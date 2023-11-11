import { MongoClient, CollectionInfo } from 'mongodb';

import MtgCollection from './types/MtgCollection';
let client: MongoClient;

async function fetchCollections({ db, uri }: { db: string; uri: string }) {
  try {
    client = new MongoClient(uri);

    const mongoDb = client.db(db);
    const MtgCollections = await mongoDb.listCollections().toArray();

    const collections = await Promise.all(
      MtgCollections.map<Promise<MtgCollection>>(async ({ name, options }: CollectionInfo) => {
        const mongoIndexes = await mongoDb.collection(name).listIndexes().toArray();
        const indexes = mongoIndexes.map(({ name: _deletedName, v: _deletedV, ...rest }) => rest);
        const result = {
          indexes,
          isGenerated: true,
          name,
          ...(options?.validator && { validator: options.validator }),
        };
        return result;
      }),
    );

    return collections;
  } finally {
    await client.close();
  }
}

export default fetchCollections;
