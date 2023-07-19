import { watch } from "chokidar";
import fs from "fs";
import { glob } from "glob";
import path from "path";

const typeMapping: Record<string, string> = {
  string: "string",
  bool: "boolean",
  date: "Date",
  double: "number",
  int: "number",
  objectId: "ObjectId",
};

const sdlMapping: Record<string, string> = {
  string: "String",
  bool: "Boolean",
  date: "Date",
  double: "Float",
  int: "Int",
  objectId: "ObjectId",
};

// tab   &#9

const reducer = ({
  obj,
  allTypes = [],
  allSdls = [],
  title,
}: {
  obj: any;
  allTypes: string[];
  allSdls: string[];
  title: string;
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
    const childType = `${title}${properK}`;

    if (value.enum) {
      const enumType = [
        `export enum ${childType}Enum {`,
        ...value.enum.map((v: string) => `  ${v} = '${v}',`),
        `}`,
      ].join("\n");
      allTypes.push(enumType);

      const enumSdl = [
        `enum ${childType}Enum {`,
        ...value.enum.map((v: string) => `  ${v}`),
        `}`,
      ].join("\n");
      allSdls.push(enumSdl);
      continue;
    }

    if (typeof value.bsonType === "string") {
      if (value.bsonType === "array") {
        typeResult.push(`  ${typeKey}: ${childType}[];`);
        sdlResult.push(
          `  ${sdlKey}: [${childType}${isKeyRequired ? "!" : ""}]`
        );
        reducer({
          obj: value.items,
          allTypes,
          allSdls,
          title: childType,
        });
        continue;
      }

      if (value.bsonType === "object") {
        typeResult.push(`  ${typeKey}: ${childType};`);
        sdlResult.push(`  ${sdlKey}: ${childType}${isKeyRequired ? "!" : ""}`);
        reducer({
          obj: value,
          allTypes,
          allSdls,
          title: childType,
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
          sdlResult.push(
            `  ${sdlKey}: ${mappedSdlValue}${isKeyRequired ? "!" : ""}`
          );
        }
        continue;
      }
    }

    if (Array.isArray(value.bsonType)) {
      const valid = value.bsonType.includes("null");
      if (!valid) {
        throw Error(
          `Only one bsonType and null are supported for a bsonType array`
        );
      }
      // handle Typescript
      const res: string[] = [];
      value.bsonType.forEach((v: string) => {
        const mapped = typeMapping[v];
        if (v === "null") {
          res.push("null");
        } else if (mapped) {
          res.push(mapped);
        }
      });
      typeResult.push(`  ${typeKey}: ${res.join(" | ")};`);

      // handle SDL
      const singleType = value.bsonType.filter((v: string) => v !== "null");
      sdlResult.push(
        `  ${sdlKey}: ${sdlMapping[singleType[0]]}${isKeyRequired ? "!" : ""}`
      );
    }
  }

  allTypes.push([`export type ${title} = {`, ...typeResult, "};"].join("\n"));
  allSdls.push([`type ${title} {`, ...sdlResult, "}"].join("\n"));
};

const abosolutePath = path.resolve(__dirname, "..", "**/mongoSchema.ts");
const filePattern = `**/mongoSchema.ts`;

const files = glob.sync(abosolutePath);

console.log("files", files);
const typeGen = async () => {
  const banner = "/* This file was generated by mongo-type-gen */";
  const allTypes: string[] = [banner, `import { ObjectId } from 'mongodb';`];
  const allSdls: string[] = [
    banner,
    `import { gql } from 'graphql-tag';`,
    "export default gql`",
  ];

  for (const file of files) {
    const imported = await import(file);
    const schema = imported.default;
    const jsonSchema = schema.$jsonSchema;
    reducer({
      obj: jsonSchema,
      title: jsonSchema.title,
      allTypes,
      allSdls,
    });
  }

  const tsString = allTypes.join("\n\n");
  const sdlString = [...allSdls, "`"].join("\n\n");
  fs.writeFileSync("./mongoDocTypes.ts", tsString);
  fs.writeFileSync("./mongoDocSdls.ts", sdlString);
  console.info("✅ Mongo Schema types generated!");
};

typeGen();

// let isInitial = true;
// const run = async () => {
//   console.log("WATCHED files ", filePattern, files);
//   if (isInitial) {
//     isInitial = false;
//     await generateDocTypesFromSchemas();
//   }

//   if (process.argv.includes("--watch")) {
//     const watcher = watch(filePattern);

//     watcher.on("change", async (path, stats) => {
//       console.log(
//         `generateDocTypesFromSchemas change ${JSON.stringify(
//           { path, stats },
//           null,
//           2
//         )}`
//       );
//       await generateDocTypesFromSchemas();
//     });
//     process.once("SIGINT", async () => {
//       console.log("generateDocTypesFromSchemas SIGINT");
//       await watcher.close();
//     });
//     process.once("SIGTERM", async () => {
//       console.log("generateDocTypesFromSchemas SIGTERM");
//       await watcher.close();
//     });
//   }
// };

// run();
