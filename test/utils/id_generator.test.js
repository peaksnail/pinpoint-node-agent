//id_generator.test.js
//

'use strict';
var expect = require('chai').expect;
var IdGenerator= require('../../agent/utils/id_generator.js');

describe(__filename, function () {

    //get random num and judge
    var isInt = true;
    for (var i=0; i<100000;i++) {
        var res = IdGenerator.get();
        if ((res % 1) !== 0) {
            isInt = false;
        }
    }

    /* jshint expr: true */

    it('get', function () {
        expect(isInt).to.be.ok;
    });
});

