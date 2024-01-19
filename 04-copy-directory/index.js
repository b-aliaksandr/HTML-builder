const fs = require('fs/promises');
const path = require('path');

const FOLDER_NAME = 'files';

async function copyDir(basePath, dirName) {
  const POSTFIX_NAME = 'copy';
  const copyDirName = dirName.concat('-', POSTFIX_NAME);
  const copyDirPath = path.join(basePath, copyDirName);

  await fs.mkdir(copyDirPath, { recursive: true });
}

copyDir(__dirname, FOLDER_NAME).catch(console.error);