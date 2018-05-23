'use strict'

const fs = require('fs')

class FSTools {
  static exists (file) {
    return new Promise((resolve, reject) => {
      fs.access(file, (err) => {
        resolve(!err)
      })
    })
  }

  static createPathArray (dir) {
    const arr = []
    const dirs = dir.substr(1).split(/\//g)
    arr.push(`/${dirs.shift()}`)
    for (const d of dirs) {
      arr.push(`${arr[arr.length - 1]}/${d}`)
    }

    return arr
  }

  static stat (file) {
    return new Promise((resolve, reject) => {
      fs.lstat(file, (err, stat) => {
        if (err) return reject(err)
        resolve(stat)
      })
    })
  }

  static createDir (dir, opt) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, opt, (err) => {
        if (err && opt && !opt.silent) return reject(err)
        resolve(dir)
      })
    })
  }

  static readDir (dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, dirs) => {
        if (err) return reject(err)
        resolve(dirs)
      })
    })
  }

  static removeDir (dir) {
    return new Promise((resolve, reject) => {
      fs.rmdir(dir, (err) => {
        if (err) return reject(err)
        resolve(dir)
      })
    })
  }

  static readFile (file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, source) => {
        if (err) return reject(err)
        resolve(source)
      })
    })
  }

  static writeFile (file, content, opt) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, content, opt, (err, source) => {
        if (err) return reject(err)
        resolve(source)
      })
    })
  }

  static removeFile (file) {
    return new Promise((resolve, reject) => {
      fs.unlink(file, (err) => {
        if (err) return reject(err)
        resolve(file)
      })
    })
  }

  static createFilterPattern (filter) {
    if (!filter) {
      return null
    }

    if (!Array.isArray(filter)) {
      filter = [filter]
    }

    return new RegExp('(' + filter.map((item) => {
      return item
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.+')
        .replace(/$/, '$')
    }).join(')|(') + ')')
  }
}

module.exports = FSTools
