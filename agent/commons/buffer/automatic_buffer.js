/**
 *
 * auto matic buffer
 *
 * Date: 2016-05-12 9:30
 * Author: psnail
 *
 */

'use strict';
var Objects = require('../../utils/objects.js');

var AutomaticBuffer = function (args) {
    if ((typeof args) === 'number') {
        this.buffer = new Buffer(args);
    } else {
        this.buffer = new Buffer(args);
    }

};

Objects.extends(true, AutomaticBuffer, Buffer);

module.exports = AutomaticBuffer;
