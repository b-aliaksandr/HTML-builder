const path = require('node:path');
const fs = require('node:fs');

const { createOrRecreateDir, copyDir } = require('../04-copy-directory/utils.js');
const { createBundleByExt } = require('../05-merge-styles/utils.js');

const PROJECT_PATH = __dirname;
const DIST_DIR_NAME = 'project-dist';
const DIST_DIR_PATH = path.join(PROJECT_PATH, DIST_DIR_NAME);
const COMPONENTS_DIR_PATH = path.join(PROJECT_PATH, 'components');
const ASSETS_DIR_NAME = 'assets';
const STYLES_DIR_NAME = 'styles';
const CSS_EXT = '.css';
const OUTPUT_CSS_FILE_NAME = 'style';

const entryPointPath = path.join(PROJECT_PATH, 'template.html');
const outputPath = path.join(DIST_DIR_PATH, 'index.html');

const findTagNames = (content) => {
  const START_TAG_SYMBOLS = '{{';
  const END_TAG_SYMBOLS = '}}';
  const tagSymbolsLen = START_TAG_SYMBOLS.length;

  let startIndex = 0;
  let endIndex = 0;
  const tagNames = [];

  while (startIndex !== -1) {
    startIndex = content.indexOf(START_TAG_SYMBOLS, startIndex + tagSymbolsLen);
    endIndex = content.indexOf(END_TAG_SYMBOLS, startIndex) + tagSymbolsLen;

    if (startIndex !== -1 && endIndex !== -1) {
      const tagName = {
        startIndex,
        endIndex,
        name: content.slice(startIndex + tagSymbolsLen, endIndex - tagSymbolsLen),
      };
      tagNames.push(tagName);
    }
  }

  return tagNames;
};

const insertComponentsInTemplateHTML = async () => {
  const outputHTMLWritableStream = fs.createWriteStream(outputPath, 'utf-8');

  const templateHTML = await fs.promises.readFile(entryPointPath, 'utf-8');
  const tagNames = findTagNames(templateHTML);

  const beforeTagNamesContentTagNamesContent = templateHTML.slice(0, tagNames.at(0).startIndex);
  outputHTMLWritableStream.write(beforeTagNamesContentTagNamesContent);

  for await (const { name } of tagNames) {
    const fileName = name.concat('.html');
    try {
      const chunk = await fs.promises.readFile(path.resolve(COMPONENTS_DIR_PATH, fileName), 'utf-8');
      outputHTMLWritableStream.write(chunk);
    } catch (err) {
      console.error(err);
    }
  }

  const afterTagNamesContent = templateHTML.slice(tagNames.at(-1).endIndex);
  outputHTMLWritableStream.write(afterTagNamesContent);
};

const main = async () => {
  await createOrRecreateDir(DIST_DIR_PATH);
  insertComponentsInTemplateHTML();
  copyDir(path.join(PROJECT_PATH, ASSETS_DIR_NAME), path.join(DIST_DIR_PATH, ASSETS_DIR_NAME));
  createBundleByExt({
    projectPath: PROJECT_PATH,
    folderName: STYLES_DIR_NAME,
    distPath: DIST_DIR_NAME,
    outputFileName: OUTPUT_CSS_FILE_NAME,
    ext: CSS_EXT,
  });
};

main().catch(console.error);