import { bundleRequire } from 'bundle-require';

import MtgCollection from '../types/MtgCollection';

const getCollectionsFromFiles = async (filenames: string[]) => {
  const collections = await Promise.all(
    filenames.map(async (filepath) => {
      const { mod } = await bundleRequire<{ default: MtgCollection }>({
        filepath,
      });
      return mod.default;
    }),
  );
  return collections;
};

export default getCollectionsFromFiles;
