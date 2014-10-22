'use strict';

var childProcess = require('child_process');
var path = require('path');


describe('Requiring assume.js', function (done) {

    it('should not interfere with chai required afterwards', function (done) {

        childProcess.exec('node ' + path.join(__dirname, '../fixtures/require/afterwards.js'), function (err, stdout, stderr) {
            expect(stdout).to.contain('assume: 1, chai: 1, catched: 1');
            done();
        });

    });

    it('should not interfere with chai required beforehand', function (done) {

        childProcess.exec('node ' + path.join(__dirname, '../fixtures/require/beforehand.js'), function (err, stdout, stderr) {
            expect(stdout).to.contain('assume: 1, chai: 1, catched: 1');
            done();
        });

    });

    it('should not interfere with chai required beforehand and afterwards being identical', function (done) {

        childProcess.exec('node ' + path.join(__dirname, '../fixtures/require/beforehandAndAfterwards.js'), function (err, stdout, stderr) {
            expect(stdout).to.contain('assume: 1, chai: 2, catched: 2');
            done();
        });

    });

});
