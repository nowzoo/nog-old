var get_date = require('../atomic/get_date');
var get_title = require('../atomic/get_title');
module.exports = function(posts){
    posts.sort(function(a, b){
        var a_date = get_date(a);
        var b_date = get_date(b);
        var a_title = get_title(a).toLowerCase();
        var b_title = get_title(b).toLowerCase();
        if (a_date.isBefore(b_date)) return 1;
        if (a_date.isAfter(b_date)) return -1;
        if (a_title < b_title) return -1;
        if (a_title > b_title) return 1;
        return 0;
    })

};
