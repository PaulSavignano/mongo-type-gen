import getConfig from './common/getConfig';
import fetchCollections from './fetchCollections';
import writeCollectionFiles from './writeCollectionFiles';

const downloadCollections = async () => {
  const { db, output, uri } = await getConfig();
  const collections = await fetchCollections({ db, uri });
  await writeCollectionFiles({ collections, dir: output.collections });
};

downloadCollections().then(() => process.exit(0));
