'use strict';
var _ = require('lodash');

var get_id = require('./get_id');
var get_main_archives_id = require('../archives/get_main_archives_id');


module.exports = function(site, content){
    var id = get_id(content);
    var archives_id = get_main_archives_id(site);
    var ignored = false;
    if (_.isString(site.archives_directory) && 0 < site.archives_directory.length){
        if(archives_id === id){
            ignored = true;
        }
    }
    return ignored;
};
