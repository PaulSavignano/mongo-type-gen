import getCollectionsFromFiles from './common/getCollectionsFromFiles';
import getConfig from './common/getConfig';
import getFilenames from './common/getFilenames';
import uploadValidatorsAndIndexes from './common/uploadValidatorsAndIndexes';

const uploadCollections = async () => {
  const { db, input, uri } = await getConfig();
  const filenames = await getFilenames(input);
  const collections = await getCollectionsFromFiles(filenames);
  await uploadValidatorsAndIndexes({ collections, db, isLogging: true, uri });
};
uploadCollections().then(() => process.exit(0));
