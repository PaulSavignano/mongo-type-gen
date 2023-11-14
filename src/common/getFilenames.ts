import fg from 'fast-glob';
import path from 'path';

const ignore = ['**/node_modules/**', '**/dist/**', '**/build/**'];

const getFilenames = async (glob: string[] | string) => {
  const paths = await fg(glob, { absolute: true, ignore });
  const mainFileDir = path.dirname(process.argv[1]);
  const filenames = paths.map((p) => path.resolve(mainFileDir, p));
  return filenames;
};

export default getFilenames;
