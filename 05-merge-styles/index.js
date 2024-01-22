const { createBundleByExt } = require('./utils');

const PROJECT_PATH = __dirname;
const DIST_DIR_NAME = 'project-dist';
const OUTPUT_FILE_NAME = 'bundle';
const CSS_EXT = '.css';
const STYLES_DIR_NAME = 'styles';

createBundleByExt({
  projectPath: PROJECT_PATH,
  folderName: STYLES_DIR_NAME,
  distPath: DIST_DIR_NAME,
  outputFileName: OUTPUT_FILE_NAME,
  ext: CSS_EXT,
}).catch(console.error);
