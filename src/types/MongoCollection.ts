import { JSONSchema4 } from 'json-schema';
import { IndexDescription, Filter } from 'mongodb';

interface Validator {
  $and: Filter<unknown>[];
  $expr: Filter<unknown>;
  $jsonSchema: JSONSchema4;
  $or: Filter<unknown>[];
}

interface MongoCollection {
  indexes: IndexDescription[];
  isGenerated: boolean;
  validator: Validator;
}

export default MongoCollection;
