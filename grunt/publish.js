/* jshint node: true */
module.exports = function (grunt, done) {
    'use strict';
    var path = require('path');
    var Git = require('nodegit');

    var repo;
    var status;

    Git.Repository.open(path.resolve(process.cwd(), './.git'))
        .then(function(repo) {
            repo.getStatus().then(function(statuses) {
                function statusToText(status) {
                    var words = [];
                    if (status.isNew()) { words.push("NEW"); }
                    if (status.isModified()) { words.push("MODIFIED"); }
                    if (status.isTypechange()) { words.push("TYPECHANGE"); }
                    if (status.isRenamed()) { words.push("RENAMED"); }
                    if (status.isIgnored()) { words.push("IGNORED"); }

                    return words.join(" ");
                }

                statuses.forEach(function(file) {
                    console.log(file.path() + " " + statusToText(file));
                });
                done();
            });
        });






};


