import _ from 'lodash'
import path from 'path'
import { Low, JSONFile } from 'lowdb'
export interface TutorialDetailsRow {
  slug: string,
  folderSlug: string,
  protocol: string,
  title: string,
  description: string,
  markdown_url: string,
  markdown_path: string,
  author: string,
  author_nickname: string,
  author_url: string,
  author_image_url: string,
  tags: string[],
  difficulty_level: string
}

export class LowWithLodash<T> extends Low<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data')
}
const target = path.resolve(__dirname, '../src/tutorials.json')
export const tutorialDetailDB = new LowWithLodash(new JSONFile<{ [slug: string]: TutorialDetailsRow }>(target))