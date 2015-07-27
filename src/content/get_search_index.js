
var get_search_index = module.exports.get_search_index = function (build_data) {
    var search_index = {};
    var published = {};
    var relative_url;
    _.each(build_data.contents, function(content){
        var published_object;
        var search_words;
        if (atomic.get_is_ignored_bad_uri(build_data, content)) return;
        if (atomic.get_is_ignored_extension(build_data, content)) return;
        if (atomic.get_is_ignored_conflicts_with_archive(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_sibling(build_data, content)) return;
        if (atomic.get_is_ignored_overridden_by_index(build_data, content)) return;
        if (! atomic.get_published(build_data, content)) return;

        relative_url = atomic.get_relative_url(build_data, content);
        search_words = atomic.get_search_words(build_data, content);
        published[relative_url] = {
            relative_url: relative_url,
            absolute_url: atomic.get_absolute_url(build_data, content),
            title: atomic.get_title(build_data, content),
            excerpt: atomic.get_excerpt(build_data, content)
        };

        _.each(search_words, function(word){
            word = word.trim().toLowerCase();
            if (!_.has(search_index, word)){
                search_index[word] = [];
            }
            search_index[word].push(relative_url);
        });
    });

    return {
        content: published,
        index: search_index
    };
};
