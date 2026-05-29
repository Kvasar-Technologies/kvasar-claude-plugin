import { makeSimpleTool, makeIdFileDataTool } from './tool-factory.js';

export function registerPiTools(api: any) {
  const tools = [
    // Program Increments
    makeSimpleTool('pis_get', 'Get PI', 'Get a Program Increment by ID', 'pis', 'get', true),
    makeIdFileDataTool('pis_update', 'Update PI', 'Update a Program Increment (PUT)', 'pis', 'update'),
    makeSimpleTool('pis_delete', 'Delete PI', 'Delete a Program Increment', 'pis', 'delete', true),
    makeIdFileDataTool('pis_add_sprint', 'Add Sprint to PI', 'Add a sprint to a Program Increment', 'pis', 'add-sprint'),
  ];

  for (const tool of tools) {
    if (tool.optional) {
      api.registerTool(tool, { optional: true });
    } else {
      api.registerTool(tool);
    }
  }
}
