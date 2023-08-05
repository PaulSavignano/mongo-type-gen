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
    const buildGenTypes = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/genTypes.ts'],
      external,
      outfile: 'bin/genTypes.js',
    });
    const buildDownloadValidators = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/downloadValidators.ts'],
      external,
      outfile: 'bin/downloadValidators.js',
    });
    const buildUploadValidators = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/uploadValidators.ts'],
      external,
      outfile: 'bin/uploadValidators.js',
    });
    await Promise.all([buildGenTypes, buildDownloadValidators, buildUploadValidators]);
    console.info('✅ esbuild completed!');
  } catch (e) {
    console.info('❌ esbuild failed', e);
  }
};

runBuild();
