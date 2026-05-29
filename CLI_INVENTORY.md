# Kvasar CLI Inventory

Source inspected: `/home/jordi/git-repo/Kvasar-Agile-Management-CLI`

Global flags verified in `src/index.ts`: `--access-token <token>`, `--output <format>`, `--pretty`, `--quiet`, `--fields <fields>`.

All registered plugin tools map to commands implemented in the CLI. JSON output is emitted by the CLI via `formatOutput(result.data, options)`, so list commands return arrays and get/create/update/delete commands return the CLI command's returned resource payload unless the API returns a scalar/null.

| Plugin tool | CLI command | Args/flags used | Personas |
|---|---|---|---|
| `value_streams_list` | `kvasar value-streams list` | `--output json` | portfolio-manager, agile-coach |
| `value_streams_get` | `kvasar value-streams get <id>` | `<id> --output json` | portfolio-manager, agile-coach |
| `value_streams_create` | `kvasar value-streams create` | `--file <path> --output json` | portfolio-manager |
| `value_streams_update` | `kvasar value-streams update <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `value_streams_delete` | `kvasar value-streams delete <id>` | `<id> --output json` | portfolio-manager |
| `value_streams_patch` | `kvasar value-streams patch <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `value_streams_stages` | `kvasar value-streams stages <id>` | `<id> --file <path> --output json` | portfolio-manager, agile-coach |
| `value_streams_add_stage` | `kvasar value-streams add-stage <id>` | `<id> --file <path> --output json` | portfolio-manager, agile-coach |
| `value_streams_add_solutions` | `kvasar value-streams add-solutions <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `value_streams_add_art` | `kvasar value-streams add-art <id>` | `<id> --file <path> --output json` | portfolio-manager, agile-coach |
| `value_streams_copy` | `kvasar value-streams copy <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `strategic_themes_list` | `kvasar strategic-themes list` | `--output json` | portfolio-manager |
| `strategic_themes_get` | `kvasar strategic-themes get <id>` | `<id> --output json` | portfolio-manager |
| `strategic_themes_create` | `kvasar strategic-themes create` | `--file <path> --output json` | portfolio-manager |
| `strategic_themes_update` | `kvasar strategic-themes update <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `strategic_themes_delete` | `kvasar strategic-themes delete <id>` | `<id> --output json` | portfolio-manager |
| `strategic_themes_patch` | `kvasar strategic-themes patch <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `strategic_themes_add_keyresult` | `kvasar strategic-themes add-keyresult <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `strategic_themes_add_budget` | `kvasar strategic-themes add-budget <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `solutions_list` | `kvasar solutions list` | `--output json` | portfolio-manager |
| `solutions_get` | `kvasar solutions get <id>` | `<id> --output json` | portfolio-manager |
| `solutions_create` | `kvasar solutions create` | `--file <path> --output json` | portfolio-manager |
| `solutions_update` | `kvasar solutions update <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `solutions_delete` | `kvasar solutions delete <id>` | `<id> --output json` | portfolio-manager |
| `solutions_patch` | `kvasar solutions patch <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `solutions_add_relation` | `kvasar solutions add-relation <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `portfolios_list` | `kvasar portfolios list` | `--output json` | portfolio-manager |
| `portfolios_create` | `kvasar portfolios create` | `--file <path> --output json` | portfolio-manager |
| `portfolios_update` | `kvasar portfolios update` | `--file <path> --output json` | portfolio-manager |
| `epics_list` | `kvasar epics list` | `--organization <id> --portfolio <id> --state <state> --output json` | portfolio-manager |
| `objectives_list` | `kvasar objectives list` | `--output json` | portfolio-manager, agile-coach |
| `objectives_update` | `kvasar objectives update` | `--file <path> --output json` | portfolio-manager, agile-coach |
| `kanbans_list` | `kvasar kanbans list` | `--output json` | portfolio-manager, agile-coach |
| `kanbans_create` | `kvasar kanbans create` | `--file <path> --output json` | portfolio-manager, agile-coach |
| `kanbans_update` | `kvasar kanbans update` | `--file <path> --output json` | portfolio-manager, agile-coach |
| `roadmaps_list` | `kvasar roadmaps list` | `--output json` | portfolio-manager |
| `roadmaps_create` | `kvasar roadmaps create` | `--file <path> --output json` | portfolio-manager |
| `roadmaps_update` | `kvasar roadmaps update` | `--file <path> --output json` | portfolio-manager |
| `organizations_get` | `kvasar organizations get <id>` | `<id> --output json` | portfolio-manager |
| `organizations_update` | `kvasar organizations update <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `organizations_delete` | `kvasar organizations delete <id>` | `<id> --output json` | portfolio-manager |
| `organizations_patch` | `kvasar organizations patch <id>` | `<id> --file <path> --output json` | portfolio-manager |
| `products_list` | `kvasar products list` | `--output json` | portfolio-manager |
| `products_get` | `kvasar products get <id>` | `<id> --output json` | portfolio-manager |
| `products_create` | `kvasar products create` | `--file <path> --output json` | portfolio-manager |
| `services_list` | `kvasar services list` | `--output json` | portfolio-manager |
| `services_get` | `kvasar services get <id>` | `<id> --output json` | portfolio-manager |
| `services_create` | `kvasar services create` | `--file <path> --output json` | portfolio-manager |
| `systems_list` | `kvasar systems list` | `--output json` | portfolio-manager |
| `systems_get` | `kvasar systems get <id>` | `<id> --output json` | portfolio-manager |
| `systems_create` | `kvasar systems create` | `--file <path> --output json` | portfolio-manager |
| `items_get` | `kvasar items get <id>` | `<id> --output json` | agile-coach, portfolio-manager |
| `items_update` | `kvasar items update <id>` | `<id> --file <path> --output json` | agile-coach, portfolio-manager |
| `items_delete` | `kvasar items delete <id>` | `<id> --output json` | agile-coach, portfolio-manager |
| `items_patch` | `kvasar items patch <id>` | `<id> --file <path> --output json` | agile-coach, portfolio-manager |
| `items_add_relation` | `kvasar items add-relation <id>` | `<id> --file <path> --output json` | agile-coach, portfolio-manager |
| `users_list` | `kvasar users list` | `--output json` | agile-coach |
| `users_create` | `kvasar users create` | `--file <path> --output json` | agile-coach |
| `users_update` | `kvasar users update` | `--file <path> --output json` | agile-coach |
| `kpis_list` | `kvasar kpis list` | `--output json` | portfolio-manager, agile-coach |
| `kpis_create` | `kvasar kpis create` | `--file <path> --output json` | portfolio-manager, agile-coach |
| `kpis_update` | `kvasar kpis update` | `--file <path> --output json` | portfolio-manager, agile-coach |
| `pis_get` | `kvasar pis get <id>` | `<id> --output json` | agile-coach |
| `pis_update` | `kvasar pis update <id>` | `<id> --file <path> --output json` | agile-coach |
| `pis_delete` | `kvasar pis delete <id>` | `<id> --output json` | agile-coach |
| `pis_add_sprint` | `kvasar pis add-sprint <id>` | `<id> --file <path> --output json` | agile-coach |
| `arts_list` | `kvasar arts list` | `--output json` | agile-coach, portfolio-manager |
| `arts_create` | `kvasar arts create` | `--file <path> --output json` | agile-coach |
| `arts_update` | `kvasar arts update` | `--file <path> --output json` | agile-coach |
| `teams_list` | `kvasar teams list` | `--output json` | agile-coach |
| `teams_create` | `kvasar teams create` | `--file <path> --output json` | agile-coach |
| `teams_update` | `kvasar teams update` | `--file <path> --output json` | agile-coach |
