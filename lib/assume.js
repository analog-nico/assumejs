'use strict';

var _ = require('lodash');


// Load chai freshly - so that tests which require chai as well get their independent instance!
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

// Standard implementation to handle violated assumption
assume.handleViolation = function (err, context) {
    console.log('Caught by assume.js!');
};

// Allow using chai plugins to extend the assumption syntax
assume.chaiUse = chai.use.bind(chai);
assume.chaiVersion = chai.version;

// Assume.js is partly a chai plugin itstelf
assume.chaiUse(function (chai, util) {

    invokeExpect = function (val, message, context) {

        // message is optional
        if (_.isString(message) === false) {
            context = message;
            message = undefined;
        }

        var assertion = chai.expect(val, message);

        // The context is passed down the chain so it becomes available in assume.handleViolation(...)
        util.flag(assertion, 'assume-context', context);

        return assertion;

    };

    // By catching AssertionErrors assume.js is altering how unmet conditions are processed.
    chai.Assertion.overwriteMethod('assert', function (originalAssert) {

        return function () {

            try {
                return originalAssert.apply(this, arguments);
            } catch (err) {
                assume.handleViolation(err, util.flag(this, 'assume-context'));
            }

        };

    });

    // Hook to inject custom notification code
    assume.overwriteHandleViolation = function (fn) {
        util.overwriteMethod(this, 'handleViolation', fn);
    };

});

module.exports = assume;
