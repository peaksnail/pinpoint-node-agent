/*
 * Copyright 2017 dmb.star-net.cn
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
var BytesUtils = {


    /**
     * see pinpoint commons module TransactionIdUtils.java
     */
    
    intToZigZag : function (value) {
        return (value << 1) ^ (value >> 31);
    },

    intToBuffer : function (value) {
        var buffer = new Buffer(1);
        buffer.writeInt8(value, 0);
        return buffer;
    },
    
    /**
     * see pinpoint commons module BytesUtils.java 
     * method: public static int writeVar64(long value, final byte[] buf, int offset) 
     *
     * nodejs doesn't support 64 bit long, and node-int64 can not do it too.
     * so using binary as str to operate
     *
     */
    
    longToBuffer : function (value) {
    
        var binaryStr = value.toString(2);
        var bufferLen = parseInt(binaryStr.length / 7 + 1);
        var buffer = new Buffer(bufferLen);
        var index = 0;
    
        //get 7bit and store to the buffer
        while (index <= bufferLen - 1) {
    
            var temp = binaryStr.substring(binaryStr.length - (index + 1) * 7, binaryStr.length - index * 7);
            var i = parseInt(temp, 2);
            if (index === bufferLen - 1) { //the last operation
                buffer.writeUInt8(i, index);
                return buffer; 
            } else {
                buffer.writeUInt8((i & 0x7F) | 0x80, index);
            }
    
            index = index + 1;
        }
        return buffer;
    
    },

    checkBound : function (bufferLength, offset) {
        if (offset < 0 ) {
            throw new Error('negative offset: ' + offset);
        }
        if (offset > bufferLength) {
            throw new Error('invalid offset: ' + offset + 'bufferLength: ' + bufferLength);
        } 
    },

};



module.exports = BytesUtils;
