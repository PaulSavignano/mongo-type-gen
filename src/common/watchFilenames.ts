import fs from 'fs';

import pkg from '../../package.json';

function watchFilenames({ filenames, onChange }: { filenames: string[]; onChange: () => Promise<void> }) {
  console.info(`✅ ${pkg.name} watching `, filenames);
  let isChanging = false;
  filenames.forEach((filename) => {
    const watcher = fs.watch(filename, { recursive: true });
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

    watcher.on('error', (e) => console.error(`❌ ${pkg.name} watchFilenames error: ${e.message}`));
    watcher.on('close', () => console.info(`🛑 ${pkg.name} watchFilenames closed`));
  });
}

export default watchFilenames;
