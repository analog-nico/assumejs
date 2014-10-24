# Assume.js

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/analog-nico/assumejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/analog-nico/assumejs.svg?branch=master)](https://travis-ci.org/analog-nico/assumejs) [![Coverage Status](https://coveralls.io/repos/analog-nico/assumejs/badge.png)](https://coveralls.io/r/analog-nico/assumejs?branch=master) [![Dependency Status](https://david-dm.org/analog-nico/assumejs.svg)](https://david-dm.org/analog-nico/assumejs)

## What does it do?

**tl;dr:** Weave assumptions - like asserts in unit tests - into your production code and get notified once they are violated. And no, it is no excuse for lazy testers.

\~\~\~

Frankly, some functionality cannot be sufficiently tested before moving to production: Will we always meet our service level agreements? Our load tests certainly won't cover all real-world scenarios! What if a third party API changes suddenly? We couldn't possibly predict the exact change and write a test for it! This means, we will have production failures and there is nothing we can do to prevent those.

Assume.js provides a solution to close the gap between "We tested this." and "We just cannot test that." The idea is to weave assumptions - like asserts in unit tests - into the production code. If an assumption is violated the developers in charge will e.g. receive an e-mail so they can do something about it, hopefully even before the user notices the error or gets annoyed.

I did not reinvent the wheel. Assume.js is a clever combination of [Chai](http://chaijs.com)'s "expect" syntax to formulate assumptions and a hook to handle the notification on violated assumptions. With this hook you can go as far as [integrating error management cloud services](#how-do-i-get-notified-like-a-boss).

## Supported Platforms

Available today:

- Node.js (0.10 and 0.11)

In the future:

- Major browsers
  (With < 100 LOC and all dependencies available for the browser it is probably just a two day job to make it happen. Also, many error management cloud services already provide a browser-compatible library to access their API.)
- Other server runtimes
  (Please let me know if you implemented a clone in another language. Chai recommends [Konacha](https://github.com/jfirebaugh/konacha) as an alternative for Ruby on Rails. Most error management cloud services already provide SDKs for major platforms. If you are a Java developer you might also want to look into [Takipi](https://www.takipi.com).)

## Performance

Will the assumptions slow down your system? I wrote a [test](test/performance.js) and executed it on my MacBook Air with node.js v0.10.32:

```
Executing 40000 assumptions took 669 ms. That is 16.725 µs per assumption.
```

## Installation

[![NPM Stats](https://nodei.co/npm/assumejs.png?downloads=true)](https://npmjs.org/package/assumejs)

The module for node.js is installed via npm:

``` bash
$ npm install assumejs --save
```

## Writing Assumptions

Assume.js is basically a renaming of [Chai](http://chaijs.com)'s `expect()`. That means you can apply your working knowledge or [read the docs](http://chaijs.com/api/bdd/) and just use "assume" instead of "expect". E.g.:

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

### Extending the Assumption Syntax

Chai was designed with high extensibility in mind and many [plugins](http://chaijs.com/plugins) are already available.

Assume.js exposes Chai's plugin hook:

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

To get started read chai's docs on the [core concepts](http://chaijs.com/guide/plugins/) and how to [build a helper](http://chaijs.com/guide/helpers/).

**Caution:** If you install an existing plugin or write your own you have to obey one rule: Any assertion must be executed through `chai.Assertion.assert(...)`. Assume.js overwrites this method in order to not throw an error if an assumption is violated and to invoke the notification handler instead. If the plugin throws its own errors instead of calling the assert method the production code will crash!

## How do I get notified of violated assumptions?

Out-of-the-box assume.js just logs a violated assumption to the console. You can easily write your own handler that gets called for each violated assumption like this:

``` js
var assume = require('assumejs');

assume.overwriteNotify(function (_super) {

  // The function returned will be called once an assumption gets violated.
  // err - The error that Chai throws
  // context - The object/array that is optionally passed to assume()
  return function (err, context) {

    // You may or may not call the previously registered handler.
	// This allows stacking multiple handlers on top of each other if you wish to do so.
    _super(err, context);

	// Do whatever you like.
	// E.g. calling on of the services listed in the next section.

  };

});
```

The error that Chai throws is caught by assume.js and passed to the handler. It actually is a standardized `AssertionError`. For details see the ['assertion-error' module](https://www.npmjs.org/package/assertion-error).

## How do I get notified like a boss?

The first time a certain assumption is violated you want to get notified immediately. However, if it occurs repeatedly you don't want to get spammed by those notifications until you fix your code. Also, you might tolerate a certain violation to occur from time to time but want to get notified if the violation suddenly occurs more frequently. For that you may ask for a sophisticated error management system. Here is a list of those I know of:

| Service                                   | No money?          | Integration                                                                | Getting Started |
|-------------------------------------------|--------------------|----------------------------------------------------------------------------|-----------------|
| [Airbrake](https://airbrake.io)           |                    | npm install [airbrake](https://www.npmjs.org/package/airbrake)             | Gists welcome   |
| [App Enlight](https://appenlight.com)     | offers a free plan | service endpoint is [Airbrake-compatible](https://appenlight.com/page/airbrake/compatible-exception-logging) | [Gist](https://gist.github.com/analog-nico/cbd45205011e810be855) |
| [Bugsnag](https://bugsnag.com)            |                    | npm install [bugsnag](https://www.npmjs.org/package/bugsnag)               | Gists welcome   |
| [Errbit](http://errbit.github.io/errbit/) | host yourself      | service endpoint is [Airbrake-compatible](http://errbit.github.io/errbit/) | Gists welcome   |
| [Honeybadger](https://www.honeybadger.io) |                    | npm install [honeybadger](https://www.npmjs.org/package/honeybadger)       | Gists welcome   |
| [Raygun](https://raygun.io)               |                    | npm install [raygun](https://www.npmjs.org/package/raygun)                 | Gists welcome   |
| [Rollbar](https://rollbar.com)            | offers a free plan | npm install [rollbar](https://www.npmjs.org/package/rollbar)               | [Gist](https://gist.github.com/analog-nico/cfec6ebf59f9cdce33a6) |
| [Stackify](http://www.stackify.com)       |                    | call their REST api                                                        | Gists welcome   |

## The Second Use Case

Assume you want to store your data in your MongoDB:

``` js
collection.update(
  { id: 42 },
  { soda: 'and what not' },
  { upsert: true },
  function (err, doc) {
    if (err) {
      // ???
    }
  });
```

Now assume you properly tested your code and it is working. The only reasons I can think of that an error occurs is (1) your code contains a bug - which is kinda unlikely because you wrote enough tests - and (2) MongoDB is down - which is also unlikely because you chose a reliable hoster. This means it would make no sense to write extensive error recovery code at this point. It is more effective to get notified if an error actually occurs and then decide if it is worth the effort to implement some intelligent error handling.

Of course one assume.js call will make your day:

``` js
function (err, doc) {
  if (err) {
    assume.notify(err); // This is the same hook that assumptions use.
  }
}
```

## Be responsible!

Assume.js is just one safety net of many you shall apply. Writing assumptions does not let you off the hook implementing proper error handling. I highly recommend Joyent's article about [error handling in node.js](https://www.joyent.com/developers/node/design/errors). Speaking in their terms it is best to focus on writing assumptions for "operational errors". For those of which you understand well you can and should write code to recover from them. Those of which you don't understand well you should write assumptions that help you get a better understanding through their notifications - but in the meantime it is probably a good choice to intentionally crash your server as you would do for "programmer errors".

When intentionally crashing your system because of an error you can't handle, you probably will want to get notified like for violated assumptions. Therefore add the following code to your main file:

``` js
var assume = require('assumejs');

process.on('uncaughtException', function (err) {
  var context = { type: 'uncaughtException' }; // Or whatever you would like to pass with the notification.
  assume.notify(err, context);                 // This is the same hook that assumptions use.
  throw err;                                   // So that you actually crash your server.
});
```

If you use one of the modules for the services [listed above](#how-do-i-get-notified-like-a-boss) please look into their API. Some already provide a mechanism for handling uncaught exceptions that might be preferable.

## Contributing

What would you like to contribute?

- **Extending the assumption syntax**
  Usually an extension will not only be helpful for assume.js users but also for Chai-based unit tests. Your contribution will be maximized if you write a Chai plugin and [use it with assume.js](#extending-the-assumption-syntax).
  Please let me know about your Chai plugins and I will compile a recommendation list. If you happen to implement a plugin that most assume.js users would use anyway I might bundle it with assume.js by default.
- **Adding a new way to notify about violated assumptions**
  If you implemented a few lines to integrate e.g. a service that is listed above feel free to publish a Gist. I will add a link in this README.
  However, if you implement some more sophisticated notification code - I would be blown away if someone used [Stackman](https://github.com/watson/stackman) - I suggest you write a node module that uses 'assumejs' as a dependency. Ideally you would name it with a 'assumejs-' prefix. Anyway please let me now and I will put up a link.
- **Extending assume.js' core**
  Pull requests are welcome. Just set up your dev environment as described below and your are ready to go.

### Set up Your Development Environment for Assume.js

1. Clone the repo to your desktop,
2. in the shell `cd` to the main folder,
3. hit `npm install`,
4. hit `npm install gulp -g` if you haven't installed gulp globally yet, and
5. run `gulp dev`. (Or run `node ./node_modules/.bin/gulp dev` if you don't want to install gulp globally.)

`gulp dev` watches all source files and if you save some changes it will lint the code and execute all tests. The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

If you want to debug a test you should use `gulp test-without-coverage` to run all tests without obscuring the code by the test coverage instrumentation.

## Change History

- v0.2.0 (2014-10-24)
	- **Breaking Changes:**
		- Renamed `assume.overwriteHandleViolation(...)` into `assume.overwriteNotify(...)`
		- Renamed `assume.handleViolation(...)` into `assume.notify(...)`
- v0.1.0 (2014-10-23)
	- Initial version

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.