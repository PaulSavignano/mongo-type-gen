import fs from 'fs';
import { MongoClient } from 'mongodb';
import { transpile } from 'typescript';

import getConfig from './common/getConfig';
import getFullPaths from './common/getFullPaths';
import pkg from '../package.json';

// Replace the uri string with your MongoDB deployment's connection string.
let client: MongoClient;

async function uploadValidators(): Promise<void> {
  try {
    const config = await getConfig();
    const uri = 'mongodb://localhost:27017';
    client = new MongoClient(uri);

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
  } finally {
    await client.close();
  }
}
uploadValidators().catch((e) => {
  console.error('❌ uploadValidators failed: ', e);
});
