/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';
    var path = require('path');
    var Git = require('nodegit');

    var repo;
    var status;

    Git.Repository
        .open(path.resolve(process.cwd(), './.git'))
        .then(function(result) {
            repo = result;
            return repo.getStatus();
        })
        .then(function(result){
            console.log(result.length);
            done();
        });





};



