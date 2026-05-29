import { describe, expect, it, vi } from 'vitest';
import { registerPortfolioTools } from '../src/tools/portfolio.tools.js';

vi.mock('../src/client.js', () => ({
  runCliCommand: vi.fn().mockResolvedValue({ ok: true }),
  succeed: vi.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], details: {} })),
  fail: vi.fn((msg) => ({ content: [{ type: 'text', text: `❌ ${msg}` }], isError: true, details: {} })),
}));

function collectPortfolioTools() {
  const tools: any[] = [];
  registerPortfolioTools({ registerTool: (tool: any) => tools.push(tool) });
  return tools;
}

describe('Portfolio tools', () => {
  it('registers only CLI-backed portfolio and LPM tools', () => {
    const tools = collectPortfolioTools();
    const names = tools.map((tool) => tool.name);

    expect(names.length).toBe(51);
    expect(names).toContain('products_get');
    expect(names).toContain('services_get');
    expect(names).toContain('systems_get');
    expect(names).not.toContain('products_update');
    expect(names).not.toContain('services_update');
    expect(names).not.toContain('systems_update');
  });

  it('maps epics filters to CLI flags', async () => {
    const { runCliCommand } = await import('../src/client.js');
    const tool = collectPortfolioTools().find((candidate) => candidate.name === 'epics_list');

    await tool.execute('', {
      organization: 'org-1',
      portfolio: 'portfolio-1',
      state: 'funnel',
    });

    expect(runCliCommand).toHaveBeenCalledWith([
      'epics',
      'list',
      '--organization',
      'org-1',
      '--portfolio',
      'portfolio-1',
      '--state',
      'funnel',
    ]);
  });
});
