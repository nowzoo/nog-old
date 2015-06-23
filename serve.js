var path = require('path');
var grunt = require('grunt');
var express = require('express');
var app = express();
var port = 3000;
app.use(express.static('_site'));
app.listen(port, function (err) {
    if (err) {
        grunt.log.err(err);
    } else {
        grunt.log.oklns('Server listening on port %s. Go to  http://localhost:%s', port, port);
        grunt.log.oklns('Press ^C to stop.')

    }
    //done();
});
