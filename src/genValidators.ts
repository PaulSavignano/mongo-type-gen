//import fs from 'fs';
import { MongoClient } from 'mongodb';
//import { transpile } from 'typescript';

import formatJsonString from './formatJsonSting';
import getFullPaths from './getFullPaths';
import writeFileAsync from './writeFileAsync';

// Replace the uri string with your MongoDB deployment's connection string.
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run(): Promise<void> {
  try {
    const files = [];

    const configPath = await getFullPaths('**/mongo-type-gen.config.ts');
    const config = await import(configPath[0]);
    const db = client.db(config.default.db);
    const listCollections = await db.listCollections().toArray();

    for (const col of listCollections) {
      const c = col as unknown as { options: { validator: string } };
      const v = c.options.validator;
      const s = formatJsonString(v);
      const tsCode = `export default ${s};`;
      const file = writeFileAsync(`./${config.default.output}/${col.name}.validator.ts`, tsCode);
      files.push(file);
    }

    await Promise.all(files);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
