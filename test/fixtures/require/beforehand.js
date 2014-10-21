'use strict';

var chai = require('chai');
var assume = require('../../../lib/assume.js');


var timesAssertOfAssumeCalled = 0;
var timesAssertOfChaiCalled = 0;
var timesAssertionCatched = 0;


assume.chaiUse(function (chai, util) {

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {

        return function () {

            try {
                return originalAssert.apply(this, arguments);
            } catch (err) {
                timesAssertOfAssumeCalled += 1;
                throw err;
            }

        };

    });

});

chai.use(function (chai, util) {

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {

        return function () {

            try {
                return originalAssert.apply(this, arguments);
            } catch (err) {
                timesAssertOfChaiCalled += 1;
                throw err;
            }

        };

    });

});

try {
    assume('X').to.equal('Y');
} catch (err) {
    timesAssertionCatched += 1;
}

try {
    chai.expect('X').to.equal('Y');
} catch (err) {
    timesAssertionCatched += 1;
}

console.log('assume: ' + timesAssertOfAssumeCalled + ', chai: ' + timesAssertOfChaiCalled + ', catched: ' + timesAssertionCatched);
