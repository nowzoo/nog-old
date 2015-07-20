### Content File Rules

#### Valid Extensions

Nog will only process files with the extensions found in `config.build.content_extensions`.  The default values are:

```
// site config...
{
  ...
  "build": {
    ...
    "content_extensions": [".md", ".markdown", ".html", ".htm"]
    ...
  }
}
```

You can change these recognized extensions in `_cfg/site.json`.

#### File Conflicts

If two files with different extensions but the same basename exist in the same directory, like this...

 - \_content/
   - foo/
     - bar.html
     - bar.markdown
     - bar.md

... the file with the extension appearing first in `config.build.content_extensions` wins. In this case, with the default config, the winner would be `bar.md`.

If a file named `index.*` or `archive.*` exists in a directory `dirname`, that file wins over a file one level up named `dirname.*`. For example, in the following case...

- \_content/
 - foo/
   - index.md
  - foo.md  

... the file `_content/foo/index.md` will be used, and `_content/foo.md` will be ignored.

Finally, `archive.*` files win out over `index.*` files in the same directory.
