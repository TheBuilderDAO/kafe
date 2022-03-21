#!/usr/bin/env node

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk';
import { diffLines } from 'diff'

import { remarkLiquidParser } from './remark-liquid-parser'
import { remarkCopyLinkedFiles } from './remark-copy-linked'
import { TemplateService } from '@builderdao/cli'
import async from 'async'
import _ from 'lodash'
import { tutorialDetailDB, TutorialDetailsRow } from './data'


const getFile = async (pathForFile: string) => {
  const source = await fs.readFile(pathForFile, 'utf8')
  return source
}

const example = path.join(process.cwd(), './kitchen/tutorial/sink.md')
const destinationDir = path.resolve('/Users/necmttn/Projects/crypto/kafe/kafe/tutorials')


// const destinationDir = path.join(process.cwd(), 'faucet')

// eslint-disable-next-line @typescript-eslint/no-use-before-define
// main(example, data, destinationDir)

const tutorials = path.join('/Users/necmttn/Projects/crypto/kafe/learn-tutorials',)

type FolderMeta = { slug: string, files: string[] }
const processQueue = async.queue(async (guide: FolderMeta) => {
  console.log("Processing => ", guide.slug)

  await tutorialDetailDB.read()
  // // const c = Object.values(tutorialDetailDB.data).filter(x => x.markdown_path === guide.slug)
  // // console.log(c)
  // // const fileRelativePath = path.relative(tutorials, guide.)
  const data = await tutorialDetailDB.chain.get(guide.slug).value()

  await main(guide.files, data, destinationDir)
  // await main(file, data, destinationDir)
}, 2)

const files: { [path: string]: FolderMeta } = {};

const getFiles = async (dir: string, level = 0): Promise<any> => {
  return fs.readdir(dir).then(async (fileOrDirs: string[]) => {
    const filtered = fileOrDirs.filter(file => !file.startsWith('.')).filter(file => !['assets'].includes(file))
    for (const fileOrDir of filtered) {
      const f = path.join(dir, fileOrDir)
      if (f.endsWith('.md')) {
        if (level === 1) {
          // console.log('single md >>', f, level)
          const slug = path.relative(tutorials, f).replace(path.extname(f), '').replace('/', '-').toLowerCase()
          _.set(files, slug, {
            slug,
            files: [f]
          })
        } else if (level === 2) {
          const multiPageTutorialRoot = path.basename(path.dirname(f)).replace('/', '-').toLowerCase()
          // console.log('multi md >>', level, multiPageTutorialRoot)

          if (!_.has(files, multiPageTutorialRoot)) {
            _.set(files, multiPageTutorialRoot, {
              slug: multiPageTutorialRoot,
              files: [f]
            })
          } else {
            _.get(files, multiPageTutorialRoot).files.push(f)
          }
        }
        continue;
        // processQueue.push(file)
      }
      const fileMeta = fs.lstatSync(f)
      if (fileMeta.isDirectory()) {
        await getFiles(path.join(dir, fileOrDir), level + 1);
        continue;
      }
    }
  })
}

getFiles(tutorials).then(async () => {
  // console.log(JSON.stringify(files, null, 2))
  await tutorialDetailDB.read()
  // console.log(tutorialDetailDB.data);
  let matching = 0
  let total = 0
  Object.entries(files).forEach(async ([key, value]) => {
    console.log(key)
    total++
    if (tutorialDetailDB.chain.has(key).value()) {
      matching++
      processQueue.push(value);
      return
    }
  })
  console.log({ matching, total })
})



async function main(pathForFiles: string[], data: TutorialDetailsRow, destinationDir: string) {
  const targetFolder = path.join(destinationDir, data.folderSlug)
  await fs.ensureDir(targetFolder)
  const template = new TemplateService(targetFolder)
  await template.copy('empty')
  await template.setName(data.slug.toLowerCase())
  await template.setTitle(data.title)
  await template.setDescription(data.description)
  await template.setTags(data.tags)

  for (const pathForFile of pathForFiles) {
    const source = await getFile(pathForFile);
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkCopyLinkedFiles, {
        destination: path.join(targetFolder, 'content'),
        sourceFolder: path.dirname(pathForFile)
      })
      .use(remarkLiquidParser as any)
      .process(source)
      .then(async file => {
        showDiff(source, String(file));
        // console.log(destinationDir)
        const frontMatter = `---
title: ${data.title}
description: ${data.description}
keywords: [${data.tags.join(', ')}]
date: ${data.date}
---`
        await template.addContent('index.mdx', [frontMatter, String(file)].join('\n'))
      })
  }
}

const showDiff = (source: string, target: string) => {
  diffLines(source, target)
    .forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts

      if (part.added) {
        console.log(chalk.green(part.value))
      } else if (part.removed) {
        console.log(chalk.red(part.value))
      } else {
        // console.log(chalk.grey(part.value))
      }
    });
}
