/* jshint node: true */
module.exports = function(template_path, data, callback){
    "use strict";

    var path = require('path');
    var swig = require('swig');

    var rendered;
    var ext = path.ext(template_path);

    switch(ext){
        case '.twig':
            swig.renderFile(template_path, data, function(err, result){
                rendered = result;
                callback(err, rendered);
            });
            break;
        default:
            callback(new Error('Unrecognized template extension"' + ext + '".'));
            break;
    }
};
