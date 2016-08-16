/**
 *
 * packet tool
 *
 * Date: 2016-05-17 17:25
 * Author: psnail
 *
 */

'use strict';
var PinpointTypes = require('../thrift/dto/Pinpoint_types.js');
var RequestPacket = require('../commons/packet/request_packet.js');
var TraceTypes = require('../thrift/dto/Trace_types.js');
var SendPacket = require('../commons/packet/send_packet.js');

var PacketUtil = function PacketUtil(data, serializeFactory) {

    var sData = serializeFactory.serialize(data);
    var packet;
    if (data instanceof PinpointTypes.TAgentInfo) {
        packet = new SendPacket(sData);
    }
    if (data instanceof TraceTypes.TApiMetaData) {
        packet = new RequestPacket(data.apiId, sData);
    }

    //valid data
    if (packet === undefined) {
        throw new Error('invalid data');
    } else {
        return packet.toBuffer();
    }
};


module.exports = PacketUtil;
