const fs = require('node:fs/promises');
const path = require('node:path');
const { stdout } = require('node:process');

const FOLDER_NAME = 'secret-folder';
const FOLDER_PATH = path.join(__dirname, FOLDER_NAME);

async function logFileInfoToOutput(direntInstance, output) {
  if (direntInstance.isFile()) {
    const { name: fileName, ext: fileExt } = path.parse(direntInstance.name);
    const { size: fileSize } = await fs.stat(
      path.join(direntInstance.path, direntInstance.name),
    );
    const fileInfo = `${fileName} - ${fileExt.slice(1)} - ${fileSize}\n`;
    output.write(fileInfo);
  }
}

async function readFilesInFolder(pathFolder) {
  const files = await fs.readdir(pathFolder, { withFileTypes: true });
  for (const file of files) {
    logFileInfoToOutput(file, stdout);
  }
}

try {
  readFilesInFolder(FOLDER_PATH);
} catch (err) {
  console.error(err);
}
