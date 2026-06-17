# AGENTS.md

## What this is

A Claude Code plugin repo (not a software project). No build system, tests, CI, or package manager. All work is editing markdown config/instruction files plus two bash wrappers.

## External dependencies (must be in PATH)

- `kvasar` — the Kvasar CLI binary. `bin/kvasar` is a thin wrapper that `exec`s it.
- `acli` — the Atlassian CLI binary. `bin/acli` is a thin wrapper that `exec`s it.

Without these, both wrappers exit 1 with an error. The plugin cannot be exercised without them.

## How to verify changes

```bash
# Validate plugin structure from repo root
claude plugin validate .

# Load plugin in a session for manual testing
claude --plugin-dir .

# Reload without restarting after editing skills/agents
/reload-plugins
```

There are no automated tests. `claude plugin validate` is the only formal check.

## Authoritative command reference

`CLI_INVENTORY.md` maps every registered plugin tool to the exact `kvasar` subcommand and flags. Read it before adding or changing agent/skill capabilities. The README and agent/skill files can drift; the inventory is the source of truth.

## Editing rules inherited from agent definitions

All three agents (`agents/kvasar-product-manager.md`, `agents/jira-manager.md`, `agents/release-manager.md`) hard-code:
- No direct REST API calls
- No MCP tool usage
- All external mutations go through `kvasar` and/or `acli`

`skills/agile-coach/skill.md` is the one skill without a `SKILL.md` casing (lowercase `skill.md`) — its full path is `skills/agile-coach/skill.md`.

## Generic docs to ignore

`doc/PLUGIN.md` and `doc/PLUGIN_REFERENCE.md` are verbatim copies of public Claude Code documentation, not repo-specific guidance. Do not edit or reference them as project instructions.
