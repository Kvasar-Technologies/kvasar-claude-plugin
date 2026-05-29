#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import http from 'http';

// Import tool registration modules
import { registerAgileCoachTools } from './tools/agile-coach.tools.js';
import { registerPiTools } from './tools/pi.tools.js';
import { registerTeamTools } from './tools/team.tools.js';
import { registerPortfolioTools } from './tools/portfolio.tools.js';

// Load skills from skills directory
async function loadSkills(): Promise<Map<string, string>> {
  const candidateDirs = [
    join(process.cwd(), 'src', 'skills'),
    join(process.cwd(), 'skills'),
    join(__dirname, 'skills'),
  ];

  for (const skillsDir of candidateDirs) {
    try {
    const files = await fs.readdir(skillsDir);
    const skills = new Map<string, string>();
    for (const file of files) {
      if (file.endsWith('.skill.md')) {
        const name = file.replace('.skill.md', '');
        const content = await fs.readFile(join(skillsDir, file), 'utf-8');
        skills.set(name, content);
      }
    }
    return skills;
    } catch {
      // Try the next location. Development uses src/skills; packaged builds may use skills/.
    }
  }

  console.error('Failed to load skills from src/skills, skills, or dist/skills');
  return new Map();
}

// Optional HTTP server for GET /skills
function startHttpServer(port: number, skills: Map<string, string>) {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/skills') {
      const skillList = Array.from(skills.entries()).map(([name, content]) => ({ name, content }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(skillList));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  server.listen(port, () => {
    console.error(`Skills HTTP server listening on port ${port}`);
  });
  server.on('error', (err: any) => {
    console.error('HTTP server error:', err);
  });
}

async function main() {
  // Validate required environment variables
  const email = process.env.KVASAR_EMAIL;
  const password = process.env.KVASAR_PASSWORD;
  if (!email || !password) {
    console.error('ERROR: Missing required environment variables KVASAR_EMAIL and KVASAR_PASSWORD');
    process.exit(1);
  }

  // Load skill definitions
  const skills = await loadSkills();

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

  // Create MCP server
  const server = new Server(
    {
      name: 'kvasar-plugin',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.parameters,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = tools.find(t => t.name === name);
    if (!tool) {
      throw new Error(`Tool '${name}' not found`);
    }
    try {
      const result = await tool.execute(null, args ?? {});
      return result;
    } catch (err: any) {
      return {
        content: [{ type: 'text', text: `❌ ${err.message}` }],
        isError: true,
      };
    }
  });

  // Start optional HTTP server for skills if PORT is set
  const httpPort = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
  if (httpPort) {
    startHttpServer(httpPort, skills);
  }

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Kvasar Claude Plugin MCP server started');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
