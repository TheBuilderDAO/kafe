// eslint-disable-next-line max-classes-per-file
import { Low, JSONFile,  } from 'lowdb-node'
import lodash from 'lodash'
import path from 'path';
import simpleGit, { SimpleGit, CleanOptions } from 'simple-git';
import fs from 'fs-extra'

type BuilderDaoConfigJson = {
  proposalId: null | number;
  title: string;
  slug: string;
  content: {[filename: string]: {
    name: string;
    path: string;
    digest: string;
  }};
  authors: {
    name: string;
    nickname: string;
    avatarUrl: string;
    email: string;
  }[]
  reviewers: {
    pda: string;
    pubkey: string;
    githubName: string;
  }[];
  description: string;
  imageUrl: string;
  categories: {
    name: string;
    slug: string;
  }[];
  href: string;
}
class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

export class BuilderDaoConfig {
  public db: LowWithLodash<BuilderDaoConfigJson>

  public git: SimpleGit 

  constructor(rootFolder: string) {
    const configFilePath = path.join(rootFolder, 'builderdao.config.json');
    this.db = new LowWithLodash(new JSONFile<BuilderDaoConfigJson>(configFilePath))
    this.git = simpleGit().clean(CleanOptions.FORCE);
  }


  async initial({proposalId, slug}:{
    proposalId: number,
    slug: string,
  }): Promise<BuilderDaoConfigJson>{
    const name = (await this.git.getConfig('user.name')).value
    const email = (await this.git.getConfig('user.email')).value

    const author = {
        name: name ?? 'The Builder Dao',
        avatarUrl: "",
        email: email ?? 'root@thebuilderdao.com',
        nickname: ''
    }

    return {
      proposalId,
      slug,
      authors: [author],
      categories: [],
      reviewers: [],
      content: {},
      description: "",
      href: "",
      imageUrl: "",
      title: "",
    }
  }
}