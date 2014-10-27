'use strict';

var assume = require('../../lib/assume.js');


describe('assume.notify()', function () {

    var orginalViolationHandler;

    before(function () {
        orginalViolationHandler = assume.notify;
    });

    after(function (){
        assume.notify = orginalViolationHandler;
    });

    it('should allow overwriting', function () {

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

    it('should allow overwriting with multiple handlers', function () {

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

});
