import { Type } from '@sinclair/typebox';
import { runCliCommand, succeed, fail } from '../client.js';
import { withTempJsonFile } from '../utils/temp.js';

export interface ToolDef {
  name: string;
  label: string;
  description: string;
  parameters: any;
  execute: (id: string, params: any) => Promise<any>;
  optional?: boolean;
}

/**
 * Create a simple tool that takes no parameters or an id.
 * If hasId = true, expects params.id and passes it as positional arg.
 */
export function makeSimpleTool(
  name: string,
  label: string,
  description: string,
  group: string,
  subcommand: string,
  hasId: boolean = false
): ToolDef {
  const parameters = hasId
    ? Type.Object({
        id: Type.String({ description: 'ID of the resource' }),
      })
    : Type.Object({});

  return {
    name,
    label,
    description,
    parameters,
    async execute(_id: string, params: any) {
      try {
        const args: string[] = [group, subcommand];
        if (hasId) {
          args.push(params.id);
        }
        const data = await runCliCommand(args);
        return succeed(data);
      } catch (err: any) {
        return fail(err.message);
      }
    },
  };
}

/**
 * Create a tool that accepts an inline data object (no ID).
 * The data is written to a temporary file and passed as --file.
 */
export function makeFileDataTool(
  name: string,
  label: string,
  description: string,
  group: string,
  subcommand: string
): ToolDef {
  const parameters = Type.Object({
    file: Type.Optional(Type.String({ description: 'Path to a JSON file' })),
    data: Type.Optional(Type.Any({ description: 'Inline JSON object' })),
  });

  return {
    name,
    label,
    description,
    parameters,
    async execute(_id: string, params: any) {
      if (!params.file && !params.data) {
        return fail('Either "file" or "data" must be provided');
      }
      try {
        let filePath = params.file;
        if (params.data) {
          const result = await withTempJsonFile(params.data, (fp) => fp);
          filePath = result as string;
        }
        const args = [group, subcommand, '--file', filePath!];
        const data = await runCliCommand(args);
        return succeed(data);
      } catch (err: any) {
        return fail(err.message);
      }
    },
  };
}

/**
 * Create a tool that accepts an ID and a file/data.
 * Typical for update/patch and add-* commands.
 */
export function makeIdFileDataTool(
  name: string,
  label: string,
  description: string,
  group: string,
  subcommand: string
): ToolDef {
  const parameters = Type.Object({
    id: Type.String({ description: 'ID of the resource' }),
    file: Type.Optional(Type.String({ description: 'Path to a JSON file' })),
    data: Type.Optional(Type.Any({ description: 'Inline JSON object' })),
  });

  return {
    name,
    label,
    description,
    parameters,
    async execute(_id: string, params: any) {
      if (!params.file && !params.data) {
        return fail('Either "file" or "data" must be provided');
      }
      try {
        let filePath = params.file;
        if (params.data) {
          const result = await withTempJsonFile(params.data, (fp) => fp);
          filePath = result as string;
        }
        const args = [group, subcommand, params.id, '--file', filePath!];
        const resultData = await runCliCommand(args);
        return succeed(resultData);
      } catch (err: any) {
        return fail(err.message);
      }
    },
  };
}

