const config = {
  external: makeExternalPredicate([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),
  input: "api/index.ts",
  output: {
    file: pkg.main,
    format: "cjs",
    sourcemap: true,
  },
};

export default config;
