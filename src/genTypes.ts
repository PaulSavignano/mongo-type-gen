import fs from 'fs';
import { JSONSchema4 } from 'json-schema';
import { transpile } from 'typescript';

import getConfig from './common/getConfig';
import getFullPaths from './common/getFullPaths';
import singularize from './common/singularize';
import watchDirs from './common/watchDirs';
import writeFileAsync from './common/writeFileAsync';
import downloadValidators from './downloadValidators';
import pkg from '../package.json';

const typeMapping: Record<string, string> = {
  bool: 'boolean',
  date: 'Date',
  double: 'number',
  int: 'number',
  objectId: 'ObjectId | string',
  string: 'string',
};

const sdlMapping: Record<string, string> = {
  bool: 'Boolean',
  date: 'Date',
  double: 'Float',
  int: 'Int',
  objectId: 'ObjectId',
  string: 'String',
};

// tab   &#9

const reduce = ({
  allSdls = [],
  allTypes = [],
  collectionName,
  obj,
}: {
  allSdls: string[];
  allTypes: string[];
  collectionName: string;
  obj: Record<string, JSONSchema4>;
}) => {
  const { properties, required = [] } = obj;
  const typeResult: string[] = [];
  const sdlResult: string[] = [];

  const propKeys = Object.keys(properties).sort();
  for (const k of propKeys) {
    const value = properties[k];
    const isKeyRequired = required.includes(k);
    const typeKey = isKeyRequired ? k : `${k}?`;
    const sdlKey = k;

    const properK = k.charAt(0).toUpperCase() + k.slice(1);
    const childType = `${collectionName}${properK}`;

    if (value.enum) {
      const enumType = [
        `export enum ${childType}Enum {`,
        ...value.enum.sort().map((v: string) => `  ${v} = '${v}',`),
        '}',
      ].join('\n');
      allTypes.push(enumType);

      const enumSdl = [`   enum ${childType}Enum {`, ...value.enum.map((v: string) => `    ${v}`), '  }'].join('\n');
      allSdls.push(enumSdl);
      continue;
    }

    if (typeof value.bsonType === 'string') {
      if (value.bsonType === 'array') {
        const mappedItemType = typeMapping[value.items.bsonType];
        const itemTypeValue = mappedItemType ? mappedItemType : childType;
        const mappedItemSdl = sdlMapping[value.items.bsonType];
        const itemSdlValue = mappedItemSdl ? mappedItemSdl : childType;
        typeResult.push(`  ${typeKey}: ${itemTypeValue}[];`);
        sdlResult.push(`    ${sdlKey}: [${itemSdlValue}${isKeyRequired ? '!' : ''}]`);
        if (!mappedItemType) {
          reduce({
            allSdls,
            allTypes,
            collectionName: childType,
            obj: value.items,
          });
        }

        continue;
      }

      if (value.bsonType === 'object') {
        typeResult.push(`  ${typeKey}: ${childType};`);
        sdlResult.push(`    ${sdlKey}: ${childType}${isKeyRequired ? '!' : ''}`);
        reduce({
          allSdls,
          allTypes,
          collectionName: childType,
          obj: value,
        });
        continue;
      }

      const mappedTypeValue = typeMapping[value.bsonType];
      const mappedSdlValue = sdlMapping[value.bsonType];

      if (mappedTypeValue || mappedTypeValue) {
        if (mappedTypeValue) {
          typeResult.push(`  ${typeKey}: ${mappedTypeValue};`);
        }

        if (mappedSdlValue) {
          sdlResult.push(`    ${sdlKey}: ${mappedSdlValue}${isKeyRequired ? '!' : ''}`);
        }
        continue;
      }
    }

    if (Array.isArray(value.bsonType)) {
      const valid = value.bsonType.includes('null') || value.bsonType.length === 1;
      if (!valid) {
        throw Error('Only one bsonType and null are supported for a bsonType array');
      }
      // handle Typescript
      const res: string[] = [];
      value.bsonType.forEach((v: string) => {
        const mapped = typeMapping[v];
        if (v === 'null') {
          res.push('null');
        } else if (mapped) {
          res.push(mapped);
        }
      });
      typeResult.push(`  ${typeKey}: ${res.join(' | ')};`);

      // handle SDL
      const singleType = value.bsonType.filter((v: string) => v !== 'null');
      sdlResult.push(`    ${sdlKey}: ${sdlMapping[singleType[0]]}${isKeyRequired ? '!' : ''}`);
    }
  }

  allTypes.push([`export type ${collectionName} = {`, ...typeResult, '};'].join('\n'));
  allSdls.push([`  type ${collectionName} {`, ...sdlResult, '  }'].join('\n'));
};

const iterateValidators = async ({ outputPath, validatorPaths }: { outputPath: string; validatorPaths: string[] }) => {
  const banner = '/* This file is generated by mongo-type-gen.  Do not edit */';
  const allTypes: string[] = [banner, "import { ObjectId } from 'mongodb';"];
  const allSdls: string[] = [banner, "import { gql } from 'graphql-tag';", 'export default gql`'];

  for (const path of validatorPaths) {
    const validatorStr = fs.readFileSync(path, 'utf8');
    const validator = transpile(validatorStr);
    const v = eval(validator);
    const cName = path.split('/').pop()?.split('.')[0] || '';
    const properCname = cName.charAt(0).toUpperCase() + cName.slice(1);
    const singularCname = singularize(properCname);
    reduce({
      allSdls,
      allTypes,
      collectionName: `${singularCname}Doc`,
      obj: v.$jsonSchema,
    });
  }

  const tsString = allTypes.join('\n\n');
  const sdlString = [...allSdls, '`;'].join('\n\n');

  await Promise.all([
    writeFileAsync(`./${outputPath}/mongo.types.ts`, tsString),
    writeFileAsync(`./${outputPath}/mongo.sdls.ts`, sdlString),
  ]);

  console.info(`✅ ${pkg.name} types generated!`);
};

const genTypes = async () => {
  const config = await getConfig();
  const validatorPaths = await getFullPaths('**/*.validator.*s');

  if (!validatorPaths.length) {
    console.info(`⚠️ ${pkg.name} could not find any validators files, downnloading from Mongo...`);
    await downloadValidators();
  }

  if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    const onChange = async () =>
      iterateValidators({
        outputPath: config.output,
        validatorPaths,
      });
    watchDirs({
      dirs: validatorPaths,
      onChange,
    });
  }

  iterateValidators({
    outputPath: config.output,
    validatorPaths,
  });
};

genTypes().catch((e) => {
  console.error('❌ genTypes failed: ', e);
  process.exit(1);
});
