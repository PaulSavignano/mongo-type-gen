import fs from 'fs';
import { MongoClient } from 'mongodb';
import { transpile } from 'typescript';

import getFullPaths from './getFullPaths';

// Replace the uri string with your MongoDB deployment's connection string.
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run(): Promise<void> {
  try {
    const validatorPaths = await getFullPaths('**/*.validator.ts');
    const configPath = await getFullPaths('**/mongo-type-gen.config.ts');
    const config = await import(configPath[0]);
    const db = client.db(config.default.db);

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

    const res = await Promise.all(runCommandPromises);
    console.log(JSON.stringify(res, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
