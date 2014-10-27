'use strict';

var assume = require('../../lib/assume.js');
var childProcess = require('child_process');
var path = require('path');


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

    describe('in its standard implementation', function () {

        it('should properly format the error', function (done) {

            childProcess.exec('node ' + path.join(__dirname, '../fixtures/notify/console.js'), function (err, stdout, stderr) {
                expect(stderr).to.contain('[assume.js] Error: test\n\n');
                expect(stderr).to.contain('[assume.js] AssertionError: expected true to deeply equal false\nActual:   true\nExpected: false\nContext:  { some: \'context\' }\n\n');
                done();
            });

        });

        // Tests deactivated since the Stack Trace API seems to be broken in node 0.11
        // See: https://github.com/joyent/node/issues/8627
        xit('should properly format the error if the callsites where retrieved beforehand', function (done) {

            childProcess.exec('node ' + path.join(__dirname, '../fixtures/notify/callsitesThenConsole.js'), function (err, stdout, stderr) {
                expect(stderr).to.contain('Callsites report filename: test/fixtures/notify/callsitesThenConsole.js\n' +
                    '[assume.js] AssertionError: expected true to deeply equal false\nActual:   true\nExpected: false\nContext:  { some: \'context\' }\n\n');
                done();
            });

        });

        xit('should allow retrieving the callsites afterwards', function (done) {

            childProcess.exec('node ' + path.join(__dirname, '../fixtures/notify/consoleThenCallsites.js'), function (err, stdout, stderr) {
                expect(stderr).to.contain('[assume.js] AssertionError: expected true to deeply equal false\nActual:   true\nExpected: false\nContext:  { some: \'context\' }\n\n' +
                    'Callsites report filename: test/fixtures/notify/consoleThenCallsites.js\n');
                done();
            });

        });

    });

});
