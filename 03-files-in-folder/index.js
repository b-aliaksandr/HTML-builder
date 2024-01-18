const fs = require('node:fs/promises');
const path = require('node:path');
const { stdout } = require('node:process');

const FOLDER_NAME = 'secret-folder';
const INSIDE_FOLDER_PATH = path.join(__dirname, FOLDER_NAME);

async function logFileInfoToWritableStream(direntInstance, writableStream) {
  if (direntInstance.isFile()) {
    const [fileName, fileExt] = direntInstance.name.split('.');
    const { size: fileSize } = await fs.stat(path.join(direntInstance.path, direntInstance.name));
    const fileInfo = `${fileName} - ${fileExt} - ${fileSize}\n`;
    writableStream.write(fileInfo);
  }
}

const filesPromise = fs.readdir(INSIDE_FOLDER_PATH, { withFileTypes: true });
filesPromise
  .then((files) => {
    for (const direntInstance of files) {
      logFileInfoToWritableStream(direntInstance, stdout);
    }
  })
  .catch((err) => console.error(err));
