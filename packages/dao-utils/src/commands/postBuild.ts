import * as commander from 'commander';
import fs from 'fs';
import path from 'path';

const defaultTargetFolder = path.resolve(
  path.join(process.cwd(), '../../target/'),
);
const targetTypesFolder = (targetFolder: string) =>
  path.join(targetFolder, `/types`);
const targetIdlFolder = (targetFolder: string) =>
  path.join(targetFolder, `/idl`);

const projectIdlFolder = () => {
  if (!fs.existsSync(path.join(process.cwd(), '/ts-sdk/lib/idl'))) {
    fs.mkdirSync('/ts-sdk/lib/idl');
  }
  return path.join(process.cwd(), '/ts-sdk/lib/idl');
};

const populateTypesFolder = (programName: string, targetFolder: string) => {
  const typeFile = path.join(
    targetTypesFolder(targetFolder),
    `${programName}.ts`,
  );
  const programFolder = path.join(projectIdlFolder(), `${programName}.ts`);
  fs.copyFileSync(typeFile, programFolder);
};

const populateIdlJson = (programName: string, targetFolder: string) => {
  const idlFile = path.join(
    targetIdlFolder(targetFolder),
    `${programName}.json`,
  );
  const programFolder = path.join(projectIdlFolder(), `${programName}.json`);
  fs.copyFileSync(idlFile, programFolder);
};

export function makePostBuildCommand() {
  const postBuild = new commander.Command('postBuild')
    .description('Copies the types file to the target folder')
    .argument('<program name>', 'program name')
    .option(
      '-t, --targetFolder <path>',
      'target folder path',
      defaultTargetFolder,
    )
    .action(
      (programName: string, { targetFolder }: { targetFolder: string }) => {
        populateTypesFolder(programName, targetFolder);
        populateIdlJson(programName, targetFolder);
      },
    );
  return postBuild;
}
