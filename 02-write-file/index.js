const fs = require('node:fs');
const path = require('node:path');
const { stdout, stdin } = require('node:process');
const readline = require('node:readline/promises');

const EXIT_PHRASE = 'exit';

const fileName = 'text.txt';
const welcomeMessage = 'Hi, student \n';
const farewellMessage = 'Bye';

const writableStream = fs.createWriteStream(path.join(__dirname, fileName));
const rl = readline.createInterface({ input: stdin, output: writableStream });

const handleReadLine = (line) => {
  if (line === EXIT_PHRASE) {
    process.emit('SIGINT');
  }
  rl.output.write(line + '\n');
};

const handleExit = () => {
  stdout.write(farewellMessage);
  process.kill(process.pid, 'SIGINT');
};

writableStream.on('open', () => stdout.write(welcomeMessage));

rl.on('line', handleReadLine);
process.on('SIGINT', handleExit);
