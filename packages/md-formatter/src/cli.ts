#!/usr/bin/env node

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk';
import { diffLines } from 'diff'

import { remarkLiquidParser } from './remark-liquid-parser'
import { TemplateService } from '@builderdao/cli'


const getFile = async (pathForFile: string) => {
  const source = await fs.readFile(pathForFile, 'utf8')
  return source
}

const example = path.join(process.cwd(), './kitchen/sink.md')
const destinationDir = path.join(process.cwd(), 'faucet')

const data = {
  name: 'tutorial-sink',
  author: 'Giovanni Fu Lin',
  title: 'Tutorial Sink',
  description: 'Est culpa enim ex laboris occaecat nisi. Nisi et nostrud amet minim reprehenderit irure tempor veniam.Quis id ullamco culpa non in officia id anim ex non aliquip.',
  protocol: ['Solana'],
  date: '2020-01-01',
  tags: [
    'React',
    'Javascript'
  ],
  diffuculty: 'Intermediate'
}
// eslint-disable-next-line @typescript-eslint/no-use-before-define
main(example, data, destinationDir)



async function main(pathForFile: string, data: any, destinationDir: string) {
  const source = await getFile(pathForFile);
  const file = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkLiquidParser)
    .process(source)
    .then(async file => {
      // showDiff(source, String(file));
      console.log(destinationDir)
      const targetFolder = path.join(destinationDir, data.name)
      fs.ensureDir(targetFolder)
      const template = new TemplateService(targetFolder)
      await template.copy('empty')
      await template.setName(data.name)
      await template.setTitle(data.title)
      await template.setDescription(data.description)
      await template.setTags(data.tags)
      const frontMatter = `---
title: ${data.title}
description: ${data.description}
keywords: [${data.tags.join(', ')}]
date: ${data.date}
---`
      await template.addContent('index.md',[frontMatter, String(file)].join('\n'))
    })
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
        console.log(chalk.grey(part.value))
      }
    });
}

