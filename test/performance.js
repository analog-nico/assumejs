'use strict';

var assume = require('../lib/assume.js');


var foo = 'bar';
var tea = {
    flavors: ['brownie', 'apple', 'raspberry']
};
var context = {
    key1: 'value1',
    key2: 'value2'
};


var dateBefore = new Date();

for ( var i = 0; i < 10000; i+= 1 ) {
    assume(foo, context).to.be.a('string');
    assume(foo, context).to.equal('bar');
    assume(foo, context).to.have.length(3);
    assume(tea, context).to.have.property('flavors').with.length(3);
}

var dateAfter = new Date();

var millisElapsed = dateAfter.getTime() - dateBefore.getTime();

console.log('Executing 40000 assumptions took ' + millisElapsed + ' ms. That is ' + (millisElapsed / 40000 * 1000) + ' µs per assumption.');
