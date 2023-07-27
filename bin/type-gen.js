"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/genTypes.ts
var import_fast_glob = __toESM(require("fast-glob"));
var import_fs2 = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_util = require("util");

// src/watchDirs.ts
var import_fs = __toESM(require("fs"));

// package.json
var package_default = {
  name: "mongo-type-gen",
  version: "1.0.0",
  description: "A type and sdl generator for MongoDB",
  main: "type-gen.js",
  bin: {
    "mongo-type-gen": "bin/type-gen.js"
  },
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
    "mongo-type-gen": "ts-node-dev ./src/genTypes.ts -w",
    "mongo-type-gen:build": "node ./bin/type-gen.js -w",
    build: "rm -rf bin && node esbuild.mjs",
    "test-1": "node ./src/testWatch.js"
  },
  keywords: [
    "GraphQL",
    "Mongo",
    "Typescript"
  ],
  author: "paul@savignano.io",
  license: "ISC",
  devDependencies: {
    "@types/debounce": "^1.2.1",
    "@types/node": "^20.4.2",
    "@typescript-eslint/eslint-plugin": "^6.1.0",
    "@typescript-eslint/parser": "^6.1.0",
    esbuild: "^0.18.14",
    eslint: "^8.45.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-import-resolver-typescript": "^3.5.5",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-plugin-sort-class-members": "^1.18.0",
    "eslint-plugin-sort-destructure-keys": "^1.5.0",
    "eslint-plugin-sort-keys-fix": "^1.1.2",
    "eslint-plugin-typescript-sort-keys": "^2.3.0",
    prettier: "^3.0.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    typescript: "^5.1.6"
  },
  dependencies: {
    "@parcel/watcher": "^2.2.0",
    chokidar: "^3.5.3",
    debounce: "^1.2.1",
    "fast-glob": "^3.3.0",
    fs: "^0.0.1-security",
    glob: "^10.3.3",
    "graphql-tag": "^2.12.6",
    "json-schema": "^0.4.0",
    mongodb: "^5.7.0"
  },
  directories: {
    example: "examples",
    lib: "lib"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/PaulSavignano/mongo-type-gen.git"
  },
  bugs: {
    url: "https://github.com/PaulSavignano/mongo-type-gen/issues"
  },
  homepage: "https://github.com/PaulSavignano/mongo-type-gen#readme"
};

// src/watchDirs.ts
function watchDirs({ dirs, onChange }) {
  console.log(`\u2705 ${package_default.name} watching: ${dirs.join(", ")}`);
  let isChanging = false;
  dirs.forEach((dir) => {
    const watcher = import_fs.default.watch(dir, { recursive: true });
    watcher.on("change", (eventType, filename) => {
      if (!isChanging) {
        isChanging = true;
        onChange();
        if (filename) {
          setTimeout(() => {
            isChanging = false;
          }, 500);
        }
      }
    });
    watcher.on("error", (error) => {
      console.error(`Watcher error: ${error}`);
    });
    watcher.on("close", () => {
      console.log("Watcher closed");
    });
  });
}
var watchDirs_default = watchDirs;

