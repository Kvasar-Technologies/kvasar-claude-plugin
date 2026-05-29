import { makeSimpleTool, makeFileDataTool, makeIdFileDataTool } from './tool-factory.js';

export function registerAgileCoachTools(api: any) {
  const tools = [
    // items
    makeSimpleTool('items_get', 'Get Item', 'Get an item (epic, feature, story, etc.) by ID', 'items', 'get', true),
    makeIdFileDataTool('items_update', 'Update Item', 'Update an item (PUT)', 'items', 'update'),
    makeSimpleTool('items_delete', 'Delete Item', 'Delete an item', 'items', 'delete', true),
    makeIdFileDataTool('items_patch', 'Patch Item', 'Patch an item (JSON Patch)', 'items', 'patch'),
    makeIdFileDataTool('items_add_relation', 'Add Item Relation', 'Add a relation to an item', 'items', 'add-relation'),
    // users
    makeSimpleTool('users_list', 'List Users', 'List all users', 'users', 'list'),
    makeFileDataTool('users_create', 'Create User', 'Create a new user', 'users', 'create'),
    makeFileDataTool('users_update', 'Update User', 'Update a user (PUT)', 'users', 'update'),
    // kpis
    makeSimpleTool('kpis_list', 'List KPIs', 'List all KPIs', 'kpis', 'list'),
    makeFileDataTool('kpis_create', 'Create KPI', 'Create a new KPI', 'kpis', 'create'),
    makeFileDataTool('kpis_update', 'Update KPI', 'Update a KPI (PUT)', 'kpis', 'update'),
  ];

  for (const tool of tools) {
    if (tool.optional) {
      api.registerTool(tool, { optional: true });
    } else {
      api.registerTool(tool);
    }
  }
}
