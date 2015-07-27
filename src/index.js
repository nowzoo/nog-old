/* jshint node: true */
"use strict";

var program = require('commander');

var serve = require('./cmd/serve');
//var lint = require('./cmd/lint');
//var push = require('./cmd/push');
var init = require('./cmd/init');


program
    .version('1.0.0')
    .option('-v, --verbose', 'verbose output');
program
    .command('init')
    .description('initialize the site with default content and config')
    .option('-v, --verbose', 'verbose output')
    .action(function(){
        process.env.verbose = program.verbose ? true : false;
        init();
    });

program
    .command('serve')
    .description('serve the site locally, rebuilding when changes are made')
    .option('-P, --published', 'suppress content that has been marked as unpublished')
    .option('-p, --port <port>', 'port for the local webserver')
    .option('-v, --verbose', 'verbose output')
    .action(function(){
        process.env.verbose = program.verbose ? true : false;
        var options = {
            published: program.published || false,
            port: program.port || 3000
        };
        serve(options);
    });

program
    .command('lint [what...]')
    .description('show problems with your content and config')
    .option('-v, --verbose', 'verbose output')
    .action(function(what){
        process.env.verbose = program.verbose ? true : false;
        lint(what);
    });

program
    .command('push')
    .description('push the gh-pages branch to github')
    .option('-v, --verbose', 'verbose output')
    .action(function(){
        process.env.verbose = program.verbose ? true : false;
        push();
    });










program
    .parse(process.argv);
