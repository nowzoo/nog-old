'use strict';
var _ = require('lodash');


module.exports = function(build, content){

    if (! _.has(content.meta, 'published')){
        return true;
    }

    if (!_.isBoolean(content.meta.published)){
       return true;
    }

    if (content.meta.published) {
        return true;
    }

    if (build.public) {
        return false;
    }
    return ! build.published_only;

};

