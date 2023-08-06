#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/downloadValidators.ts
var downloadValidators_exports = {};
__export(downloadValidators_exports, {
  downloadValidators: () => downloadValidators
});
module.exports = __toCommonJS(downloadValidators_exports);
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

// src/common/writeFileAsync.ts
var import_fs = __toESM(require("fs"));
var import_util = require("util");
var writeFileAsync = (0, import_util.promisify)(import_fs.default.writeFile);
var writeFileAsync_default = writeFileAsync;

// src/downloadValidators.ts
var import_package2 = __toESM(require("../package.json"));
var client;
async function downloadValidators() {
  try {
    const config = await getConfig_default();
    const files = [];
    const banner = "/* This file is generated by mongo-type-gen.  Do not edit */";
    client = new import_mongodb.MongoClient(config.uri);
    const db = client.db(config.db);
    const listCollections = await db.listCollections().toArray();
    for (const col of listCollections) {
      const c = col;
      const v = c.options.validator;
      const s = formatJsonSting_default(v);
      const tsCode = [banner, `export default ${s};`].join("\n\n");
      const file = writeFileAsync_default(`./${config.output}/${col.name}.validator.ts`, tsCode);
      files.push(file);
    }
    await Promise.all(files);
    console.info(`\u2705 ${import_package2.default.name} validators downloaded from Mongo!`);
  } finally {
    await client.close();
  }
}
downloadValidators().catch((e) => {
  console.error("\u274C downloadValidators failed: ", e);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadValidators
});
//# sourceMappingURL=downloadValidators.js.map
