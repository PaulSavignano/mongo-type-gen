const importFileDefaultNoCache = async <T>(filename: string) => {
  const moduleKey = require.resolve(filename);
  delete require.cache[moduleKey];
  const file = await import(filename);

  if (!file) {
    throw Error(`${filename} was not found`);
  }
  if (!file.default) {
    throw Error(`${filename} must export a default object`);
  }
  const fileDefault = file.default as T;
  return fileDefault;
};

export default importFileDefaultNoCache;
