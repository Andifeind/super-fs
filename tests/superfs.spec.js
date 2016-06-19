'use strict';

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let fs = require('fs');
let SuperFS = require('../index');

describe('SuperFS', function() {
  describe('readDir', function() {
    it('Should read a directory', function() {
      let files = SuperFS.readDir(__dirname);
      inspect(files).isPromise();

      return files.then(files => {
        inspect.print(files);
        inspect(files).isArray();
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
