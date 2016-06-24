'use strict';

let fs = require('fs');
let path = require('path');

let mkdir = require('./libs/mkdir');
let SuperFSFile = require('./libs/file');

class SuperFS {
  constructor(path) {
    this.path = path;
  }

  readDir(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(files.map(file => {
          file = new SuperFSFile(dir + '/' + file);
          return file.create();
        })).then(files => {
          resolve(files);
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

  writeFile(content) {
    let file = new SuperFSFile(this.path);
    return file.write(content);
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
