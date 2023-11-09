import fg from 'fast-glob';
import path from 'path';

const getFilenames = async (glob: string[] | string) => {
  const paths = await fg(glob, { absolute: true, ignore: ['**/node_modules/**'] });
  const mainFileDir = path.dirname(process.argv[1]);
  const filenames = paths.map((p) => path.resolve(mainFileDir, p));
  return filenames;
};

export default getFilenames;
