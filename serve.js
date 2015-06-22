var express = require('express');
var app = express();
var port = process.argv[2] || 3000;
app.use(express.static('_site'));
app.listen(port, function (err) {
    if (err){
        console.log(err);
    } else {
        console.log('Server listening on port ', port);
        console.log('http://localhost:%s', port);
    }
});

