import fs from 'fs';

import pkg from '../../package.json';

function watchDirs({ dirs, onChange }: { dirs: string[]; onChange: () => Promise<void> }) {
  console.info(`✅ ${pkg.name} watching ${dirs.join(', ')}`);
  let isChanging = false;
  dirs.forEach((dir) => {
    const watcher = fs.watch(dir, { recursive: true });
    watcher.on('change', async (_eventType, filename) => {
      if (!isChanging) {
        isChanging = true;
        await onChange();
        if (filename) {
          setTimeout(() => {
            isChanging = false;
          }, 2000);
        }
      }
    });

    watcher.on('error', (e) => console.error(`watchDirs error: ${e.message}`));
    watcher.on('close', () => console.log('watchDirs closed'));
  });
}

export default watchDirs;
