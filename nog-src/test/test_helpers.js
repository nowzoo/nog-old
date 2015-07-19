/* jshint expr: true */
/* jshint node: true */
var expect = require('chai').expect;
var path = require('path');
var async = require('async');
var moment = require('moment');
var fs = require('fs-extra');
var _ = require('lodash');
var sprintf =  require('sprintf-js').sprintf;
var temp = require('temp').track();
var yaml = require('js-yaml');







var get_content_file_text = module.exports.get_content_file_text = function (meta, content) {
    var text = '';
    if (meta){
        text += '---\n';
        text += yaml.safeDump(meta);
        text += '\n---\n';
    }

    text += content;
    return text;
};


var set_contents = module.exports.set_contents = function(directory, contents, callback){
    var _content_path = path.join(directory, '_content');
    async.series(
        [
            function(callback){
                fs.remove(_content_path, callback);
            },
            function(callback){
                async.each(contents, function(o, callback){
                    var content = o.content || '';
                    var meta = o.meta || null;
                    var p = path.join(_content_path, o.slugs.join(path.sep));
                    var data = get_content_file_text(meta, content);
                    fs.outputFile(p, data, callback);
                }, callback)
            },

        ], callback
    );
};


var set_templates = module.exports.set_templates = function(directory, files, callback){
    var _templates_path = path.join(directory, '_templates');
    async.series(
        [
            function(callback){
                fs.remove(_templates_path, callback);
            },
            function(callback){
                async.each(files, function(slugs, callback){
                    fs.ensureFile(path.join(_templates_path, slugs.join(path.sep)), callback);
                }, callback)
            },

        ], callback
    );
};

var set_config = module.exports.set_config = function(directory, cfg, callback){
    var _cfg_path = path.join(directory, '_cfg');
    async.series(
        [
            function(callback){
                fs.remove(_cfg_path, callback);
            },
            function(callback){
                fs.outputJSON(path.join(_cfg_path, 'site.json'), cfg, callback)
            },

        ], callback
    );
};
