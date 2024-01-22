const path = require('node:path');
const { copyDir } = require('./utils');

const FOLDER_NAME = 'files';
const POSTFIX_NAME = 'copy';
const copyDirName = FOLDER_NAME.concat('-', POSTFIX_NAME);
const copyDirPath = path.join(__dirname, copyDirName);
const baseDirPath = path.join(__dirname, FOLDER_NAME);

copyDir(baseDirPath, copyDirPath).catch(console.error);
