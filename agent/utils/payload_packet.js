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

var PayloadPacket = {

    appendPayload : function (header, payload) {
        if (payload === null) {
           header.writeInt(-1);
           return header;
        } else {
            header.writeInt(payload.length);
            return Buffer.concat([header.getBuffer(), payload]);
        }
    },

    readPayload : function (buffer) {
        var len = buffer.readInt();    
        if(len <= 0){
            return new Buffer();
        }
        return buffer.readBytes(len);
    }

};


module.exports = PayloadPacket;
