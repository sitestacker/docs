---
title: Template Multi Appearances
category: Templates
date: 2016-07-26 00:00:00
tags: development,template,sass,compass
readtime: 10
---

This article explains how to add support for multiple appearances ti the same template. This is only working for templates that are using SASS and is achieved by using multiple __config.rb__ files in the same template.

## Required files

In order to have a multi appearance functional template files are required to be created. This are:

| Path | Notes |
| ---- | ----- |
| /webroot/sass/config.rb | Default configuration file |
| /webroot/sass/_default_variables.scss | Default template SCSS variables |
| /webroot/sass/variables/default/_variables.scss | Variables used by the default configuration file |

## Alternate appearance files

For adding alternate appearances to the template you can create additional `*.rb` and `_variables.scss` files. Assuming that you would want to add different appearances for `Client One` and `Client Two` you should add the following files:

| Path | Notes |
| ---- | ----- |
| /webroot/sass/config-client-one.rb | Client One configuration file |
| /webroot/sass/variables/client-one/_variables.scss | Variables used by the Client One configuration file |
| /webroot/sass/config-client-two.rb | Client Two configuration file |
| /webroot/sass/variables/client-two/_variables.scss | Variables used by the Client Two configuration file |

## Config files (*.rb)

> Important:  
>   
> - Any ExtJS theme related configuration should be completely removed from this file.  
> - A new configuration for include paths needs to be specified.

### Default config file (config.rb)

``` ruby
# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
# Generally this will be in a resources/sass folder
# <root>/resources/sass
sass_path = File.dirname(__FILE__)

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
# <root>/resources/css
css_path = File.join(sass_path, "..", "css-default")

# Disable sass cache
# asset_cache_buster = :none
# cache = false

# Minify CSS output
# output_style = :compressed

# Disable SASS line comments in CSS files
# line_comments = false

# Specify include directory
Sass.load_paths << File.join(sass_path, 'variables', 'default')

# Compile other template appearances
on_stylesheet_saved do
  `compass compile -c config-client-one.rb --force`
  `compass compile -c config-client-two.rb --force`
end
```

| Config | Description |
| ------ | ----------- |
| `sass_path` | Specifies which folder should be considered as root by the compiler. In this case is the current `config.rb` file folder which is `/webroot/sass` |
| `css_path` | Specifies where the compiled `CSS` files should be placed. In this case they will be compiled in the `/webroot/css-default` directory
| `Sass.load_paths` | Specifies include folder path. In this case the compiler is instructed to include the files from the `/webroot/sass/default/variables` folder. In other words the following syntax `@import "variables"` in a SCSS file will be treated as `@import "/webroot/sass/variables/default/_variables.scss"` | 

> Note: The last section of the default `config.rb` file will make sure that whenever the default appearance is compiled to the other appearances are also compiled.

### Custom config file (config-[dashed-lowercased-client-name].rb)

``` ruby
# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
# Generally this will be in a resources/sass folder
# <root>/resources/sass
sass_path = File.dirname(__FILE__)

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
# <root>/resources/css
css_path = File.join(sass_path, "..", "css-[dashed-lowercased-client-name]")

# Disable sass cache
# asset_cache_buster = :none
# cache = false

# Minify CSS output
# output_style = :compressed

# Disable SASS line comments in CSS files
# line_comments = false

# Specify include directory
Sass.load_paths << File.join(sass_path, 'variables', '[dashed-lowercased-client-name]')
```

| Config | Description |
| ------ | ----------- |
| `sass_path` | Specifies which folder should be considered as root by the compiler. In this case is the current `config.rb` file folder which is `/webroot/sass` |
| `css_path` | Specifies where the compiled `CSS` files should be placed. In this case they will be compiled in the `/webroot/css-[dashed-lowercased-client-name]` directory
| `Sass.load_paths` | Specifies include folder path. In this case the compiler is instructed to include the files from the `/webroot/sass/variables/[dashed-lowercased-client-name]` folder. In other words the following syntax `@import "variables"` in a SCSS file will be treated as `@import "/webroot/sass/variables/[dashed-lowercased-client-name]/_variables.scss"` |

## Default variable file (*.scss)

This file is __required__ and is located at `/webroot/sass/_default_variables.scss`   
In this file all the default template variables will be declared. All the additional `_variables.scss` files will include this one first making all the variables available.

