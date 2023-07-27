import { build } from 'esbuild';

import pkg from './package.json' assert { type: 'json' };

const external = [
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

const runBuild = async () => {
  try {
    await build({
      ...defaultOptions,
      entryPoints: ['src/genTypes.ts'],
      external,
      outfile: `bin/${pkg.main}`,
    });
    console.info('✅ esbuild completed!');
  } catch (e) {
    console.info('❌ esbuild failed', e);
  }
};

runBuild();