/**
 * Create a tool that accepts an ID and optional file/data? But for commands like copy? They require id and file. So use makeIdFileDataTool.

We also need to handle optional flags like --fields, but we can ignore for now.

Now, in each tool file, we'll import these factories and define arrays.

Given the many tools, I'll produce the tool files but maybe not list every single one explicitly in code; I'll use a list of definitions mapping tool name, group, subcommand, type (simple, file-data, id-file-data). Then loop to create ToolDef objects.

But that would require some meta-programming. I could define an array of specs and then map to actual ToolDef objects using the factories. That's fine.

For example, in portfolio.tools.ts:

```ts
import { makeSimpleTool, makeFileDataTool, makeIdFileDataTool } from './tool-factory.js';

export function registerPortfolioTools(api: any) {
  const tools = [
    // value_streams
    makeSimpleTool('value_streams_list', 'List Value Streams', 'List all value streams', 'value-streams', 'list'),
    makeSimpleTool('value_streams_get', 'Get Value Stream', 'Get a value stream by ID', 'value-streams', 'get', true),
    makeFileDataTool('value_streams_create', 'Create Value Stream', 'Create a new value stream', 'value-streams', 'create'),
    makeIdFileDataTool('value_streams_update', 'Update Value Stream', 'Update a value stream (PUT)', 'value-streams', 'update'),
    makeSimpleTool('value_streams_delete', 'Delete Value Stream', 'Delete a value stream', 'value-streams', 'delete', true),
    makeIdFileDataTool('value_streams_patch', 'Patch Value Stream', 'Patch a value stream (JSON Patch)', 'value-streams', 'patch'),
    makeIdFileDataTool('value_streams_stages', 'Update Value Stream Stages', 'Update all stages of a value stream', 'value-streams', 'stages'),
    makeIdFileDataTool('value_streams_add_stage', 'Add Stage to Value Stream', 'Add a stage to a value stream', 'value-streams', 'add-stage'),
    makeIdFileDataTool('value_streams_add_solutions', 'Add Solutions to Value Stream', 'Add solutions to a value stream', 'value-streams', 'add-solutions'),
    makeIdFileDataTool('value_streams_add_art', 'Add ART to Value Stream', 'Add an ART to a value stream', 'value-streams', 'add-art'),
    makeIdFileDataTool('value_streams_copy', 'Copy Value Stream', 'Copy a value stream', 'value-streams', 'copy'),
    // strategic_themes
    makeSimpleTool('strategic_themes_list', 'List Strategic Themes', 'List all strategic themes', 'strategic-themes', 'list'),
    makeSimpleTool('strategic_themes_get', 'Get Strategic Theme', 'Get a strategic theme by ID', 'strategic-themes', 'get', true),
    makeFileDataTool('strategic_themes_create', 'Create Strategic Theme', 'Create a new strategic theme', 'strategic-themes', 'create'),
    makeIdFileDataTool('strategic_themes_update', 'Update Strategic Theme', 'Update a strategic theme (PUT)', 'strategic-themes', 'update'),
    makeSimpleTool('strategic_themes_delete', 'Delete Strategic Theme', 'Delete a strategic theme', 'strategic-themes', 'delete', true),
    makeIdFileDataTool('strategic_themes_patch', 'Patch Strategic Theme', 'Patch a strategic theme (JSON Patch)', 'strategic-themes', 'patch'),
    makeIdFileDataTool('strategic_themes_add_keyresult', 'Add Key Result', 'Add a key result to a strategic theme', 'strategic-themes', 'add-keyresult'),
    makeIdFileDataTool('strategic_themes_add_budget', 'Add Budget Distribution', 'Add budget distribution to a strategic theme', 'strategic-themes', 'add-budget'),
    // solutions
    makeSimpleTool('solutions_list', 'List Solutions', 'List all solutions', 'solutions', 'list'),
    makeSimpleTool('solutions_get', 'Get Solution', 'Get a solution by ID', 'solutions', 'get', true),
    makeFileDataTool('solutions_create', 'Create Solution', 'Create a new solution', 'solutions', 'create'),
    makeIdFileDataTool('solutions_update', 'Update Solution', 'Update a solution (PUT)', 'solutions', 'update'),
    makeSimpleTool('solutions_delete', 'Delete Solution', 'Delete a solution', 'solutions', 'delete', true),
    makeIdFileDataTool('solutions_patch', 'Patch Solution', 'Patch a solution (JSON Patch)', 'solutions', 'patch'),
    makeIdFileDataTool('solutions_add_relation', 'Add Relation', 'Add a relation to a solution', 'solutions', 'add-relation'),
    // portfolios
    makeSimpleTool('portfolios_list', 'List Portfolios', 'List all portfolios', 'portfolios', 'list'),
    makeFileDataTool('portfolios_create', 'Create Portfolio', 'Create a new portfolio', 'portfolios', 'create'),
    makeFileDataTool('portfolios_update', 'Update Portfolio', 'Update a portfolio (PUT)', 'portfolios', 'update'),
    // epics
    makeSimpleTool('epics_list', 'List Epics', 'List epics with optional filters', 'epics', 'list'),
    // objectives
    makeSimpleTool('objectives_list', 'List Objectives', 'List all objectives', 'objectives', 'list'),
    makeFileDataTool('objectives_update', 'Update Objectives', 'Update objectives', 'objectives', 'update'),
    // kanbans
    makeSimpleTool('kanbans_list', 'List Kanbans', 'List all kanbans', 'kanbans', 'list'),
    makeFileDataTool('kanbans_create', 'Create Kanban', 'Create a new kanban', 'kanbans', 'create'),
    makeFileDataTool('kanbans_update', 'Update Kanban', 'Update a kanban (PUT)', 'kanbans', 'update'),
    // roadmaps
    makeSimpleTool('roadmaps_list', 'List Roadmaps', 'List all roadmaps', 'roadmaps', 'list'),
    makeFileDataTool('roadmaps_create', 'Create Roadmap', 'Create a new roadmap', 'roadmaps', 'create'),
    makeFileDataTool('roadmaps_update', 'Update Roadmap', 'Update a roadmap (PUT)', 'roadmaps', 'update'),
    // organizations
    makeSimpleTool('organizations_get', 'Get Organization', 'Get an organization by ID', 'organizations', 'get', true),
    makeIdFileDataTool('organizations_update', 'Update Organization', 'Update an organization (PUT)', 'organizations', 'update'),
    makeSimpleTool('organizations_delete', 'Delete Organization', 'Delete an organization', 'organizations', 'delete', true),
    makeIdFileDataTool('organizations_patch', 'Patch Organization', 'Patch an organization (JSON Patch)', 'organizations', 'patch'),
  ];

  for (const tool of tools) {
    if (tool.optional) {
      api.registerTool(tool, { optional: true });
    } else {
      api.registerTool(tool);
    }
  }
}
