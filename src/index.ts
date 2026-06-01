#!/usr/bin/env node
// MCP server functionality is not yet implemented.
// This entry point will be updated when MCP integration is ready.

import { registerAgileCoachTools } from './tools/agile-coach.tools.js';
import { registerPiTools } from './tools/pi.tools.js';
import { registerTeamTools } from './tools/team.tools.js';
import { registerPortfolioTools } from './tools/portfolio.tools.js';

async function main() {
  // Collect tools from all modules
  const tools: any[] = [];
  const api = {
    registerTool: (tool: any, opts?: any) => {
      tools.push(tool);
    },
  };

  registerAgileCoachTools(api);
  registerPiTools(api);
  registerTeamTools(api);
  registerPortfolioTools(api);

  console.error(`Kvasar plugin: ${tools.length} tools registered. MCP server not yet implemented.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
