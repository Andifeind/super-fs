'use strict'

const fs = require('fs')
const path = require('path')

const mkdir = require('./mkdir')

class SuperFSFile {
  constructor (file) {
    if (/^\.\.?/.test(file)) {
      file = path.resolve(path.dirname(module.parent.parent.filename), file)
    }

    this.path = file
  }

  create () {
    return new Promise((resolve, reject) => {
      fs.lstat(this.path, (err, stat) => {
        if (err) {
          return reject(err)
        }

        resolve(Object.assign(this, {
          name: path.basename(this.path),
          dir: path.dirname(this.path),
          ext: path.extname(this.path).substr(1),
          isFile: stat.isFile(),
          isDir: stat.isDirectory(),
          isLink: stat.isSymbolicLink(),
          isBlockDevice: stat.isBlockDevice(),
          isCharDevice: stat.isCharacterDevice(),
          isFIFO: stat.isFIFO(),
          isSocket: stat.isSocket()
        }, stat))
      })
    })
  }

  /**
   * Reads a file
   *
   * @method read
   * @param {string} [encoding=utf8] Changes encoding.
   *
   * @returns Returns a promise with a source buffer as its first argument
   * @arg {object} source File content as a buffer
   */
  read (encoding) {
    let opts = {
      encoding: encoding || 'utf8'
    }

    return new Promise((resolve, reject) => {
      fs.readFile(this.path, opts, function (err, source) {
        if (err) {
          return reject(err)
        }

        resolve(source)
      })
    })
  }

  /**
   * Writes a file
   *
   * @param {string} File content
   * @param {object} Options object
   *
   * @returns {object} Returns a promise
   * @arg {object} SuperFSFile object
   */
  write (content, opts) {
    opts = Object.assign({
      mode: 0o644
    }, opts || {})

    return new Promise((resolve, reject) => {
      mkdir(path.dirname(this.path), (err) => {
        if (err) {
          return reject(err)
        }

        fs.writeFile(this.path, content, opts, (err) => {
          if (err) {
            return reject(err)
          }

          this.create().then(resolve).catch(reject)
        })
      })
    })
  }

  append (content, opts) {
    opts = Object.assign({
      mode: 0o644
    }, opts || {})

    return new Promise((resolve, reject) => {
      fs.appendFile(this.path, content, opts, function (err, source) {
        if (err) {
          return reject(err)
        }

        resolve(this)
      })
    })
  }

  exists () {
    return new Promise((resolve, reject) => {
      fs.access(this.path, function (err) {
        if (err) {
          return resolve(false)
        }

        resolve(true)
      })
    })
  }

  readJSON (encoding) {
    let read = this.read(encoding)
    return read.then(source => {
      return JSON.parse(source)
    })
  }

  writeJSON (json) {
    return this.write(JSON.stringify(json, null, '  '))
  }
}

module.exports = SuperFSFile
