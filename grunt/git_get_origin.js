module.exports = function(grunt, callback){
    //origin	git@github.com:nowzoo/nog.git (fetch)
    //origin	git@github.com:nowzoo/nog.git (push)

    var exec = require('child_process').exec;
    var _ = require('lodash');
    var S = require('string');

    var cmd = 'git remote -v';

    exec(cmd, function(err, stdout){
        var lines = stdout.split('\n');
        var origin = {
            fetch: null,
            push: null
        };
        var rx_fetch = /origin([^\()]+)\(fetch\)/;
        var rx_push = /origin([^\()]+)\(push\)/;
        _.each(lines, function(line){
            var match;
            match = line.match(rx_fetch);
            if (match){
                origin.fetch = S(match[1]).trim().s;
                return;
            }
            match = line.match(rx_push);
            if (match){
                origin.push = S(match[1]).trim().s;
            }
        });
        if (! origin.fetch || ! origin.push){
            callback(new Error('Invalid origin'), origin);
        } else {
            callback(null, origin);
        }
    })


}
