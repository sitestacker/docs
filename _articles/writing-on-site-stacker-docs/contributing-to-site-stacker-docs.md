---
title: Contributing to Site Stacker Docs
category: Writing on Site Stacker Docs
tags: documentation
date: 2015-11-06 00:00:00
---

Contributing to the content on the Site Stacker Documentation site
is incredibly easy. There are 2 methods you can contribute:

1. [Edit directly on GitHub](#edit-on-github). This method
doesn't require any additional steps and it's most suited
for small changes and typo fixes.
2. [Clone the repository on your local machine](#clone-the-repository-locally).
This method allows you to do more complex changes to the site,
but requires some initial setup to get it working.

## Edit on GitHub

This is the easiest method to change content on the site.
Below are the advantages and disadvantages of this method.

Advantages | Disadvantages
---------- | -------------
No setup required | Cannot delete articles, only add new ones or edit existing ones
Suited for small changes and typo fixes | Adding new categories or changing multiple articles is cumbersome
 | Difficult to preview changes
 | Every save creates a new commit in the repository
 | It's very easy to **break the site**

### Edit a page

To edit a page, click on the _Improve this page_ link
next to the title:

![Image alt text](https://git.sitestacker.com/sitestacker/docs/uploads/784ac9e7f300b1a7fa185c4874689d04/Screen_Shot_2015-11-06_at_5.49.20_PM__2_.jpg)

From here, two things can happen:

1. [You'll be presented with the GitHub editor](#edit-in-place)
2. [You'll be asked to fork the repository to propose changes](#fork)

#### Edit in place

If you have write access to [sitestacker/docs](https://github.com/sitestacker/docs),
you'll be presented with the GitHub editor, and you
can make changes right there:

![GitHub Editor](https://git.sitestacker.com/sitestacker/docs/uploads/97290c22539982f65be1fffb6e6b740e/image.png)

<note>
For information about the article syntax and content, see <a href="writing-an-article">Writing an Article</a>.
</note>

<important>
<title>Save only once</title>
Since every change represents a commit, use the <i>Preview changes</i> tab to preview your changes and <b>ONLY</b> save when you're satisfied with the changes.
</important>

<important>
<title>Add descriptive message on save</title>
When you save, thus commit, add a descriptive commit subject and body, describing why you made the change.
</important>

After you save, you may have to wait a few minutes before you can see
the changes on the site.

#### Fork

If you don't have write access to [sitestacker/docs](https://github.com/sitestacker/docs),
you can still propose changes by submitting a
[Pull Request](https://help.github.com/articles/using-pull-requests/).
In this case you'll be presented with this screen:

![Fork](https://git.sitestacker.com/sitestacker/docs/uploads/8324fa0f90272cf30ebd5d1fc6059307/Screen_Shot_2015-11-06_at_7.13.21_PM.jpg)

After you fork, you'll have access to the GitHub editor
where you can make the changes( see
[edit in place](#edit-in-place)). When you're satisfied,
hit **Propose changes** and you'll be presented with the
next screen where you can review your changes and
create the pull request:

![Pull Request](https://git.sitestacker.com/sitestacker/docs/uploads/8a4d2675f047e217cee5d1ac8ffc9487/Screen_Shot_2015-11-06_at_7.10.34_PM__2_.jpg)

You're done! Once the pull request is merged, your changes
will be live.

<note>
<title>Delete your fork</title>
It's recommended to <a href="https://help.github.com/articles/deleting-a-repository/">delete your fork</a> after you created the pull request, so next time you want to propose changes you'll start fresh.
</note>

## Clone the repository locally

TODO
