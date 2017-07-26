SuperFS
=======

[![Build Status](https://travis-ci.org/Andifeind/superfs.svg?branch=master)](https://travis-ci.org/Andifeind/superfs)

Better filesystem support for Node.js

```js
const SuperFS = require('super-fs');
SuperFS.readDir('foo/').then(files => {
  // Files is an array of files of `foo/`
});
```

#### Write file
```js
const SuperFS = require('super-fs');
SuperFS.writeFile('foo/bar.js', 'FooBar').then(files => {
  // Files is an array of files of `foo/`
});

// or

const file = SuperFS.file('foo/bar.js');
yield file.write('FooBar');
```

#### Copy dir

```js
SuperFS.copyDir('foo/', 'bar/').then(files => {
  // Files is an array of files of `foo/`
});
```
