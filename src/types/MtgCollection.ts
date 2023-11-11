import { JSONSchema4 } from 'json-schema';
import { IndexDescription, Filter } from 'mongodb';

interface Validator {
  $and: Filter<unknown>[];
  $expr: Filter<unknown>;
  $jsonSchema: JSONSchema4;
  $or: Filter<unknown>[];
}

export enum MtgCollectionKeyEnum {
  indexes = 'indexes',
  isGenerated = 'isGenerated',
  name = 'name',
  validator = 'validator',
}

interface MtgCollection extends Record<string, unknown> {
  [key: string]: unknown;
  [MtgCollectionKeyEnum.indexes]: IndexDescription[];
  [MtgCollectionKeyEnum.isGenerated]: boolean;
  [MtgCollectionKeyEnum.name]: string;
  [MtgCollectionKeyEnum.validator]?: Validator;
}

export default MtgCollection;
