import getFullPaths from './getFullPaths';
import pkg from '../../package.json';

const getConfig = async () => {
  const configPaths = await getFullPaths(['**/mtg.config.*s', '**/mongo-type-gen.config.*s']);
  const configFile = await import(configPaths[0]);
  console.log('configFile', configFile);
  console.log('type of configFile', typeof configFile);
  if (configPaths.length > 1) {
    console.log(`🟡 ${pkg.name} found multiple config files.  Using ${configPaths[0]}.`);
  }

  return configFile.default;
};

export default getConfig;
