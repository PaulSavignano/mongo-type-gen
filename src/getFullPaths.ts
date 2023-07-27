import fg from 'fast-glob';
import path from 'path';

const getFullPaths = async (glob: string) => {
  const paths = await fg(glob, { absolute: true });
  console.log('paths', paths);
  const mainFileDir = path.dirname(process.argv[1]);
  console.log('mainFileDir', mainFileDir);
  const resolvedGlobs = paths.map((p) => path.resolve(mainFileDir, p));
  return resolvedGlobs;
};

export default getFullPaths;
