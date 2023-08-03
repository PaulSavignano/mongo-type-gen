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

// src/addValidators.ts
var import_fs = __toESM(require("fs"));
var import_mongodb = require("mongodb");
var import_typescript = require("typescript");

// src/common/getFullPaths.ts
var import_fast_glob = __toESM(require("fast-glob"));
var import_path = __toESM(require("path"));
var getFullPaths = async (glob) => {
  const paths = await (0, import_fast_glob.default)(glob, { absolute: true, ignore: ["**/node_modules/**"] });
  console.log("paths are ", paths);
  const mainFileDir = import_path.default.dirname(process.argv[1]);
  const resolvedGlobs = paths.map((p) => import_path.default.resolve(mainFileDir, p));
  return resolvedGlobs;
};
var getFullPaths_default = getFullPaths;

// src/common/getConfig.ts
var import_package = __toESM(require("../package.json"));
var getConfig = async () => {
  const configPaths = await getFullPaths_default(["**/mtg.config.*s", "**/mongo-type-gen.config.*s"]);
  if (configPaths.length > 1) {
    throw Error(
      `\u274C ${import_package.default.name} found multiple config files: 
${configPaths.join("\n")}
Please only use one config file.`
    );
  }
  const configFile = await import(configPaths[0]);
  return configFile.default;
};
var getConfig_default = getConfig;

// src/addValidators.ts
var import_package2 = __toESM(require("../package.json"));
var client;
async function addValidators() {
  try {
    const config = await getConfig_default();
    const uri = "mongodb://localhost:27017";
    client = new import_mongodb.MongoClient(uri);
    const validatorPaths = await getFullPaths_default("**/*.validator.ts");
    const db = client.db(config.db);
    const listCollections = await db.listCollections().toArray();
    const collections = listCollections.map((c) => c.name);
    const runCommandPromises = validatorPaths.map((path) => {
      const validatorStr = import_fs.default.readFileSync(path, "utf8");
      const validator = (0, import_typescript.transpile)(validatorStr);
      const v = eval(validator);
      const cName = path.split("/").pop()?.split(".")[0] || "";
      const isExisting = collections.includes(cName);
      if (isExisting) {
        const command = db.command({
          collMod: cName,
          validator: v
        });
        return command;
      }
      const createCollection = db.createCollection(cName, {
        validator: v
      });
      return createCollection;
    });
    await Promise.all(runCommandPromises);
    console.info(`\u2705 ${import_package2.default.name} validators updated in Mongo!`);
  } finally {
    await client.close();
  }
}
addValidators().catch(console.dir);
//# sourceMappingURL=addValidators.js.map
