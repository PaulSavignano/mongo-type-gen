import fg from 'fast-glob';
import path from 'path';

const getFullPaths = async (glob: string[] | string) => {
  const paths = await fg(glob, { absolute: true, ignore: ['**/node_modules/**'] });
  const mainFileDir = path.dirname(process.argv[1]);
  const resolvedGlobs = paths.map((p) => path.resolve(mainFileDir, p));
  return resolvedGlobs;
};

export default getFullPaths;
