import { describe, expect, it, vi } from 'vitest';
import { registerAgileCoachTools } from '../src/tools/agile-coach.tools.js';
import { registerPiTools } from '../src/tools/pi.tools.js';
import { registerTeamTools } from '../src/tools/team.tools.js';

vi.mock('../src/client.js', () => ({
  runCliCommand: vi.fn().mockResolvedValue({ ok: true }),
  succeed: vi.fn((data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], details: {} })),
  fail: vi.fn((msg) => ({ content: [{ type: 'text', text: `❌ ${msg}` }], isError: true, details: {} })),
}));

function collectTools(register: (api: any) => void) {
  const tools: any[] = [];
  register({ registerTool: (tool: any) => tools.push(tool) });
  return tools;
}

describe('Agile coach tools', () => {
  it('registers item, user, and KPI tools', () => {
    const names = collectTools(registerAgileCoachTools).map((tool) => tool.name);

    expect(names).toEqual([
      'items_get',
      'items_update',
      'items_delete',
      'items_patch',
      'items_add_relation',
      'users_list',
      'users_create',
      'users_update',
      'kpis_list',
      'kpis_create',
      'kpis_update',
    ]);
  });

  it('registers PI planning tools', () => {
    const names = collectTools(registerPiTools).map((tool) => tool.name);

    expect(names).toEqual(['pis_get', 'pis_update', 'pis_delete', 'pis_add_sprint']);
  });

  it('registers ART and team tools', () => {
    const names = collectTools(registerTeamTools).map((tool) => tool.name);

    expect(names).toEqual([
      'arts_list',
      'arts_create',
      'arts_update',
      'teams_list',
      'teams_create',
      'teams_update',
    ]);
  });
});
