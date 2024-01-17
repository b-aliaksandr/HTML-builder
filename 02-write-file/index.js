const fs = require('node:fs');
const path = require('node:path');

const fileName = 'text.txt';

const writableStream = fs.createWriteStream(path.join(__dirname, fileName));