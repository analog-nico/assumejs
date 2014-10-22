'use strict';

var assume = require('../../lib/assume.js');


describe('Assume.js embodying chai.expect', function () {

    it('should allow basic assertions', function () {

        expect(function () { assume(true).to.eql(true);  }).to.not.throw();
        expect(function () { assume(true).to.eql(false); }).to.not.throw();

    });

});
