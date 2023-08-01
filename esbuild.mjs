import { build } from 'esbuild';

import pkg from './package.json' assert { type: 'json' };

const external = [
  './package.json',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

const defaultOptions = {
  bundle: true,
  logLevel: 'debug',
  minify: false,
  platform: 'node',
  sourcemap: true,
};

const banner = {
  js: '#!/usr/bin/env node',
};

const runBuild = async () => {
  try {
    const getTypes = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/genTypes.ts'],
      external,
      outfile: 'bin/genTypes.js',
    });
    const getValidators = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/genValidators.ts'],
      external,
      outfile: 'bin/genValidators.js',
    });
    const updateValidators = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/addValidators.ts'],
      external,
      outfile: 'bin/addValidators.js',
    });
    await Promise.all([getTypes, getValidators, updateValidators]);
    console.info('✅ esbuild completed!');
  } catch (e) {
    console.info('❌ esbuild failed', e);
  }
};

runBuild();
