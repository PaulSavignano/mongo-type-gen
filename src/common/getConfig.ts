import getFilenames from './getFilenames';
import pkg from '../../package.json';

export interface Config {
  db: string;
  input: string;
  output: {
    collections: string;
    sdls?: string;
    types: string;
  };
  uri: string;
}

const getConfig = async (): Promise<Config> => {
  const configFiles = await getFilenames(['**/mtg.config.*s', '**/mongo-type-gen.config.*s']);
  if (configFiles.length > 1) {
    throw Error(`⚠️ ${pkg.name} found multiple config files, please remove one.`);
  }
  if (!configFiles.length) {
    throw Error(`⚠️ ${pkg.name} could not find a config file, please add one.`);
  }
  const configFile = await import(configFiles[0]);
  if (!configFile.default) {
    throw Error(`⚠️ ${pkg.name} could not find a default export in the config file, please add one.`);
  }
  const { db, input, output, uri } = configFile.default as Config;
  Object.entries({
    db,
    input,
    output,
    uri,
  }).forEach(([key, value]) => {
    if (!value) throw Error(`${key} required but received ${value}`);
  });
  const { collections, types } = output;
  Object.entries({
    collections,
    types,
  }).forEach(([key, value]) => {
    if (!value) throw Error(`${key} required but received ${value}`);
  });
  return { db, input, output, uri };
};

export default getConfig;
