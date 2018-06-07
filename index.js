'use strict'

const mkdir = require('./libs/mkdir')
const SuperFSFile = require('./libs/file')
const SuperFSDir = require('./libs/dir')

class SuperFS {
  constructor (path) {
    this.path = path
  }

  readDir (dir, options) {
    return new SuperFSDir(dir).read(options)
  }

  writeFile (content, opts) {
    const file = new SuperFSFile(this.path)
    return file.write(content, opts)
  }

  createDir () {
    return new Promise((resolve, reject) => {
      mkdir(this.path, err => {
        if (err) {
          return reject(err)
        }

        resolve(true)
      })
    })
  }

  static getFilterPattern (pattern) {
    let filters = {
      files: [],
      dirs: []
    }

    if (!Array.isArray(pattern)) {
      pattern = [pattern]
    }

    for (let file of pattern) {
      if (file.endsWith('/')) {
        filters.dirs.push(file.replace(/\//, '\\/') + '$')
      } else {
        let reg = file
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.+')

        filters.files.push(reg + '$')
      }
    }

    if (filters.dirs) {
      filters.dirs = new RegExp('(' + filters.dirs.join(')|(') + ')')
    }

    if (filters.files) {
      filters.files = new RegExp('(' + filters.files.join(')|(') + ')')
    }

    return filters
  }
}

module.exports = function (filePath) {
  return new SuperFS(filePath)
}

module.exports.file = function (filePath) {
  return new SuperFSFile(filePath)
}

module.exports.readDir = function (dir, opt) {
  return new SuperFSDir(dir).read(opt)
}

module.exports.readFile = function (file, content, opt) {
  return new SuperFSFile(file).read(content, opt)
}

module.exports.writeFile = function (file, content, opt) {
  return new SuperFSFile(file).write(content, opt)
}

module.exports.createDir = function (dir) {
  return new SuperFS(dir).createDir()
}

module.exports.copyDir = function (src, dest, opt) {
  return new SuperFSDir(src).copy(dest, opt)
}

module.exports.deleteDir = function (dir) {
  return new SuperFSDir(dir).delete()
}

module.exports.getFilter = function (filters) {
  let filter = SuperFS.getFilterPattern(filters)
  return {
    filterFiles (file) {
      return filter.files.test(file)
    },
    filterDirs (dir) {
      return filter.dirs.test(dir)
    }
  }
}

module.exports.watch = function (dir, opts, fn) {
  const fl = new SuperFSDir(dir)
  return fl.watch(opts, fn)
}
