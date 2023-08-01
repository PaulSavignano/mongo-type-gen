import fs from 'fs';

import pkg from '../../package.json';

function watchDirs({ dirs, onChange }: { dirs: string[]; onChange: () => Promise<void> }) {
  console.info(`✅ ${pkg.name} watching: ${dirs.join(', ')}`);

  let isChanging = false;
  dirs.forEach((dir) => {
    const watcher = fs.watch(dir, { recursive: true });
    watcher.on('change', (eventType, filename) => {
      if (!isChanging) {
        isChanging = true;
        onChange();
        if (filename) {
          setTimeout(() => {
            isChanging = false;
          }, 500);
        }
      }
    });

    watcher.on('error', (error) => {
      console.error(`Watcher error: ${error}`);
    });

    // Event listener for 'close' event (optional)
    watcher.on('close', () => {
      console.log('Watcher closed');
    });
  });
}

export default watchDirs;
