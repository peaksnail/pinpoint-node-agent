/**
 *
 * packet tool
 *
 * Date: 2016-05-17 17:25
 * Author: psnail
 *
 */

'use strict';
var FixedBuffer = require('../commons/buffer/fixed_buffer.js');
var LoggerFactory = require('./logger_factory.js');
var PinpointTypes = require('../thrift/dto/Pinpoint_types.js');
var PacketType = require('../commons/packet/packet_type.js');
var PongPacket = require('../commons/packet/pong_packet.js');
var RequestPacket = require('../commons/packet/request_packet.js');
var ResponsePacket = require('../commons/packet/response_packet.js');
var TraceTypes = require('../thrift/dto/Trace_types.js');
var SendPacket = require('../commons/packet/send_packet.js');
var SerializeFactory = require('../thrift/io/serialize.js');

var logger = LoggerFactory.getLogger(__filename);

var PacketEncode = function PacketEncode(data, serializeFactory) {

    var sData = serializeFactory.serialize(data);
    var packet;
    if (data instanceof PinpointTypes.TAgentInfo) {
        packet = new SendPacket(sData);
    }
    if (data instanceof TraceTypes.TApiMetaData) {
        logger.info('request id: ' + data.apiId);
        packet = new RequestPacket(data.apiId, sData);
    }

    //valid data
    if (packet === undefined) {
        logger.error('invalid data: ' + data);
    } else {
        return packet.toBuffer();
    }
};

var PacketDecode = function PacketDecode(data, deserializeFactory) {
    //get packet type,the type is storaged in BIG_ENDIAN in java
    if (data.length === 0) {
        return;
    }
    var buffer = new FixedBuffer(data);
    var packetType = buffer.readShort();

    switch(packetType){
    
        case PacketType.CONTROL_PING:
            logger.info('receive control ping');
            var packet = new PongPacket();
            global.PinpointNodejsAgent.tcpClient.send_directly(packet.toBuffer(), function () {
                logger.info('send control pong success!'); 
            });
            PacketDecode(buffer.getOffsetBuffer());
            break;
        case PacketType.APPLICATION_RESPONSE:
            logger.info('receive control response');
            readResponse(packetType, buffer);
            PacketDecode(buffer.getOffsetBuffer());
            break;
        default:
            logger.info('packetType:' + packetType);
            break;

    }
};

function readResponse(packetType, buffer) {
    var responsePacket = ResponsePacket.readBuffer(packetType, buffer);
    logger.info('request id: ' + responsePacket.getRequestId() + ' response!')
}

module.exports.PacketEncode = PacketEncode;
module.exports.PacketDecode = PacketDecode;
