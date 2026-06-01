# Kvasar Claude Plugin (`@kvasar/claude-plugin-kvasar`)

Claude plugin that exposes Kvasar Agile Management capabilities as tools for Claude. Includes two built-in skill personas:

- **Portfolio Manager (LPM)** – Lean Portfolio Management, WSJF, budget guardrails, OKRs.
- **Agile Coach** – SAFe coaching, PI planning, flow metrics, impediments, dependencies.

The plugin wraps the `kvasar` CLI and uses JWT authentication via email/password (Auth0).

## Prerequisites

- Node.js 18+
- Kvasar CLI installed and available in PATH (`kvasar` command). You can install it from the [Kvasar Agile Management CLI](https://github.com/Kvasar-Technologies/Kvasar-Agile-Management-CLI) repo or via npm when published.
- Kvasar account with appropriate permissions.

## Installation

### As an MCP Server for Claude Desktop

1. Build the plugin:
```bash
npm install
npm run build
```

2. Configure Claude Desktop by adding to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kvasar": {
      "command": "node",
      "args": ["/absolute/path/to/kvasar-claude-plugin/dist/index.js"],
      "env": {
        "KVASAR_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

3. Restart Claude Desktop. The `kvasar` CLI must be installed and available in `PATH`.

## Environment Variables

For **MCP server** operation (Claude Desktop), set:

- `KVASAR_TOKEN` – A JWT token from Kvasar API. Obtain by authenticating with the Kvasar CLI first: `kvasar auth login`. The token is automatically passed to the CLI when tools are invoked.

Note: When using the `kvasar` CLI directly (outside the MCP server), authenticate normally using `kvasar auth login`.

## Tool Summary

72 CLI-backed tools covering:

- Value Streams
- Strategic Themes & Budget
- Solutions & Roadmaps
- Portfolios & Epics
- Objectives (OKRs)
- Kanbans
- Organizations
- ARTs & Teams
- Program Increments
- Items (epics, features, stories)
- Users
- KPIs

See `CLI_INVENTORY.md` for the full tool list and CLI command mapping.

## Skills

The plugin provides two skill markdown files:

- `src/skills/agile-coach.skill.md`
- `src/skills/portfolio-manager.skill.md`

These are loaded by the MCP server and can be activated by Claude via natural language.

## Claude Desktop

Build the package, then point Claude Desktop at the MCP binary:

```json
{
  "mcpServers": {
    "kvasar": {
      "command": "node",
      "args": ["/absolute/path/to/kvasar-claude-plugin/dist/index.js"],
      "env": {
        "KVASAR_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

The `kvasar` CLI must also be installed and available in `PATH` for the Claude Desktop process.

## Development

```bash
npm install
npm run dev      # Run directly in development mode
npm run build    # Build to dist/
npm run test     # Run unit tests
npm run typecheck
```

## Project Structure

```
kvasar-claude-plugin/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── auth.ts            # JWT auth (email+password → token)
│   ├── client.ts          # CLI wrapper
│   ├── tools/
│   │   ├── portfolio.tools.ts
│   │   ├── agile-coach.tools.ts
│   │   ├── pi.tools.ts
│   │   ├── team.tools.ts
│   │   └── tool-factory.ts
│   └── skills/
│       ├── agile-coach.skill.md
│       └── portfolio-manager.skill.md
├── tests/
│   ├── portfolio.tools.test.ts
│   └── agile-coach.tools.test.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## Notes

- All tools are derived 1:1 from the official Kvasar Agile Management CLI; we do not call the REST API directly.
- If a needed capability is missing from the CLI, it is documented in `GAPS.md`.
