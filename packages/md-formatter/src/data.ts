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

export interface SolanaDetailsRow {
  slug: string,
  title: string,
  description: string,
  tags: string[],
  difficulty: string,
  id: number,
  streamId: string,
  creator: string,
  reviewer1: string,
  reviewer2: string,
  state: string,
  date: number,
}

export class LowWithLodash<T> extends Low<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data')
}
const target = path.resolve(__dirname, '../src/tutorials.json')
export const tutorialDetailDB = new LowWithLodash(new JSONFile<{ [slug: string]: TutorialDetailsRow }>(target))

const solana = path.resolve(__dirname, '../src/output.json')
export const solanaDB = new LowWithLodash(new JSONFile <SolanaDetailsRow[]> (solana))

