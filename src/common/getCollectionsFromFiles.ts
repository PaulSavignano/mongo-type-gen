import importFileDefaultNoCache from './importFileDefaultNoCache';
import MtgCollection from '../types/MtgCollection';

const getCollectionsFromFiles = async (filenames: string[]) => {
  const collections = await Promise.all(
    filenames.map(async (filename) => {
      const collectionObj = await importFileDefaultNoCache<MtgCollection>(filename);
      return collectionObj;
    }),
  );
  return collections;
};

export default getCollectionsFromFiles;
