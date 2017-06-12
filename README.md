# session-rethinkdb

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-image]][node-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][dependencies-image]][dependencies-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[![NPM][npm-image]][npm-url]

![downloads-url]

### [RethinkDB](http://rethinkdb.com/) session store for Express and Connect.

## Installation

```npm install session-rethinkdb```

## Usage

```JS
const r = require('rethinkdbdash')();
const session = require('express-session');
const RDBStore = require('session-rethinkdb')(session);

const store = new SessionStore(r, {
  browserSessionsMaxAge: 60000, // optional, default is 60000. After how much time should an expired session be cleared from the database
  clearInterval: 60000, // optional, default is 60000. How often do you want to check and clear expired sessions
});

app.use(session({
    // https://github.com/expressjs/session#options
    secret: 'keyboard cat',
		// Pass the store to express-session
    store: store,
		// This needs to be set for session-rethinkdb to work!
    resave: true,
    saveUninitialized: true
}));
```

> **Note:** The API has changed in v2.0.

Refer to the [example application](https://github.com/llambda/session-rethinkdb/blob/v2.0/example.js) for a full example.

[npm-version-image]: https://img.shields.io/npm/v/session-rethinkdb.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/session-rethinkdb.svg
[npm-image]: https://nodei.co/npm/session-rethinkdb.png?downloads=true&downloadRank=true&stars=true
[npm-url]: https://npmjs.org/package/session-rethinkdb
[travis-image]: https://img.shields.io/travis/llambda/session-rethinkdb/master.svg
[travis-url]: https://travis-ci.org/llambda/session-rethinkdb
[dependencies-image]: https://david-dm.org/llambda/session-rethinkdb.svg?style=flat
[dependencies-url]: https://david-dm.org/llambda/session-rethinkdb
[coveralls-image]: https://img.shields.io/coveralls/llambda/session-rethinkdb/master.svg
[coveralls-url]: https://coveralls.io/r/llambda/session-rethinkdb?branch=master
[node-image]: https://img.shields.io/node/v/session-rethinkdb.svg
[node-url]: http://nodejs.org/download/
[gitter-join-chat-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-channel-url]: https://gitter.im/llambda/session-rethinkdb
[express-session-url]: https://github.com/expressjs/session
[io-url]: https://iojs.org
[downloads-url]: https://nodei.co/npm-dl/session-rethinkdb.png?&months=6&height=3
