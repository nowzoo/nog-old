
module.exports = function(build, content){
    var val = '';
    var tags;
    var stopwords = require('stopwords').english;

    val += ' ' + get_title(content);
    val += ' ' + get_content(build, content);
    val += ' ' + get_excerpt(build, content);


    tags = _.map(get_tags(build_data, content), function(val){return S(val).trim().toLowerCase().s});

    val = S(val).stripTags().toLowerCase().split(/\W+/);

    val  = _.difference(val, stopwords);
    //add the tags...
    val = val.concat(tags);
    val = _.filter(val, function(val) {return 0 < val.length;});
    val = _.uniq(val);
    return val;
};
