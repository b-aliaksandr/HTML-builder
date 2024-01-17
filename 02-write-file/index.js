const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('node:process');

const fileName = 'text.txt';
const welcomeMessage = 'Hi, student';

const writableStream = fs.createWriteStream(path.join(__dirname, fileName));

writableStream.on('open', () => stdout.write(welcomeMessage));