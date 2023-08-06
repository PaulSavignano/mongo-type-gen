import fs from 'fs';
import { MongoClient } from 'mongodb';
import { transpile } from 'typescript';

import getConfig from './common/getConfig';
import getFullPaths from './common/getFullPaths';
import pkg from '../package.json';

// Replace the uri string with your MongoDB deployment's connection string.
let client: MongoClient;

async function uploadValidators(): Promise<number> {
  try {
    const config = await getConfig();
    if (!config.uri) {
      throw Error('I cannot connect to upload your validators to Mongo without a uri.');
    }
    client = new MongoClient(config.uri);

    const validatorPaths = await getFullPaths('**/*.validator.ts');
    const db = client.db(config.db);

    const listCollections = await db.listCollections().toArray();
    const collections = listCollections.map((c) => c.name);

    const runCommandPromises = validatorPaths.map((path) => {
      const validatorStr = fs.readFileSync(path, 'utf8');
      const validator = transpile(validatorStr);
      const v = eval(validator);
      const cName = path.split('/').pop()?.split('.')[0] || '';

      const isExisting = collections.includes(cName);
      if (isExisting) {
        const command = db.command({
          collMod: cName,
          validator: v,
        });
        return command;
      }

      const createCollection = db.createCollection(cName, {
        validator: v,
      });
      return createCollection;
    });

    await Promise.all(runCommandPromises);
    console.info(`✅ ${pkg.name} validators uploaded to Mongo!`);
    return 0;
  } catch (e) {
    const error = e instanceof Error ? e.message : e;
    console.error(`❌ ${pkg.name} failed to download validators from Mongo: `, error);
    return 1;
  } finally {
    await client.close();
  }
}
uploadValidators()
  .then((code) => {
    process.exit(code);
  })
  .catch((code) => {
    process.exit(code);
  });
