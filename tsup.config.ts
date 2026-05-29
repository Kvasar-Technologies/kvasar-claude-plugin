import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node18',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  external: ['@modelcontextprotocol/sdk', 'execa', 'zod', '@sinclair/typebox'],
});
