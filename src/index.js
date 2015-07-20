/* jshint node: true */
"use strict";

var program = require('commander');

var serve = require('./serve');
var lint = require('./lint');
var push = require('./push');


program
    .version('1.0.0')
    .option('-v, --verbose', 'verbose output')
    .option('-p, --port <port>', 'port for the local webserver');

program
    .command('serve')
    .description('serve the site locally, rebuilding when changes are made')
    .option('-v, --verbose', 'verbose output')
    .option('-p, --port <port>', 'port for the local webserver')
    .action(function(){
        process.env.verbose = program.verbose ? true : false;
        var options = {
            port: program.port || 3000
        };
        serve(options);
    });

program
    .command('lint')
    .description('show problems with your content and config')
    .option('-v, --verbose', 'verbose output')
    .action(function(){
        process.env.verbose = program.verbose ? true : false;
        lint();
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
