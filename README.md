# Assume.js

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/analog-nico/assumejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/analog-nico/assumejs.svg?branch=master)](https://travis-ci.org/analog-nico/assumejs) [![Coverage Status](https://coveralls.io/repos/analog-nico/assumejs/badge.png)](https://coveralls.io/r/analog-nico/assumejs?branch=master) [![Dependency Status](https://david-dm.org/analog-nico/assumejs.svg)](https://david-dm.org/analog-nico/assumejs)

Assume your **node.js** production server won't fail. And get notified if you were wrong.

## What does it do?

Description forthcoming.

## Installation

Description forthcoming.

## Writing Assumptions

Assume.js is basically a renaming of [chai](http://chaijs.com)'s `expect()`. That means you can apply your working knowledge or [read the docs](http://chaijs.com/api/bdd/) and just use 'assume' instead of 'expect'. E.g.:

``` js
var expect = require('chai').expect;

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.length(3);
expect(tea).to.have.property('flavors')
  .with.length(3);


var assume = require('assumejs');

assume(foo).to.be.a('string');
assume(foo).to.equal('bar');
assume(foo).to.have.length(3);
assume(tea).to.have.property('flavors')
  .with.length(3);
```

**The main difference**, however, is that assume.js does not throw an error if an assumption is violated. Instead it invokes the [notification on violated assumptions](#how-do-i-get-notified-of-violated-assumptions).

Additionally, the signature of `assume()` was extended:

### assume(obj, [message], [context])

- **@param** _{ Mixed }_ obj
- **@param** _{ String }_ message \_optional\_
- **@param** _{ Object | Array }_ context \_optional\_

```js
assume(foo, 'my message').to.equal('bar');
// is identical to:
expect(foo, 'my message').to.equal('bar');
// which adds the message to the error if the expectation fails.

assume(foo, { data: 'Hello world!' }).to.equal('bar');
// forwards { data: 'Hello world!' } to the notification handler if the assumption is violated
// and invokes:
expect(foo).to.equal('bar');

// All can be combined:
assume(foo, 'my message', { data: 'Hello world!' }).to.equal('bar');
```

TODO:
- Add never chain which is an alias for .not
- assume().never.happens()

### Extending the Assumption Syntax

Chai was designed with high extensibility in mind and many [plugins](http://chaijs.com/plugins) are already available.

Assume.js exposes chai's plugin hook:

``` js
// Chai users are used to:
var chai = require('chai');

chai.use(function (_chai, utils) {
	// Write your plugin code here.
});

// This is identical in assume.js:
var assume = require('assumejs');

assume.chaiUse(function (_chai, utils) {
	// Write your plugin code here.
});
```

Read chai's docs on the [core concepts](http://chaijs.com/guide/plugins/) and how to [build a helper](http://chaijs.com/guide/helpers/) to get started.

**Caution:** If you install an existing plugin or write your own you have to obey one rule: Any assertion must be executed through `chai.Assertion.assert(...)`. Assume.js overwrites this method in order to not throw an error if an assumption is violated and to invoke the notification handler instead.

## How do I get notified of violated assumptions?

Description forthcoming.

## How do I get notified like a boss?

The first time a certain assumption is violated you want to get notified immediately. However, if it occurs repeatedly you don't want to get spammed by those notifications until you fix your code. Also, you might tolerate a certain violation to occur from time to time but want to get notified if the violation suddenly occurs more frequently. For that you may ask for a sophisticated error management system. Here is a list of those I know of:

| Service                                   | No money?          | Integration                                                                | Getting Started |
|-------------------------------------------|--------------------|----------------------------------------------------------------------------|-----------------|
| [Airbrake](https://airbrake.io)           |                    | npm install [airbrake](https://www.npmjs.org/package/airbrake)             | Gists welcome   |
| [App Enlight](https://appenlight.com)     | offers a free plan | service endpoint is [Airbrake-compatible](https://appenlight.com/page/airbrake/compatible-exception-logging) | Gists welcome   |
| [Bugsnag](https://bugsnag.com)            |                    | npm install [bugsnag](https://www.npmjs.org/package/bugsnag)               | Gists welcome   |
| [Errbit](http://errbit.github.io/errbit/) | host yourself      | service endpoint is [Airbrake-compatible](http://errbit.github.io/errbit/) | Gists welcome   |
| [Honeybadger](https://www.honeybadger.io) |                    | npm install [honeybadger](https://www.npmjs.org/package/honeybadger)       | Gists welcome   |
| [Raygun](https://raygun.io)               |                    | npm install [raygun](https://www.npmjs.org/package/raygun)                 | Gists welcome   |
| [Rollbar](https://rollbar.com)            | offers a free plan | npm install [rollbar](https://www.npmjs.org/package/rollbar)               | Gists welcome   |
| [Stackify](http://www.stackify.com)       |                    | call their REST api                                                        | Gists welcome   |

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.