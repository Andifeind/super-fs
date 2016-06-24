'use strict';

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let fs = require('fs');
let path = require('path');
let SuperFS = require('../index');

const TEST_FILE = [
  '{',
  '  "name": "test",',
  '  "content": "Testfile"',
  '}',
  ''
].join('\n');

describe('SuperFS', function() {
  describe('readDir', function() {
    let filesArray

    before(() => {
      return SuperFS.readDir(path.join(__dirname, '../examples/')).then(files => {
        filesArray = files;
      });
    });

    it('Should read a directory', function() {
      inspect(filesArray).isArray();
    });

    it('Should have a few files', function() {
      let firstFile = filesArray[0];
      let secondFile = filesArray[1];
      inspect(firstFile).isObject();
      inspect(secondFile).isObject();
    });

    it('Each file should have a read method', function() {
      let firstFile = filesArray[0];
      let secondFile = filesArray[1];
      inspect(firstFile.read).isFunction();
      inspect(secondFile.read).isFunction();
    });

    it('read() should return its file content in a promise', function() {
      let secondFile = filesArray[1];
      let read = secondFile.read();
      inspect(read).isPromise();
      return read.then(source => {
        inspect(source).isEql(TEST_FILE);
      });
    });

    it('readJSON() should return its file content in a promise as JSON', function() {
      let secondFile = filesArray[1];
      let read = secondFile.readJSON();
      inspect(read).isPromise();
      return read.then(json => {
        inspect(json).isObject();
        inspect(json).isEql(JSON.parse(TEST_FILE));
      });
    });
  });

  describe('createDir', function() {
    after(done => {
      try {
        fs.rmdirSync(__dirname + '/tmp/test/foo');
        fs.rmdirSync(__dirname + '/tmp/test');
        fs.rmdirSync(__dirname + '/tmp');
      } catch(err) {
        console.error(err.stack);
      }

      done();
    });

    it('Should create a directory recursively', function() {
      let sfs = SuperFS.createDir(__dirname + '/tmp/test/foo');
      inspect(sfs).isPromise();

      return sfs.then(state => {
        let stat = fs.statSync(__dirname + '/tmp/test/foo');
        inspect(stat.isDirectory()).isTrue();
        inspect(state).isTrue();
      });
    });

  });
});
