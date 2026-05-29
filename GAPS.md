# Gaps

The plugin intentionally exposes only commands that are implemented by the Kvasar CLI. Missing capabilities below should be added to the CLI first, then wrapped by plugin tools.

## Gap: portfolio_get
- **Needed for:** Portfolio Manager skill (single portfolio review)
- **CLI command:** Not implemented
- **Suggested CLI command:** `kvasar portfolios get <id>`
- **Workaround:** Use `kvasar portfolios list` and filter client-side.

## Gap: portfolio_delete
- **Needed for:** Portfolio Manager skill (portfolio lifecycle administration)
- **CLI command:** Not implemented
- **Suggested CLI command:** `kvasar portfolios delete <id>`

## Gap: epic_get
- **Needed for:** Portfolio Manager skill (deep dive on one epic)
- **CLI command:** Not implemented as `kvasar epics get <id>`
- **Suggested CLI command:** `kvasar epics get <id>`
- **Workaround:** Use `kvasar items get <id>` if the epic ID is known.

## Gap: epic_create_update_delete
- **Needed for:** Portfolio Manager skill (portfolio Kanban administration)
- **CLI command:** Not implemented under `kvasar epics`
- **Suggested CLI commands:** `kvasar epics create`, `kvasar epics update <id>`, `kvasar epics delete <id>`
- **Workaround:** Use generic `items_*` tools where supported by the platform model.

## Gap: product_service_system_update_delete
- **Needed for:** Portfolio Manager skill (solution taxonomy maintenance)
- **CLI command:** `products`, `services`, and `systems` currently expose only `list`, `get`, and `create`
- **Suggested CLI commands:** `kvasar products update <id>`, `kvasar products delete <id>`, and equivalents for services and systems.

## Gap: team_members_tools
- **Needed for:** Agile Coach skill (team composition analysis)
- **CLI command:** `teammembers` source exists but is not registered in the CLI command index
- **Suggested CLI change:** Register `teammembersCommand` in `src/commands/index.ts`, then expose `teammembers_list` and `teammembers_create`.

## Gap: groups_tools
- **Needed for:** Agile Coach and Portfolio Manager skills (ART/group structure analysis)
- **CLI command:** `groups` source exists but is explicitly skipped in the CLI command index because of complex polymorphic types
- **Suggested CLI change:** Finish and register `groupsCommand`, then expose `groups_list`, `groups_create`, and `groups_update`.
