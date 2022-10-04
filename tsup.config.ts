// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  external: [],
  format: ['esm', 'cjs'],
  keepNames: true,
  minify: false,
  noExternal: [],
  platform: 'node',
  shims: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: false,
  target: 'es2022',
});
