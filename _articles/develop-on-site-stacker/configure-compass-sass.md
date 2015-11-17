---
title: Configure Compass Sass
category: Develop on Site Stacker
date: 2015-11-17 19:00:00
tags: compass,sass
---

### This guide will explain how to install Ruby, Compass and Sass so ExtJS compiling will work correctly.

1. Install Ruby 1.9.3 (any greater version will not work) from [here](http://rubyinstaller.org/downloads/)

2. Install Ruby DevKit for Ruby 1.9.3 form [here](http://rubyinstaller.org/downloads/)
   1. For how to install DevKit read the Quick start section from [here](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit)

3. Install compass 0.12.2 (any greater version might not work)
   1. Run `gem install compass -v 0.12.2`

4. Change the installed SASS version (the one that is installed with compass will not work)
   1. Run `sass -v` to find out the installed SASS version. IE: 3.3.0
   2. Run `gem install sass -v 3.2.5` to install the working SASS version
   3. Run `gem uninstall sass -v 3.3.0` to uninstall the default SASS version. Replace 3.3.0 with whatever version you get in step 4.i

5. Check all the installed version are correct by running the following commands:
   1. `ruby -v` you should get 1.9.3
   2. `compass -v` you should get 0.12.2
   3. `sass -v` you should get 3.2.5

6. Possible errors:
   1. "LoadError on line ["#"] of X: cannot load such file -- compass/import-once/activate"  
Fix by installing Import Once plugin: `gem install compass-import-once`

<tip>
    This steps are required only if you also compiling the SiteStacker ExtJS theme. If you don't need support for ExtJS theme just install the latest versions of Ruby, SASS and Compass.
</tip>
