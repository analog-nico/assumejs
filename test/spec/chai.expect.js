'use strict';

var assume = require('../../lib/assume.js');


describe('Assume.js embodying chai.expect', function () {

    var orginalViolationHandler;

    before(function () {
        orginalViolationHandler = assume.notify;
    });

    after(function (){
        assume.notify = orginalViolationHandler;
    });

    it('should not have altered expect() used in these tests - just to be sure', function () {

        var expectThrewException = false;
        try {
            expect(true).to.eql(false);
        } catch (e) {
            expectThrewException = true;
        }

        if (expectThrewException === false) {
            throw Error('Expected expect() to throw an exception.');
        }

    });

    it('should allow basic assertions', function () {

        assume.overwriteNotify(function (_super) {
            return function (err, context) { };
        });

        expect(function () { assume(true).to.eql(true);  }).to.not.throw();
        expect(function () { assume(true).to.eql(false); }).to.not.throw();

    });

    it('should allow the assertion in the readme', function () {

        var foo = 'bar';
        var tea = {
            flavors: ['brownie', 'apple', 'raspberry']
        };

        expect(function () { assume(foo).to.be.a('string');                          }).to.not.throw();
        expect(function () { assume(foo).to.equal('bar');                            }).to.not.throw();
        expect(function () { assume(foo).to.have.length(3);                          }).to.not.throw();
        expect(function () { assume(tea).to.have.property('flavors').with.length(3); }).to.not.throw();

    });

});
