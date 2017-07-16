'use strict';

const path = require('path')
const inspect = require('inspect.js')

const SuperFSDir = require('../libs/dir')

describe('SuperFSDir', () => {
  describe('instance', () => {
    let testDir

    beforeEach(() => {
      testDir = new SuperFSDir(path.join(__dirname, '../examples'))
    })

    it('should create a SuperFSDir instance', () => {
      inspect(testDir).isObject()
    });

    it('should read a dir and returns all files', () => {
      const res = testDir.read()
      inspect(res).isPromise()

      return res.then((files) => {
        inspect(files).isArray()
        inspect(files).hasLength(3)

        const TEST_FILES = [
          'sub',
          'piglet.jpg',
          'test.json'
        ]

        for (const fl of files) {
          inspect(TEST_FILES).hasValue(fl.name)
        }
      })
    });

    it('should read a dir recursive and returns all files', () => {
      const res = testDir.read({
        recursive: true
      })

      inspect(res).isPromise()

      return res.then((files) => {
        inspect(files).isArray()
        inspect(files).hasLength(4)

        const TEST_FILES = [
          'sub',
          'piglet.jpg',
          'test.json',
          'lele.jpg'
        ]

        for (const fl of files) {
          inspect(TEST_FILES).hasValue(fl.name)
        }
      })
    });
  });
});
