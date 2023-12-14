import { Transform } from 'node:stream';

export class Decryption extends Transform {
  constructor() {
    super();
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 0) {
        chunk[i] -= 1;
      }
    }

    this.push(chunk);
  }
}
