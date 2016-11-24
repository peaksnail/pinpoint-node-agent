/**
 * constants for https plugin
 *
 * Date: 2016-05-20 21:50
 * Author: zengshaojian
 */

'use strict';
var ServiceTypeConstants = {
    redisServiceType: 8200,
    callback: 5000
};

var AnnotationConstants = {
    sqlSpeed: -1,
    sql: 21
};

var PluginConstants = {
    destinationId: 'REDIS'
};
module.exports.ServiceTypeConstants = ServiceTypeConstants;
module.exports.AnnotationConstants = AnnotationConstants;
module.exports.PluginConstants = PluginConstants;
