import { MongoClient } from 'mongodb';

import pkg from '../../package.json';
import MtgCollection from '../types/MtgCollection';

let client: MongoClient;

const logResult = ({
  errors,
  hasErrors,
  hasIndexes,
  hasValidator,
}: {
  errors: Record<string, Record<string, unknown[]>>;
  hasErrors: boolean;
  hasIndexes: boolean;
  hasValidator: boolean;
}) => {
  const log = [];
  if (hasErrors) {
    log.push('🟡');
  } else {
    log.push('✅');
  }
  log.push(pkg.name);

  if (hasValidator && hasIndexes) {
    log.push('validator and indexes');
  } else if (hasValidator) {
    log.push('validator');
  } else if (hasIndexes) {
    log.push('indexes');
  }
  log.push('upload to Mongo completed');
  if (hasErrors) {
    log.push('but received errors');
  } else {
    log.push('successfully!');
  }
  const str = log.join(' ');

  if (hasErrors) {
    console.warn(str, JSON.stringify(errors, null, 2));
  }
};
async function uploadValidatorsAndIndexes({
  collections,
  db,
  uri,
}: {
  collections: MtgCollection[];
  db: string;
  uri: string;
}): Promise<void> {
  try {
    client = new MongoClient(uri);

    const mongoDb = client.db(db);

    const mongoCollections = await mongoDb.listCollections().toArray();
    const mongoCollectionNames = mongoCollections.map((c) => c.name);

    const errors: Record<string, Record<string, unknown[]>> = {};
    let hasErrors = false;
    let hasValidator = false;
    let hasIndexes = false;
    const promises = collections
      .map(async (c) => {
        if (c.isGenerated) {
          console.warn(`🟡 ${pkg.name} upload is skipping ${c.name} because it is generated`);
          return undefined;
        }

        if (c.validator) {
          hasValidator = true;
          const handleE = (e: unknown) => {
            errors[c.name]['validator'].push(e);
            hasErrors = true;
          };
          const collMod = c.name;
          const isExisting = mongoCollectionNames.includes(c.name);

          if (isExisting) {
            await mongoDb.command({ collMod, validator: c.validator }).catch(handleE);
          } else {
            await mongoDb.createCollection(c.name, { validator: c.validator }).catch(handleE);
          }
        }

        if (c.indexes && c.indexes.length) {
          hasIndexes = true;
          const handleE = (e: unknown) => {
            errors[c.name]['indexes'].push(e);
            hasErrors = true;
          };
          const col = mongoDb.collection(c.name);
          await col.createIndexes(c.indexes).catch(handleE);
        }
        return true;
      })
      .filter(Boolean);

    if (promises.length) {
      await Promise.all(promises);
    }
    logResult({ errors, hasErrors, hasIndexes, hasValidator });
  } catch (e) {
    const error = e instanceof Error ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : JSON.stringify(e);
    console.error(`❌ ${pkg.name} failed to download validators from Mongo: `, error);
  } finally {
    await client.close();
  }
}

export default uploadValidatorsAndIndexes;
