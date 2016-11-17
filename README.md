### Pinpoint Node Agent

This is node agent for pinpoint

For details, please refer to [pinpoint introduction](https://github.com/naver/pinpoint)

###### Plugin Development Guide

Please refer to [node agent plugin development guide](https://github.com/peaksnail/pinpoint-node-agent/wiki/Pinpoint-node-agent-Plugin-Developer-Guide)

### Supported Modules

* express

* mqtt-connection

* amqp-rpc

* redis

### Issues

For feature requests and bug reports, feel free to post them [here](https://github.com/peaksnail/pinpoint-node-agent/issues).

### Installation

* installation(For details, please refer to [quick start](https://github.com/naver/pinpoint/blob/master/quickstart/README.md))

    1 git clone git@github.com:peaksnail/pinpoint-node-agent.git

    2 cd pinpoint-node-agent && npm install

    3 insert "require('${path}/pinpoint-node-agent')" into the entry file on the first line of your project

    4 restart your project

* configuration

    1 agent.id: node application id

    2 agent.application: node application name

    3 trace.manager.enable: using child process handle serializtion and data sending to improve performance

    4 trace.metadata.retention: let node agent wait n(configuration)ms to send trace data after the finish of current callstack

    5 profiler.collector.ip: collector ip

### Attention

###### Performance Loss

about 7% when trace.manager.enable is true and 30% when trace.manager.enable is false

###### ServiceType Code

ServiceType code must be unique.For more details,please refer to [plugin development guide](https://github.com/naver/pinpoint/wiki/Pinpoint-Plugin-Developer-Guide)
