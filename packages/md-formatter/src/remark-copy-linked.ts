import { visit } from "unist-util-visit";
import isAbsoluteUrl from 'is-absolute-url';
import path from 'path';
import fs from 'fs-extra'
import axios from "axios";
import async from 'async';

const download = async (url: string, destinationPath: string) => {
  const saveFile = await axios.get(url, {
    responseType: 'stream',
  });
  const file = url.split('/')[3];
  const download = fs.createWriteStream(destinationPath);
  await new Promise((resolve, reject) => {
    saveFile.data.pipe(download);
    download.on("close", resolve);
    download.on("error", console.error);
  });
}

export const remarkCopyLinkedFiles = (options: { destination: string, sourceFolder: string }) => async (tree, { cwd }: { cwd: string }) => {
  const downloadQueue = async.queue(async ({ url, path }) => {
    console.log('downloading', path)
    await download(url, path);
  }, 5)
  await fs.ensureDir(path.join(options.destination, 'assets'));
  visit(tree, "image", node => {
    let isRelative = !isAbsoluteUrl(node.url)
    if (isRelative) {
      const fullPath = path.resolve(options.sourceFolder, node.url)
      const filename = path.basename(fullPath)
      const targetPath = path.join(options.destination, 'assets', filename)
      console.log({ fullPath, targetPath })
      fs.copySync(fullPath, targetPath)
      node.url = `./assets/${filename}`
    } else {
      let filename = node.url.substring(node.url.lastIndexOf('/') + 1)
      if (!path.extname(filename)) {
        filename = `${filename}.png` 
      }
      const targetPath = path.join(options.destination, 'assets', filename)
      downloadQueue.push({
        url: node.url,
        path: targetPath 
      });
      node.url = `./assets/${filename}`
    }
  })
  await downloadQueue.drain();
  return tree;
};