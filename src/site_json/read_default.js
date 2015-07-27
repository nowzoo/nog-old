module.exports = function(callback){
    callback( null, {
        title: 'Nog',
        tagline: 'A site manager for GitHub Pages.',
        url: 'http://nowzoo.github.io',
        prefix: 'nog',
        excerpt_length: 255,
        archives_title: 'Posts',
        archives_directory: 'posts',
        archives_posts_per_page: 10,
        archives_generate_dates: true,
        archives_generate_tags: true,
        archives_tag_slug: 'tag',
        archives_tag_title_format: 'Posts tagged: %s',
        archives_page_slug: 'p',
        archives_year_slug_format: 'YYYY',
        archives_year_name_format: 'YYYY',
        archives_year_title_format: 'Yearly Archives: %s',
        archives_month_slug_format: 'YYYY/MM',
        archives_month_name_format: 'MMMM, YYYY',
        archives_month_title_format: 'Monthly Archives: %s',
        archives_day_slug_format: 'YYYY/MM/DD',
        archives_day_name_format: 'LL',
        archives_day_title_format: 'Daily Archives: %s',
        assets_copy_to_subdir:  false,
        content_extensions: ['.md', '.markdown', '.html', '.htm'],
        default_template_extension: '.twig'
    });
};


