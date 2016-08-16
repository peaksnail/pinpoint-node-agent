//sequence_number_singleton.test.js
//

'use strict';
var expect = require('chai').expect;
var Sequence= require('../../agent/utils/sequence_number_singleton.js');

describe(__filename, function () {

    var seq = Sequence.getSequenceNumber();
    Sequence= require('../../agent/utils/sequence_number_singleton.js');
    var seqAgain = Sequence.getSequenceNumber();

    it('getSequenceNumber', function () {
        expect(seqAgain - seq).to.be.equal(1);
    });
});

