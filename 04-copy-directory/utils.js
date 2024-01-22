const fs = require('fs/promises');

async function createOrRecreateDir(folderPath) {
  try {
    await fs.mkdir(folderPath);
  } catch (err) {
    await fs.rm(folderPath, { recursive: true, force: true });
    await fs.mkdir(folderPath);
  }
}

module.exports = {
  createOrRecreateDir,
}