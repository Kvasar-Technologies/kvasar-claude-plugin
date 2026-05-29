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
        if (params.data) {
          const data = await withTempJsonFile(params.data, async (filePath) => {
            return runCliCommand([group, subcommand, '--file', filePath]);
          });
          return succeed(data);
        }
        const args = [group, subcommand, '--file', params.file];
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
        if (params.data) {
          const resultData = await withTempJsonFile(params.data, async (filePath) => {
            return runCliCommand([group, subcommand, params.id, '--file', filePath]);
          });
          return succeed(resultData);
        }
        const args = [group, subcommand, params.id, '--file', params.file];
        const resultData = await runCliCommand(args);
        return succeed(resultData);
      } catch (err: any) {
        return fail(err.message);
      }
    },
  };
}
