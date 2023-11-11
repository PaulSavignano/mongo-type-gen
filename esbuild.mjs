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
      entryPoints: ['src/downloadCollections.ts'],
      external,
      outfile: 'bin/downloadCollections.js',
    });
    const buildUploadCollections = build({
      ...defaultOptions,
      banner,
      entryPoints: ['src/uploadCollections.ts'],
      external,
      outfile: 'bin/uploadCollections.js',
    });
    await Promise.all([buildGenTypes, buildDownloadCollections, buildUploadCollections]);
    console.info('✅ esbuild completed!');
  } catch (e) {
    console.info('❌ esbuild failed', e);
  }
};

runBuild();
