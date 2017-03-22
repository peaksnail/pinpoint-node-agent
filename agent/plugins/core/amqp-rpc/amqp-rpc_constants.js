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
var ServiceTypeConstants = {
  serviceType: 9913,
  callback: 5000
};

var AnnotationConstants = {
  topic: -1
};

var PluginConstants = {
  endPoint: 'RABBITMQ',
  destinationId: 'RABBITMQ'
};
module.exports.ServiceTypeConstants = ServiceTypeConstants;
module.exports.AnnotationConstants = AnnotationConstants;
module.exports.PluginConstants = PluginConstants;
