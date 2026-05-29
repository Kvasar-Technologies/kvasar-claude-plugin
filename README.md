# Kvasar Claude Plugin (`@kvasar/claude-plugin-kvasar`)

OpenClaw plugin that exposes Kvasar Agile Management capabilities as tools for Claude. Includes two built-in skill personas:

- **Portfolio Manager (LPM)** – Lean Portfolio Management, WSJF, budget guardrails, OKRs.
- **Agile Coach** – SAFe coaching, PI planning, flow metrics, impediments, dependencies.

The plugin wraps the `kvasar` CLI and uses JWT authentication via email/password (Auth0).

## Prerequisites

- Node.js 18+
- Kvasar CLI installed and available in PATH (`kvasar` command). You can install it from the [Kvasar Agile Management CLI](https://github.com/Kvasar-Technologies/Kvasar-Agile-Management-CLI) repo or via npm when published.
- Kvasar account with appropriate permissions.

## Installation

```bash
# From the plugin repository
npm install
npm run build
# Then install into OpenClaw
openclaw plugins install ./kvasar-claude-plugin
openclaw gateway restart
```

Alternatively, publish to npm as `@kvasar/claude-plugin-kvasar` and install with `openclaw plugins install @kvasar/claude-plugin-kvasar`.

## Environment Variables

Set these on the host where OpenClaw runs:

- `KVASAR_EMAIL` – Your Kvasar login email.
- `KVASAR_PASSWORD` – Your Kvasar password.
- `AUTH0_DOMAIN` (optional) – Defaults to `https://kvasar-pro.eu.auth0.com`.
- `AUTH0_CLIENT_ID` (optional) – Defaults to Kvasar public client ID.
- `AUTH0_AUDIENCE` (optional) – Defaults to `https://api.kvasar.tech/api/v1/`.

The plugin uses the Resource Owner Password flow to obtain a JWT token and caches it in memory. The token is passed to the CLI via the `--access-token` flag on each command.

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

See `openclaw.plugin.json` for the full tool list and `CLI_INVENTORY.md` for the CLI command mapping.

## Skills

The plugin provides two skill markdown files:

- `src/skills/agile-coach.skill.md`
- `src/skills/portfolio-manager.skill.md`

These are automatically loaded by OpenClaw and can be activated via natural language (e.g., "act as agile coach" or "give me a portfolio review"). The MCP server can also expose the raw skill markdown over `GET /skills` when started with `PORT=<port>`.

## Claude Desktop

Build the package, then point Claude Desktop at the MCP binary:

```json
{
  "mcpServers": {
    "kvasar": {
      "command": "node",
      "args": ["/absolute/path/to/kvasar-claude-plugin/dist/index.js"],
      "env": {
        "KVASAR_EMAIL": "you@example.com",
        "KVASAR_PASSWORD": "your-password"
      }
    }
  }
}
```

The `kvasar` CLI must also be installed and available in `PATH` for the Claude Desktop process.

## Development

```bash
npm install
npm run dev      # Run directly (requires OpenClaw plugin host)
npm run build    # Build to dist/
npm run test     # Run unit tests
npm run typecheck
```

## Project Structure

```
kvasar-claude-plugin/
├── src/
│   ├── index.ts           # Plugin entry point
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
├── openclaw.plugin.json
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- All tools are derived 1:1 from the official Kvasar Agile Management CLI; we do not call the REST API directly.
- If a needed capability is missing from the CLI, it is documented in `GAPS.md`.
- Follows the same plugin architecture as `@kvasar/openclaw-hubspot` and `@kvasar/openclaw-git`.
