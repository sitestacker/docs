---
title: Markdown Elements
category: Writing on Site Stacker Docs
tags: documentation
date: 2015-11-03 00:00:00
---

Articles are written in [Markdown](http://daringfireball.net/projects/markdown/).
This page shows all elements that can be used in a page.

## Basic writing

### Paragraphs

Paragraphs are just one or more lines of consecutive text followed by one
or more blank lines.

On July 2, an alien mothership entered Earth's orbit and deployed several
dozen saucer-shaped "destroyer" spacecraft, each 15 miles (24 km) wide.

### Headings

You can create a heading by adding one or more `#` symbols before your
heading text. The number of `#` you use will determine the size of the heading.

```
# The largest heading (an <h1> tag)
## The second largest heading (an <h2> tag)
…
###### The 6th largest heading (an <h6> tag)
```

### Blockquotes

You can indicate [blockquotes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote) with a `>`.

```
In the words of Abraham Lincoln:

> Pardon my french
```

In the words of Abraham Lincoln:

> Pardon my french

### Styling text

You can make text **bold**, *italic*, _underline_, ==highlight==,
~~strikethrough~~, superscript^(ed), "quoted" or add footnote [^1].

```
*This text will be italic*  
**This text will be bold**  
_This text will be underline_  
==This text will be highlighted==  
~~This text will be strikethrough~~  
This is a superscript: 2^(nd)  
"This is a quote"  
This is a footnote [^1]  

[^1]: This is the first footnote, placed anywhere in the document.
```

*This text will be italic*  
**This text will be bold**  
_This text will be underline_  
==This text will be highlighted==  
~~This text will be strikethrough~~  
This is a superscript: 2^(nd)  
"This is a quote"  
This is a footnote [^1]  

[^1]: This is the first footnote, placed anywhere in the document.

__bold__ text can use either a `*` or an `_` around the text for styling,
and *italic* text can only use a `*`. This allows you to combine both
bold and italic if needed.

```
*Everyone __must__ attend the meeting at 5 o'clock today.*
```

*Everyone __must__ attend the meeting at 5 o'clock today.*

## Lists

### Unordered lists

You can make an [unordered list](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)
by preceding list items with either a `*` or a `-`.

```
- Item 1
- Item 2
    - Subitem 1
        - Sub-subitem 1
    - Subitem 2
- Item 3
```

- Item 1
- Item 2
    - Subitem 1
        - Sub-subitem 1
    - Subitem 2
- Item 3

### Ordered lists

You can make an [ordered list](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
by preceding list items with a number.

```
1. Item 1
    1. A corollary to the above item.
    2. Yet another point to consider.
2. Item 2
```

1. Item 1
    1. A corollary to the above item.
    2. Yet another point to consider.
2. Item 2

### Nested lists

You can create nested lists by indenting list items by four spaces.

```
1. Item 1
    1. A corollary to the above item.
    2. Yet another point to consider.
2. Item 2
    * A corollary that does not need to be ordered.
        * This is indented four spaces, because it's two spaces further than the item above.
        * You might want to consider making a new list.
3. Item 3
```

1. Item 1
    1. A corollary to the above item.
    2. Yet another point to consider.
2. Item 2
    * A corollary that does not need to be ordered.
        * This is indented four spaces, because it's two spaces further than the item above.
        * You might want to consider making a new list.
3. Item 3

### Lists with code

You can create unordered or ordered lists that contain code by indenting
list items and the code by four spaces, leaving an empty line between the
item and the code block.

```
- Item 1 with php code:

    ```php
    <?php
    $x = 1
    ```

- Item 2
    - Subitem 1 with JS code:

        ```js
        alert('Hy');
        ```
```

- Item 1 with php code:

    ```php
    <?php
    $x = 1
    ```

- Item 2
    - Subitem 1 with JS code:

        ```js
        alert('Hy');
        ```

## Code formatting

### Inline formats

Use single backticks (<code>`</code>) to format text in a special monospace format.
Everything within the backticks appear as-is, with no other special formatting.

```
Here's an idea: why don't we take `SuperiorProject` and turn it into `**Reasonable**Project`.
```

Here's an idea: why don't we take `SuperiorProject` and turn it into `**Reasonable**Project`.

### Multiple lines

You can use triple backticks (<code>```</code>) to format text as its own distinct block.

```
Check out this neat program I wrote:

``'
x = 0
x = 2 + 2
what is x
``'
```

Check out this neat program I wrote:

```
x = 0
x = 2 + 2
what is x
```

## Links

You can create an inline link by wrapping link text in brackets ( `[ ]` ),
and then wrapping the link in parentheses ( `( )` ).

For example, to create a hyperlink to [docs.sitestacker.com](docs.sitestacker.com),
with a link text that says, Visit Site Stacker Docs!, you'd write this in Markdown:
`[Visit Site Stacker Docs!](http://docs.sitestacker.com)`.

[Visit Site Stacker Docs!](http://docs.sitestacker.com)

==IMPORTANT:== For linking to relative pages within the documentation see
[Writing an Article](writing-an-article#linking).

## Images

You can include images with the following syntax:

```
![Image alt text](https://git.sitestacker.com/sitestacker/docs/uploads/784ac9e7f300b1a7fa185c4874689d04/Screen_Shot_2015-11-06_at_5.49.20_PM__2_.jpg)
```

![Image alt text](https://git.sitestacker.com/sitestacker/docs/uploads/784ac9e7f300b1a7fa185c4874689d04/Screen_Shot_2015-11-06_at_5.49.20_PM__2_.jpg)

```
![Google](https://www.google.ro/logos/doodles/2015/adolphe-saxs-201st-birthday-6443879796572160.2-res.png)
```

![Google](https://www.google.ro/logos/doodles/2015/adolphe-saxs-201st-birthday-6443879796572160.2-res.png)

## Syntax highlighting

Code blocks can be taken a step further by adding syntax highlighting.
In your fenced block, add an optional [language identifier](http://pygments.org/languages/)
and we'll run it through syntax highlighting.

We use [pygments](http://pygments.org/) to perform language detection
and syntax highlighting. You can find out which languages are supported
[here](http://pygments.org/languages/).

### PHP

Use the <code>```php</code> code fence tag:

```php
<?php
$x = 1;
$arr = array(1, 'test');
print_r($arr);
```

==IMPORTANT:== For PHP code you **must** include the `<?php` tag at the
beginning of the script for the syntax highlighter to work properly.

### JS, with line numbers

Use the <code>```js</code> code fence tag or liquid tags as below
to also include line numbers:

```
{% raw %}
{% highlight js linenos %}
var fn = function() {
  alert('Hello');
}
{% endhighlight %}
{% endraw %}
```

{% highlight js linenos %}
var fn = function() {
  alert('Hello');
}
{% endhighlight %}

### HTML

Use the <code>```html</code> code fence tag:

```html
<!DOCTYPE html>
<html>
 <head>
  <title>Sample page</title>
 </head>
 <body>
  <h1>Sample page</h1>
  <p>This is a <a href="demo.html">simple</a> sample.</p>
  <!-- this is a comment -->
 </body>
</html>
```

### Smarty

Use the <code>```smarty</code> code fence tag:

```smarty
<h1>{$title}</h1>
<p>{$summary}</p>
```

## Tables

You can create tables by assembling a list of words and dividing them
with hyphens `-` (for the first row), and then separating each column
with a pipe `|`:

```
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

Note that the dashes at the top don't need to match the length of the header text exactly:

```
| Name | Description          |
| ------------- | ----------- |
| Help      | Display the help window.|
| Close     | Closes a window     |
```

| Name | Description          |
| ------------- | ----------- |
| Help      | Display the help window.|
| Close     | Closes a window     |

You can also include inline Markdown such as links, bold, italics, or strikethrough:

```
| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |
```

| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |

Finally, by including colons `:` within the header row, you can define
text to be left-aligned, right-aligned, or center-aligned:

```
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
```

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

A colon on the **left-most** side indicates a left-aligned column; a colon
on the **right-most** side indicates a right-aligned column; a colon on
**both** sides indicates a center-aligned column.

## Emoji

You can use emoji anywhere in the document :+1:

For a full list of available emoji check out :point_right:
[emoji-cheat-sheet.com](http://www.emoji-cheat-sheet.com/) :metal:

## Hints

You can use `<note>`, `<tip>` and `<important>` tags to indicate useful hints.
Note that the `<title>` tag is optional. Also inside the tags you ==cannot==
use other HTML tags beside `<title>` and `<br>`.

```
<note>
    <title>A note</title>
    Some paragraph _here_
</note>
```

<note>
    <title>A note</title>
    Some paragraph _here_
</note>

```
<note>
    This is a note without a title.
</note>
```

<note>
    This is a note without a title.
</note>

```
<tip>
    <title>ProTip: Use a search engine</title>
    Use [Google](http://google.com) or [~~Bing](http://bing.com).
</tip>
```

<tip>
    <title>ProTip: Use a search engine</title>
    Use [Google](http://google.com) or [~~Bing~~](http://bing.com).
</tip>

```
<important>
    <title>Be careful!</title>
    Some **paragraph** here.<br>
    <br>
    Some paragraph here.<br>
    One more line in this paragraph.
</important>
```

<important>
    <title>Be careful!</title>
    Some **paragraph** here.<br>
    <br>
    Some paragraph here.<br>
    One more line in this paragraph.
</important>
