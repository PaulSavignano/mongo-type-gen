import { MongoClient } from 'mongodb';

import pkg from '../../package.json';
import MtgCollection from '../types/MtgCollection';

let client: MongoClient;

const logResult = ({
  errors,
  hasErrors,
  hasIndexes,
  hasValidator,
  isLogging,
}: {
  errors: Record<string, Record<string, unknown[]>>;
  hasErrors: boolean;
  hasIndexes: boolean;
  hasValidator: boolean;
  isLogging: boolean;
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
  log.push('upload completed');
  if (hasErrors) {
    log.push('but received errors');
  } else {
    log.push('successfully!');
  }
  const str = log.join(' ');

  if (hasErrors) {
    console.warn(str, JSON.stringify(errors, null, 2));
  } else if (isLogging) {
    console.info(str);
  }
};
async function uploadValidatorsAndIndexes({
  collections,
  db,
  isLogging,
  uri,
}: {
  collections: MtgCollection[];
  db: string;
  isLogging: boolean;
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
    const runCommandPromises = collections.map(async (c) => {
      if (c.isGenerated) {
        if (isLogging) {
          console.warn(`🟡 ${pkg.name} skipping ${c.name} because it is generated`);
        }
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
    });

    await Promise.all(runCommandPromises);

    logResult({ errors, hasErrors, hasIndexes, hasValidator, isLogging });
  } catch (e) {
    const error = e instanceof Error ? e.message : e;
    console.error(`❌ ${pkg.name} failed to download validators from Mongo: `, error);
  } finally {
    await client.close();
  }
}

export default uploadValidatorsAndIndexes;
