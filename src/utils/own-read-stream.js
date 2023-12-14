import { Readable } from 'node:stream';
import fs from 'node:fs';

export class OwnReadStream extends Readable {
  constructor({ fileName }) {
    super();

    this.fileName = fileName;
    this.fileDescriptor = null;
  }

  _construct(callback) {
    fs.open(this.fileName, 'r', (err, fileDescriptor) => {
      if (err) {
        return callback(err);
      }

      this.fileDescriptor = fileDescriptor;
      callback();
    });
  }

  _read(chunkSize) {
    const buffer = Buffer.alloc(chunkSize);

    fs.read(this.fileDescriptor, buffer, 0, buffer.length, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
      }
    });
  }

  _destroy(err, callback) {
    if (this.fileDescriptor) {
      fs.close(this.fileDescriptor, (error) => callback(error || err));
    } else {
      callback(err);
    }
  }
}
