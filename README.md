# super-fs

Better filesystem support

```js
let SuperFS = require('super-fs');
SuperFS.readDir('foo/').then(files => {
  // Files is an array of files of `foo/`
});
```

#### Write file
```js
let SuperFS = require('super-fs');
SuperFS.writeFile('foo/bar.js', 'FooBar').then(files => {
  // Files is an array of files of `foo/`
});

// or

let file = SuperFS.file('foo/bar.js');
yield file.write('FooBar');
```
