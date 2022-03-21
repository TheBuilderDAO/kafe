import path from 'path';
import fs from 'fs-extra'
import { LowWithLodash, BuilderDaoConfig, BuilderDaoConfigJson } from './builderdao-config.service';
import { JSONFile } from 'lowdb-node';
import { PackageJson } from 'type-fest';
type TemplateTypes = "simple" | "multipage" | "empty" | undefined;



export class TemplateService {
  public target: string;

  public packageJson: LowWithLodash<PackageJson>;
  public configJson: LowWithLodash<BuilderDaoConfigJson>;

  public templateName: TemplateTypes
  public packageJsonPath: string;
  public configJsonPath: string;
  

  constructor(target: string) {
    this.target = target

    this.packageJsonPath = path.join(this.target, 'package.json')
    this.configJsonPath = path.join(this.target, 'builderdao.config.json')
    this.configJson =  new BuilderDaoConfig(this.target).db;
    this.packageJson = new LowWithLodash(new JSONFile<PackageJson>(this.packageJsonPath))
  }


  async copy(templateName: TemplateTypes) {
    this.templateName = templateName
    const template = path.join(__dirname, `../../../templates/${templateName}`)
    await fs.copy(template, this.target, {
      recursive: true
    })
  }

  async setName(name: string) {
    await this.updateConfig('href', `learn/${name}`)
    await this.updatePackageJson('name', `@builderdao-learn/${name}`);
  }

  async setTitle(title: string) {
    await this.updateConfig('title', title)
  }

  async setDescription(description: string) {
    await this.updateConfig('description', description);
    await this.updatePackageJson('description', description);
  }

  async setTags(tags: string[]) {
    await this.updateConfig('categories', tags);
    await this.updatePackageJson('keywords', tags);
  }

  private async updateConfig(key: string, value: any) {
    const config = this.configJson 
    await config?.read()
    config.chain.set(key, value).value();
    await config.write();
  }

  private async updatePackageJson(key: string, value: any) {
    const packageJson = this.packageJson
    await packageJson?.read(); 
    packageJson.chain.set(key, value).value();
    await packageJson.write();
  }
}