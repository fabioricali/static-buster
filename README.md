<div align="center">
<h1>staticbuster</h1>
Cache buster for static resources in HTML pages.
<br/><br/>
<a href="https://travis-ci.org/fabioricali/staticbuster" target="_blank"><img src="https://travis-ci.org/fabioricali/staticbuster.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
</div>

## Installation

### Node.js
```
npm install staticbuster --save
```

Imagine this scenario:

**index.html**

```html
<!DOCTYPE html>
    <html>
        <head>
            <script src="res/html2canvas.js"></script>
            <link rel="stylesheet" href="res/colpick.css">   
```

You may have cache problems! staticbuster adds a cache buster for each resource. For example:

```html
            <script src="res/html2canvas.js?_sb=1512833988607"></script>
            <link rel="stylesheet" href="res/colpick.css?_sb=1512833988607">   
```

## Usage

```javascript
const staticbuster = require('staticbuster');

staticbuster({
    file: 'path/index.html'
})
.then(() => console.log('ok'))
.catch(err => console.err(err));
```


### Options

Name | Type | Default | Description
-|-|-|-
file | string or array of string |  | File(s) to process
dest | string |  | Optional, file destination
busterParam | string | _sb | Optional, buster param
busterValue | string | timestamp | Optional, buster value
saveCopy | boolean | true | Optional, save a copy

### CLI
```
$ staticbuster --help

  Options:

    -V, --version              output the version number
    -f, --file <fileName>      file to process
    -d, --dest [destination]   optional file destination
    -b, --saveCopy [boolean]   optional save a copy
    -p, --busterParam [param]  optional buster param, default is _sb
    -v, --busterValue [value]  optional buster value, default is the timestamp
    -h, --help                 output usage information

```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/fabioricali/staticbuster/blob/master/CHANGELOG.md">here</a>

## License
staticbuster is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>