'use strict';

var _ = require('lodash');


// Load chai freshly - so that tests which require chai get their independent instance!
var chai = (function () {

    function clearCache() {
        _(require.cache).keys().forEach(function (key) {
            delete require.cache[key];
        });
    }

    var temp = _.assign({}, require.cache);
    clearCache();

    var freshChai = require('chai');

    clearCache();
    _.assign(require.cache, temp);

    return freshChai;

})();


var invokeExpect;

// Assume.js is first and foremost a rebranding of chai.expect
function assume(val, message, context) {
    return invokeExpect(val, message, context);
}

function handleViolation(err, context) {
    console.log('Caught by assume.js!');
}

// Allow using chai plugins
assume.chaiUse = chai.use.bind(chai);
assume.chaiVersion = chai.version;

// By catching AssertionErrors assume.js is altering how unmet conditions are processed.
assume.chaiUse(function (chai, util) {

    invokeExpect = function (val, message, context) {

        // message is optional
        if (_.isString(message) === false) {
            context = message;
            message = undefined;
        }

        var assertion = chai.expect(val, message);

        util.flag(assertion, 'assume-context', context);

        return assertion;

    };

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {

        return function () {

            try {
                return originalAssert.apply(this, arguments);
            } catch (err) {
                handleViolation(err, util.flag(this, 'assume-context'));
            }

        };

    });

});

module.exports = assume;
