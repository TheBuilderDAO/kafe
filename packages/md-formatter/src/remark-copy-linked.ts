import { visit } from "unist-util-visit";
import isAbsoluteUrl from 'is-absolute-url';
import path from 'path';
import fs from 'fs-extra'
import axios from "axios";
import async from 'async';

const isRelativeUrl = (url: string) => !isAbsoluteUrl(url);

const handleUrl = async (url: string, { cwd, path: cPath, pathname }: { cwd: string, path: string, pathname: string }) => {
  const platformNormalizedUrl = url.replace(/[\\/]/g, path.sep);
  console.log(platformNormalizedUrl)
  // if (!isRelativeUrl(platformNormalizedUrl)) {
  //   return;
  // }

  const ext = path.extname(platformNormalizedUrl);
  console.log(ext)
  // if (!ext || ignoreFileExtensions.includes(ext)) {
  //   return;
  // }

  const fullpath = path.resolve(
    cwd,
    path ? path.dirname(cPath) : '',
    platformNormalizedUrl,
  );


  const name = path.basename(fullpath, ext);
  const filename = `${name}-${ext}`;

  return {
    fullpath,
    filename,
  };
};

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
  const assets = [];
  const downloadQueue = async.queue(async ({ url, path }) => {
    console.log('downloading', url, path)
    await download(url, path);
    console.log('downloaded', url, path)
  }, 2)
  await fs.ensureDir(path.join(options.destination, 'assets'));
  let i = 1;
  visit(tree, "image", node => {
    // console.log(node);
    let isRelative = !isAbsoluteUrl(node.url)
    console.log("isRelative", isRelative);

    if (isRelative) {
      const fullPath = path.resolve(options.sourceFolder, node.url)
      const filename = path.basename(fullPath)
      const targetPath = path.join(options.destination, 'assets', filename)
      console.log({ fullPath, targetPath })
      fs.copySync(fullPath, targetPath)
      node.url = `./assets/${filename}`
    } else {
      // return
      // const { fullpath, filename } = handleUrl(node.url, {cwd, ...options})
      // console.log("REMOTE", fullpath, filename);

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
      // fs.copySync(fullpath, path.join(options.destination, filename))
      // assets.push(filename)
    }
    i++;
  })
  await downloadQueue.drain();
  return tree;
};