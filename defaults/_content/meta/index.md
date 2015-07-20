---
title: Page Metadata
excerpt: How to define metadata for Nog pages using YAML front matter.
---

### Managing Pages and Posts

#### The \_content Directory

Any `.md` or `.html` file in the `_content` directory will be turned into a page on the site. Where a content file is found inside this directory determines several things:

 - the `id` of the page
 - the resulting URL
 - the page's parent and children
 - whether the content is treated as:
   - a plain "evergreen" page or
   - a blog post, existing in an archive ordered by date

For example:


| Content File Path | URL | ID  | Parent |
| ------------- |-------------| -----| - |
| index.md |/  | `index`| |
| about.md | /about      |   `about` | |
| help.md | [ignored]     |    | |
| help/index.md | /help      |   `help` | |
| help/advanced.md | [ignored] |  | |
| help/advanced.html | /help/advanced  | `help/advanced` | `help` |
|foo.md| /foo| `foo`|    |
|foo/bar.md| /foo/bar | `foo/bar`| `foo`|
|posts/archive.md| /posts | `posts' | |
|| other archive URLs (see below)|  | |
|posts/my-first-post.md| /posts/my-first-post|  `posts/my-first-post`| |



Note the following rules:

 - Index files take precedence: `help/index.md` is used instead of `help.md`
 - HTML files take precedence over Markdown files: `help/advanced.html` is used instead of `help/advanced.md`
 - If a directory has a file named `archive.md`, the other files in the directory will be treated as blog posts, ordered by date, and a variety of date- and tag-based archive URLs will be generated.


#### Atomic Content Metadata

Page metadata, such as the title, is defined by inserting an optional YAML front matter section at the top of your content  files. The front matter section consists of:

 - three dashes `---` and a line break
 - some YAML
 - three dashes `---` and a line break

For example, a valid page file in Markdown might look like this:

```
---
title: My Valid Page
excerpt: Who dee woot who dee woo too?
some_complex_yaml: Some complex data structure which will bring about the destruction of our foes.
---
# The Actual Content Begins Here
## My Personal Strong Suits
 - Humanity
 - Peace
 - Speling
```

By default and design, Nog doesn't care very much or make assumptions about what a page's metadata has or doesn't have. That said, Nog provides the following sensible default values:

 - `title`

 If missing, Nog uses the un-dasherized ucword-ed name of the file. Thus `my-great-page` will result in a title of My Great Page.

 - `date`

 If missing (or if the value can't be parsed as a Date) this is set to the modified time of the file. You can use any parseable format, but you can't go wrong with `YYYY/MM/DD HH:mm`.

 - `excerpt`

 If missing, Nog uses the first 255 characters of the strip-tagged content, with all consecutive whitespaces converted to a single space character.

 - `template`

 If missing, assumed to be `page.twig` if the content is a plain page, `post.twig` if it's a blog post or `archive.twig` if it's an archive of blog posts. This value should always be relative to the `_templates` directory.

#### Post Archives

When Nog encounters an `directory-name/archive.md` file the other contents of  `directory-name` are treated as blog posts, and a variety of archive URLs are automatically generated. If you have a directory named `posts` containing an `archive.md` file and 12 other content files all dated July 4, 2015 and all tagged "News Flash", the following URLs will be generated:

|URL| |
|--|--|
|/posts| The first 10 posts|
|/posts/p/2| The second page of posts, with the last two posts|
|/posts/2015| The archive for 2015|
|/posts/2015/p/2| ..second page|
|/posts/2015/07| The archive for July|
|/posts/2015/07/p/2| ..second page|
|/posts/2015/07/04| The archive for July 4|
|/posts/2015/07/04/p/2| ..second page|
|/posts/tag/news-flash| Tag archive for "News Flash"|
|/posts/tag/news-flash/p/2| ...second page|

##### Modifying Archive Defaults

You can modify how Nog generates archives either globally, in your `_cfg/site.json` file or on a case-by-case basis using YAML front matter section in your `archive.md` file.


- `archives.posts_per_page` Default: `10`. If set to `0`, no paging will occur, that is, all archive URLs will display all matching posts.

- `archives.generate_dates` Default: `true`. Whether or not to generate date based archives.

- `archives.generate_tags` Default: `true`. Whether or not to generate tag archives.

- `archives.tag_slug`  Default: `'tag'`. The slug to insert before the individual tag slug.

- `archives.page_slug`  Default: `'p'`. The slug to insert before the page number (for archive pages > 1).


In `_cfg/site.json`...
```
{
    "archives": {
        "posts_per_page": 14,
        "generate_tags": false,
        "page_slug": "page"
    }
}
```

In `posts/archive.md`...

```
---
generate_tags: false
---
```
