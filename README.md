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

### As a Library

The plugin provides a set of tools that wrap the Kvasar CLI. To use programmatically:

1. Build the plugin:
```bash
npm install
npm run build
```

2. Import and use the tools from the compiled output.

## Environment Variables

When running the server, set:

- `KVASAR_TOKEN` – A JWT token from Kvasar API. Obtain by authenticating with the Kvasar CLI first: `kvasar auth login`. The token is automatically passed to the CLI when tools are invoked.

Note: When using the `kvasar` CLI directly, authenticate via `kvasar auth login`.

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

These are defined as markdown skill files.

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
│   ├── index.ts           # Plugin entry point
│   ├── auth.ts            # JWT token auth
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
