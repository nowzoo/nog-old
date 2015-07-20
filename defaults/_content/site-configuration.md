---
title: Site configuration
date: 2015/07/01 12:00
test: foo
---

To edit your site's configuration, edit `site.json` file in the `_cfg` directory. Out of the box, the defaults are:

```
{
    "title": "Nog",
    "tagline": "A site manager for GitHub Pages.",
    "url": "http://nowzoo.github.io",
    "prefix": "nog",
    "archives": {
        "title": "Posts",
        "posts_per_page": 10,
        "generate_dates": true,
        "generate_tags": true,
        "tag_slug": "tag",
        "page_slug": "p",
    },
    "build": {
        "assets_copy_to_subdir":  false,
        "template_engine": "swig",
        "markdown_engine": "marked"
    }
}
```

Your `_cfg/site.json` will be recursively merged with these defaults. To check the validity of the resulting config:

```
$ grunt nog:lint:config
```

## title
The name of your site.

## tagline
The tagline.

## url
The url of your live site, for example, http://nowzoo.github.io or http://my-custom-domain

## prefix
For "project" sites existing on a \*.github.io URL, the path of the project, e.g. `"nog"`. For "organization" sites or sites with a custom domain, this should be blank.

## archives
This object contains settings for the automatic generation of archives. These settings will only take effect if you have created one or more archives. These options can also be set on an archive-by-archive basis by editing the YAML front matter in an `archive.md` file.

### archives.title
Default: `"posts"`

The title of the main archives.

### archives.posts_per_page
Default: `10`

How many posts do display on a page.  If you set this to `0`, no pagination will occur.

### archives.generate_dates
Default: `true`

Whether to generate date based archives, e.g. `posts/2015/07`. Setting it to `false` means that no date archives will be created.

### archives.generate_tags
Default: `true`

Whether to generate tag based archives, e.g. `posts/tag/news-flash`. This will only take effect if tags are found among the archive's posts. Setting it to `false` means that no tag archives will be created.

### archives.tag_slug
Default: `tag`

The slug to insert before the individual tag slug, for example : posts/**tag**/news-flash

### archives.page_slug
Default: `p`

The slug to insert before the page number for paged archives, for example : posts/**p**/2
