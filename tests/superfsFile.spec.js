'use strict';

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let fs = require('fs');
let path = require('path');
let SuperFS = require('../index');
let SuperFSFile = require('../libs/file');

const TEST_FILE = [
  '{',
  '  "name": "test",',
  '  "content": "Testfile"',
  '}',
  ''
].join('\n');

describe('SuperFSFile', function() {
  describe('instance', function() {
    let file;

    beforeEach(function() {
      file = SuperFS.file('foo.js');
    });

    it('Gets a SuperFSFile instance', function() {
      inspect(file).isInstanceOf(SuperFSFile);
    });

    it('has a write method', function() {
      inspect(file).hasMethod('write');
    });

    it('has a read method', function() {
      inspect(file).hasMethod('read');
    });

    it('has a append method', function() {
      inspect(file).hasMethod('append');
    });

    it('has an exists method', function() {
      inspect(file).hasMethod('exists');
    });
  });

  describe('read()', function() {
    it('reads a file', function() {
      let file = SuperFS.file('../examples/test.json');
      return file.read().then(content => {
        inspect(content).isEql(TEST_FILE);
      });
    });

    it('throws an file not found error', function() {
      let file = SuperFS.file('../examples/not-found.json');
      return file.read().then(content => {
        inspect(content).isEql(TEST_FILE);
      }).catch(err => {
        return err;
      }).then(err => {
        inspect(err).isEql({
          'errno': -2,
          'code': 'ENOENT',
          'syscall': 'open',
          'path': '/home/andi/Webprojects/superfs/examples/not-found.json'
        });
      });
    });
  });

  describe('write()', function() {
    it('writes a file', function() {
      let file = SuperFS.file('../tmp/test.json');
      return file.write('Test').then(content => {
        inspect(content).hasProps({
          name: 'test.json',
          size: 4,
          isFile: true
        });
      });
    });
  });
});
