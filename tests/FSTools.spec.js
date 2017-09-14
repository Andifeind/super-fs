const path = require('path')

const inspect = require('inspect.js')
const sinon = require('sinon')
inspect.useSinon(sinon)

const FSTools = require('../libs/FSTools')

describe('FSTools', () => {
  describe('createPathArray', () => {
    it('should return an array of paths', () => {
      const arr = FSTools.createPathArray('/tmp/foo/bar/bla')
      inspect(arr).isEql([
        '/tmp',
        '/tmp/foo',
        '/tmp/foo/bar',
        '/tmp/foo/bar/bla'
      ])
    })
  })

  describe('createDir()', () => {
    it('should create a dir', () => {
      const dir = path.join(__dirname, './tmp')
      const fsDir = FSTools.createDir(dir)
      inspect(fsDir).isPromise()

      return fsDir.then((res) => {
        inspect(dir).isDirectory()
      })
    })
  })

  describe('removeDir()', () => {
    it('should remove a dir', () => {
      const dir = path.join(__dirname, './tmp')
      const fsDir = FSTools.removeDir(dir)
      inspect(fsDir).isPromise()

      return fsDir.then((res) => {
        inspect(dir).isNotDirectory()
      })
    })
  })

  describe('exists()', () => {
    it('should check if a file exists', () => {
      const exists = FSTools.exists(path.join(__dirname, 'FSTools.spec.js'))
      inspect(exists).isPromise()

      return exists.then((res) => {
        inspect(res).isTrue()
      })
    })

    it('should check if a dir exists', () => {
      const exists = FSTools.exists(__dirname)
      inspect(exists).isPromise()

      return exists.then((res) => {
        inspect(res).isTrue()
      })
    })

    it('should check if a file doesn\'t exists', () => {
      const exists = FSTools.exists(path.join(__dirname, 'notFound.spec.js'))
      inspect(exists).isPromise()

      return exists.then((res) => {
        inspect(res).isFalse()
      })
    })

    it('should check if a dir doesn\'t exists', () => {
      const exists = FSTools.exists(path.join(__dirname, 'notFound'))
      inspect(exists).isPromise()

      return exists.then((res) => {
        inspect(res).isFalse()
      })
    })
  })

  describe('readFile()', () => {
    it('should read a file', () => {
      const file = path.join(__dirname, '../package.json')
      const fsFile = FSTools.readFile(file)
      inspect(fsFile).isPromise()

      return fsFile.then((data) => {
        inspect(data.toString()).doesContain('"superfs"')
      })
    })
  })

  describe('writeFile()', () => {
    it('should write a file', () => {
      const file = path.join(__dirname, '../tmp/test.json')
      const fsFile = FSTools.writeFile(file, '{ "foo": "bar" }')
      inspect(fsFile).isPromise()

      return fsFile.then(() => {
        inspect(require(file)).isEql({
          foo: 'bar'
        })
      })
    })
  })

  describe('removeFile()', () => {
    it('should remove a file', () => {
      const file = path.join(__dirname, '../tmp/test.json')
      const fsFile = FSTools.removeFile(file)
      inspect(fsFile).isPromise()

      return fsFile.then(() => {
        inspect(file).isNotFile()
      })
    })
  })
})
