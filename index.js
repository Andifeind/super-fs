'use strict';

let fs = require('fs');
let path = require('path');

let mkdir = require('./libs/mkdir');

class SuperFS {
  constructor(path) {
    this.path = path;
  }

  fileStat(file) {
    return new Promise((resolve, reject) => {
      fs.lstat(file, function(err, stat) {
        if (err) {
          return reject(err);
        }

        resolve(Object.assign({
          path: file,
          name: path.basename(file),
          dir: path.dirname(file),
          ext: path.extname(file).substr(1),
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

  readDir(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(files.map(file => {
          return this.fileStat(dir + '/' + file);
        })).then(files => {
          resolve(files);
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

  writeFile(content) {
    let file = this.path;
    console.log('WRITE', file);
    return new Promise((resolve, reject) => {
      let dirname = path.dirname(file);
      mkdir(dirname, err => {
        if (err) {
          console.error(err.stack);
          return reject(err);
        }

        fs.writeFile(file, content, err => {
          if (err) {
            console.error(err.stack);
            return reject(err);
          }

          resolve(true);
        });
      });
    });
  }

  createDir() {
    return new Promise((resolve, reject) => {
      mkdir(this.path, err => {
        if (err) {
          return reject(err);
        }

        resolve(true);
      })
    });
  }
}

module.exports = {
  readDir: function(dir) {
    return new SuperFS().readDir(dir);
  },

  writeFile: function(file, content) {
    return new SuperFS(file).writeFile(content);
  },

  createDir: function(dir) {
    return new SuperFS(dir).createDir();
  }
};
