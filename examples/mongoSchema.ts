import { JSONSchema } from "json-schema-to-typescript";

const personSchema: JSONSchema = {
  $jsonSchema: {
    bsonType: "object",
    properties: {
      _id: { bsonType: "objectId" },
      name: { bsonType: "string" },
      age: { bsonType: ["int", "null"] },
      gender: { enum: ["MALE", "FEMALE"] },
      children: {
        bsonType: "array",
        items: {
          bsonType: "object",
          properties: {
            _id: { bsonType: "objectId" },
            name: { bsonType: "string" },
            createdAt: { bsonType: "date" },
            age: { bsonType: ["int", "null"] },
            updatedAt: { bsonType: "date" },
          },
          required: ["_id", "age", "createdAt", "name"],
        },
      },
      address: {
        additionalProperties: false,
        bsonType: "object",
        properties: {
          state: { bsonType: "string" },
          street: { bsonType: "string" },
          city: { bsonType: "string" },
          zip: { bsonType: "string" },
        },
        required: ["state", "street", "city", "zip"],
      },
    },
    required: ["_id", "name", "address"],
    title: "UserDoc",
  },
};

export default personSchema;
