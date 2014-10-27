'use strict';

var assume = require('../../../lib/assume.js');
var path = require('path');


assume.overwriteNotify(function (_super) {

    return function (err, context) {

        // callsites
        var prepare_orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        var stack = err.stack;
        Error.prepareStackTrace = prepare_orig;

        console.error('Callsites report filename: ' + path.relative('.', stack[1].receiver.filename));

        // console
        _super(err, context);

    };

});


assume(true, { some: 'context' }).to.eql(false);
