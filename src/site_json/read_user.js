'use strict';
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

module.exports = function(build, callback) {
    var p = path.join(build.input_directory, '_cfg', 'site.json');
    fs.readJSON(p, function (err, result) {
        if (!err) {
            if (!_.isPlainObject(result)) {
                err = new Error('_cfg/site.json does not contain a plain object.');
                result = {};
            }
        } else {
            result = {};
        }
        callback(err, result);
    });
};