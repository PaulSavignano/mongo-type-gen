import { MongoClient } from 'mongodb';
// Replace the uri string with your MongoDB deployment's connection string.
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run(): Promise<void> {
  try {
    const db = client.db('mongo-type-gen');
    const collections = await db.listCollections().toArray();
    // const res = await db.createCollection('students', {
    //   validator: {
    //     $jsonSchema: {
    //       bsonType: 'object',
    //       properties: {
    //         gpa: {
    //           bsonType: ['double'],
    //           description: "'gpa' must be a double if the field exists",
    //         },
    //         name: {
    //           bsonType: 'string',
    //           description: "'name' must be a string and is required",
    //         },
    //         year: {
    //           bsonType: 'int',
    //           description: "'year' must be an integer in [ 2017, 3017 ] and is required",
    //           maximum: 3017,
    //           minimum: 2017,
    //         },
    //       },
    //       required: ['address', 'major', 'name', 'year'],
    //       title: 'Student Object Validation',
    //     },
    //   },
    // });

    console.log(JSON.stringify(collections, null, 2));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
