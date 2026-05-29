import { makeSimpleTool, makeFileDataTool } from './tool-factory.js';

export function registerTeamTools(api: any) {
  const tools = [
    // ARTs
    makeSimpleTool('arts_list', 'List ARTs', 'List all Agile Release Trains', 'arts', 'list'),
    makeFileDataTool('arts_create', 'Create ART', 'Create a new Agile Release Train', 'arts', 'create'),
    makeFileDataTool('arts_update', 'Update ART', 'Update an Agile Release Train', 'arts', 'update'),
    // Teams
    makeSimpleTool('teams_list', 'List Teams', 'List all teams', 'teams', 'list'),
    makeFileDataTool('teams_create', 'Create Team', 'Create a new team', 'teams', 'create'),
    makeFileDataTool('teams_update', 'Update Team', 'Update a team', 'teams', 'update'),
  ];

  for (const tool of tools) {
    if (tool.optional) {
      api.registerTool(tool, { optional: true });
    } else {
      api.registerTool(tool);
    }
  }
}
