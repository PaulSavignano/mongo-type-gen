import fs from 'fs';

import pkg from '../../package.json';

function watchDirs({ dirs, onChange }: { dirs: string[]; onChange: () => Promise<void> }) {
  console.info(`✅ ${pkg.name} watching: ${dirs.join(', ')}`);

  let isChanging = false;
  dirs.forEach((dir) => {
    const watcher = fs.watch(dir, { recursive: true });
    watcher.on('change', (_eventType, filename) => {
      if (!isChanging) {
        isChanging = true;
        onChange();
        if (filename) {
          setTimeout(() => {
            isChanging = false;
          }, 2000);
        }
      }
    });

    watcher.on('error', (error) => {
      console.error(`watchDirs error: ${error}`);
    });

    // Event listener for 'close' event (optional)
    watcher.on('close', () => {
      console.log('watchDirs closed');
    });
  });
}

export default watchDirs;
