// eslint-disable-next-line max-classes-per-file
import { Low, JSONFile, } from 'lowdb-node'
import lodash from 'lodash'
import path from 'path';
import simpleGit, { SimpleGit, CleanOptions } from 'simple-git';
import { getTutorialContentByPath } from '@builderdao/md-utils';
import async from 'async';
import { hashSumDigest } from '../utils';

export type BuilderDaoLockJson = {
  proposalId: number;
  slug: string;
  creator: string;
  authors: {
    name: string;
    nickname: string;
    avatarUrl: string;
    url: string;
  }[]
  content: {
    [filename: string]: {
      name: string;
      path: string;
      digest: string;
      arweaveHash?: string;
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

export type BuilderDaoConfigJson = {
  title: string;
  description: string;
  imageUrl: string;
  categories: string[];
}
export class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

export class BuilderDaoConfig {
  public rootFolder: string

  public config: LowWithLodash<BuilderDaoConfigJson>

  public lock: LowWithLodash<BuilderDaoLockJson>

  public git: SimpleGit

  constructor(rootFolder: string) {
    this.rootFolder = rootFolder;
    const configFilePath = path.join(rootFolder, 'builderdao.config.json');
    this.config = new LowWithLodash(new JSONFile<BuilderDaoConfigJson>(configFilePath))
    const lockFilePath = path.join(rootFolder, 'builderdao.lock.json');
    this.lock = new LowWithLodash(new JSONFile<BuilderDaoLockJson>(lockFilePath))
    this.git = simpleGit().clean(CleanOptions.FORCE);
  }


  async updateHashDigestOfFolder() {
    const tutorialMetadata = await getTutorialContentByPath({
      rootFolder: this.rootFolder,
    });

    await this.lock.read();
    const hashQueue = async.queue(
      async (file: { path: string; name: string; digest?: string }) => {
        const digest = await hashSumDigest(file.path);
        const relativePath = path.relative(this.rootFolder, file.path);
        const prev = this.lock.chain.get(`content["${relativePath}"]`).value();
        this.lock.chain
          .set(`content["${relativePath}"]`, {
            ...prev,
            name: file.name,
            path: relativePath,
            digest,
          })
          .value();
        await this.lock.write();
      },
      2,
    );
    tutorialMetadata.content.forEach((file: { path: string; name: string }) => {
      hashQueue.push(file);
    });
    await hashQueue.drain();
  }


  static async initial({ proposalId, slug }: {
    proposalId: number,
    slug: string,
  }): Promise<{ lock: BuilderDaoLockJson, config: BuilderDaoConfigJson }> {
    // const name = (await this.git.getConfig('user.name')).value
    // const email = (await this.git.getConfig('user.email')).value

    const author = {
      name: 'The Builder Dao',
      avatarUrl: "https://github.com/TheBuilderDAO.png",
      url: 'https://builderdao.io',
      nickname: 'TheBuilderDAO'
    }

    return {
      lock: {
        proposalId,
        slug,
        creator: "",
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