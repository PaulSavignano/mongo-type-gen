#!/usr/bin/env node
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
var import_fs3 = __toESM(require("fs"));
var import_typescript = require("typescript");

// src/common/getFullPaths.ts
var import_fast_glob = __toESM(require("fast-glob"));
var import_path = __toESM(require("path"));
var getFullPaths = async (glob) => {
  const paths = await (0, import_fast_glob.default)(glob, { absolute: true, ignore: ["**/node_modules/**"] });
  const mainFileDir = import_path.default.dirname(process.argv[1]);
  const resolvedGlobs = paths.map((p) => import_path.default.resolve(mainFileDir, p));
  return resolvedGlobs;
};
var getFullPaths_default = getFullPaths;

// src/common/getConfig.ts
var import_package = __toESM(require("../package.json"));
var getConfig = async () => {
  const configPaths = await getFullPaths_default(["**/mtg.config.*s", "**/mongo-type-gen.config.*s"]);
  const configFile = await import(configPaths[0]);
  if (configPaths.length > 1) {
    console.log(`\u{1F7E1} ${import_package.default.name} found multiple config files.  Using ${configPaths[0]}.`);
  }
  return configFile.default;
};
var getConfig_default = getConfig;

// src/common/singularize.ts
function singularize(name) {
  const pluralToSingular = {
    es: "",
    ies: "y",
    oes: "o",
    s: "",
    ves: "f",
    xes: "x"
  };
  for (const pluralSuffix in pluralToSingular) {
    if (name.endsWith(pluralSuffix)) {
      return name.slice(0, -pluralSuffix.length) + pluralToSingular[pluralSuffix];
    }
  }
  return name;
}
var singularize_default = singularize;

// src/common/watchDirs.ts
var import_fs = __toESM(require("fs"));
var import_package2 = __toESM(require("../package.json"));
function watchDirs({ dirs, onChange }) {
  console.info(`\u2705 ${import_package2.default.name} watching: ${dirs.join(", ")}`);
  let isChanging = false;
  dirs.forEach((dir) => {
    const watcher = import_fs.default.watch(dir, { recursive: true });
    watcher.on("change", (_eventType, filename) => {
      if (!isChanging) {
        isChanging = true;
        onChange();
        if (filename) {
          setTimeout(() => {
            isChanging = false;
          }, 2e3);
        }
      }
    });
    watcher.on("error", (error) => {
      console.error(`watchDirs error: ${error}`);
    });
    watcher.on("close", () => {
      console.log("watchDirs closed");
    });
  });
}
var watchDirs_default = watchDirs;

// src/common/writeFileAsync.ts
var import_fs2 = __toESM(require("fs"));
var import_util = require("util");
var writeFileAsync = (0, import_util.promisify)(import_fs2.default.writeFile);
var writeFileAsync_default = writeFileAsync;

// src/downloadValidators.ts
var import_mongodb = require("mongodb");

// src/common/formatJsonSting.ts
var formatJsonString = (obj) => {
  if (!obj)
    return "";
  const keys = Object.keys(obj);
  if (!keys || !keys.length)
    return "{}";
  const json = JSON.stringify(obj, null, 2);
  const removeDoubleQuoteKeys = json.replace(/"([^"]+)":/g, "$1:");
  const replaceDoubleQuotes = removeDoubleQuoteKeys.replace(/"([^"]*)"/g, (p, p1) => {
    if (p1.includes("'")) {
      return `"${p1}"`;
    }
    return `'${p1}'`;
  });
  return replaceDoubleQuotes;
};
var formatJsonSting_default = formatJsonString;

// src/downloadValidators.ts
var import_package3 = __toESM(require("../package.json"));
var client;
async function downloadValidators() {
  try {
    const config = await getConfig_default();
    const files = [];
    const banner2 = "/* This file is generated by mongo-type-gen.  Do not edit */";
    client = new import_mongodb.MongoClient(config.uri);
    const db = client.db(config.db);
    const listCollections = await db.listCollections().toArray();
    for (const col of listCollections) {
      const c = col;
      const v2 = c.options.validator;
      const s = formatJsonSting_default(v2);
      const tsCode = [banner2, `export default ${s};`].join("\n\n");
      const file = writeFileAsync_default(`./${config.output}/${col.name}.validator.ts`, tsCode);
      files.push(file);
    }
    await Promise.all(files);
    console.info(`\u2705 ${import_package3.default.name} validators downloaded from Mongo!`);
    return 0;
  } catch (e) {
    console.error("\u274C downloadValidators failed: ", e);
    return 1;
  } finally {
    await client.close();
  }
}
var downloadValidators_default = downloadValidators;

