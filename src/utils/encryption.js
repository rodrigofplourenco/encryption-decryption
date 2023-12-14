import { Transform } from 'node:stream';

export class Encryption extends Transform {
  constructor() {
    super();
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] += 1;
      }
    }

    this.push(chunk);
  }
}
