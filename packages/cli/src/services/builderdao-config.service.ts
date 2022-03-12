import { Low, JSONFile } from 'lowdb-node'
import lodash from 'lodash'
import path from 'path';
import simpleGit, { SimpleGit, CleanOptions } from 'simple-git';

type BuilderDaoConfigJson = {
  proposalId: null | number;
  title: string;
  content: { [filename: string]: string };
  authors: {
    name: string;
    nickname: string;
    avatarUrl: string;
    email: string;
  }[]
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

  initial(): BuilderDaoConfigJson {
    // const spawn = require('child_process').spawn;
    // spawn('git' ,['config --get user.name'])

    const name = this.git.getConfig('user.name')
    const email = this.git.getConfig('user.email')
    console.log(name, email)

    return {
      authors: [{
        name: "",
        avatarUrl: "",
        email: "",
        nickname: ''
      }],
      categories: [],
      content: {},
      description: "",
      href: "",
      imageUrl: "",
      title: "",
      proposalId: null
    }
  }

  async write() {
    await this.db.write()
  }
}