import { Type } from '@sinclair/typebox';
import { makeSimpleTool, makeFileDataTool, makeIdFileDataTool } from './tool-factory.js';
import { runCliCommand, succeed, fail } from '../client.js';

export function registerPortfolioTools(api: any) {
  const tools = [
    // Value Streams
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

    // Strategic Themes
    makeSimpleTool('strategic_themes_list', 'List Strategic Themes', 'List all strategic themes', 'strategic-themes', 'list'),
    makeSimpleTool('strategic_themes_get', 'Get Strategic Theme', 'Get a strategic theme by ID', 'strategic-themes', 'get', true),
    makeFileDataTool('strategic_themes_create', 'Create Strategic Theme', 'Create a new strategic theme', 'strategic-themes', 'create'),
    makeIdFileDataTool('strategic_themes_update', 'Update Strategic Theme', 'Update a strategic theme (PUT)', 'strategic-themes', 'update'),
    makeSimpleTool('strategic_themes_delete', 'Delete Strategic Theme', 'Delete a strategic theme', 'strategic-themes', 'delete', true),
    makeIdFileDataTool('strategic_themes_patch', 'Patch Strategic Theme', 'Patch a strategic theme (JSON Patch)', 'strategic-themes', 'patch'),
    makeIdFileDataTool('strategic_themes_add_keyresult', 'Add Key Result', 'Add a key result to a strategic theme', 'strategic-themes', 'add-keyresult'),
    makeIdFileDataTool('strategic_themes_add_budget', 'Add Budget Distribution', 'Add budget distribution to a strategic theme', 'strategic-themes', 'add-budget'),

    // Solutions
    makeSimpleTool('solutions_list', 'List Solutions', 'List all solutions', 'solutions', 'list'),
    makeSimpleTool('solutions_get', 'Get Solution', 'Get a solution by ID', 'solutions', 'get', true),
    makeFileDataTool('solutions_create', 'Create Solution', 'Create a new solution', 'solutions', 'create'),
    makeIdFileDataTool('solutions_update', 'Update Solution', 'Update a solution (PUT)', 'solutions', 'update'),
    makeSimpleTool('solutions_delete', 'Delete Solution', 'Delete a solution', 'solutions', 'delete', true),
    makeIdFileDataTool('solutions_patch', 'Patch Solution', 'Patch a solution (JSON Patch)', 'solutions', 'patch'),
    makeIdFileDataTool('solutions_add_relation', 'Add Solution Relation', 'Add a relation to a solution', 'solutions', 'add-relation'),

    // Portfolios
    makeSimpleTool('portfolios_list', 'List Portfolios', 'List all portfolios', 'portfolios', 'list'),
    makeFileDataTool('portfolios_create', 'Create Portfolio', 'Create a new portfolio', 'portfolios', 'create'),
    makeFileDataTool('portfolios_update', 'Update Portfolio', 'Update a portfolio (PUT)', 'portfolios', 'update'),

    // Epics (list with optional filters)
    {
      name: 'epics_list',
      label: 'List Epics',
      description: 'List epics with optional filters (organization, portfolio, state)',
      parameters: Type.Object({
        organization: Type.Optional(Type.String({ description: 'Filter by organization ID' })),
        portfolio: Type.Optional(Type.String({ description: 'Filter by portfolio ID' })),
        state: Type.Optional(Type.String({ description: 'Filter by state (e.g., in-progress, completed)' })),
      }),
      async execute(_id: string, params: any) {
        try {
          const args = ['epics', 'list'];
          if (params.organization) args.push('--organization', params.organization);
          if (params.portfolio) args.push('--portfolio', params.portfolio);
          if (params.state) args.push('--state', params.state);
          const data = await runCliCommand(args);
          return succeed(data);
        } catch (err: any) {
          return fail(err.message);
        }
      },
    },

    // Objectives
    makeSimpleTool('objectives_list', 'List Objectives', 'List all objectives', 'objectives', 'list'),
    makeFileDataTool('objectives_update', 'Update Objectives', 'Update objectives', 'objectives', 'update'),

    // Kanbans
    makeSimpleTool('kanbans_list', 'List Kanbans', 'List all kanbans', 'kanbans', 'list'),
    makeFileDataTool('kanbans_create', 'Create Kanban', 'Create a new kanban', 'kanbans', 'create'),
    makeFileDataTool('kanbans_update', 'Update Kanban', 'Update a kanban (PUT)', 'kanbans', 'update'),

    // Roadmaps
    makeSimpleTool('roadmaps_list', 'List Roadmaps', 'List all roadmaps', 'roadmaps', 'list'),
    makeFileDataTool('roadmaps_create', 'Create Roadmap', 'Create a new roadmap', 'roadmaps', 'create'),
    makeFileDataTool('roadmaps_update', 'Update Roadmap', 'Update a roadmap (PUT)', 'roadmaps', 'update'),

    // Organizations
    makeSimpleTool('organizations_get', 'Get Organization', 'Get an organization by ID', 'organizations', 'get', true),
    makeIdFileDataTool('organizations_update', 'Update Organization', 'Update an organization (PUT)', 'organizations', 'update'),
    makeSimpleTool('organizations_delete', 'Delete Organization', 'Delete an organization', 'organizations', 'delete', true),
    makeIdFileDataTool('organizations_patch', 'Patch Organization', 'Patch an organization (JSON Patch)', 'organizations', 'patch'),

    // Products
    makeSimpleTool('products_list', 'List Products', 'List all products', 'products', 'list'),
    makeSimpleTool('products_get', 'Get Product', 'Get a product by ID', 'products', 'get', true),
    makeFileDataTool('products_create', 'Create Product', 'Create a new product', 'products', 'create'),

    // Services
    makeSimpleTool('services_list', 'List Services', 'List all services', 'services', 'list'),
    makeSimpleTool('services_get', 'Get Service', 'Get a service by ID', 'services', 'get', true),
    makeFileDataTool('services_create', 'Create Service', 'Create a new service', 'services', 'create'),

    // Systems
    makeSimpleTool('systems_list', 'List Systems', 'List all systems', 'systems', 'list'),
    makeSimpleTool('systems_get', 'Get System', 'Get a system by ID', 'systems', 'get', true),
    makeFileDataTool('systems_create', 'Create System', 'Create a new system', 'systems', 'create'),
  ];

  for (const tool of tools) {
    if (tool.optional) {
      api.registerTool(tool, { optional: true });
    } else {
      api.registerTool(tool);
    }
  }
}
