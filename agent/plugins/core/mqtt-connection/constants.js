/**
 * constants for amqp-rpc plugin
 *
 * Date: 2016-05-20 21:50
 * Author: zengshaojian
 */

'use strict';
var ServiceTypeConstants = {
    mqtt_connection: 9914,
};

var AnnotationConstants = {
};

var PluginConstants = {
    endPoint: 'MQTT',
    destinationId: 'MQTT',
};
module.exports.ServiceTypeConstants = ServiceTypeConstants;
module.exports.AnnotationConstants = AnnotationConstants;
module.exports.PluginConstants = PluginConstants;
