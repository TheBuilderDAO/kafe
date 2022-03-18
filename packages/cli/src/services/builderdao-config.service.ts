// eslint-disable-next-line max-classes-per-file
import { Low, JSONFile, } from 'lowdb-node'
import lodash from 'lodash'
import path from 'path';
import simpleGit, { SimpleGit, CleanOptions } from 'simple-git';
import fs from 'fs-extra'

type BuilderDaoLockJson = {
  proposalId: number;
  slug: string;
  authors: {
    name: string;
    nickname: string;
    avatarUrl: string;
    email: string;
  }[]
  content: {
    [filename: string]: {
      name: string;
      path: string;
      digest: string;
    }
  };
  reviewers: {
    [reviwerIndex: string | 'reviewer1' | 'reviewer1']:
    {
      pda: string;
      pubkey: string;
      githubName: string;
    }
  };
  href: string;
}

type BuilderDaoConfigJson = {
  title: string;
  description: string;
  imageUrl: string;
  categories: {
    name: string;
    slug: string;
  }[];
}
class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

export class BuilderDaoConfig {
  public config: LowWithLodash<BuilderDaoConfigJson>

  public lock: LowWithLodash<BuilderDaoLockJson>

  public git: SimpleGit

  constructor(rootFolder: string) {
    const configFilePath = path.join(rootFolder, 'builderdao.config.json');
    this.config = new LowWithLodash(new JSONFile<BuilderDaoConfigJson>(configFilePath))
    const lockFilePath = path.join(rootFolder, 'builderdao.lock.json');
    this.lock = new LowWithLodash(new JSONFile<BuilderDaoLockJson>(lockFilePath))
    this.git = simpleGit().clean(CleanOptions.FORCE);
  }


  async initial({ proposalId, slug }: {
    proposalId: number,
    slug: string,
  }): Promise<{ lock: BuilderDaoLockJson, config: BuilderDaoConfigJson }> {
    // const name = (await this.git.getConfig('user.name')).value
    // const email = (await this.git.getConfig('user.email')).value

    const author = {
      name:  'The Builder Dao',
      avatarUrl: "",
      email: 'root@thebuilderdao.com',
      nickname: ''
    }

    return {
      lock: {
        proposalId,
        slug,
        authors: [author],
        reviewers: {},
        content: {},
        href: `/learn/${slug}`,
      },
      config: {
        categories: [],
        description: "",
        imageUrl: "",
        title: "",
      }
    }
  }
}