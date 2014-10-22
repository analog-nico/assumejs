'use strict';

var assume = require('../../../lib/assume.js');
var chai = require('chai');


var timesAssertOfAssumeCalled = 0;
var timesAssertOfChaiCalled = 0;
var timesAssertionCatched = 0;


assume.chaiUse(function (chai, util) {

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {
        return function () {
            timesAssertOfAssumeCalled += 1;
            return originalAssert.apply(this, arguments);
        };
    });

});

chai.use(function (chai, util) {

    chai.Assertion.overwriteMethod('assert', function (originalAssert) {
        return function () {
            timesAssertOfChaiCalled += 1;
            return originalAssert.apply(this, arguments);
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
