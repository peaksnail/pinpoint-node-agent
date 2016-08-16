//agent info utils.test.js
//

'use strict';
var AgentInfoUtils = require('../../agent/utils/agent_info_utils.js');
var expect = require('chai').expect;
var SerializeFactory = require('../../agent/thrift/io/serialize.js');
var TcpClient = require('../../agent/socket/tcp_client.js');
var TAgentInfo = require('../../agent/thrift/dto/Pinpoint_types.js').TAgentInfo;

describe(__filename, function () {
    var bufferData = false;
    //create tcp server
    require('net').createServer(function (socket) {
        /* jshint unused: false */
        socket.on('data', function (data) {
            bufferData = true;
        }); 
        socket.on('end', function (data) {
        });
    
    }).listen(9001);

    //create tcp client
    var tcpClient = new TcpClient('localhost', 9001);
    tcpClient.connect();
    tcpClient.setSerialize(new SerializeFactory());

    //create agent info
    var agentInfo = AgentInfoUtils.createAgentInfo('id', 'name', 1111, Date.now());
    AgentInfoUtils.agentInfoSender(tcpClient, new TAgentInfo());

    /* jshint expr: true */

    it('create agent info', function () {
        expect(agentInfo).to.be.instanceof(TAgentInfo);
    });
    it('agent info send', function () {
        expect(bufferData).to.be.ok;
    });
});

