const fs = require('fs-extra');
const path = require('path');

async function main() {
  const rootFolder = path.resolve(__dirname, '../../../');
  const tutorialFolder = path.join(rootFolder, 'tutorials');
  console.log({ rootFolder });
  const tutorials = await fs.readdir(tutorialFolder);

  const filterFunc = async (src, dest) => {
    // your logic here
    // it will be copied if return true
    const fileMeta = await fs.lstat(path.resolve(src));
    const isDirectory = fileMeta.isDirectory();
    if (isDirectory || src.endsWith('.json')) {
      return true;
    }
    return false;
  };
  const publicTutorialFolder = path.join('./public/tutorials');
  await fs.ensureDir(publicTutorialFolder);
  for (const tutorial of tutorials) {
    const source = path.join(tutorialFolder, tutorial);
    const target = path.join(publicTutorialFolder, tutorial);
    const lockFile = path.join(source, 'builderdao.lock.json');
    const configFile = path.join(source, 'builderdao.config.json');
    const packageFile = path.join(source, 'package.json');
    const files = await Promise.all([
      await fs.pathExists(lockFile),
      await fs.pathExists(configFile),
      await fs.pathExists(packageFile),
    ]);
    if (!files.every(Boolean)) {
      await fs.remove(source);
      continue;
    }
    await fs.copy(lockFile, path.join(target, 'builderdao.lock.json'), {
      filter: filterFunc,
    });
    await fs.copy(configFile, path.join(target, 'builderdao.config.json'), {
      filter: filterFunc,
    });
    await fs.copy(configFile, path.join(target, 'package.json'), {
      filter: filterFunc,
    });
  }
}

main().then(() => console.log('done'));
