import path from 'path';

export const rootTutorialFolderPath = path.resolve(__dirname).includes('yarn/global')
  ? path.join(process.cwd(), 'tutorials')
  : path.join(__dirname, '../../../', 'tutorials');