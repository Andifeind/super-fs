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

  describe('stat()', () => {
    it('should return fileinfos for a file', () => {
      const file = path.join(__dirname, '../package.json')
      const fsStat = FSTools.stat(file)
      inspect(fsStat).isPromise()

      return fsStat.then((res) => {
        inspect(res).isObject()
        inspect(res.isDirectory()).isFalse()
        inspect(res.isFile()).isTrue()
      })
    })

    it('should return fileinfos for a dir', () => {
      const file = path.join(__dirname, '../examples')
      const fsStat = FSTools.stat(file)
      inspect(fsStat).isPromise()

      return fsStat.then((res) => {
        inspect(res).isObject()
        inspect(res.isDirectory()).isTrue()
        inspect(res.isFile()).isFalse()
      })
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

  describe('readDir()', () => {
    it('should read a dir', () => {
      const dir = path.join(__dirname, '../examples')
      const fsDir = FSTools.readDir(dir)
      inspect(fsDir).isPromise()

      return fsDir.then((res) => {
        inspect(res).isEql([
          'piglet.jpg',
          'sub',
          'test.json'
        ])
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
    before(() => {
      return FSTools.createDir(path.join(__dirname, '../tmp'), {
        silent: true
      })
    })

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

  describe('createFilterPattern()', () => {
    const testFilters = []
    testFilters.push({ str: '*.js', reg: /(.+\.js$)/, negated: true })
    testFilters.push({ str: ['*.js'], reg: /(.+\.js$)/, negated: true })
    testFilters.push({ str: ['*.js', '*.json'], reg: /(.+\.js$)|(.+\.json$)/, negated: true })

    testFilters.forEach((filter) => {
      it(`should return a regexp from filter ${filter.str}`, () => {
        const reg = FSTools.createFilterPattern(filter.str)
        inspect(reg).isEql(filter.reg)
    })
  })

  describe('createFileMatch', () => {
    const pattern = [
      { pat: '*.js', reg: /([^/]+\.js$)/ },
      { pat: 'foo/bar/bla.js', reg: /(foo\/bar\/bla\.js$)/ },
      { pat: '**/*.js', reg: /(.+\/[^/]+\.js$)/ },
      { pat: 'test/**/*.js', reg: /(test\/.+\/[^/]+\.js$)/ }
    ]

    pattern.forEach((test) => {
      it(`returns a file pattern reg exp from ${test.pat}`, () => {
        const pat = FSTools.createFileMatch(test.pat)
        inspect(pat).isEql(test.reg)
      })
    })
  })
})
