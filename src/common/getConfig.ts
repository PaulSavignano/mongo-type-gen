import getFullPaths from './getFullPaths';
import pkg from '../../package.json';

const getConfig = async () => {
  const configPaths = await getFullPaths(['**/mtg.config.*s', '**/mongo-type-gen.config.*s']);
  if (configPaths.length > 0) {
    throw Error(
      `❌ ${pkg.name} found multiple config files: \n${configPaths.join('\n')}\nPlease only use one config file.`,
    );
  }
  const configFile = await import(configPaths[0]);
  return configFile.default;
};

export default getConfig;
