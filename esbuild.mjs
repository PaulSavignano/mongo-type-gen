import { build } from "esbuild";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import pkg from "./package.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

const defaultOptions = {
  bundle: true,
  logLevel: "debug",
  minify: true,
  platform: "node",
  sourcemap: true,
};

const runBuild = async () => {
  try {
    await Promise.all([
      build({
        ...defaultOptions,
        entryPoints: ["src/genTypes.ts"],
        external,
        outfile: `bin/${pkg.main}`,
      }),
    ]);

    console.info("✅ esbuild completed!");
  } catch (e) {
    console.info("❌ esbuild failed", e);
  }
};

runBuild();
