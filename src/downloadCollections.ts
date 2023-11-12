import fetchCollections from './common/fetchCollections';
import getConfig from './common/getConfig';
import writeCollectionFiles from './common/writeCollectionFiles';
import pkg from '../package.json';

const downloadCollections = async () => {
  try {
    const { db, output, uri } = await getConfig();
    const collections = await fetchCollections({ db, uri });
    await writeCollectionFiles({ collections, dir: output.collections });
  } catch (e) {
    const error = e instanceof Error ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : JSON.stringify(e);
    console.error(`❌ ${pkg.name} failed to download collections from Mongo: `, error);
  } finally {
    console.info(`✅ ${pkg.name} collections downloaded from Mongo!`);
    process.exit(0);
  }
};

downloadCollections();