``` scss
@import "compass/css3";

$fontFamily: "Arial", sans-serif;
$textColor: black;
$backgroundColor: white;
$fontSize: 18px;
```

As you can see in the above example we are declaring 4 default variable for `Font Family`, `Text Color`, `Background Color` and `Font Size`.

## Custom variables (*.scss)

Custom variable files are later included in all the SCSS files defined in the template. This files can be used to create the different appearances.  
Each config file should have a corresponding variables file. As and example we could have:

| Config File | Variables File |
| ----------- | -------------- |
| config.rb | /webroot/sass/variables/default/_variables.scss |
| config-ntm.rb | /webroot/sass/variables/ntm/_variables.scss |
| config-client-one.rb | /webroot/sass/variables/client-one/_variables.scss |

> Note: Notice that the config.rb file is looking for the variables file in the default folder.

> Important: All the __\_variables.scss__` files should start with the following code __@import "../../default_variables";__  
> This will load all the default variables in the current file. If you don't need to override anything just leave it blank but make sure the file is created.

Considering that you want to override the text color and background color variables for NTM appearance we would have the following code in the `/webroot/sass/variables/ntm/_variables.scss` file:

```scss
@import "../../default_variables";

$textColor: green;
$backgroundColor: yellow;
```

## Compiling/Watching the SCSS files

Considering that the `compass compile` and `compass watch` commands needs to be executed with the `-c <config-file>` flag in order to specify the appearance that you want to compile automatic file watchers configured in PhpStorm will not work. You will have to use shell commands:

```bash
# compile everything
compass compile
# watch everything
compass watch --force
```

> Note: Notice that `--force` flag on `watch` command. This is required to make sure that changes in any variable files will trigger a recompiling action.

## Template.css file

> Important:
>
> - After one config file is compiled for the first time and the CSS folder is created make sure to create the `template.css` file like before and add import all the required CSS files. This file need to be created and maintained in each existing CSS folder.
> - After creating a new SCSS file for a new view and the CSS file is generated, make sure you add it to the `template.css` file like before. Also make sure you add the new CSS file to all existing `template.css` files.
> - The `template.css` file is still used by the system when in CSS Debug mode and used to create the `template-all.css` file for production mode.

`template.css` file example:

```css
@import "global.css";
@import "Architect/Wrapper/Basic.css";
@import "Architect/Static/Title.css";
```

## Dynamically include CSS

The template CSS files will always be included in the `<HEAD>` section of the `index.tpl` file. 
 
> Important: Considering that we need to load the template CSS files based on a setting made in admin is is required from now on to always use the Smarty `$templateCss` variable. This variable will always serve the CSS for the selected appearance.

The following code could be used in `index.tpl` file to dynamically include the template CSS:

```html
<link rel="stylesheet" type="text/css" href="{$templateCss}" />
```

## Choosing template appearance in admin

Selecting a template appearance from admin side is very easy. Bellow are the steps that should be followed:

1. Open the Sitestacker admin side 
2. Open Sites component by clicking on the Sites icons
3. Expand the tree until the site channel on witch you want to set a specific appearance
4. Double click the site channel / Right click on the site channel and click on Edit
5. In the Template Theme field select the desired appearance (if no options are available it's probably because the template has a single appearance)
6. Click Save or Save & Close

## Adding ExtJS theme to template

ExtJS theme will not be part of the main template SASS folder anymore. For the templates that support multiple appearances everything related to the ExtJS theme should be placed in the `/webroot/extjs` folder.  
The `/webroot/extjs` folder should look like this:

```
css
    parts
        checklists.css
    ext-js-theme.css
parts
    _all.scss
    checklists.scss
config.rb
ext-js-theme.scss
```

The ExtJS theme should also be included in the `<HEAD>` section of the `index.tpl`  file.  
Example:

```html
<link rel="stylesheet" type="text/css" href="{'/extjs/css/ext-js-theme.css'|get_asset_url}" />
<link rel="stylesheet" type="text/css" href="{$templateCss}" />
```

> Important: The ExtJS theme should be always included before the `$templateCss`

## Example template

For exemplification the [MultiSass](https://git.sitestacker.com/templates/MultiSass) template was created. Feel free to have a look in this template structure for better understanding of how multi appearances are working.