import { execa } from 'execa';
import { getAuthHeader } from './auth.js';

export interface ToolResult {
  content: { type: string; text: string }[];
  isError?: boolean;
  details?: Record<string, unknown>;
}

/**
 * Run a kvasar CLI command and return parsed JSON.
 * The command is invoked with `--output json` and `--access-token` from auth.
 */
export async function runCliCommand(args: string[]): Promise<any> {
  const { Authorization } = await getAuthHeader();
  const token = Authorization.replace(/^Bearer\s+/i, '');

  try {
    const { stdout, stderr, exitCode } = await execa('kvasar', [...args, '--output', 'json', '--access-token', token], {
      env: { ...process.env },
      reject: false,
      all: false,
    });

    if (exitCode !== 0) {
      const errorMsg = stderr?.trim() || stdout?.trim() || 'Command failed with no output';
      throw new Error(`kvasar ${args.join(' ')}: ${errorMsg}`);
    }

    if (!stdout.trim()) {
      return null;
    }

    try {
      return JSON.parse(stdout);
    } catch (e) {
      // If not JSON, return raw string
      return { raw: stdout };
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

/**
 * Helper to create a successful ToolResult with JSON-formatted text.
 */
export function succeed(data: any): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    details: {},
  };
}

/**
 * Helper to create an error ToolResult.
 */
export function fail(error: string): ToolResult {
  return {
    content: [{ type: 'text', text: `❌ ${error}` }],
    isError: true,
    details: {},
  };
}
