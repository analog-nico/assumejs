'use strict';

var assume = require('../../../lib/assume.js');


assume(true, { some: 'context' }).to.eql(false);

assume.notify(new Error('test'));
