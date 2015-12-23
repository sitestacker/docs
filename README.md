# Site Stacker Docs

This repository provides guides and resources for Site Stacker
developers.

## Get Started

If you want to clone this repository and make changes on your
local machine, you'll need [Ruby](https://www.ruby-lang.org/),
[Bundler](http://bundler.io/) and
[Jekyll](http://jekyllrb.com/).

For details on how to install the first two, see
[Using Jekyll with Pages](https://help.github.com/articles/using-jekyll-with-pages/),
specifically the [Installing Jekyll](https://help.github.com/articles/using-jekyll-with-pages/#installing-jekyll)
section. Skip the Jekyll install (step #3) since it will be installed
automatically when you run `bundle install` from the root of this
repository.

If you're on Windows see [Jekyll on Windows](http://jekyllrb.com/docs/windows/) or follow these steps:
- Install Ruby version 2.0.0 [download](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.0.0-p647.exe)
    - It will not work with higher version of Ruby
- Download Development Kit and extract it to the Ruby installation directory [download](http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe)
- Install Python version 2.7.10 [download](https://www.python.org/ftp/python/2.7.10/python-2.7.10.msi)
    - It will not work with higher version of Pyhton
- From CMD/PowerShell go into Development Kit and run `ruby dk.rb init` then `ruby dk.rb install`
- Clone Docs repository from [https://github.com/sitestacker/docs.git](https://github.com/sitestacker/docs.git)
- From CMD/PowerShell go into cloned repository directory and run `bundle install`. This will install Jekyll and all it's dependencies
- After everything is installed run `jekyll serve`
- If all went ok you should be able to access SiteStacker Docs by pointing you browser to localhost:4000.
    - Keep the CMD/PowerShell window open while developing because it will trace any change you do in your code and automatically compile them.

I had success installing all this using [chocolately](https://chocolatey.org/).
Note that I had Python and Node.js already installed:

```PowerShell
$ python --version
Python 2.7.10
$ node --version
v5.1.1
```

The commands I run from an administrator PowerShell are:

```PowerShell
$ choco install ruby --version 2.1.7 -y
$ choco install ruby2.devkit -y
# follow the instructions here: https://github.com/oneclick/rubyinstaller/wiki/Development-Kit#4-run-installation-scripts
# basically add '- C:/tools/ruby21' to 'C:\tools\DevKit2\config.yml' and run 'ruby dk.rb install' in the DevKit root
$ gem install bundler
```

After you have all the requirements, you can clone and install Jekyll:

```sh
git clone https://github.com/sitestacker/docs
cd docs
bundle install
```

**Patch jekyll to work with Extension-less URLs**

To mimic the GitHub Pages functionality regarding the .html extension,
jekyll 2.x needs to be patched with
[jekyll/jekyll#3452](https://github.com/jekyll/jekyll/pull/3452).

To find out where jekyll is installed, see
[How can I find where gem files are installed?](http://stackoverflow.com/a/19072136/1104534).
For example on OS X the file is at `/Library/Ruby/Gems/2.0.0/gems/jekyll-2.4.0/lib/jekyll/commands/serve.rb`
and on Windows is at `C:\tools\ruby21\lib\ruby\gems\2.1.0\gems\jekyll-2.4.0\lib\jekyll\commands\serve.rb`.

To access the site locally, run:

```sh
bundle exec jekyll serve
```

You can now access the site at [http://127.0.0.1:4000](http://127.0.0.1:4000).

This command should watch for every file change, but in case you
don't see the changes stop and run the command again.
