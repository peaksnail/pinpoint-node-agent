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

### License

pinpoint node agent is licensed under the Apache License, Version 2.0. See LICENSE for full license text.

```
Copyright 2017 dmb.star-net.cn

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
