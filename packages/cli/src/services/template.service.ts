import path from 'path';
import fs from 'fs-extra'

export class TemplateService  {

  static async copy(templateName: string, destination: string) {
    const template = path.join(__dirname, `../../../templates/${templateName}`)
    await fs.copy(template, destination)
  }

  static replace(target: string) {
    
  }
}