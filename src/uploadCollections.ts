import getCollectionsFromFiles from './common/getCollectionsFromFiles';
import getConfig from './common/getConfig';
import getFilenames from './common/getFilenames';
import uploadValidatorsAndIndexes from './common/uploadValidatorsAndIndexes';
import pkg from '../package.json';

const uploadCollections = async () => {
  try {
    const { db, input, uri } = await getConfig();
    const filenames = await getFilenames(input);
    const collections = await getCollectionsFromFiles(filenames);
    await uploadValidatorsAndIndexes({ collections, db, uri });
  } catch (e) {
    const error = e instanceof Error ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : JSON.stringify(e);
    console.error(`❌ ${pkg.name} failed to upload collections to Mongo: `, error);
  } finally {
    process.exit(0);
  }
};
uploadCollections();
