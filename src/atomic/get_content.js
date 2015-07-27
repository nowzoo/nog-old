"use strict";
var sprintf = require('sprintf-js').sprintf;
module.exports = function(build, site, content, callback){
    build.render_markdown(content.meta.__content, function(err, result){
        if (! err){
            if (result.length === 0){
                err = new Error(sprintf('The content at %s is empty.', content.relative_path));
            }

        }
        callback(err, result);
    });
};
