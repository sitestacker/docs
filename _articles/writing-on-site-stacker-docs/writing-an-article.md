---
title: Writing an Article
category: Writing on Site Stacker Docs
tags: documentation
date: 2015-11-06 00:00:00
readtime: 5
---

Articles are the most important content and each article represents a page.
They are located in the [_articles/]({{ site.data.github.repourl }}/tree/gh-pages/_articles)
directory and are written in Markdown.

An article is comprised of two things:

1. [article header](#article-header)
2. [article content](#article-content)

## Article Header

```
---
title: Markdown Elements
category: Writing on Site Stacker Docs
tags: documentation,markdown
date: 2015-11-06 00:00:00
readtime: 5
---
```

Every article **must** include a [Jekyll Front Matter](http://jekyllrb.com/docs/frontmatter/)
header with the following information:

- [`title`](#article-title) *(required)* The Article title. This is very important to get right!
- [`category`](#article-category) The article category.
- [`tags`](#article-tags) Article tags.
- [`date`](#article-date) The date when the article was last modified.
- [`readtime`](#article-read-time) Article read time.

### Article title

The article's title is also the page title and should be as **descriptive**
as possible. This is the only **required** field in the article header, although
it's *highly recommended to set all the fields*.

<important>
<title>Article title should be unique!</title>
Every article title should be unique throughout the entire site, even if the
file is added in a subdirectory in <a href="{{ site.data.github.repourl }}/tree/gh-pages/_articles">_articles/</a>.
</important>

#### Article file

The title dictates the name of the article's file in [_articles/]({{ site.data.github.repourl }}/tree/gh-pages/_articles).
The file name is a slug[^slug] of the title, suffixed with the `.md` extension.

##### Article file name rule

To find the slug[^slug] of an article take its *title* and:

1. lowercase all letters
2. replace all special characters (non alphanumeric) with a **single** `-` (dash)

After you determined the slug[^slug], add the `.md` extension to it and you
have the article file name.

Examples:

Article title | Article file name
------------- | ------------
Writing on Site Stacker | {{ "Writing on Site Stacker" | slugify }}.md
2. Configure the server | {{ "2. Configure the server" | slugify }}.md
Ask Questions !!! | {{ "Ask Questions !!!" | slugify }}.md
No more `system_repository.xml` | {{ "No more `system_repository.xml`" | slugify }}.md

<note>
The article file can be placed directly in the <a href="{{ site.data.github.repourl }}/tree/gh-pages/_articles">_articles/</a>
folder, or inside another directory. The extra directory it's only for
organization purposes and can have any name, but it's recommended to name
it by its category slug, as the <a href="#article-file-name-rule">article file name</a>.
</note>

### Article category

Every article should have a category, although if you don't specify one
the article will be added to the **Uncategorized** category *(not recommended)*.
Besides that a category offers better organization, it also helps finding
the article in the search results.

If you specify an existing[^existing-category] category for an article,
you don't have to do anything else.
However if you specify a category that doesn't exist yet, there's one more
thing you need to do, which is to *add the new category file* (see below).

#### Adding a new category

Each category has its own page (e.g.
[Writing on Site Stacker Docs]({{ site.url }}/categories/{{ "Writing on Site Stacker Docs" | slugify }})
). If you want to add a new category, you need to create a new file named
using the same rules as the [article file name](#article-file-name-rule),
but with the `.html` extension, in the
[_categories/]({{ site.data.github.repourl }}/tree/gh-pages/_categories) folder.

Examples:

Category title | Category file name
------------- | ------------
Writing on Site Stacker | {{ "Writing on Site Stacker" | slugify }}.html
Install Site Stacker (on production) | {{ "Install Site Stacker (on production)" | slugify }}.html

The file should contain the following:

```
{% raw %}
---
title: Writing on Site Stacker Docs
---
{% include category.html category=page.title %}
{% endraw %}
```

Note the [Jekyll Front Matter](http://jekyllrb.com/docs/frontmatter/) as
in the [article header](#article-header) that contains the category title.
You should change it to whatever your category is called.

<important>
<title>Be consistent</title>
When specifying categories, make sure you're consistent and always use the
same case for a category.
</important>

### Article tags

Articles can have tags. Tags are optional but if present are used to
improve the article's discoverability in the search results.

Tags can be specified as a [YAML list](https://en.wikipedia.org/wiki/YAML#Lists)
or a comma-separated string. See
[tags on jekyll docs](http://jekyllrb.com/docs/frontmatter/#predefined-global-variables)
for more details.

### Article date

It's highly recommended to specify a date for every article.
The date is the last time the article was modified and it is a
valuable information for a user reading an article.

The date can be given in the following formats:

- `YYYY-MM-DD HH:MM:SS` (assuming UTC)
- `YYYY-MM-DD HH:MM:SS +/-TTTT` (to specify a time zone using an offset from UTC. e.g. `2008-12-14 10:30:00 +0200`)

Note that you cannot omit the time part. You can only leave it
zero, e.g. `2008-12-14 00:00:00`, not `2008-12-14`.

<important>
<title>Update the date</title>
When you edit an article, don't forget to update its date.
</important>

### Article read time

It's a good idea to specify how long does it take to read an article, in minutes. Generally you should keep it at or under 5 minutes, but greater values might also be appropriate for more complex guides.

The expected value is always the number of minutes, e.g. `readtime: 5`.

## Article Content

The article content is what comes after the header and is what is displayed
on the site.

See [Markdown Elements](markdown-elements) for a comprehensive guide that
includes all the Markdown elements you can use in an article.

### Linking

You can add external or internal links in an article. See
[Markdown Elements #Links](markdown-elements#links) for the syntax.

#### Link to other articles (internal links)

You can link to other articles in the documentation by simply using
the other article's slug[^slug] as the link.

To reference the [Markdown Elements](markdown-elements) article, use:

```
[Markdown Elements](markdown-elements)
```

To reference the [Markdown Elements Links](markdown-elements#links) header in the
Markdown Elements article append the header slug[^slug] like this:

```
[Markdown Elements Links](markdown-elements#links)
```

#### Link to headers within the same article

If you want to link to a header inside the current article you can omit
the article title from the link.

To link to [Article Header](#article-header), use:

```
[Article Header](#article-header)
```

#### Link to other pages

To link to other pages that are not articles, you need to enter the entire
url without the domain, beginning with a `/` (slash).

To link to the [Writing on Site Stacker Docs](/categories/writing-on-site-stacker-docs)
category page, use:

```
[Writing on Site Stacker Docs](/categories/writing-on-site-stacker-docs)
```

### Images

To include images in an article you need to upload the images somewhere.
The recommended way is to head over to the [Site Stacker Docs](https://git.sitestacker.com/sitestacker/docs/issues)
repository on Gitlab and upload your images in an existing issue, or create a new issue if
none exists for that article. See [sitestacker/docs#1](https://git.sitestacker.com/sitestacker/docs/issues/1)
for an example.

Every article should have one and only one issue, so make sure you search
for it first before creating a new one. Once in an issue, simply drag and drop
the image, save the issue and grab the image url to be used in the article.

See [Markdown Elements #Images](markdown-elements#images) for the syntax to
include images.

[^slug]: [What is a "slug" in Django?](http://stackoverflow.com/questions/427102/what-is-a-slug-in-django)
[^existing-category]: You can find all existing categories on the [site homepage]({{ site.url }})
