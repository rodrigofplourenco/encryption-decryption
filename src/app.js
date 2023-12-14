import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

import { OwnReadStream } from './utils/own-read-stream.js';
import { OwnWriteStream } from './utils/own-write-stream.js';

import { Encryption } from './utils/encryption.js';
import { Decryption } from './utils/decryption.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parsePath(fileName) {
  return path.resolve(__dirname, fileName);
} 

async function encrypt() {
  const fileReadStream = new OwnReadStream({ fileName: parsePath('data.txt') });
  const fileWriteStream = new OwnWriteStream({ fileName: parsePath('enc-data.txt') });
  const encryptStream = new Encryption();

  fileReadStream
    .pipe(encryptStream)
    .pipe(fileWriteStream);
}

async function decrypt() {
  const fileReadStream = new OwnReadStream({ fileName: parsePath('enc-data.txt') });
  const fileWriteStream = new OwnWriteStream({ fileName: parsePath('dec-data.txt') });
  const decryptStream = new Decryption();

  fileReadStream
    .pipe(decryptStream)
    .pipe(fileWriteStream);
}

async function clean() {
  await fs.unlink(parsePath('enc-data.txt'));
  await fs.unlink(parsePath('dec-data.txt'));
}

function main(typeOfExecution) {
  switch (typeOfExecution) {
    case 'ENC':
      console.log('data.txt > enc-data.txt');
      encrypt();
      break;
    case 'DEC':
      console.log('enc-data.txt > dec-data.txt');
      decrypt();
      break;
    case 'CLN':
      console.warn('removing enc-data and dec-data');
      clean();
      break;
    default:
      console.error('wrong type of execution passed, check README.md for more info');
      break;
  }
}
main(process.argv[2]);
