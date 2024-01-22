const { copyDir } = require('./utils');

const FOLDER_NAME = 'files';

copyDir(__dirname, FOLDER_NAME).catch(console.error);