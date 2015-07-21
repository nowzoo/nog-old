---
title: Templates
date: 2015/07/20
---

Nog uses [Swig](http://paularmstrong.github.io/swig/) templates. Out of the box, it comes with the following (in `_templates`):

- `main.twig` The base layout template. The other templates all inherit from this one.
- `index.twig` The layout for the home page.
- `page.twig` The layout for evergreen pages.
- `post.twig` The layout for blog posts.
- `archive.twig` The layout for a page in a blog post archive.
- `search.twig` The layout for the search page.

You can create custom templates for any atomic content. Just set `template: my-custom-template.twig` in the content's metadata.

#### Template Variables

The following are available to all templates:

- `site_root`
- `site`

##### Atomic Variables

The following are available when rendering atomic content:

- `post`

##### Archive Variables

The following are available when rendering a page of a blog post archive:

- `archive`
- `page`
