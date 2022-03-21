#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import async from 'async'
import { tutorialDetailDB, TutorialDetailsRow } from './data';

interface TutorialsCsvRow {
  slug: string,
  protocol: string,
  title: string,
  description: string,
  markdown_url: string,
  author: string,
  author_url: string,
  tags: string,
  difficulty_level: string
}

const target = path.resolve(__dirname, '../src/tutorials.json')


const writeQueue = async.queue(async (data: TutorialDetailsRow) => {
  await tutorialDetailDB.read()
  tutorialDetailDB.chain
    .set(data.folderSlug.toLowerCase(), data)
    .value()
  await tutorialDetailDB.write()
}, 2)

const generateMetadata = async () => {
  console.log('#'.repeat(80))
  tutorialDetailDB.data = {}
  await tutorialDetailDB.write()
  let count = 0
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../src/tutorials-dump.csv'))
    .pipe(csv.parse({ headers: true }))
    .pipe(
      csv.format<TutorialsCsvRow, TutorialDetailsRow>({ headers: true }),
    )
    .transform(async (row, next): Promise<void> => {
      count = count + 1;
      console.log(count);
      if (!row.author_url.startsWith('https://github.com')) {
        row.author_url = `https://github.com/TheBuilderDAO`
        row.author = 'TheBuilderDAO'
      }
      const markdown_path = row.markdown_url.split('/master/')[1]
      const folder = markdown_path.replace('.md', '').replace('/', '-')
      const extended = {
        ...row,
        folderSlug: folder,
        tags: row.tags.split(';').map(tag => tag.trim()).filter(tag => tag.length > 0),
        markdown_path,
        author_nickname: row.author_url.replace(/^https:\/\/github.com\//, ''),
        author_image_url: `${row.author_url}.png`,
      }
      writeQueue.push(extended)
      return next(null, extended)
    })
    .pipe(process.stdout)
    .on('end', async () => {
      await writeQueue.drain();
      resolve()
      // process.exit()
    })
  })
}

generateMetadata().then(() => {
  console.log('done')
})




