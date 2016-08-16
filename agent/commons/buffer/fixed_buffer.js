/**
 *
 *
 * fixed buffer class, big endien
 *
 * Date: 2016-05-11 20:00
 * Author: psnail
 *
 */


'use strict';
var FixedBuffer = function (args) {

    if (args === null || args === undefined) {
        throw new Error('args must not be null or undefined');
    }
    this.offset = 0;
    this.buffer = new Buffer(args);

};

FixedBuffer.prototype.getBuffer = function () {
    return this.buffer;
};

FixedBuffer.prototype.getLength = function () {
    return this.buffer.length;
};

/**
 * high 8bits ignore,low 8 bits is unsigned int8
 */
FixedBuffer.prototype.writeShort = function (value) {
    this.buffer.writeUInt8(0, this.offset++);
    this.buffer.writeUInt8(value, this.offset++);
};

/**
 * 32bits
 */
FixedBuffer.prototype.writeInt = function (value) {
    this.buffer.writeUInt32BE(value, this.offset);
    this.offset += 4;
};

module.exports = FixedBuffer;