// src/genTypes.ts
var typeMapping = {
  bool: "boolean",
  date: "Date",
  double: "number",
  int: "number",
  objectId: "ObjectId",
  string: "string"
};
var sdlMapping = {
  bool: "Boolean",
  date: "Date",
  double: "Float",
  int: "Int",
  objectId: "ObjectId",
  string: "String"
};
var writeFileAsync = (0, import_util.promisify)(import_fs2.default.writeFile);
var getFullPath = async (glob) => {
  const paths = await (0, import_fast_glob.default)(glob, { absolute: true });
  console.log("paths", paths);
  const mainFileDir = import_path.default.dirname(process.argv[1]);
  console.log("mainFileDir", mainFileDir);
  const resolvedGlobs = paths.map((p) => import_path.default.resolve(mainFileDir, p));
  return resolvedGlobs;
};
var reducer = ({
  allSdls: allSdls2 = [],
  allTypes: allTypes2 = [],
  obj,
  title
}) => {
  const { properties, required = [] } = obj;
  const typeResult = [];
  const sdlResult = [];
  const propKeys = Object.keys(properties).sort();
  for (const k of propKeys) {
    const value = properties[k];
    const isKeyRequired = required.includes(k);
    const typeKey = isKeyRequired ? k : `${k}?`;
    const sdlKey = k;
    const properK = k.charAt(0).toUpperCase() + k.slice(1);
    const childType = `${title}${properK}`;
    if (value.enum) {
      const enumType = [
        `export enum ${childType}Enum {`,
        ...value.enum.sort().map((v) => `  ${v} = '${v}',`),
        "  }"
      ].join("\n");
      allTypes2.push(enumType);
      const enumSdl = [`   enum ${childType}Enum {`, ...value.enum.map((v) => `    ${v}`), "  }"].join("\n");
      allSdls2.push(enumSdl);
      continue;
    }
    if (typeof value.bsonType === "string") {
      if (value.bsonType === "array") {
        const mappedItemType = typeMapping[value.items.bsonType];
        const itemTypeValue = mappedItemType ? mappedItemType : childType;
        const mappedItemSdl = sdlMapping[value.items.bsonType];
        const itemSdlValue = mappedItemSdl ? mappedItemSdl : childType;
        typeResult.push(`  ${typeKey}: ${itemTypeValue}[];`);
        sdlResult.push(`    ${sdlKey}: [${itemSdlValue}${isKeyRequired ? "!" : ""}]`);
        if (!mappedItemType) {
          reducer({
            allSdls: allSdls2,
            allTypes: allTypes2,
            obj: value.items,
            title: childType
          });
        }
        continue;
      }
      if (value.bsonType === "object") {
        typeResult.push(`  ${typeKey}: ${childType};`);
        sdlResult.push(`    ${sdlKey}: ${childType}${isKeyRequired ? "!" : ""}`);
        reducer({
          allSdls: allSdls2,
          allTypes: allTypes2,
          obj: value,
          title: childType
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
          sdlResult.push(`    ${sdlKey}: ${mappedSdlValue}${isKeyRequired ? "!" : ""}`);
        }
        continue;
      }
    }
    if (Array.isArray(value.bsonType)) {
      const valid = value.bsonType.includes("null");
      if (!valid) {
        throw Error("Only one bsonType and null are supported for a bsonType array");
      }
      const res = [];
      value.bsonType.forEach((v) => {
        const mapped = typeMapping[v];
        if (v === "null") {
          res.push("null");
        } else if (mapped) {
          res.push(mapped);
        }
      });
      typeResult.push(`  ${typeKey}: ${res.join(" | ")};`);
      const singleType = value.bsonType.filter((v) => v !== "null");
      sdlResult.push(`    ${sdlKey}: ${sdlMapping[singleType[0]]}${isKeyRequired ? "!" : ""}`);
    }
  }
  allTypes2.push([`export type ${title} = {`, ...typeResult, "};"].join("\n"));
  allSdls2.push([`  type ${title} {`, ...sdlResult, "  }"].join("\n"));
};
var generateTypes = async ({ outputPath, schemaPaths }) => {
  const banner = "/* This file was generated by mongo-type-gen.  Do not edit */";
  const allTypes = [banner, "import { ObjectId } from 'mongodb';"];
  const allSdls = [banner, "import { gql } from 'graphql-tag';", "export default gql`"];
  for (const path of schemaPaths) {
    const config = import_fs2.default.readFileSync(path, "utf8");
    const moduleExportsObject = eval(config);
    console.log("config is ", config);
    const jsonSchema = moduleExportsObject.$jsonSchema;
    reducer({
      allSdls,
      allTypes,
      obj: jsonSchema,
      title: jsonSchema.title
    });
  }
  const tsString = allTypes.join("\n\n");
  const sdlString = [...allSdls, "`;"].join("\n\n");
  await Promise.all([
    writeFileAsync(`./${outputPath}/mongoDocTypes.ts`, tsString),
    writeFileAsync(`./${outputPath}/mongoDocSdls.ts`, sdlString)
  ]);
  console.info("\u2705 Mongo Schema types generated!");
};
var run = async () => {
  const configPath = await getFullPath("**/typeGen.config.js");
  const configFile = await import(configPath[0]);
  const schemaPaths2 = await getFullPath(configFile.default.input);
  if (process.argv.includes("--watch") || process.argv.includes("-w")) {
    const onChange = async () => generateTypes({
      outputPath: configFile.default.output,
      schemaPaths: schemaPaths2
    });
    watchDirs_default({
      dirs: schemaPaths2,
      onChange
    });
  }
  generateTypes({
    outputPath: configFile.default.output,
    schemaPaths: schemaPaths2
  });
};
run();
//# sourceMappingURL=type-gen.js.map
