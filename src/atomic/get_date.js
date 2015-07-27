'use strict';
var _ = require('lodash');
var moment = require('moment');


module.exports = function(content){
    var val;
    var m;
    if (!_.has(content.meta, 'date') || !_.isString(content.meta.date)){
        m = moment(content.stat.mtime);
    } else {

        val = content.meta.date.trim();
        m = moment(Date.parse(val));
        if (! m.isValid()){
            m = moment(content.stat.mtime);
        }
    }
    return m;
};