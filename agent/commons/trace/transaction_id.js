/**
 *
 * trace transaction id
 * 
 * Date: 2016-05-06 19:45
 * Author: psnail
 *
 */

'use strict';
var TransactionId = function (agentId, agentStartTime, transactionSequence) {

    if (agentId === undefined) {
        throw new Error('agentId can not be undefined');
    }
    this.agentId = agentId;
    this.agentStartTime = agentStartTime;
    this.transactionSequence = transactionSequence;

};

TransactionId.prototype.toString = function() {
    return [this.agentId, this.agentStartTime, this.transactionSequence].join(TransactionId.TRANSACTION_ID_DELIMITER);
};

TransactionId.TRANSACTION_ID_DELIMITER = '^';

module.exports = TransactionId;
