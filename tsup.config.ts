import { defineConfig } from 'tsup';

export default [
  defineConfig({
    dts: true,
    entry: ['src/configMtg.ts'],
    minify: true,
    sourcemap: true,
    splitting: false,
  }),
  defineConfig({
    banner: { js: '#!/usr/bin/env node' },
    entry: ['src/cli.ts'],
    minify: true,
    sourcemap: true,
    splitting: false,
  }),
];
