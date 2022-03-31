import _ from 'lodash'
import path from 'path'
import { Low, JSONFile } from 'lowdb'

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

const solana = path.resolve(__dirname, '../src/output.json')
export const solanaDB = new LowWithLodash(new JSONFile<SolanaDetailsRow[]>(solana))


const source = path.resolve(__dirname, '../src/tutorials-dump.json')
export const tutorialDumpDB = new LowWithLodash(new JSONFile<Tutorial[]>(source))

export interface Tutorial {
  slug: string;
  is_multi_page: boolean;
  title: string;
  description: string;
  author_github_account?: string;
  author_url?: string;
  author_wallet?: string;
  tags: string[];
  difficulty: 'beginner' | 'experienced';
  published_at: string;
  pages: Page[];
}


export interface TutorialExtended {
  slug: string;
  oldSlug: string;
  is_multi_page: boolean;
  title: string;
  description: string;
  author_name: string;
  author_github_account: string;
  author_url: string;
  author_wallet?: string;
  author_image_url: string;
  tags: string[];
  difficulty: 'beginner' | 'experienced';
  published_at: string;
  pages: Page[];
}

type Page = {
  slug: string;
  title: string;
  description: string;
  markdown_url: string;
  keywords: string[];
  next_slug: string;
  previous_slug: string;
  page_number: number;
}

const target = path.resolve(__dirname, '../src/tutorials.json')
export const tutorialDumpExtendedDB = new LowWithLodash(new JSONFile<{ [slug: string]: TutorialExtended }>(target))