// src/genTypes.ts
var import_package4 = __toESM(require("../package.json"));
var typeMapping = {
  bool: "boolean",
  date: "Date",
  double: "number",
  int: "number",
  objectId: "ObjectId | string",
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
var reduce = ({
  allSdls: allSdls2 = [],
  allTypes: allTypes2 = [],
  collectionName,
  obj
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
    const childType = `${collectionName}${properK}`;
    if (value.enum) {
      const enumType = [
        `export enum ${childType}Enum {`,
        ...value.enum.sort().map((v2) => `  ${v2} = '${v2}',`),
        "}"
      ].join("\n");
      allTypes2.push(enumType);
      const enumSdl = [`   enum ${childType}Enum {`, ...value.enum.map((v2) => `    ${v2}`), "  }"].join("\n");
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
          reduce({
            allSdls: allSdls2,
            allTypes: allTypes2,
            collectionName: childType,
            obj: value.items
          });
        }
        continue;
      }
      if (value.bsonType === "object") {
        typeResult.push(`  ${typeKey}: ${childType};`);
        sdlResult.push(`    ${sdlKey}: ${childType}${isKeyRequired ? "!" : ""}`);
        reduce({
          allSdls: allSdls2,
          allTypes: allTypes2,
          collectionName: childType,
          obj: value
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
      const valid = value.bsonType.includes("null") || value.bsonType.length === 1;
      if (!valid) {
        throw Error("Only one bsonType and null are supported for a bsonType array");
      }
      const res = [];
      value.bsonType.forEach((v2) => {
        const mapped = typeMapping[v2];
        if (v2 === "null") {
          res.push("null");
        } else if (mapped) {
          res.push(mapped);
        }
      });
      typeResult.push(`  ${typeKey}: ${res.join(" | ")};`);
      const singleType = value.bsonType.filter((v2) => v2 !== "null");
      sdlResult.push(`    ${sdlKey}: ${sdlMapping[singleType[0]]}${isKeyRequired ? "!" : ""}`);
    }
  }
  allTypes2.push([`export type ${collectionName} = {`, ...typeResult, "};"].join("\n"));
  allSdls2.push([`  type ${collectionName} {`, ...sdlResult, "  }"].join("\n"));
};
var iterateValidators = async ({ outputPath, validatorPaths }) => {
  const banner = "/* This file is generated by mongo-type-gen.  Do not edit */";
  const allTypes = [banner, "import { ObjectId } from 'mongodb';"];
  const allSdls = [banner, "import { gql } from 'graphql-tag';", "export default gql`"];
  for (const path of validatorPaths) {
    const validatorStr = import_fs3.default.readFileSync(path, "utf8");
    const validator = (0, import_typescript.transpile)(validatorStr);
    const v = eval(validator);
    const cName = path.split("/").pop()?.split(".")[0] || "";
    const properCname = cName.charAt(0).toUpperCase() + cName.slice(1);
    const singularCname = singularize_default(properCname);
    reduce({
      allSdls,
      allTypes,
      collectionName: `${singularCname}Doc`,
      obj: v.$jsonSchema
    });
  }
  const tsString = allTypes.join("\n\n");
  const sdlString = [...allSdls, "`;"].join("\n\n");
  await Promise.all([
    writeFileAsync_default(`./${outputPath}/mongo.types.ts`, tsString),
    writeFileAsync_default(`./${outputPath}/mongo.sdls.ts`, sdlString)
  ]);
  console.info(`\u2705 ${import_package4.default.name} types generated!`);
};
var genTypes = async () => {
  const config = await getConfig_default();
  const validatorPaths2 = await getFullPaths_default("**/*.validator.*s");
  if (!validatorPaths2.length) {
    console.info(`\u26A0\uFE0F ${import_package4.default.name} could not find any validators files, downnloading from Mongo...`);
    await downloadValidators_default();
  }
  if (process.argv.includes("--watch") || process.argv.includes("-w")) {
    const onChange = async () => iterateValidators({
      outputPath: config.output,
      validatorPaths: validatorPaths2
    });
    watchDirs_default({
      dirs: validatorPaths2,
      onChange
    });
  }
  iterateValidators({
    outputPath: config.output,
    validatorPaths: validatorPaths2
  });
};
genTypes().catch((e) => {
  console.error("\u274C genTypes failed: ", e);
  process.exit(1);
});
//# sourceMappingURL=genTypes.js.map
