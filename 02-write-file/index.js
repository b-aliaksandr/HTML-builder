const fs = require('node:fs');
const path = require('node:path');
const { stdout, stdin } = require('node:process');
const readline = require('node:readline/promises');

const EXIT_PHRASE = 'exit';

const fileName = 'text.txt';
const welcomeMessage = 'Hi, student \n';
const farewellMessage = 'Bye';

const handleExit = () => {
  stdout.write(farewellMessage);
  process.kill(process.pid, 'SIGINT');
};

const handleReadLine = (line) => {
  if (line === EXIT_PHRASE) {
    handleExit();
  }
  rl.output.write(line.concat('\n'));
};

process.on('SIGINT', handleExit);

const writableStream = fs.createWriteStream(
  path.join(__dirname, fileName),
  'utf-8',
);
const rl = readline.createInterface({ input: stdin, output: writableStream });

stdout.write(welcomeMessage);
rl.on('line', handleReadLine);
