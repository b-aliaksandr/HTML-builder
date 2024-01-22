const path = require('node:path');
const fs = require('node:fs');

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
        name: content.slice(
          startIndex + tagSymbolsLen,
          endIndex - tagSymbolsLen,
        ),
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

  let curIndex = 0;

  for await (const { name, startIndex, endIndex } of tagNames) {
    const fileName = name.trim().concat('.html');
    const beforeTagNamesContent = templateHTML.slice(
      curIndex,
      startIndex,
    );
    outputHTMLWritableStream.write(beforeTagNamesContent);
    curIndex = endIndex;
    try {
      const chunk = await fs.promises.readFile(
        path.resolve(COMPONENTS_DIR_PATH, fileName),
        'utf-8',
      );
      outputHTMLWritableStream.write(chunk);
    } catch (err) {
      console.error(err);
    }
  }

  const afterTagNamesContent = templateHTML.slice(curIndex);
  outputHTMLWritableStream.write(afterTagNamesContent);
};

async function createOrRecreateDir(folderPath) {
  try {
    await fs.promises.mkdir(folderPath);
  } catch (err) {
    await fs.promises.rm(folderPath, { recursive: true, force: true });
    await fs.promises.mkdir(folderPath);
  }
}

async function copyDir(entryDirPath, outputDirPath) {
  await createOrRecreateDir(outputDirPath);

  const dirContent = await fs.promises.readdir(entryDirPath, { withFileTypes: true });

  for (const direntInstance of dirContent) {
    if (direntInstance.isFile()) {
      await fs.promises.copyFile(
        path.join(entryDirPath, direntInstance.name),
        path.join(outputDirPath, direntInstance.name),
      );
    } else if (direntInstance.isDirectory()) {
      copyDir(
        path.join(entryDirPath, direntInstance.name),
        path.join(outputDirPath, direntInstance.name),
      );
    }
  }
}

const filterDirFilesByExt = (dirContent, ext) => {
  return dirContent.filter((direntInstance) => {
    return direntInstance.isFile() && path.extname(direntInstance.name) === ext;
  });
};

const readFileContent = (fileName, dirPath) => {
  const filePath = path.resolve(dirPath, fileName);
  return fs.promises.readFile(filePath, 'utf-8');
};

async function createBundleByExt({
  projectPath,
  folderName,
  distPath,
  outputFileName,
  ext,
}) {
  const dirPath = path.join(projectPath, folderName);
  const dirContent = await fs.promises.readdir(dirPath, { withFileTypes: true });

  const filesContentData = await filterDirFilesByExt(dirContent, ext).map(
    ({ name }) => readFileContent(name, dirPath),
  );

  await fs.promises.writeFile(
    path.join(projectPath, distPath, outputFileName.concat(ext)),
    filesContentData,
    'utf-8',
  );
}

const main = async () => {
  await createOrRecreateDir(DIST_DIR_PATH);
  insertComponentsInTemplateHTML().catch(console.error);
  copyDir(
    path.join(PROJECT_PATH, ASSETS_DIR_NAME),
    path.join(DIST_DIR_PATH, ASSETS_DIR_NAME),
  ).catch(console.error);
  createBundleByExt({
    projectPath: PROJECT_PATH,
    folderName: STYLES_DIR_NAME,
    distPath: DIST_DIR_NAME,
    outputFileName: OUTPUT_CSS_FILE_NAME,
    ext: CSS_EXT,
  }).catch(console.error);
};

main().catch(console.error);
