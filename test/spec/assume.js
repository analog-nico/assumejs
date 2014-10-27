'use strict';

var assume = require('../../lib/assume.js');


describe('Assume.js', function () {

    var orginalViolationHandler;

    before(function () {
        orginalViolationHandler = assume.notify;
    });

    after(function (){
        assume.notify = orginalViolationHandler;
    });

    it('should forward the message value', function () {

        var passedError;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                passedError = err;
            };
        });

        assume(true, 'my message').to.eql(false);

        expect(passedError.message).to.contain('my message');

    });

    it('should forward the context value', function () {

        var passedContextValue;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                passedContextValue = context;
                _super(err, context);
            };
        });

        var actualContext = { name: 'test' };
        assume(true, actualContext).to.eql(false);

        expect(passedContextValue).to.eql(actualContext);

    });

    it('should forward undefined if no context value is provided', function () {

        var passedContextValue;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                passedContextValue = context;
            };
        });

        assume(true).to.eql(false);

        expect(passedContextValue).to.eql(undefined);

    });

    it('should process all three parameters', function () {

        var passedContextValue, passedError;

        assume.overwriteNotify(function (_super) {
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
