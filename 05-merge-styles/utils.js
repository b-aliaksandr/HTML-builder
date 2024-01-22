const path = require('node:path');
const fs = require('node:fs/promises');

const filterDirFilesByExt = (dirContent, ext) => {
  return dirContent.filter((direntInstance) => {
    return direntInstance.isFile() && path.extname(direntInstance.name) === ext;
  });
};

const readFileContent = (fileName, dirPath) => {
  const filePath = path.resolve(dirPath, fileName);
  return fs.readFile(filePath, 'utf-8');
}

async function createBundleByExt({ projectPath, folderName, distPath, outputFileName, ext }) {
  const dirPath = path.join(projectPath, folderName);
  const dirContent = await fs.readdir(dirPath, { withFileTypes: true });

  const filesContentData = await filterDirFilesByExt(dirContent, ext)
    .map(({ name }) => readFileContent(name, dirPath));

  await fs.writeFile(path.join(projectPath, distPath, outputFileName.concat(ext)), filesContentData, 'utf-8');
}

module.exports = {
  createBundleByExt,
}