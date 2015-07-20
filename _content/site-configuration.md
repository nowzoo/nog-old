---
title: Site Configuration
date: 2015/07/01 12:00
excerpt: Edit your site's configuration by modifying _cfg/site.json.
---

To edit your site's configuration, edit the `_cfg/site.json` file.

Your `_cfg/site.json` will be recursively merged with the following defaults. To check the validity of the resulting config run `nog lint`.



#### title
The name of your site.

#### tagline
The tagline.

#### url
The url of your live site, for example, http://nowzoo.github.io or http://my-custom-domain

#### prefix
For "project" sites existing on a \*.github.io URL, the path of the project, e.g. `"nog"`. For "organization" sites or sites with a custom domain, this should be blank.

#### archives_directory
Default: `"posts"`. The directory where your blog posts are found. Setting this to the empty string `""` will disable blog posts.

#### archives_title
The title to use for your main archives, e.g., `"Posts"`

#### archives_posts_per_page
How many posts do display on a page.  If you set this to `0`, no pagination will occur.

#### archives_generate_dates
Default: `true`. Whether or not to generate date based archives, e.g. `posts/2015/07`. Setting it to `false` means that no date archives will be created.

#### archives_generate_tags
Default: `true`. Whether to generate tag based archives, e.g. `posts/tag/news-flash`. This will only take effect if tags are found among the archive's posts. Setting it to `false` means that no tag archives will be created.

#### archives_tag_slug
Default: `"tag"`. The slug to insert before an individual tag slug, for example : posts/**tag**/news-flash

#### archives_page_slug
Default: `"p"`. The slug to insert before the page number for paged archives, for example : posts/**p**/2

#### archives_year_name_format
Default: `"YYYY"`. A moment.js format for the year. See archives_year_title_format below.

#### archives_year_title_format
Default: `"Yearly Archive: %s"`. The format for a yearly archive's title. `%s` is replaced with the actual date as formatted by archives_year_name_format, above.


#### archives_month_name_format
Default: `"MMMM, YYYY"`. A moment.js format for a month and year. See archives_month_title_format below.

#### archives_month_title_format
Default: `"Monthly Archive: %s"`. The format for a monthly archive's title. `%s` is replaced with the actual date as formatted by archives_month_name_format, above.

#### archives_day_name_format
Default: `"LL"`. A moment.js format for a day, month and year. See archives_day_title_format below.

#### archives_day_title_format
Default: `"Daily Archive: %s"`. The format for a monthly archive's title. `%s` is replaced with the actual date as formatted by archives_day_name_format, above.

#### assets_copy_to_subdir
Default: `false`. Whether or not to copy the contents of the `_assets` directory to a subdirectory. By default the files are copied directly to the site root. If specify a string, then the assets will be copied to a subdirectory of that name in the site root.

#### content_extensions
Default: `[".md", ".markdown", ".html", ".htm"]`. This setting determines the extensions that will be processed as content within the `_content` directory. It also determines the precedence of files with the same basename: Extensions that come first in the array win. Thus, by default, a file named `foo.md` will override a file named `foo.html`.
