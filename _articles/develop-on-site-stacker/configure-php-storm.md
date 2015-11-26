---
title: Configure PHPStorm
category: Develop on Site Stacker
date: 2015-11-17 19:00:00
tags: php storm, editor
---

This guide will explain how to correctly configure PHPStorm for best development experience.

#### Setting up the resource directory

Open PHPStorm settings window (File > Settings or Ctrl+Alt+S)

1. In the left panel navigate to and expand `Project` and then click on `Directories`
2. In the right panel select the SiteStacker `webroot` directory
3. Click on `Resource Root` button from the top toolbar

<note>
This will make PHPStorm know that the webroot folder is holding all the possible assets and will offer paths auto completion.
</note>

#### Marking `lib` and `app` duplicated PHP files as Plain text  
Each file located in `App/Lib` has a corresponding file in `lib/Cake`. In order to have correct auto completion when using CakePHP methods in your code make sure that each file found in `App/Lib` has the corresponding file in `Lib/Cake` marked as plain text. You can do this by right clicking the file and choosing the `Mark as plain text` option.

#### Marking `webroot/lib` files as Plain text
PHPStorm is building the JS auto complete options by reading every JS file found in the `Resource` directory which is the `webroot` folder. Because SiteStacker has a lot of JS libraries in the `webroot/lib` folder, PHPStorm will sometime become unresponsive and offer very slow JS auto completion. To fix this you can `Mark as plain text` every JS and CSS file found in `webroot/lib`. This can take some time but it will dramatically improve PHPStorm functionality and responsiveness.

#### Required and Optional [PHPStorm plugins](https://www.jetbrains.com/phpstorm/help/installing-updating-and-uninstalling-repository-plugins.html)
We have a list of required and optional plugins that you need to install. Here is the list:

1. **EditorConfig** (==REQUIRED==) - This plugin will make sure that all the developers are using the same indents and EOL's on different file types.
2. **MultiMarkdown** (OPTIONAL) - Enable support for Markdown `.md` files.
3. **.gitignore** (OPTIONAL) - Enable support for `.gitignore` files.
4. **Database Tools and SQL** (OPTIONAL) - Enable MySQL and MSSQL support and syntax highlighting.