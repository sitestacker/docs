---
title: Building a Template
category: Templates
date: 2015-05-30 00:00:00
---

### Summary
- [Things to know before you start](#things-to-know-before-you-start)
- [Directory Structure](#directory-structure)
- [Positions](#positions)
- [Views](#views)
- [View Inheritance](#view-inheritance)
- [View Classes](#view-classes)
- [Index File (index.tpl)](#index-file)
- [SASS and CSS](#sass-and-css)

***


### Things to know before you start

- Strings formatting conventions used in this document

Name | Example
---- | -------
normal | `Some text` or `some other text`
alias | `sometext` or `someothertext`
camelCase | `someText` or `someOtherText`
FullCamelCase | `SomeText` or `SomeOtherText`
dashedAlias | `some-text` or `some-other-text`
underscoredAlias | `some_text` or `some_other_text`

> Except the `normal` formatting there are no spaces allowed.

- All templates are located in `/packages/templates/{TemplateAlias}`. The `{TemplateAlias}` can be any name you want but it needs to be FullCamelCase formatted.

> For a client called WMtek Global the `{TemplateAlias}` should be **WmtekGlobal**

- All templates are built using Smarty 3. For the Smarty documentation you can visit [this link](http://www.smarty.net/docs/en/).

- Any new template should be created manually file by file. Copying and then modifying an existing template is not a desired technique because there are a lot of unnecessary files that can remain in the new template. They will never be used and they will just slow down the template rendering time.

- In order to view all Smarty variables available in a view you can write `{debug}` inside the view and after refreshing it will open a popup containing the variables.  

[Back to top](#summary)

***


### Directory Structure

Main template folders and files:
```
> elements  
> views  
> webroot  
- .gitignore  
- config.xml  
- index.tpl  
```

The `config.xml` and `index.tpl` files are required and must exist in all templates. We'll go deeper into the directory structure as we continue in the following sections.

[Back to top](#summary)

***


### Positions

The purpose of positions is to divide the page into multiple smaller sections and they designate the places where the content will be rendered. Positions are defined inside the `config.xml` file and are implemented in the `index.tpl` file.  

Example declaration in `config.xml`:
```xml
<?xml version="1.0"?>
<template>
    <position alias="header" name="Header"/>
    <position alias="content" name="Content"/>
    <position alias="footer" name="Footer"/>
</template>
```

> The `alias` will become the variable name, the `name` is what will be visible in admin.

Example implementation in `index.tpl`:
```smarty
<html>
<head></head>
<body>
    {if !empty($header)}
        <header class="tpl-position-header">
            {$header}
        </header>
    {/if}
    {if !empty($content)}
        <div class="tpl-position-content">
            {$content}
        </div>
    {/if}
    {if !empty($footer)}
        <footer class="tpl-position-footer">
            {$footer}
        </footer>
    {/if}
</body>
</html>
``` 

In the examples above we defined three positions: `header`, `content` and `footer`. Then we implemented them in the `index.tpl` file by using the `alias` value as the Smarty variable name (it's good practice to check if the variable is not empty before using it, in order to avoid notices).  

There can be as many positions as needed and they can vary from template to template; one template may require two positions for the header, let's say Header Left and Header Right, while another template only needs one Header position.

[Back to top](#summary)

***


### Views

A View is a template that displays data in a specific way and is rendered inside of a position. Like positions, views are also defined in the `config.xml` file but they are implemented as a standalone `.tpl` file inside the `views` folder:
```
> views  
  > Architect
    > Missionary
      - summary.tpl
    > Project
      - full_view.tpl
    > Static
      - title_only.tpl
    > Wrapper
      - basic.tpl
  > Components
    > Page
      - basic.tpl
  > Menus
    > Menu
      - main_menu.tpl
  > Modules
    > Module
      - default.tpl
```
 
Views generally belong to one content type (except [shared views](#view-inheritance)) and all the content type fields are available as variables inside of them.

There are a few rules that views must follow:

- The `alias` chosen must match the name of the view file, without the `.tpl` extension
- All CSS classes must be prefixed with `tpl-`. Example: `tpl-body`, `tpl-image`
- The first element in each view should be a wrapper `<div>` and should contain a class like `tpl-{component}-{content-type-alias}-{view-name}`. Example: `tpl-architect-missionary-summary` or `tpl-menus-menu-header-menu`
  - There is an exception for the Components and Module views where there is no need for a wrapper div.
- If a view requires CSS styling then it should have a corresponding SCSS file following this directory structure:
  - For content types: `sass/Architect/{ContentTypeAlias}/{view_name}.scss`  
  - For menus: `sass/Menus/{view_name}.scss`  
  - For components and modules: `sass/Components|Modules/{Component}/{view_name}.scss`  


**Bellow you can find a few views examples:**

Definition in `config.xml` file:
```xml
<contentType plugin="Architect" alias="Static">
    <view alias="title_only" name="Title Only" />
</contentType>

<contentType plugin="Architect" alias="Missionary">
    <view alias="summary" name="Summary"/>
</contentType>

<contentType plugin="Menus" alias="Menu">
    <view alias="unordered_list" name="List"/>
</contentType>

<contentType plugin="Components" alias="Page">
    <view alias="basic" name="Basic"/>
</contentType>

<contentType plugin="Modules" alias="Module">
    <view alias="default" name="Default"/>
</contentType>
```

> The `name` value is what will show up in admin
   
- `title_only.tpl` view for Static content type:  

```smarty
<div class="tpl-architect-static-title-only {$viewClass}">
    {$title}
</div>
```

- `basic.tpl` Component view or `default.tpl` Module view:
```smarty
{$body}
```

- `unordered_list.tpl` Menu view:
```smarty
<div class="tpl-menus-menu-unordered-list {$viewClass}">
    <ul class="tpl-menu">
        {foreach $items AS $item}
            <li class="tpl-menu-item {$item|menu_item_active}">
                <a href="{$item.url}" target="{$item.target}">{$item.text}</a>
                {if $item.children|@count > 0}
                    <ul>
                        {foreach name=subitems from=$item.children item=subitem}
                            <li class="tpl-menu-subitem {if $smarty.foreach.subitems.first}first{/if} {if $smarty.foreach.subitems.last}last{/if} {$subitem|menu_item_active}">
                                <a href="{$subitem.url}" target="{$subitem.target}">{$subitem.text}</a>
                            </li>
                        {/foreach}
                    </ul>
                {/if}
            </li>
        {/foreach}
    </ul>
</div>
```

- `summary.tpl` Missionary view:
```smarty
<div class="tpl-architect-missionary-summary {$viewClass}">
    
    <img src="{$image[0]|resize:100:100}" alt="{$fullname}">
    
    {if !empty($first_name)}
        <p>Missionary First Name: {$first_name}</p> 
    {/if}
    
    {if !empty($last_name)}
        <p>Missionary Last Name: {$last_name}</p>
    {/if}
    
    <div class="tpl-summary">
        {$summary|strip_tags|truncate:100:"...":false}
    </div>
</div>
```

[Back to top](#summary)

***


### View Inheritance

View inheritance is useful for sharing common views between multiple content types. Instead of creating identical files for each content type you can create it just once in a shared or common content type. This will be helpful in the long run when doing maintenance on these views.

Shared views are defined as normal views but in a "made-up" content type (ie: Shared), and then they are linked to an existing content type using the `inherit` property: 
```xml
<contentType plugin="Architect" alias="Shared">
    <view alias="summary" name="Summary" />
    <view alias="full_view" name="Full View" />
    <view alias="generic_giving" name="Generic Giving" />
</contentType>
<contentType plugin="Architect" alias="Missionary" inherit="Shared">
    ....
</contentType>
<contentType plugin="Architect" alias="Project" inherit="Shared">
    ....
</contentType>
```

In the example above all three views `Summary`, `Full View` and `Generic Giving` will become available for Missionary and Project content types. The `.tpl` files for these views must reside in `views/Architect/Shared/` directory.

[Back to top](#summary)

***


### View Classes

View classes allow for further customization of a view without the need to create multiple similar views. Each view can have as many view classes as needed and they are also defined in the `config.xml` file, inside of the `<view>` element:
```xml
<contentType plugin="Architect" alias="Static">
    <view alias="summary" name="Summary">
        <class alias="tpl-hide-title" name="Hide Title" />
    </view>
    <view alias="full_view" name="Full View" />
</contentType>
```

> Is recommended to prefix view classes with `tpl-` but is not mandatory

In the example above the Summary view has one view class called `Hide Title`. As the name suggest adding this view class from the admin side should make the title hidden. The implementation of this behavior is up to the developer and is usually done with CSS.

For a view to make use of view classes it must implement the `$viewClass` variable. Example:
```smarty
<div class="tpl-architect-static-summary {$viewClass}">
    <h1 class="tpl-title">{$title}</h1>
    ...
</div>
``` 

Using the examples above, if the `Hide Title` view class would be added, then the `$viewClass` variable will render: `tpl-hide-title`. Multiple view classes are separated by space.

The SCSS implementation for the `Hide Title` view class could be:
```scss
.tpl-architect-static-summary {
    &.tpl-hide-title {
        .tpl-title {
            display: none;
        }
    }
}
```

[Back to top](#summary)

***


### The Index File

The `index.tpl` is the main template file where everything is strapped together and all required resources are included.

#### Available Smarty Variables

Variable | Description
-------- | -----------
{$meta} | Various meta tags coming from the `Metadata` tab of the Site Channel and Site Page (description, keywords, open graph tags, etc.).
{$SiteChannel.title} | The global site channel title.
{$SitePage.title} | The current site page title.
{$fullViewItemTitle} | The title of the content item currently displayed in full view.
{$css} | All the required `css` files from component pages and modules.
{$templateCss&#124;asset_version} | The `template.css` file. Depending on the CSS debug value this variable can include each file individually or a single unified file. The `asset_version` modifier is required.
{$script} | All the required `js` files from component pages and modules.
{$position_alias} | The rendered content of a position. Any position declared in config.xml will generate it's own variable in the index.tpl file based on the position alias [see Positions section](#positions).

#### \<HEAD\> Section

- The three template variables `$meta`, `$css` and `$script` are absolutely required. They can't be omitted.
- Any files you include should be from the template `webroot` directory or from `external` links.
- All the `script` and `style` tags should be included in the `<head>` section. Do not place script and style blocks anywhere else in the index file.
- The included files order should be as follows:
   - {$css}
   - {$templateCss}
   - any other custom CSS files you want to include
   - `/js/ss/vars.js` (required)
   - `/js/ss/utils/Router.js` (required)
   - {$script}
   - {include file='elements/jQuery.tpl'} (optional)
   - any other custom JS files you want to include

> All the CSS files should be included before any `<script>` tag.

Because the `<title>` is so important for search engines it is a good practice to declare it as follows:
```smarty
<title>
    {if !empty($fullViewItemTitle)}
        {$fullViewItemTitle} -
    {elseif !empty($SitePage.title)}
        {$SitePage.title} -
    {/if}
    {$SiteChannel.title}
</title>
```

The inclusion of the main `template.css` file should be done as follows:

```smarty
<link rel="stylesheet" type="text/css" href="{$templateCss|asset_version}" />
```

All CSS and Javascript files that are included from the `webroot` directory must use the `get_asset_url` Smarty modifier:

```smarty
<link rel="stylesheet" type="text/css" href="{'/css/ext-js-theme.css'|get_asset_url}" />
<script type="text/javascript" src="{'/js/template.js'|get_asset_url}"></script>
``` 

#### \<BODY\> Section

- It's recommended to wrap all positions in a `<div>` with class in the format `tpl-position-{position_name}`: `<div class="tpl-position-header-menu">` or `<div class="tpl-position-content">`
- Because positions can be empty, add a Smarty if statement to make sure the position is not rendered if the position variable is empty.
- To keep a clean structure all the positions styling should be declared in a separate SCSS file called `positions.scss`.
- After adding/deleting positions in the `index.ctp` file don't forget to also add them in the `config.xml` file.

Assuming we have a dark section in which we want to print two positions `header` and `content` we could have the following code (notice the IF statements):
```smarty
<div class="tpl-section-dark">
    {if !empty($header)} //header position IF statement
        <div class="tpl-position-header">
            <div class="tpl-position-header-inner">
                {$header}
            </div>
        </div>
    {/if}
    {if !empty($content)}
        <div class="tpl-position-content">
            <div class="tpl-position-content-inner">
                {$content}
            </div>
        </div>
    {/if}
</div>
```

[Back to top](#summary)

***


### SASS and CSS

Site Stacker templates generally use SASS as the CSS extension, but it's not absolutely required. We will use SASS as example going forward.

All `.scss` files are residing in the `webroot/sass` directory. The compiled `.css` files should be placed in the `webroot/css` directory. The images should be placed in the `webroot/img` directory.

The `webroot` directory structure:

```
> webroot  
  > css
    > Architect
      > Static
        - TitleOnly.css
      > Missionary
    > Components
      > Contributions
        - Checkout.scss
    > Menus
      - HeaderMenu.scss
    > Modules
      > Contributions
        - ShoppingCart.scss
    - global.css
    - positions.css
    - template.css
  > img
  > sass
    > Architect
      > Static
        - TitleOnly.scss
      > Missionary
    > Components
      > Contributions
        - Checkout.scss
    > Menus
      - HeaderMenu.scss
    > Modules
      > Contributions
        - ShoppingCart.scss
    - _variables.scss
    - config.rb
    - global.scss
    - positions.scss
```

The `_variables.scss` file is used the define global variables that will be used throughout the template (text color, link color, headers size, etc.). This file should be included at the top of the other files. Assuming we want to include it in the `webroot/sass/Architect/Static/TitleOnly.scss` file:
```scss
@import "../../variables";
```

The `global.scss` file is where the global styles should be defined, and `positions.scss` should contain styling for the elements in the `index.tpl` file.

Almost all Architect and Menu views will have a corresponding SCSS and CSS file. These will reside in the `Architect` directory categorised by content type, and `Menus` directory respectively.

When styling component pages or modules the SCSS file should be placed in the `sass/Components/{Component}` and `sass/Modules/{Component}` respectively.

All CSS files should be included in `template.css` and this file should only contain `@import` statements:

```css
@import "global.css";
@import "positions.css";

@import "Architect/Static/TitleOnly.css";
@import "Components/Contributions/Checkout.css";
@import "Modules/Contributions/ShoppingCart.css";
@import "Menus/HeaderMenu.css";
....
```    

[Back to top](#summary)
