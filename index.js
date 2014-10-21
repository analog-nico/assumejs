'use strict';

var chai = require('chai');


// Assume.js is first and foremost a rebranding of chai.expect
function assume(val, message) {
    return chai.expect(val, message);
}

// Allow using chai plugins
assume.chaiUse = chai.use.bind(chai);
assume.chaiVersion = chai.version;

// By catching AssertionErrors assume.js is altering how unmet conditions are processed.
assume.chaiUse(function (chai, util) {

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {

        return function () {

            try {
                return originalAssert.apply(this, arguments);
            } catch (err) {
                console.log('Caught by assume.js!');
                throw err;
            }

        }

    });

});

modules.exports = assume;
