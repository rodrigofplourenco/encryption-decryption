import { Writable } from 'node:stream';
import fs from 'node:fs';

export class OwnWriteStream extends Writable {
  constructor({ fileName }) {
    super();

    this.fileName = fileName;
    this.fileDescriptor = null;
  }

  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fileDescriptor) => {
      if (err) {
        return callback(err);
      }

      this.fileDescriptor = fileDescriptor;
      callback();
    });
  }

  _write(chunk, encoding, callback) {
    fs.write(this.fileDescriptor, chunk, callback);
  }

  _destroy(err, callback) {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (error) => callback(error || err));
    } else {
      callback(err);
    }
  }
}
