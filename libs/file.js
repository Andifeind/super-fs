'use strict';

let fs = require('fs');
let path = require('path');

let mkdir = require('./mkdir');

class SuperFSFile {
  constructor(file) {
    this.path = file;
  }

  create() {
    return new Promise((resolve, reject) => {
      fs.lstat(this.path, (err, stat) => {
        if (err) {
          return reject(err);
        }

        resolve(Object.assign(this, {
          name: path.basename(this.path),
          dir: path.dirname(this.path),
          ext: path.extname(this.path).substr(1),
          isFile: stat.isFile(),
          isDir: stat.isDirectory(),
          isLink: stat.isSymbolicLink(),
          isBlockDevice: stat.isBlockDevice(),
          isCharDevice: stat.isCharacterDevice(),
          isFIFO: stat.isFIFO(),
          isSocket: stat.isSocket()
        }, stat));
      })
    });
  }

  read(encoding) {
    let opts = {
      encoding: encoding || 'utf8'
    };

    return new Promise((resolve, reject) => {
      fs.readFile(this.path, opts, function(err, source) {
        if (err) {
          return reject(err);
        }

        resolve(source);
      });
    });
  }

  write(content, opts) {
    opts = Object.assign({
      mode: 0o644
    }, opts || {});

    return new Promise((resolve, reject) => {
      mkdir(path.dirname(this.path), err => {
        fs.writeFile(this.path, content, opts, (err, source) => {
          if (err) {
            return reject(err);
          }

          this.create().then(resolve).catch(reject);
        });
      });
    });
  }

  append(content, opts) {
    opts = Object.assign({
      mode: 0o644
    }, opts || {});

    return new Promise((resolve, reject) => {
      fs.appendFile(this.path, content, opts, function(err, source) {
        if (err) {
          return reject(err);
        }

        resolve(this);
      });
    });
  }

  readJSON(encoding) {
    let read = this.read(encoding);
    return read.then(source => {
      return JSON.parse(source);
    });
  }
}

module.exports = SuperFSFile;
