---
title: Building a Template
category: Templates
date: 2015-05-30 00:00:00
---

#### Summary
- [Things you know before you start](#things-to-know-before-you-start)
- [Directory structure](#directory-structure)
- [The Config File](#the-config-file)
- [The Index File - Available Smarty Variables](#available-smarty-variables)
- [The Index File - Head Section](#head-section)
- [The Index File - Body Section](#body-section)
- [Template Views](#template-views)
- [CSS Class Naming Conventions](#css-class-naming-conventions)

***

#### Things to know before you start

- Strings formatting conventions used in this document

Name | Example
---- | -------
normal | `Some text` or `some other text`
alias | `sometext` or `someothertext`
camelCase | `someText` or `someOtherText`
FullCamelCase | `SomeText` or `SomeOtherText`
dashedAlias | `some-text` or `some-other-text`
underscoredAlias | `some_text` or `some_other_text`

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Except the `normal` formatting there are no spaces allowed.

- All templates are located in `/packages/templates/{TemplateAlias}`. The `{TemplateAlias}` can be any name you want but it needs to be FullCamelCase formatted.

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) For a client called WMtek Global the `{TemplateAlias}` should be **WmtekGlobal**

- All templates are build using Smarty 3. For the Smarty documentation you can visit [this link](http://www.smarty.net/docs/en/).

- Any new template should be created manually file by file. Copying and then modifying an existing template is not a desired technique because there are a lot of unnecessary files that can remain in the new template. They will never be used and they will just slow down the template rendering time.

[Back to top](#summary)

#### Directory Structure

![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/templates/directory-structure.png)

Folder/File | Name Format | Allowed content | Description
----------- | ----------- | ------------------ | -----------
/elements | alias | `.tpl` | Optional folder that you can use for creating elements that will be later included in the main template index file.
/views | alias | `DIR` | This is the main views folder.
/views/{Component} | FullCamelCase | `DIR` | This folder is keeping the views rendered by a specific component.
/views/{Component}/{ContentTypeAlias} | FullCamelCase | `.tpl` | This is keeping the actual view files
/webroot | alias | `DIR` | This is where all the `css`, `fonts`, `images` and `js` files should be placed.
/webroot/css | alias | `DIR`/`.css` | All the template `css` files.
/webroot/css/{Component} | FullCamelCase | `DIR` | All the template `css` files related to a specific component.
/webroot/css/{Component}/{ContentTypeAlias} | FullCamelCase | `.css` | All the template `css` files related to a specific content type. All the `css` files in this folders should be named by the view name. So if we want to create a `css` file for the `Summary` view from the `Article` content type the file path should be `/webroot/css/Architect/Article/Summary.css`.
/webroot/img | alias | `.jpg`,`.png`,`.gif` etc | All the template image files.
/webroot/js | alias | `.js` | All the template `js` files.
/confix.xml | - | - | This is the template configuration files where all the positions, content types and views are declared.
/index.tpl | - | - | This is the main index template file. This file will contain the doctype, any includes, special smarty variables, positions etc.
/system-repository.xml | - | - | Special file used by System Repository. Here you can declare the template name, description, special dependencies, encode exceptions etc.

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) It is very important that you follow this rules otherwise the template might not work as expected, Smarty errors and exceptions might be generated etc.

[Back to top](#summary)

***

### The Config File

The template config file, called `config.xml` is a very simple XML file where we can declare our available positions and views for each content type.  
There are 3 possible nodes with a few properties that you can use in the config file:
- `position` - Used for declaring positions
   - `alias` property - Needs to be an underscoredAlias string. Site Planner will render content into a variable with this `alias`.
   - `name` property - The position name. Used in Site Planner when publishing items.
- `contentType` - Used for declaring content types.
   - `plugin` property - The FullCamelCased component name.
   - `alias` property - The FullCamelCased content type name.
   - `inherit` property - Optional property to inherit views from a different content type.
- `view` - Used for declaring content type views. This needs to be a child of a `contentType` node.
   - `alias` property - Needs to be an underscoredAlias string. Site Planner will render content into a variable with this `alias`.
   - `name` property - The view name. Used in Site Planner when publishing items.

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) There is a special situation when you want to declare content type that will inherit all the views from another content type. In this case the `contentType` node doesn't need to have any children but it need to have the `inherit` extra property declared.

Bellow there is a simple config file example:
````XML
<?xml version="1.0"?>
<template>

    <!-- POSITIONS -->
    <position alias="header_menu" name="Header Menu" />
    <position alias="body_full_blue" name="Full Width Blue" />
    <position alias="footer" name="Footer" />

    <!-- CONTENT TYPE VIEWS - Architect -->
    <!-- declaring the views for the Shared content type. -->
    <contentType plugin="Architect" alias="Shared">
        <view alias="title_only" name="Title Only" />
        <view alias="body_only" name="Body Only" />
    </contentType>

    <!-- declaring the views for the Article content type. -->
    <contentType plugin="Architect" alias="Article">
        <view alias="full" name="Full" />
    </contentType>

    <!-- declaring the views for the PrimaryArticle content type and also inherit all the Shared views. -->
    <contentType plugin="Architect" alias="PrimaryArticle" inherit="Shared">
        <view alias="full" name="Full" />
    </contentType>

    <!-- inheriting the views for the CustomArticle content from the Shared content type. -->
    <contentType plugin="Architect" alias="CustomArticle" inherit="Article"/>

    <!-- CONTENT TYPE VIEWS - Components -->
    <contentType plugin="Components" alias="Page">
        <view alias="default" name="Default" />
    </contentType>

    <!-- CONTENT TYPE VIEWS - Modules -->
    <contentType plugin="Modules" alias="Module">
        <view alias="default" name="Default" />
    </contentType>

    <!-- CONTENT TYPE VIEWS - Menus -->
    <contentType plugin="Menus" alias="Menu">
        <view alias="auto_rendered" name="Auto Rendered" />
        <view alias="unordered_list" name="Unordered List" />
    </contentType>

</template>
````

[Back to top](#summary)

***

### The Index File

#### Available Smarty Variables

Variabel | Description
-------- | -----------
{$meta} | Various meta tags coming from Site, SiteChannel and SitePage settings like `descriptions`, `keywords` etc.
{SiteChannel.title} | The global site channel title.
{SitePage.title} | The current site page title.
{$css} | All the required `css` files from component pages and modules.
{$templateCss} | All the template `css` files. Depending on the CSS debug value this variable can include each file individually or a single unified file.
{$script} | All the required `js` files from component pages and modules.
{$position_alias} | The rendered content of a position. Any position declared in config.xml will generate it's own variable in the index.tpl file based on the position alias [see config file](#the-config-file).

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Because the meta title is so important for web search engines it is a good practice to declare the meta-title tag as follows:
````Smarty
<title>
    {if !empty($SitePage.title)} // we check if the site page title is not empty
        {$SitePage.title} // print site page title if not empty
    {else}
        {$SiteChannel.title} // else print global site channel title
    {/if}
</title>
````

[Back to top](#summary)

#### \<HEAD\> Section

- The 3 template variables `$meta`, `$css` and `$script` are absolutely required. They can't be omitted.
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

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) All the CSS files should be included before any `<script>` tag.

[Back to top](#summary)

#### \<BODY\> Section

- The `<body>` section should only contain `section` and `position` div's.
- All the classes used in the index file should be underscored and separated by dashes.
- Do not use ID's on any DIV's in the index file.
- The sections are defining big areas in the template like "dark section" or "light section". The sections have no publishing management in Site Planner.
- Any section in the index file should have a class respecting the following pattern: `tpl-section-{section-name}`.  
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) `<div class="tpl-section-dark-gray">` or `<div class="tpl-section-light-gray">`
- The positions are used to render content defined in Site Planner. Any position declared in the `config.xml` file should have it's own div placed in the `index.tpl` file.  
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) `<div class="tpl-position-header-menu">` or `<div class="tpl-position-body-full">`
- Any position div should be wrapped in a section div.  
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Add any position div in a Smarty if statement to make sure the position is not rendered if the position variable is empty.
- To keep a clean structure all the positions styling should be declared in a separate CSS file called `positions.css`.
- After adding/deleting positions in the `index.ctp` file don't forget to also add them in the `config.xml` file.
- It is a good practice to wrap the sections and position variables in a double div to give more flexibility when building the CSS.

![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) Assuming we have a dark gray section in witch we want to print 2 positions header and body full we could have the following code. Notice the IF statements and the double div's for section and positions.
````PHP
{if !empty($header) || !empty($full_body)} //global section IF statement
    <div class="tpl-section-dark-gray">
        <div class="tpl-section-dark-gray-inner"> //double section div
            {if !empty($header)} //header position IF statement
                <div class="tpl-position-header">
                    <div class="tpl-position-header-inner"> // double position div
                        {$header}
                    </div>
                </div>
            {/if}
            {if !empty($full_body)} //full body position IF statement
                <div class="tpl-position-full-body">
                    <div class="tpl-position-full-body-inner"> // double position div
                        {$full_body}
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
````

[Back to top](#summary)

***

#### Template Views

- All the views are included in the `views` folder, in a `/views/{Component}/{ContentTypeAlias}/{view_name}.tpl`.   
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) `/views/Architect/Article/full_view.tpl` or `/views/Modules/Module/default.tpl`
- The first element in each view should be a wrapper div and should contain a class like `tpl-{component-alias}-{content-type-alias}-{view-name}`.      
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) `tpl-architect-giving-project-summary-with-giving-form` or `tpl-menus-menu-header-menu`   
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) No matter how long this class will be just stick to this convention.
- Each view should have a corresponding CSS file following this directory structure: `/css/{Component}/{ContentTypeAlias}/{view_name}.css`.   
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/example.png) `/css/Architect/Article/full_view.tpl` or `/css/Modules/Module/default.tpl`   

![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) There is an exception for the `component-page` and `module` views where there is no need for a wrapper div.

**Bellow you can find a few views examples:**   
- Title only view for Article:
````PHP
<div class="tpl-architect-article-title-only">
    {$title}
</div>
````

- Default Component view or deafult Module view:
````PHP
{$body}
````

- Unordered list Menu view:
````PHP
<ul class="tpl-menus-menu-unordered-list">
    {foreach $items AS $item}
        <li>
            <a href="{$item.url}" target="{$item.target}">{$item.text}</a>
            {if $item.children|@count > 0}
                <ul>
                    {foreach name=subitems from=$item.children item=subitem}
                        <li class="subitem {if $smarty.foreach.subitems.first}first{/if} {if $smarty.foreach.subitems.last}last{/if}">
                            <a href="{$subitem.url}" target="{$subitem.target}">{$subitem.text}</a>
                        </li>
                    {/foreach}
                </ul>
            {/if}
        </li>
    {/foreach}
</ul>
````

[Back to top](#summary)

***

#### Template View Inheritance

* **For development**  
One of the cases inherited views are useful is for template development on a local SiteStacker installation. As an example, most template will have an Article content type, however the configuration of the content type will be slightly different. Because you can only have one content type with the alias Article on your installation you wouldn't be able to create multiple configurations and still test the templates locally.  
So, by using inherited views you would create the ClientOneArticle and ClientTwoArticle content types and you would add these lines in the config.xml files of the template:

````XML
<contentType plugin="Architect" alias="ClientOneArticle" inherit="Article"/>
````

````XML
<contentType plugin="Architect" alias="ClientTwoArticle" inherit="Article"/>
````

* **For view sharing**  
View inheritance is useful for sharing common views between multiple content types. Instead of creating identical files for each content type you can create it just once in a Shared content type. This will be helpful in the long run when doing maintenance on these views.
````XML
<contentType plugin="Architect" alias="SharedContent">
    <view alias="my_shared_view_1" name="MySharedView1" />
    <view alias="my_shared_view_2" name="MySharedView2" />
</contentType>
<contentType plugin="Architect" alias="Article" inherit="SharedContent">
    ....
</contentType>
<contentType plugin="Architect" alias="Project" inherit="SharedContent">
    ....
</contentType>
````

[Back to top](#summary)

***

#### CSS Guidelines

- On a live site, all template CSS files will be automatically merged to increase performance. For this to happen, you need to create a `template.css`, where the only allowed content are `@import` statements. No comments or CSS rule declarations are allowed in this file. Bellow you can see a `template.css` file example:
````PHP
@import "global.css";
@import "fonts.css";
@import "positions.css";
@import "Architect/Article/TitleOnly.css";
@import "modules/Users/Register.css";
````

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) Read the [The Index File - Head Section](#head-section) for details on what Smarty variable need to be used in order for this to work.

- There is also some CSS code that needs to exists in every template, so we recommend creating a `global.css` file and add the following code to the top of the file:
    - The first block will ensure that when you give a div the width of 100% and it also has some padding for example, the padding will be subtracted from that 100%. Also when an element has some border will not add that border over the 100% width but it will subtract it from the available width. This is for making the template responsive.
    - The second block is a css class that can be used throughout the site as seen in the index.tpl example to clear any floating elements.
````CSS
body * {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.clearfix:after {
    clear: both;
    content: ".";
    display: block;
    font-size: 0;
    height: 0;
    visibility: hidden;
}
````

[Back to top](#summary)

***

#### CSS Class Naming Conventions

- All classes in a template should start with `tpl-`.
- Positions should follow this format: `tpl-position-{position-name}`.
- Views should follow this format: `tpl-{component-alias}-{content-type-alias}-{view-name}`.
- For component pages, the main wrapper should contain a combined class like: `<div class="{component-alias} page-{item-name}>`. For example the Checkout page of the Contributions component should look like: `<div class="contributions page-checkout">...<div>`.
- For modules, the main wrapper should contain a combined class like: `<div class="{component-alias} module-{item-name}">`. For example the Login module of the Users component should look like: `<div class="users module-login">...<div>`.    

[Back to top](#summary)