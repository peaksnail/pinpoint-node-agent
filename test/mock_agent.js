//mock agent

'use strict';

var Agent = require('../agent/commons/agent.js');
var Configuration = require('../agent/conf/read_config.js');
var dgram = require('dgram');
var events =  require('events');
var expect = require('chai').expect;
var path = require('path');


//start tcp and udp server as collector
//tcp
var tcpConnect = false;
var tcpDataReceive = false;
var tcpServerEnd = false; 
var bufferData = false;
var spanDataReceive = false;
var spanConnect = false;
var statConnect = false;
require('net').createServer(function(socket){
    tcpConnect = true;
    /* jshint unused: false */
    socket.on('data', function(data){
        tcpDataReceive = true;
    }); 
    socket.on('end', function(data){
        tcpServerEnd = true; 
    });

}).listen(8990);

//span
var spanServer = dgram.createSocket('udp4');
spanServer.on('listening', function () {
    spanConnect = true;
});
/* jshint unused: false */
spanServer.on('message', function (message, remote) {
	spanDataReceive = true;
});
spanServer.bind(9999, '127.0.0.1');

//stat
var statServer = dgram.createSocket('udp4');
statServer.on('listening', function () {
    statConnect = true;
});
statServer.on('message', function (message, remote) {
	bufferData = true;
});
statServer.bind(9991, '127.0.0.1');


//get agent conf 
var conf = new Configuration(path.join(__dirname, 'pinpoint.config'));

//add data receive count for test
var originalReceiveCount = 0;
var nowReceiveCount = 0;
Agent.prototype.receiveNewData = function receiveNewData(){
	this.traceManager = new events.EventEmitter();
    this.traceManager.on('test', function(){
        originalReceiveCount = nowReceiveCount;
        nowReceiveCount = nowReceiveCount + 1; 
    });
};

Agent.prototype.hasReceiveNewData = function hasReceiveNewData(){
    if((nowReceiveCount - originalReceiveCount) === 1){
        return true;
    }else{
        return false;
    }
};

var defaultAgent = new Agent(conf);
global.PinpointNodejsAgent = defaultAgent;

//start agent socket client 
defaultAgent.startTcpClient();
defaultAgent.startUdpClient();

//start send agentInfo
defaultAgent.sendAgentInfo();

//start hack load and load plugins
defaultAgent.hackModuleLoad();

//start to send api info
defaultAgent.sendApiInfo();

//start trace manager
//defaultAgent.startTraceManager();
//console.log(defaultAgent.agentStartTime)

//start new event for count data receiver
defaultAgent.receiveNewData();

//TraceContext add test event
var TraceContext = require('../agent/commons/trace/trace_context.js').TraceContext;
var originalNewTraceObject = TraceContext.prototype.newTraceObject;
TraceContext.prototype.newTraceObject = function newTraceObject(){
    global.PinpointNodejsAgent.traceManager.emit('test', this);
    return originalNewTraceObject.apply(this, arguments);
};

module.exports = defaultAgent;
