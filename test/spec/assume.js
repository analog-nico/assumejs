'use strict';

var assume = require('../../lib/assume.js');


describe('Assume.js', function () {

    var orginalViolationHandler;

    before(function () {
        orginalViolationHandler = assume.handleViolation;
    });

    after(function (){
        assume.handleViolation = orginalViolationHandler;
    });

    it('should register a custom violation handler', function () {

        var timesCalled = 0;

        assume.overwriteHandleViolation(function (_super) {
            return function (err, context) {
                timesCalled += 1;
            };
        });

        assume(true).to.eql(true);
        assume(true).to.eql(false);

        expect(timesCalled).to.eql(1);

    });

    it('should forward the message', function () {

        var passedError;

        assume.overwriteHandleViolation(function (_super) {
            return function (err, context) {
                passedError = err;
            };
        });

        assume(true, 'my message').to.eql(false);

        expect(passedError.message).to.contain('my message');

    });

    it('should pass the context value', function () {

        var passedContextValue;

        assume.overwriteHandleViolation(function (_super) {
            return function (err, context) {
                passedContextValue = context;
            };
        });

        var actualContext = { name: 'test' };
        assume(true, actualContext).to.eql(false);

        expect(passedContextValue).to.eql(actualContext);

    });

    it('should set the context value to undefined if not provided', function () {

        var passedContextValue;

        assume.overwriteHandleViolation(function (_super) {
            return function (err, context) {
                passedContextValue = context;
            };
        });

        assume(true).to.eql(false);

        expect(passedContextValue).to.eql(undefined);

    });

    it('should process all three parameters', function () {

        var passedContextValue, passedError;

        assume.overwriteHandleViolation(function (_super) {
            return function (err, context) {
                passedContextValue = context;
                passedError = err;
            };
        });

        var actualContext = { name: 'test' };
        assume(true, 'my message', actualContext).to.eql(false);

        expect(passedContextValue).to.eql(actualContext);
        expect(passedError.message).to.contain('my message');

    });

});
