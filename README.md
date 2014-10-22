# Assume.js

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/analog-nico/assumejs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/analog-nico/assumejs.svg?branch=master)](https://travis-ci.org/analog-nico/assumejs) [![Coverage Status](https://coveralls.io/repos/analog-nico/assumejs/badge.png)](https://coveralls.io/r/analog-nico/assumejs?branch=master) [![Dependency Status](https://david-dm.org/analog-nico/assumejs.svg)](https://david-dm.org/analog-nico/assumejs)

Assume your **node.js** production server won't fail. And get proofed wrong by notifications.

## What does it do?

Description forthcoming.

## Installation

Description forthcoming.

## Configuration

Description forthcoming.

- assume.options()

## Writing Assumptions

Description forthcoming.

- assume.never.happens()
- assume().to.eql().otherwise.disclose()

## How do I get notified of violated assumptions?

Description forthcoming.

## How do I get notified like a boss?

The first time a certain assumption is violated you want to get notified immediately. However, if it occurs repeatedly you don't want to get spammed by those notifications until you fix your code. Also, you might tolerate a certain violation to occur from time to time but want to get notified if the violation suddenly occurs more frequently. For that you may ask for a sophisticated error management system. Here is a list of those I know of:

| Service                                   | No money?          | Integration                                                                |
|-------------------------------------------|--------------------|----------------------------------------------------------------------------|
| [Airbrake](https://airbrake.io)           |                    | npm install [airbrake](https://www.npmjs.org/package/airbrake)             |
| [App Enlight](https://appenlight.com)     | offers a free plan | service endpoint is [Airbrake-compatible](https://appenlight.com/page/airbrake/compatible-exception-logging) |
| [Bugsnag](https://bugsnag.com)            |                    | npm install [bugsnag](https://www.npmjs.org/package/bugsnag)               |
| [Errbit](http://errbit.github.io/errbit/) | host yourself      | service endpoint is [Airbrake-compatible](http://errbit.github.io/errbit/) |
| [Honeybadger](https://www.honeybadger.io) |                    | npm install [honeybadger](https://www.npmjs.org/package/honeybadger)       |
| [Raygun](https://raygun.io)               |                    | npm install [raygun](https://www.npmjs.org/package/raygun)                 |
| [Rollbar](https://rollbar.com)            | offers a free plan | npm install [rollbar](https://www.npmjs.org/package/rollbar)               |
| [Stackify](http://www.stackify.com)       |                    | call their REST api                                                        |

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.