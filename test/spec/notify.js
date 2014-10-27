'use strict';

var assume = require('../../lib/assume.js');


describe('assume.notify()', function () {

    var originalViolationHandler;

    before(function () {
        originalViolationHandler = assume.notify;
    });

    after(function (){
        assume.notify = originalViolationHandler;
    });

    it('can be overwritten', function () {

        var timesCalled = 0;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                timesCalled += 1;
            };
        });

        assume(true).to.eql(true);
        assume(true).to.eql(false);

        expect(timesCalled).to.eql(1);

    });

    it('can be overwritten with multiple handlers', function () {

        var timesCalled = 0;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                timesCalled += 1;
            };
        });

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                timesCalled += 1;
                _super(err, context);
            };
        });

        assume(true).to.eql(false);

        expect(timesCalled).to.eql(2);

    });

    it('can be invoked directly', function () {

        var receivedErr, receivedContext;

        assume.overwriteNotify(function (_super) {
            return function (err, context) {
                receivedErr = err;
                receivedContext = context;
            };
        });

        var err = new Error('test');
        var context = { some: 'context'};

        assume.notify(err, context);

        expect(err).to.eql(receivedErr);
        expect(context).to.eql(receivedContext);

    });

});
