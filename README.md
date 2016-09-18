# uri-change-observer

[![Build Status](https://travis-ci.org/samuelcampos/uri-change-observer.svg?branch=master)](https://travis-ci.org/samuelcampos/uri-change-observer)
[![NPM version](http://img.shields.io/npm/v/uri-change-observer.svg)](https://www.npmjs.com/package/uri-change-observer)


Observe changes on web resources. This package enables you to register a callback method to be notified when the result of a given HTTP request changes.


## Installation

You can install using [npm](https://www.npmjs.com/package/uri-change-observer).

```
npm install uri-change-observer
```

## Usage example

```javascript
var URIObservable = require('uri-change-observer');

var httpOptions = {
    host: 'samuelcampos.net',
    port: '80',
    path: '/',
    method: 'GET'
};
var observable = new URIObservable();
observable.addObserver(httpOptions, function changeCallback (newData) {
    console.log('The web page has changed!', newData);
})
```

