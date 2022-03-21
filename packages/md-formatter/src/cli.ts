#!/usr/bin/env node

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk';
import { diffLines } from 'diff'

import { remarkLiquidParser } from './remark-liquid-parser'


const getFile = async (pathForFile: string) => {
  const source = await fs.readFile(pathForFile, 'utf8')
  return source
}

// eslint-disable-next-line @typescript-eslint/no-use-before-define
main()

async function main() {
  const source = await getFile(path.join(process.cwd(), './kitchen/sink.md'));
  const destinationDir = path.join(process.cwd(), 'faucet')
  const file = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkLiquidParser)
    .process(source)

  diffLines(source, String(file))
    .forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts

      if (part.added) {
        console.log(chalk.green(part.value))
      } else  if (part.removed){
          console.log(chalk.red(part.value))
        } else {
          console.log(chalk.grey(part.value))
        }
    });
}

