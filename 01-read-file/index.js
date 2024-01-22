const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const fileName = 'text.txt';

const main = async () => {
  const readableStream = fs.createReadStream(
    path.join(__dirname, fileName),
    'utf-8',
  );
  for await (const chunk of readableStream) {
    stdout.write(chunk);
  }
};

main().catch(console.error);
