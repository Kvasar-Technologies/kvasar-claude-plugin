import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeSimpleTool, makeFileDataTool, makeIdFileDataTool } from '../src/tools/tool-factory.js';

// Mock the client module
vi.mock('../src/client.js', () => {
  const mockRunCliCommand = vi.fn().mockResolvedValue({ data: 'mocked' });
  const mockSucceed = vi.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], details: {} }));
  const mockFail = vi.fn((msg) => ({ content: [{ type: 'text', text: `❌ ${msg}` }], isError: true, details: {} }));
  return {
    runCliCommand: mockRunCliCommand,
    succeed: mockSucceed,
    fail: mockFail,
  };
});

import { runCliCommand, succeed, fail } from '../src/client.js';

describe('Tool Factory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('makeSimpleTool', () => {
    it('creates a tool with no ID parameter', () => {
      const tool = makeSimpleTool('test_list', 'Test List', 'Desc', 'test', 'list');
      expect(tool.name).toBe('test_list');
      expect(tool.parameters).toEqual({ type: 'object', properties: {} });
    });

    it('creates a tool with ID parameter when hasId=true', () => {
      const tool = makeSimpleTool('test_get', 'Test Get', 'Desc', 'test', 'get', true);
      expect(tool.parameters).toMatchObject({
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID of the resource' },
        },
        required: ['id'],
      });
    });

    it('executes command without ID', async () => {
      const tool = makeSimpleTool('test_list', 'Test List', 'Desc', 'test', 'list');
      const result = await tool.execute('', {});
      expect(runCliCommand).toHaveBeenCalledWith(['test', 'list']);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('executes command with ID', async () => {
      const tool = makeSimpleTool('test_get', 'Test Get', 'Desc', 'test', 'get', true);
      const result = await tool.execute('', { id: '123' });
      expect(runCliCommand).toHaveBeenCalledWith(['test', 'get', '123']);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('returns error if execution fails', async () => {
      (runCliCommand as any).mockRejectedValueOnce(new Error('CLI error'));
      const tool = makeSimpleTool('test_list', 'Test List', 'Desc', 'test', 'list');
      const result = await tool.execute('', {});
      expect(result).toEqual(fail('CLI error'));
    });
  });

  describe('makeFileDataTool', () => {
    it('creates tool with file and data parameters', () => {
      const tool = makeFileDataTool('test_create', 'Test Create', 'Desc', 'test', 'create');
      expect(tool.parameters).toMatchObject({
        type: 'object',
        properties: {
          file: { type: 'string', description: 'Path to a JSON file' },
          data: { description: 'Inline JSON object' }, // Any type
        },
      });
    });

    it('executes with file path', async () => {
      const tool = makeFileDataTool('test_create', 'Test Create', 'Desc', 'test', 'create');
      const result = await tool.execute('', { file: '/path/to/file.json' });
      expect(runCliCommand).toHaveBeenCalledWith(['test', 'create', '--file', '/path/to/file.json']);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('executes with inline data using temp file', async () => {
      const tool = makeFileDataTool('test_create', 'Test Create', 'Desc', 'test', 'create');
      const result = await tool.execute('', { data: { foo: 'bar' } });
      // Check that runCliCommand was called with some temp file path
      const callArgs = (runCliCommand as any).mock.calls[0][0];
      expect(callArgs[0]).toBe('test');
      expect(callArgs[1]).toBe('create');
      expect(callArgs[2]).toBe('--file');
      expect(callArgs[3]).toMatch(/.*kvasar-plugin-.*\.json/);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('fails if neither file nor data provided', async () => {
      const tool = makeFileDataTool('test_create', 'Test Create', 'Desc', 'test', 'create');
      const result = await tool.execute('', {});
      expect(result).toEqual(fail('Either "file" or "data" must be provided'));
    });
  });

  describe('makeIdFileDataTool', () => {
    it('creates tool with id, file, and data parameters', () => {
      const tool = makeIdFileDataTool('test_update', 'Test Update', 'Desc', 'test', 'update');
      expect(tool.parameters).toMatchObject({
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID of the resource' },
          file: { type: 'string', description: 'Path to a JSON file' },
          data: { description: 'Inline JSON object' },
        },
        required: ['id'],
      });
    });

    it('executes with id and file', async () => {
      const tool = makeIdFileDataTool('test_update', 'Test Update', 'Desc', 'test', 'update');
      const result = await tool.execute('', { id: '123', file: 'file.json' });
      expect(runCliCommand).toHaveBeenCalledWith(['test', 'update', '123', '--file', 'file.json']);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('executes with id and inline data', async () => {
      const tool = makeIdFileDataTool('test_update', 'Test Update', 'Desc', 'test', 'update');
      const result = await tool.execute('', { id: '123', data: { name: 'new' } });
      const callArgs = (runCliCommand as any).mock.calls[0][0];
      expect(callArgs[0]).toBe('test');
      expect(callArgs[1]).toBe('update');
      expect(callArgs[2]).toBe('123');
      expect(callArgs[3]).toBe('--file');
      expect(callArgs[4]).toMatch(/.*kvasar-plugin-.*\.json/);
      expect(result).toEqual(succeed({ data: 'mocked' }));
    });

    it('fails if no file or data', async () => {
      const tool = makeIdFileDataTool('test_update', 'Test Update', 'Desc', 'test', 'update');
      const result = await tool.execute('', { id: '123' });
      expect(result).toEqual(fail('Either "file" or "data" must be provided'));
    });
  });
});
