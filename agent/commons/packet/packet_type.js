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
var PacketType = {

    APPLICATION_SEND : 1,
    APPLICATION_TRACE_SEND : 2,
    APPLICATION_TRACE_SEND_ACK : 3,
	APPLICATION_REQUEST : 5,
    APPLICATION_RESPONSE : 6,


    APPLICATION_STREAM_CREATE : 10,
    APPLICATION_STREAM_CREATE_SUCCESS : 12,
    APPLICATION_STREAM_CREATE_FAIL : 14,

    APPLICATION_STREAM_CLOSE : 15,

    APPLICATION_STREAM_PING : 17,
    APPLICATION_STREAM_PONG : 18,
    
    APPLICATION_STREAM_RESPONSE : 20,

    
    CONTROL_CLIENT_CLOSE : 100,
    CONTROL_SERVER_CLOSE : 110,

    
    CONTROL_HANDSHAKE : 150,
    CONTROL_HANDSHAKE_RESPONSE : 151,

    CONTROL_PING : 200,

	CONTROL_PONG : 201,

    UNKNOWN : 500,

    PACKET_TYPE_SIZE : 2,

};



module.exports = PacketType;
