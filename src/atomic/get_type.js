'use strict';

var get_id = require('./get_id');
var get_main_archives_id = require('../archives/get_main_archives_id');


module.exports = function(site, content){
    var main_archives_id;
    var type;
    var id = get_id(content);
    if ('' === id){
        type = 'index';
    } else {
        main_archives_id = get_main_archives_id(site);
        if (0 < site.archives_directory.length){
            if (0 === id.indexOf(main_archives_id + '/')){
                type = 'post';
            } else {
                type = 'page';
            }
        } else {
            type = 'page';
        }
    }
    return type;
};
