#!/usr/bin/env node

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk';
import { diffLines } from 'diff'

import { remarkLiquidParser } from './remark-liquid-parser'
import { remarkCopyLinkedFiles, sleep } from './remark-copy-linked'
import { BuilderDaoConfig, TemplateService } from '@builderdao/cli'
import async from 'async'
import { getFileFromGithub } from './github';
import _ from 'lodash'
import { tutorialDumpExtendedDB, solanaDB, TutorialExtended, SolanaDetailsRow } from './data'


const getFile = async (pathForFile: string) => {
  const source = await fs.readFile(pathForFile, 'utf8')
  return source
}

// const example = path.join(process.cwd(), './kitchen/tutorial/sink.md')
const destinationDir = path.resolve('/Users/necmttn/Projects/crypto/kafe/kafe/tutorials')


// const destinationDir = path.join(process.cwd(), 'faucet')

// eslint-disable-next-line @typescript-eslint/no-use-before-define
// main(example, data, destinationDir)

const tutorials = path.join('/Users/necmttn/Projects/crypto/kafe/learn-tutorials',)

type FolderMeta = { slug: string, files: string[] }
let processCount = 0
const processQueue = async.queue(async (task: { tutorial: TutorialExtended, proposal: SolanaDetailsRow }) => {
  // console.log(JSON.stringify({task}, null ,2))
  console.log("Processing => ", task.tutorial.slug)

  // await tutorialDumpExtendedDB.read()
  // // const c = Object.values(tutorialDetailDB.data).filter(x => x.markdown_path === guide.slug)
  // // console.log(c)
  // // const fileRelativePath = path.relative(tutorials, guide.)
  // const data = await tutorialDumpExtendedDB.chain.get(guide.slug).value()

  await main(task, destinationDir)
  processCount++
  console.log(`totalProcessed: [${processCount}] inQueue: [${processQueue.length()}]`)
  await sleep(2000)
  // await main(file, data, destinationDir)
}, 6)


const files: { [path: string]: FolderMeta } = {};

const getFiles = async (dir: string, level = 0): Promise<any> => {
  return fs.readdir(dir).then(async (fileOrDirs: string[]) => {
    const filtered = fileOrDirs.filter(file => !file.startsWith('.')).filter(file => !['assets'].includes(file))
    for (const fileOrDir of filtered) {
      const f = path.join(dir, fileOrDir)
      if (f.endsWith('.md')) {
        if (level === 1) {
          // console.log('single md >>', f, level)
          let slug = path.relative(tutorials, f).replace(path.extname(f), '').replace('/', '-').toLowerCase()
          const a = slug.split('-')
          if (a[0] === a[1]) {
            slug = a.slice(1).join('-');
          }
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
  await tutorialDumpExtendedDB.read()
  // console.log(tutorialDetailDB.data);
  let matching = 0
  let total = 0
  // Object.entries(files).forEach(async ([key, value]) => {
  //   // console.log(key, value)
  //   total++
  //   if (tutorialDumpExtendedDB.chain.has(key).value()) {
  //     matching++
  //     // processQueue.push(value);
  //   } else { 
  //     // console.log(key);
  //   }
  // })
  console.log({ matching, total })
  await processQueue.drain();
  // assign an error callback
  processQueue.error(function (err, task) {
    console.error('task experienced an error');
    console.log(err, task)
  });
})

const process = async () => {
  await tutorialDumpExtendedDB.read();
  await solanaDB.read();

  let matching = 0
  let total = 0
  tutorialDumpExtendedDB.chain.entries().forEach(async ([key, value]) => {
    const proposal = solanaDB.chain.find({ slug: value.slug }).value();
    total++
    if (proposal) {
      matching++
      if (value.slug === 'avalanche-create-an-avalanche-crowdfunding-app') {
        await processQueue.pushAsync({ tutorial: value, proposal });
      }
      // console.log(proposal)
    } else {
      console.log("NOPE >> ", value.slug)
    }
  }).value()

  console.log({ matching, total })
}

process().then(() => {
  if (processQueue.length() > 0) {
    processQueue.drain();
  }
});





async function main(task: { tutorial: TutorialExtended, proposal: SolanaDetailsRow }, destinationDir: string) {
  try {
    const targetFolder = path.join(destinationDir, task.tutorial.slug)
    await fs.ensureDir(targetFolder)
    const template = new TemplateService(targetFolder)
    await template.copy('empty')
    await template.setName(task.tutorial.slug.toLowerCase())
    await template.setTitle(task.tutorial.title)
    await template.setDescription(task.tutorial.description)
    await template.setTags(task.tutorial.tags)
    await template.setAuthor({
      name: task.tutorial.author_name,
      url: task.tutorial.author_url,
      nickname: task.tutorial.author_github_account,
      avatarUrl: task.tutorial.author_image_url
    })
    await template.updateLock('proposalId', task.proposal.id)
    const reviewer = {
      pda: "6nzUwczpPhNJGGaEVEqPXQVff7xFqkBGn3XkmbbzNSug",
      pubkey: 'daoGuHGpHQxWBTX2SR3viSHrAaD2CJ1E44mmNEHmLfi',
      githubName: 'LearnTeam'
    }
    await template.updateLock('creator', task.proposal.creator)
    await template.updateLock('reviewers.reviewer1', reviewer)
    await template.updateLock('reviewers.reviewer2', reviewer)

    for (const page of task.tutorial.pages) {
      const source = await getFileFromGithub(page.markdown_url)
      // const source = await getFile(pathForFile);
      const file = await unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkCopyLinkedFiles, {
          destination: path.join(targetFolder, 'content'),
          sourceUrl: page.markdown_url,
          fileNamePrefix: `${task.tutorial.slug}${task.tutorial.is_multi_page ? `-${page.slug}` : ''}-`
        })
        .use(remarkLiquidParser as any)
        .process(source)
        .then(async file => {
          // showDiff(source, String(file));
          // console.log(destinationDir)
          const frontMatter = `---
title: ${page.title}
description: ${page.description}
keywords: [${page.keywords.join(', ')}]
date: '${task.tutorial.published_at}'
${page.next_slug ? `next:
  title: '${_.find(task.tutorial.pages, { slug: page.next_slug })?.title || 'Next'}'
  slug: '/${page.next_slug}'
`: ''}
${page.previous_slug ? `prev:
  title: '${_.find(task.tutorial.pages, { slug: page.previous_slug })?.title || 'Previous'}'
  slug: '/${page.previous_slug}'
`: ''}
---`
          await template.addContent(page.page_number === 1 ? 'index.mdx' : page.slug, [frontMatter, String(file)].join('\n'))
        })
    }
    const config = new BuilderDaoConfig(targetFolder)
    await config.updateHashDigestOfFolder()
  } catch (err) {
    console.log('ERROR'.repeat(20), err)
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
