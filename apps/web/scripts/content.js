const fs = require('fs-extra');
const { resolve } = require('path');
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

    // return new Promise((res, rej) => {
    //     if (isDirectory || src.endsWith('.json')) {
    //         resolve(true)
    //     }
    //     else resolve(false)
    // })
    // if (src.includes('.json')) {
    //     return true
    // }
    // return false
  };
  const publicTutorialFolder = path.join('./public/tutorials');
  await fs.ensureDir(publicTutorialFolder);
  for (const tutorial of tutorials) {
    const source = path.join(tutorialFolder, tutorial);
    const target = path.join(publicTutorialFolder, tutorial);
    await fs.copy(
      path.join(source, 'builderdao.lock.json'),
      path.join(target, 'builderdao.lock.json'),
      { filter: filterFunc },
    );
    await fs.copy(
      path.join(source, 'builderdao.config.json'),
      path.join(target, 'builderdao.config.json'),
      { filter: filterFunc },
    );
    await fs.copy(
      path.join(source, 'package.json'),
      path.join(target, 'package.json'),
      { filter: filterFunc },
    );
  }
}

main().then(() => console.log('done'));
