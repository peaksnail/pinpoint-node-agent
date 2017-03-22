/*
 * Copyright 2017 dmb.star-net.cn Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var FixedBuffer = function (args) {

    if (!args) {
        throw new Error('args must not be null or undefined');
    }
    if (args instanceof Buffer) {
        this.buffer = args;
    } else if ((typeof args) === 'number') {
        this.buffer = new Buffer(args);
    } else {
        throw new Error('args must be number or buffer');
    }
    this.offset = 0;

};

FixedBuffer.prototype.getBuffer = function () {
    //get all buffer
    return this.buffer;
};

FixedBuffer.prototype.getOffsetBuffer = function () {
    //get buffer from the offset
    return this.buffer.slice(this.offset);
};

/**
 * high 8bits ignore,low 8 bits is unsigned int8
 */
FixedBuffer.prototype.writeShort = function (value) {
    //this.buffer.writeUInt8(0, this.offset++);
    //this.buffer.writeUInt8(value, this.offset++);
    this.buffer.writeInt16BE(value, this.offset);
    this.offset += 2;
};

FixedBuffer.prototype.readShort = function () {
    var res = this.buffer.readInt16BE(this.offset);
    this.offset += 2;
    return res;
}

/**
 * 32bits
 */
FixedBuffer.prototype.writeInt = function (value) {
    this.buffer.writeInt32BE(value, this.offset);
    this.offset += 4;
};

FixedBuffer.prototype.readInt = function () {
    var res= this.buffer.readInt32BE(this.offset);
    this.offset += 4;
    return res;
};

FixedBuffer.prototype.resetReaderIndex = function () {
    this.offset = 0;
};

FixedBuffer.prototype.readBytes = function (payloadLength) {
    var res = this.buffer.readInt8(this.offset + payloadLength - 1);
    this.offset += payloadLength;
    return res;
};

module.exports = FixedBuffer;
