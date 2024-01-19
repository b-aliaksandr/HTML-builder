const fs = require('fs/promises');
const path = require('path');

const FOLDER_NAME = 'files';

async function createOrRecreateDir(folderPath) {
  try {
    await fs.mkdir(folderPath);
  } catch (err) {
    await fs.rm(folderPath, { recursive: true, force: true });
    await fs.mkdir(folderPath);
  }
}

async function copyDir(basePath, dirName) {
  const POSTFIX_NAME = 'copy';
  const copyDirName = dirName.concat('-', POSTFIX_NAME);
  const copyDirPath = path.join(basePath, copyDirName);
  const baseDirPath = path.join(basePath, dirName);

  await createOrRecreateDir(copyDirPath);

  const dirContent = await fs.readdir(baseDirPath, { withFileTypes: true });

  for (const direntInstance of dirContent) {
    if (direntInstance.isFile()) {
      await fs.copyFile(
        path.join(baseDirPath, direntInstance.name),
        path.join(copyDirPath, direntInstance.name)
      );
    }
  }
}

copyDir(__dirname, FOLDER_NAME).catch(console.error);