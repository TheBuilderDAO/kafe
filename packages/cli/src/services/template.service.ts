import path from 'path';
import fs from 'fs-extra'
import {replaceInFile} from 'replace-in-file'

export class TemplateService  {
  public target: string;

  public templateName: "simple" | "multipage" | undefined;

  constructor(target: string) {
    this.target = target
  }

  async copy(templateName: "simple" | "multipage") {
    this.templateName = templateName
    const template = path.join(__dirname, `../../../templates/${templateName}`)
    await fs.copy(template, this.target, {
      recursive: true
    })
  }

  async setName(name: string) {
    return this.replace(`template_${this.templateName}`, name)
  }

  async setTitle(title: string) {
    return this.replace("{{title}}", title)
  }

  async setDescription(description: string) {
    return this.replace('{{description}}', description);
  }


  private async replace(from: string, to: string) {
     await replaceInFile({
      files: `${this.target}/**/*`,
      from,
      to
    })  
  }
}