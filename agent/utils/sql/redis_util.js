/**
 *
 * redis util
 *
 * Date: 2016-06-17 14:30
 * Author: psnail
 *
 */

'use strict';

var RedisUtil = {
    
    getSqlString : function (method, args) {
        var length = Object.keys(args).length;
        var str = method;
        if (length === 0) {
            str = str + '()';
        } else {
            str = str + '(';
        }
        var value;
        for (var i=0; i<length; i++) {
            switch (typeof args[i]) {
                case 'undefined':
                    value = 'undefined';
                    break;
                case 'function':
                    value = 'function';
                    break;
                case 'object':
                    value = 'object';
                    break;
                default:
                    value =args[i];
            }
            if (i === length - 1) {
                str = str + value + ')';
            } else {
                str = str + value + ', ';
            }
        }
        return str;
    },

};


module.exports = RedisUtil;
