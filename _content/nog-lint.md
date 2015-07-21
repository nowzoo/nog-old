---
title: nog lint
date: 2015/07/20
---

Displays potential errors in your config and content.

```
Usage: $ nog lint [options] [what...]

show problems with your content and config

Options:

  -h, --help     output usage information
  -v, --verbose  verbose output
```

### Examples

Lint everything...
```
$ nog lint
```

Lint only the config...
```
$ nog lint config

Linting config...

	Site Config
		Everything ok.
```

Lint only the content...
```
$ nog lint content
```


Pass a path to lint a single piece of content...
```
$ nog lint _content/index.md

Linting _content/index.md...
	index.md
		The content at index.md does not have a defined excerpt. Using the first 255 chars.
		The date is missing in index.md. Setting date to the file modified date "Monday, July 20, 2015 4:55 PM".

```

#### Options
Use `--verbose` or `-v`  for verbose output.

```
$ nog push -v
```
