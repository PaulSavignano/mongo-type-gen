import fs from 'fs';

const writeFile = async ({ data, dir, file }: { data: string; dir: string; file: string }): Promise<void> => {
  await fs.promises.mkdir(dir, { recursive: true });
  return fs.promises.writeFile(`${dir}/${file}`, data, 'utf8');
};

export default writeFile;
