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

For adding alternate appearances to the template you can create additional `*.rb` and `_variables.scss` files. Assuming that you would want to add different appearances for `Client One` and `Client Two` you should add the follosing files:

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
```

| Config | Description |
| ------ | ----------- |
| `sass_path` | Specifies which folder should be considered as root by the compiler. In this case is the current `config.rb` file folder which is `/webroot/sass` |
| `css_path` | Specifies where the compiled `CSS` files should be placed. In this case they will be compiled in the `/webroot/css-default` directory
| `Sass.load_paths` | Specifies include folder path. In this case the compiler is instructed to include the files from the `/webroot/sass/default/variables` folder. In other words the following syntax `@import "variables"` in a SCSS file will be treated as `@import "/webroot/sass/variables/default/_variables.scss"` | 

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
| config.rb | /webroot/sass/variables/deafult/_variables.scss |
| config-ntm.rb | /webroot/sass/variables/ntm/_variables.scss |
| config-client-one.rb | /webroot/sass/variables/client-one/_variables.scss |

> Note: Notice that the config.rb file is looking for the variables file in the deafult folder.

> Important: All the __\_varibales.scss__` files should start with the following code __@import "../../default_variables";__  
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

## Dynamically include the CSS files in the index.tpl file
 
 To be made.

## Choosing template appearance in admin

To be made.

## Adding ExtJS theme to template

To be made.