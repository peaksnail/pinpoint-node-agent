/**
 *
 * generate sequence number
 *
 * singleton
 * 
 * Date: 2016-05-12 16:30
 * Author: psnail
 *
 */

'use strict';
var sequenceNumber = -1; 

var SequenceNumberSingleton = {
    
    getSequenceNumber: function () {
        return ++sequenceNumber; 
    }

};

module.exports = SequenceNumberSingleton;
