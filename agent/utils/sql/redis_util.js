/*
 * Copyright 2017 dmb.star-net.cn
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
