import { visit } from "unist-util-visit";
import isAbsoluteUrl from 'is-absolute-url';
import path from 'path';
import fs from 'fs-extra'
import axios from "axios";
import async from 'async';


const download = async (url: string, destinationPath: string) => {
  console.log('downlaod', url);
  const saveFile = await axios.get(url, {
    responseType: 'stream',
  });
  const download = fs.createWriteStream(destinationPath);
  await new Promise((resolve, reject) => {
    saveFile.data.pipe(download);
    download.on("close", resolve);
    download.on("error", console.error);
  });
}


// eslint-disable-next-line no-promise-executor-return
export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const remarkCopyLinkedFiles = (options: { destination: string, sourceFolder: string }) => async (tree, { cwd }: { cwd: string }) => {

  await fs.ensureDir(path.join(options.destination, 'assets'));
  const downloadQueue = async.queue(async ({ url, path }) => {
    return await download(url, path);
  }, 2)


  visit(tree, "image", node => {
    let isRelative = !isAbsoluteUrl(node.url)
    if (isRelative) {
      const fullPath = path.resolve(options.sourceFolder, node.url)
      const filename = path.basename(fullPath)
      const targetPath = path.join(options.destination, 'assets', filename)
      fs.copySync(fullPath, targetPath)
      node.url = `./assets/${filename}`
    } else {
      let filename = node.url.substring(node.url.lastIndexOf('/') + 1).split('?')[0].toLowerCase()
      if (!path.extname(filename)) {
        filename = `${filename}.png`
      }
      const targetPath = path.join(options.destination, 'assets', filename)
      console.log(node)
      downloadQueue.push({
        url: node.url,
        path: targetPath
      });

      node.url = `./assets/${filename}`
    }
  })
  if (downloadQueue.length() > 0) {
    await downloadQueue.drain();
  }
  return tree;
};