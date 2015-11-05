---
title: Related Items
category: Templates
date: 2014-11-11 00:00:00
---

#### Description
Related Items feature allows you to connect any Content Items from Content Explorer with an individual Content Item. For example you could connect `Article A` with `Missionary A`, `Missionary B` and `Project C`. Then in the full view of the `Article A` you can print this related items in any way you want by using some specific views.

#### Related items assignments
To assign related items follow this 3 easy steps:
- right click on any architect content item in Content Explorer and click on `Manage Related Items`.
- in the new opened window you will see 2 columns.
    - In the left column you can find all the assignable items. This are all the content items created using an architect content type.
    - In the right column you can see the items that are already assigned as related items for the item you right clicked in the first step. If the right list is empty it means that no items were assigned yet.
- to assign an item as related you just need to drag it from the left column to the right column. You can also make multiple selections by holding down the `Ctrl` key and then drag them all to the right column.

#### Getting and printing the related item in views.

The content item views are the ones that are taking care of grabbing and printing the related items. Assuming the we want to print the related items for the `Article A` in the full view you need to follow this steps:

- First we need to define what sub-views we want to use for the related items. So at the beginning the of the full view in our case we can declare the related items views using the following code:

```smarty
{assign var="views" value=[
    # in case the related item view is in the content type folder
    'Architect.Article' => 'article_related_item',
    # in case the related item view is in a different content type folder.
    'Architect.Missionary' => 'Shared.related_item',
    'Architect.Project' => 'Shared.related_item',
]}
```

![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) You should declare related item views for all the possible architect content types used on that template to avoid Smarty errors and warnings.

- Second step is to grab the rendered related items and assign them to a smarty variable. You can do this using the following example:

```smarty
{get_related_items contentItemId=$content_item_id views=$views}
```

The `get_related_items` Smarty function will look for related items for the specified `contentItemId`, will render them trough the views specified in the `views` variable and assign them into the `$relatedItems` variable.

- The last step is to print our related items wherever we want them in out `Article A` full view. To do this all you need to do is make a simple foreach statement like in the following example:

```smarty
{foreach $relatedItems AS $relatedItem}
    {$relatedItem}
{/foreach}
```

![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Remember that the related items are already rendered at this point...so you just need to print them as they are.

#### Related item views CSS styling.
Use the same conventions as for any other template view.
