import path from 'path';
import isInstalledGlobally from 'is-installed-globally';


export const rootTutorialFolderPath = isInstalledGlobally
  ? path.join(process.cwd(), 'tutorials')
  : path.join(__dirname, '../../../', 'tutorials');