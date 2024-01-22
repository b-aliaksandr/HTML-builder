const fs = require('node:fs/promises');
const path = require('node:path');

const FOLDER_NAME = 'files';
const POSTFIX_NAME = 'copy';
const copyDirName = FOLDER_NAME.concat('-', POSTFIX_NAME);
const copyDirPath = path.join(__dirname, copyDirName);
const baseDirPath = path.join(__dirname, FOLDER_NAME);

async function createOrRecreateDir(folderPath) {
  try {
    await fs.mkdir(folderPath);
  } catch (err) {
    await fs.rm(folderPath, { recursive: true, force: true });
    await fs.mkdir(folderPath);
  }
}

async function copyDir(entryDirPath, outputDirPath) {
  await createOrRecreateDir(outputDirPath);

  const dirContent = await fs.readdir(entryDirPath, { withFileTypes: true });

  for (const direntInstance of dirContent) {
    if (direntInstance.isFile()) {
      await fs.copyFile(
        path.join(entryDirPath, direntInstance.name),
        path.join(outputDirPath, direntInstance.name),
      );
    } else if (direntInstance.isDirectory()) {
      copyDir(
        path.join(entryDirPath, direntInstance.name),
        path.join(outputDirPath, direntInstance.name),
      );
    }
  }
}

copyDir(baseDirPath, copyDirPath).catch(console.error);
