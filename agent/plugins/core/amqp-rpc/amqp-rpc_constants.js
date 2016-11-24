/**
 * constants for amqp-rpc plugin
 *
 * Date: 2016-05-20 21:50
 * Author: zengshaojian
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
