'use strict'

const fs = require('fs')
const path = require('path')

const co = require('co')
const SuperFSFile = require('./file')
const FSTools = require('./FSTools')
const mkdir = require('./mkdir')

class SuperFSDir {
  constructor (dirname) {
    if (/^\.\.?/.test(dirname)) {
      dirname = path.resolve(path.dirname(module.parent.parent.filename), dirname)
    }

    this.path = dirname
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
  read (opts) {
    opts = opts || {}
    opts = Object.assign({
      encoding: 'utf8',
      recursive: false,
      relativePath: ''
    }, opts)

    return co(function * () {
      const outFiles = []
      const rawFiles = yield FSTools.readDir(this.path)

      for (const file of rawFiles) {
        const filepath = path.join(this.path, file)
        const stat = yield FSTools.stat(filepath)

        if (stat.isDirectory()) {
          const dir = new SuperFSDir(filepath)
          yield dir.create()

          dir.relative = opts.relativePath ? `${opts.relativePath}/${dir.name}` : dir.name
          outFiles.push(dir)
          if (opts.recursive) {
            const subFiles = yield dir.read(Object.assign({}, opts, {
              relativePath: opts.relativePath ? `${opts.relativePath}/${file}` : file
            }))

            subFiles.forEach(s => outFiles.push(s))
          }
        } else {
          const fl = new SuperFSFile(filepath, {
            encoding: opts.encoding
          })
          yield fl.create()
          fl.relative = opts.relativePath ? `${opts.relativePath}/${fl.name}` : fl.name
          outFiles.push(fl)
        }
      }

      return outFiles
    }.bind(this))
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

  mkdir (dir, opts) {
    return co(function * () {
      const dirs = FSTools.createPathArray(dir)

      for (const d of dirs) {
        if (yield FSTools.exists(d)) {
          continue
        }

        yield FSTools.createDir(d, opts)
      }
    })
  }

  copy (dest, opts) {
    if (opts === true) {
      opts = {
        recursive: true,
        overwrite: false
      }
    }

    opts = opts || {
      recursive: false,
      overwrite: false
    }

    return co(function * () {
      if (!(yield FSTools.exists(dest))) {
        yield this.mkdir(dest)
      }

      const files = yield this.read({
        recursive: true
      })

      for (const fl of files) {
        const destFile = path.join(dest, fl.relative)
        if (fl.isDir) {
          yield this.mkdir(destFile, opts.dirMode || fl.mode)
        } else {
          const data = yield FSTools.readFile(fl.path)
          const targetExists = yield FSTools.exists(destFile)
          fl.fileExists = targetExists
          fl.fileOverwritten = !!opts.overwrite
          if (!targetExists || opts.overwrite) {
            yield FSTools.writeFile(destFile, data, {
              mode: opts.fileMode || fl.mode
            })
          }
        }
      }

      // console.log('RETURN FILES', files)
      return files
    }.bind(this))
  }

  delete () {
    return co(function * () {
      const files = yield this.read({
        recursive: true
      })

      const sortedFiles = files.sort((a, b) => a.isDir ? 1 : -1)
      for (const fl of sortedFiles) {
        if (fl.isDir) {
          yield FSTools.removeDir(fl.path)
        } else {
          yield FSTools.removeFile(fl.path)
        }
      }

      return sortedFiles
    }.bind(this))
    // return new Promise((resolve, reject) => {
    //   this.read({
    //     recursive: true
    //   }).then((files) => {
    //     Promise.all(files.sort((a, b) => a.isDir ? 1 : -1).map((fl) => {
    //       return new Promise((innerResolve, innerReject) => {
    //         if (fl.isDir) {
    //           fs.rmdir(fl.path, (err) => {
    //             if (err) {
    //               throw err
    //             }
    //
    //             innerResolve(fl)
    //           })
    //         } else {
    //           fs.unlink(fl.path, (err, data) => {
    //             if (err) {
    //               throw err
    //             }
    //
    //             innerResolve(fl)
    //           })
    //         }
    //       })
    //     })).then(resolve).catch(reject)
    //   }).catch(reject)
    // })
  }
}

module.exports = SuperFSDir
