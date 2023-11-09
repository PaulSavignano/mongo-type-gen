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
  minify: true,
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
    const buildDownloadCollections = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/runDownloadCollections.ts'],
      external,
      outfile: 'bin/runDownloadCollections.js',
    });
    const buildUploadCollections = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/runUploadCollections.ts'],
      external,
      outfile: 'bin/runUploadCollections.js',
    });
    await Promise.all([buildGenTypes, buildDownloadCollections, buildUploadCollections]);
    console.info('✅ esbuild completed!');
  } catch (e) {
    console.info('❌ esbuild failed', e);
  }
};

runBuild();
