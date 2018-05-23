'use strict'

const path = require('path')
const inspect = require('inspect.js')
const sinon = require('sinon')
inspect.useSinon(sinon)

const SuperFSDir = require('../libs/dir')

describe('SuperFSDir', () => {
  describe('instance', () => {
    let testDir

    beforeEach(() => {
      testDir = new SuperFSDir(path.join(__dirname, '../examples'))
    })

    it('should create a SuperFSDir instance', () => {
      inspect(testDir).isObject()
    })

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
    })

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
    })

    it('should read a dir recursive and returns all *.jpg files', () => {
      const res = testDir.read({
        recursive: true,
        filter: '*.jpg'
      })

      inspect(res).isPromise()

      return res.then((files) => {
        inspect(files).isArray()
        inspect(files).hasLength(2)

        inspect(files[0]).hasProps({
          name: 'piglet.jpg'
        })

        inspect(files[1]).hasProps({
          name: 'lele.jpg'
        })
      })
    })
  })

  describe('copy()', () => {
    it('should copy a directory with all its subfolders', () => {
      const superDir = new SuperFSDir(path.join(__dirname, '../examples'))
      const res = superDir.copy(path.join(__dirname, '../tmp/'), true).then((copiedFiles) => {
        inspect(copiedFiles).isArray().hasLength(4)
        inspect(path.join(__dirname, '../tmp/test.json')).doesFileExists()
        inspect(path.join(__dirname, '../tmp/piglet.jpg')).doesFileExists()
        inspect(path.join(__dirname, '../tmp/sub/lele.jpg')).doesFileExists()
      })

      inspect(res).isPromise()
      return res
    })
  })

  describe('delete()', () => {
    it('should delete a directory and all its files', () => {
      const superDir = new SuperFSDir(path.join(__dirname, '../tmp'))
      const res = superDir.delete().then((deletedFiles) => {
        inspect(deletedFiles).isArray().hasLength(4)
        inspect(path.join(__dirname, '../tmp/test.json')).doesNotFileExists()
        inspect(path.join(__dirname, '../tmp/piglet.jpg')).doesNotFileExists()
        inspect(path.join(__dirname, '../tmp/sub/lele.jpg')).doesNotFileExists()
      })

      inspect(res).isPromise()
      return res
    })
  })

  describe('watch()', () => {
    const testDir = path.join(__dirname, '../tmp')
    const testFile = path.join(testDir, 'test.js')

    beforeEach(() => {
      inspect.removeFile(testFile)
    })

    it('watch a dir for changes', (done) => {
      const superDir = new SuperFSDir(path.join(__dirname, '../tmp'))
      const fn = (changed, b, c) => {
        inspect(changed).hasProps({
          path: testDir,
          changeMode: 'rename'
        })

        done()
      }

      const res = superDir.watch(fn).then((dirs) => {
        inspect(dirs).isArray().hasLength(1)
        inspect.writeFile(testFile, 'foo')
      })

      inspect(res).isPromise()
    })
  })
})
