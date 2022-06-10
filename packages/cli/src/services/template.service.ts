import path from 'path';
import fs from 'fs-extra';
import {
  LowWithLodash,
  BuilderDaoConfig,
  BuilderDaoConfigJson,
  BuilderDaoLockJson,
} from './builderdao-config.service';
import { JSONFile } from 'lowdb-node';
import { PackageJson } from 'type-fest';
type TemplateTypes = 'simple' | 'multipage' | 'empty' | undefined;

export class TemplateService {
  public target: string;

  public packageJson: LowWithLodash<PackageJson>;

  public configJson: LowWithLodash<BuilderDaoConfigJson>;

  public lockJson: LowWithLodash<BuilderDaoLockJson>;

  public templateName: TemplateTypes;

  public packageJsonPath: string;

  public lockJsonPath: string;

  public configJsonPath: string;

  constructor(target: string) {
    this.target = target;

    this.packageJsonPath = path.join(this.target, 'package.json');
    this.configJsonPath = path.join(this.target, 'builderdao.config.json');
    this.lockJsonPath = path.join(this.target, 'builderdao.lock.json');
    this.configJson = new BuilderDaoConfig(this.target).config;
    this.packageJson = new LowWithLodash(
      new JSONFile<PackageJson>(this.packageJsonPath),
    );
    this.lockJson = new BuilderDaoConfig(this.target).lock;
  }

  async copy(templateName: TemplateTypes) {
    this.templateName = templateName;
    const template = path.join(__dirname, `../../../templates/${templateName}`);
    await fs.copy(template, this.target, {
      recursive: true,
    });
  }

  async setName(name: string) {
    await this.updateLock('href', `learn/${name}`);
    await this.updateLock('slug', name);
    await this.updatePackageJson('name', `@builderdao-learn/${name}`);
  }

  async setTitle(title: string) {
    await this.updateConfig('title', title);
  }

  async setDescription(description: string) {
    await this.updateConfig('description', description);
    await this.updatePackageJson('description', description);
  }

  async setTags(tags: string[]) {
    await this.updateConfig('categories', tags);
    await this.updatePackageJson('keywords', tags);
  }

  async addContent(fileName: string, content: string) {
    const filePath = path.join(this.target, 'content', fileName);
    await fs.writeFile(filePath, content);
  }

  async setAuthor({
    name,
    url,
    nickname,
    avatarUrl,
  }: {
    name: string;
    url: string;
    nickname: string;
    avatarUrl: string;
  }) {
    await this.lockJson.read();
    this.lockJson.chain
      .set('authors', [
        {
          name,
          avatarUrl,
          url,
          nickname,
        },
      ])
      .value();
    await this.lockJson.write();
  }

  async updateLock(key: string, value: any) {
    const lock = this.lockJson;
    await lock?.read();
    lock.chain.set(key, value).value();
    await lock.write();
  }

  async updateConfig(key: string, value: any) {
    const config = this.configJson;
    await config?.read();
    config.chain.set(key, value).value();
    await config.write();
  }

  async updatePackageJson(key: string, value: any) {
    const packageJson = this.packageJson;
    await packageJson?.read();
    packageJson.chain.set(key, value).value();
    await packageJson.write();
  }
}
