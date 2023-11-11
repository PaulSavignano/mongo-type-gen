import getConfig from './common/getConfig';
import getFilenames from './common/getFilenames';
import getCollectionsFromFiles from './getCollectionsFromFiles';
import uploadCollections from './uploadCollections';

const runUploadCollections = async () => {
  const { db, input, uri } = await getConfig();
  const filenames = await getFilenames(input);
  const collections = await getCollectionsFromFiles(filenames);
  await uploadCollections({ collections, db, isLogging: true, uri });
};
runUploadCollections().then(() => process.exit(0));
