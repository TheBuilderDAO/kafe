import { visit } from "unist-util-visit";
import isAbsoluteUrl from 'is-absolute-url';
import path from 'path';
import fs from 'fs-extra'
import axios from "axios";
import async from 'async';
import _ from "lodash";


const download = async (url: string, destinationPath: string) => {
  console.log('⬇️', url);

  const tmp = path.resolve('/tmp', path.basename(destinationPath));
  console.log(tmp)
  if (fs.existsSync(tmp)) {
    await fs.copyFile(tmp, destinationPath);
    return
  }
  const saveFile = await axios.get(url, {
    responseType: 'stream',
  });
  const download = fs.createWriteStream(tmp);
  await new Promise<void>((resolve, reject) => {
    saveFile.data.pipe(download);
    download.on("close", async ()=> {
      await fs.copyFile(tmp, destinationPath);
      resolve()
    });
    download.on("error", console.error);
  });
}


// eslint-disable-next-line no-promise-executor-return
export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const remarkCopyLinkedFiles = (options: { destination: string, sourceUrl: string, fileNamePrefix: string }) => async (tree, { cwd }: { cwd: string }) => {

  await fs.ensureDir(path.join(options.destination, 'assets'));
  const downloadQueue = async.queue(async ({ url, path }) => {
    return await download(url, path);
  }, 4)
  let fileCount = 0


  visit(tree, "image", node => {
    let isRelative = !isAbsoluteUrl(node.url)
    if (isRelative && node.url.includes('https://')) { // TODO: this is a hack
      isRelative = false
      node.url = node.url.replace('../', '')
    }
    fileCount++;

    let filename = [
      options.fileNamePrefix,
      // node.url.substring(node.url.lastIndexOf('/') + 1).split('?')[0].toLowerCase()]
      node.alt ? _.words(node.alt).join('-').toLowerCase() : `image`,
      `-${fileCount}`
    ].join('');

    if (!path.extname(filename)) {
      filename = `${filename}.png`
    }
    const targetPath = path.join(options.destination, 'assets', filename)
    if (isRelative) {
      // TODO: getfile from github
      console.log(node)
      if (node.url.includes('.gitbook')) {
        downloadQueue.push({
          url: "https://via.placeholder.com/300x200.png?text=Image+not+found",
          path: targetPath
        })
        node.alt = `TODO:NOT_FOUND ${node.alt}`
      } else {
        console.log("RELATIVE", node.url, options.sourceUrl)
        throw Error("RELATIVE",)
      }

      // const filename = path.basename(fullPath)

      // const targetPath = path.join(options.destination, 'assets', filename)
      // downloadQueue.push({

      //   path: targetPath
      // })
      // fs.copySync(fullPath, targetPath)
      // node.url = `./assets/${filename}`
    } else {
      // TODO: utilize node.alt for meanfull filename
      downloadQueue.push({
        url: node.url,
        path: targetPath
      }, (err, result) => {
        if (err) {
          downloadQueue.push({
            url: "https://via.placeholder.com/300x200.png?text=Image+not+found",
            path: targetPath
          })
          node.alt = `TODO:NOT_FOUND ${node.alt}`
        }
      });

      node.url = `./assets/${filename}`
    }
  })
  if (downloadQueue.length() > 0) {
    await downloadQueue.drain();
  }
  return tree;
};