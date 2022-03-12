import { Low, JSONFile } from 'lowdb'
import lodash from 'lodash'

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

  constructor(configFilePath: string) {
    this.db = new LowWithLodash(new JSONFile<BuilderDaoConfigJson>(configFilePath))
  }

  initial(): BuilderDaoConfigJson {
    return {
      authors: [],
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