import { MongoClient } from 'mongodb';

import getConfig from './common/getConfig';
import getFilenames from './common/getFilenames';
import importFile from './common/importFile';
import MongoCollection from './types/MongoCollection';
import pkg from '../package.json';

let client: MongoClient;
async function uploadCollections(): Promise<void> {
  try {
    const { db, input, uri } = await getConfig();
    client = new MongoClient(uri);

    const collectionFilenames = await getFilenames(input);
    const mongoDb = client.db(db);

    const collections = await mongoDb.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const errors: Record<string, unknown[]> = {};
    let hasErrors = false;
    const runCommandPromises = collectionFilenames.map(async (filename) => {
      const { indexes, isGenerated, validator } = await importFile<MongoCollection>(filename);

      if (isGenerated) {
        console.warn(`🟡 ${pkg.name} skipping ${filename} because it is generated`);
        return undefined;
      }

      const collectionName = filename.split('/').pop()?.split('.')[0] || '';
      errors[collectionName] = [];
      const handleE = (e: unknown) => {
        errors[collectionName].push(e);
        hasErrors = true;
      };

      if (validator) {
        const collMod = collectionName;
        const isExisting = collectionNames.includes(collectionName);

        if (isExisting) {
          await mongoDb.command({ collMod, validator }).catch(handleE);
        } else {
          await mongoDb.createCollection(collectionName, { validator }).catch(handleE);
        }
      }

      if (indexes && indexes.length) {
        const col = mongoDb.collection(collectionName);
        await col.createIndexes(indexes).catch(handleE);
      }
    });

    await Promise.all(runCommandPromises);

    if (hasErrors) {
      console.warn(`🟡 ${pkg.name} collections uploaded to Mongo with errors`, JSON.stringify(errors, null, 2));
    } else {
      console.info(`✅ ${pkg.name} collections uploaded to Mongo!`);
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : e;
    console.error(`❌ ${pkg.name} failed to download validators from Mongo: `, error);
  } finally {
    console.log('closing client');
    await client.close();
  }
}

export default uploadCollections;
