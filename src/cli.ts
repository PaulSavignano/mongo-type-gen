import { bundleRequire } from 'bundle-require';

import getFilenames from './common/getFilenames';
import handleError from './common/handleError';
import pkg from '../package.json';

const { argv } = process;

const cli = async () => {
  try {
    const configFiles = await getFilenames([
      '**/mongo-type-gen.*s',
      '**/mongo-type-gen.config.*s',
      '**/mtg.*s',
      '**/mtg.config.*s',
    ]);
    if (configFiles.length > 1) {
      console.error(`${pkg.name} found ${configFiles.length} config files`, configFiles);
      throw Error('found multiple config files, please remove one.');
    }
    const filepath = configFiles[0];
    await bundleRequire({ filepath });
  } catch (e) {
    const error = handleError(e);
    console.error(`❌ ${pkg.name} failed: `, error);
    process.exit(1);
  } finally {
    const isWatching = argv.includes('--watch') || argv.includes('-w');
    if (!isWatching) {
      process.exit(0);
    }
  }
};

cli();
