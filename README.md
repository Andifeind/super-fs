SuperFS
=======

[![Build Status](https://travis-ci.org/Andifeind/superfs.svg?branch=master)](https://travis-ci.org/Andifeind/superfs)

Better filesystem support for Node.js

## Dealing with files


```js
const SuperFS = require('super-fs')
const fl = SuperFS.file('foo/bar.json')

// read a file content.then(file => {
  // Files is an array of files of `foo/`
});
```

```js
const SuperFS = require('super-fs');
SuperFS.readDir('foo/').then(files => {
  // Files is an array of files of `foo/`
});
```

#### Read file
```js
const SuperFS = require('super-fs');
SuperFS.readFile('foo/bar.js', 'FooBar').then(content => {
  // content is an buffer
});

// or

const fl = SuperFS.file('foo/bar.js');
yield fl.write('FooBar');
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

#### Watch dir

```js
const SuperFS = require('super-fs');
SuperFS.watch('foo/bar.js', handlerFn).then(files => {
  // Files is an array of files of `foo/`
});

// or

const file = SuperFS.file('foo/bar.js');
yield file.watch(handlerFn);
