'use strict'

const inspect = require('inspect.js')
const sinon = require('sinon')
inspect.useSinon(sinon)

const path = require('path')
const SuperFS = require('../index')
const SuperFSFile = require('../libs/file')

const TEST_FILE = [
  '{',
  '  "name": "test",',
  '  "content": "Testfile"',
  '}',
  ''
].join('\n')

describe('SuperFSFile', function () {
  describe('instance', function () {
    let file

    beforeEach(function () {
      file = SuperFS.file('foo.js')
    })

    it('Gets a SuperFSFile instance', function () {
      inspect(file).isInstanceOf(SuperFSFile)
    })

    it('has a write method', function () {
      inspect(file).hasMethod('write')
    })

    it('has a read method', function () {
      inspect(file).hasMethod('read')
    })

    it('has a append method', function () {
      inspect(file).hasMethod('append')
    })

    it('has an exists method', function () {
      inspect(file).hasMethod('exists')
    })
  })

  describe('read()', function () {
    it('reads a file', function () {
      let file = SuperFS.file('../examples/test.json')
      return file.read().then(content => {
        inspect(content).isEql(TEST_FILE)
      })
    })

    it('throws an file not found error', function () {
      let file = SuperFS.file('../examples/not-found.json')
      return file.read().then(content => {
        inspect(content).isEql(TEST_FILE)
      }).catch(err => {
        return err
      }).then(err => {
        inspect(err).isEql({
          'errno': -2,
          'code': 'ENOENT',
          'syscall': 'open',
          'path': path.join(__dirname, '../examples/not-found.json')
        })
      })
    })
  })

  describe('write()', function () {
    it('writes a file', function () {
      let file = SuperFS.file('../tmp/test.json')
      return file.write('Test').then(content => {
        inspect(content).hasProps({
          name: 'test.json',
          size: 4,
          isFile: true
        })
      })
    })
  })

  describe('copy()', function () {
    it('copies a file', function () {
      let file = SuperFS.file('../examples/test.json')
      return file.copy('../tmp/test2.json').then(fl => {
        inspect(fl).hasProps({
          path: path.join(__dirname, '../tmp/test2.json')
        })
      })
    })

    it('throws an file not found error', function () {
      let file = SuperFS.file('../examples/not-found.json')
      return file.read().then(content => {
        inspect(content).isEql(TEST_FILE)
      }).catch(err => {
        return err
      }).then(err => {
        inspect(err).isEql({
          'errno': -2,
          'code': 'ENOENT',
          'syscall': 'open',
          'path': path.join(__dirname, '../examples/not-found.json')
        })
      })
    })
  })

  describe('writeJSON()', function () {
    it('writes a JSON file', function () {
      let file = SuperFS.file('../tmp/test.json')
      return file.writeJSON({ test: 'Test' }).then(content => {
        inspect(content).hasProps({
          name: 'test.json',
          size: 20,
          isFile: true
        })

        inspect(path.join(__dirname, '../tmp/test.json')).isFile()
        inspect(path.join(__dirname, '../tmp/test.json')).fileContains('"test": "Test"')
      })
    })
  })
})
