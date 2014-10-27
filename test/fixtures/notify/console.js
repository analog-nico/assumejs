'use strict';

var assume = require('../../../lib/assume.js');


assume.notify(new Error('test'));
assume(true, { some: 'context' }).to.eql(false);
