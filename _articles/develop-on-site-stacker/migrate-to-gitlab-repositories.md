---
title: Migrate to GitLab repositories
category: Develop on Site Stacker
date: 2015-11-08 00:00:00
---

<note>
This guide is intended for Site Stacker developers that currently work on
the repository cloned from **ssrepository.com**. If you have
any issues [leave a comment](#disqus).
</note>

The Site Stacker repository was migrated to an on-premise installation of
[GitLab](https://about.gitlab.com) at https://git.sitestacker.com
and **will not accept any new push**.
Everyone that was working on that repository will need to clone Site Stacker
from the new location.

## New Repositories

Besides migrating to GitLab, the old Site Stacker repository was
split into multiple repositories, as follows:

- a core repository at [`sitestacker/sitestacker.git`](https://git.sitestacker.com/sitestacker/sitestacker) that includes everything Site Stacker, but without the repos below
- client components have their own repositories at [`components/<component>.git`](https://git.sitestacker.com/components)
- all templates are in separate repositories at [`templates/<template>.git`](https://git.sitestacker.com/templates)
- client themes have their own repositories at [`themes/<component>-<theme>.git`](https://git.sitestacker.com/themes)

![gitlab_migration](https://git.sitestacker.com/sitestacker/docs/uploads/c68529d59b9009b69adeb2b42a73c60b/gitlab_migartion_2.png)

## Migrate

### Backup current folder

The easiest method is to rename your old directory and clone the
new repository in place. This way you'll keep safe any local changes that
you haven't pushed yet or untracked files, so you can come back to them.

On Windows, simply rename the old directory in Windows Explorer.

On OS X, use the `mv` command, e.g.
`mv ~/Sites/sitestacker ~/Sites/sitestacker-old-repo`.

### GitLab account

Before you can clone the new repositories, you'll need a
[Site Stacker GitLab](https://git.sitestacker.com) account.
You should already have one.

If you can't log in, try [resetting your password](https://git.sitestacker.com/users/password/new)
first by entering the email you used with the old repository. If you get
"Email not found", contact calin@wmtek.com.

### Clone URL

You can clone any [Site Stacker GitLab](https://git.sitestacker.com)
repositories using two URLs:

1. `git@git.sitestacker.com:<group>/<repo>.git` (through SSH)
2. `https://git.sitestacker.com/<group>/<repo>.git` (through HTTPS)

Method #1 (through SSH) is recommended because it is faster and doesn't
require you to specify the USER and PASSWORD. To be able to use it
you need to [configure an SSH Key](http://doc.gitlab.com/ce/ssh/README.html).

<note>
If you're using [PhpStorm](https://www.jetbrains.com/phpstorm) you can use method #2 because PhpStorm
stores your [GitLab login credentials](#gitlab-account) so you don't have
to keep entering them.
</note>

### Clone Site Stacker core

Below you'll find instructions for:

- [PhpStorm](#using-phpstorm) (recommended because it is easier)
- [Terminal](#using-the-terminal)

#### Using PhpStorm

In PhpStorm, use _Check out from Version Control_ as shown below:

![PhpStorm Clone](https://git.sitestacker.com/sitestacker/docs/uploads/6e9eebb784c864e3656303d04215b8f4/Screen_Shot_2015-11-09_at_2.06.48_PM__2_.png)

Enter the repository URL and local path:

![PhpStorm Clone URL](https://git.sitestacker.com/sitestacker/docs/uploads/1051dfc1a0e2f63e95f13eba8f13ceb0/PHPStorm_Checkout_1.PNG)

And you'll be prompted for a login and password. These are the same as your
[GitLab account](#gitlab-account) (either username or email will work):

![GitLab user pwd](https://git.sitestacker.com/sitestacker/docs/uploads/1275371b7c155eab2edd4840fdd348a6/PHPStorm_Checkout_2.PNG)

After cloning, you'll be prompted to open the directory. If you want
to keep your previous settings you may chose
_No_, and copy the `.idea/` directory from your old folder.

![open directory](https://git.sitestacker.com/sitestacker/docs/uploads/8d50786aa9d8a99fead80ba479c35d10/image.png)

#### Using the terminal

```sh
# using SSH (replace "~/Sites/sitestacker" with your own path)
git clone "git@git.sitestacker.com:sitestacker/sitestacker.git" ~/Sites/sitestacker

# OR

# using HTTPS (replace "~/Sites/sitestacker" with your own path)
git clone "https://git.sitestacker.com/sitestacker/sitestacker.git" ~/Sites/sitestacker
cd ~/Sites/sitestacker
```

### Configure the new installation

At this point you have Site Stacker core successfully cloned from GitLab.

#### Configure the git identity

It is ==VERY IMPORTANT== to correctly [configure the git identity](#configure-git-identity)
before pushing any commits, to avoid your push being rejected.

#### Copy your `database.php` and `email.php` files

Copy the `database.php` and `emai.php` files from your old folder into
the new clone at `App/Config/`.

#### Copy the `data` dir

Copy the `webroot/data/` directory from your old folder into the new clone.
This folder is ignored in git so you need to manually copy it over.

#### Copy unversioned files

If you had unversioned files in your old project, you may copy them over.

<tip>
<title>ProTip: Ignore unversioned files in webroot</title>
If you have unversioned files in `webroot/` (e.g. user uploaded files)
you can create a [`webroot/.gitignore`](https://git-scm.com/docs/gitignore)
file and exclude those files. This `.gitignore` file will be ignored
by git, so you don't have to worry about it.
</tip>

#### Run After VCS Update

Go at `http://<your-ss-domain>/dev` in the browser and run
the _Run After VCS Update_ action to set up the symlinks.

#### Done

You should now be able to access the Site Stacker admin interface.
See below for information about templates, client components and client themes.

### Clone components, templates, themes

You'll notice your new Site Stacker folder doesn't include any templates,
*client* components or *client* themes. You'll need to clone these separately.
You don't need to clone them all at once, clone only what you need.

Below you can see the GitLab URL path and the corresponding local path within
Site Stacker for any component, template and theme.

Repo type | GitLab URL Path | Local Path
----------|------------|-----------
components | `<GITLAB-URL>components/<Component>.git` | `packages/components/<Component>`
templates | `<GITLAB-URL>templates/<Template>.git` | `packages/templates/<Template>`
themes | `<GITLAB-URL>themes/<Component>-<Theme>.git` | `packages/themes/<Component>/<Theme>`

You can get the url of any repository you want to clone in GitLab:

![GitLab URL](https://git.sitestacker.com/sitestacker/docs/uploads/a4ead2363576d1d99a3054d32ca2ce51/gitlab-url.png)

You can see all the available templates in the
[`templates/`](https://git.sitestacker.com/templates) group (right side).

You can see all the available components in the
[`components/`](https://git.sitestacker.com/components) group (right side).

You can see all the available themes in the
[`themes/`](https://git.sitestacker.com/themes) group (right side).
Notice the theme name includes the component and the theme, separated by a `-`
(dash), as in `COMPONENT-THEME`.

#### Cloning subrepos from PhpStorm

If you use PhpStorm, you can clone these subrepos using the
_Check out from Version Control_ function:

![PhpStorm Checkout](https://git.sitestacker.com/sitestacker/docs/uploads/eb3da8b294cd4656bcb21350d3b54662/phpstorm-clone.png)

If cloning a template, make sure you create the `templates` folder, if
doesn't exist:

![create-templates-folder](https://git.sitestacker.com/sitestacker/docs/uploads/94daf14e28030213214a892ac4e9db05/image.png)

To clone the `Wmtek` template, you would use something like this:

![clone-wmtek-tpl](https://git.sitestacker.com/sitestacker/docs/uploads/c0727e26d00ee382f107472f43cbd0b5/image.png)

When prompted to open the directory, chose _No_.

<important>
<title>Configure the Git Identity</title>
If you haven't [configured it globally](#configure-the-git-user-globally),
you'll need to [configure your git identity](#configure-the-git-user-per-repository)
for every repository you clone.
</important>

#### Cloning subrepos from terminal

If you're using the terminal, you can use `git clone` with the
appropriate URL and path, ==from the Site Stacker root==:

```sh
# template (replace <CLONE-URL> and TEMPLATE, twice)
git clone <CLONE-URL>templates/TEMPLATE.git packages/templates/TEMPLATE

# component (replace <CLONE-URL> and TEMPLATE, twice)
git clone <CLONE-URL>components/COMPONENT.git packages/components/COMPONENT

# theme (replace <CLONE-URL>, COMPONENT and THEME, twice)
git clone <CLONE-URL>themes/COMPONENT-THEME.git packages/themes/COMPONENT/THEME
```

## Configure Git Identity

The repositories will reject any commit that has an unknown author
(the user **name** and **email** needs to match the user in GitLab).

Assuming your user name in GitLab is **Joe Doe** and the email is
**joedoe@example.com**, you can configure the git user globally
*(recommended)* or per repository.

#### Configure the git user globally

```sh
git config --global user.name "Joe Doe"
git config --global user.email "joedoe@example.com"
```

#### Configure the git user per repository

<note>
If you didn't configure your git user globally, you'll need to do this ==for
every== Site Stacker repository you cloned (e.g. core, templates, components...).
</note>

```sh
# inside a repository
git config user.name "Joe Doe"
git config user.email "joedoe@example.com"
```

## No more `system_repository.xml`

The `system_repository.xml` file that was required in every package
is no longer needed and SHOULD NOT BE INCLUDED ANYMORE, even though
System Repository warns about it.

## Synchronous branch control in PhpStorm

When you first click on the branch popup menu (bottom right), you'll see
a notice about **Synchronous branch control enabled**:

![synchronous branch control](https://git.sitestacker.com/sitestacker/docs/uploads/2e8e17cf51d01158ea9b071392a2ebc3/synchronous-branch.png)

This is usually not desirable so you should ==disable== it by unchecking it here:

![uncheck-synchronous-branch](https://git.sitestacker.com/sitestacker/docs/uploads/697af6627d18c5a240f1f33a13bf78d5/uncheck-sync-branch.png)

## Fix permissions on OS X

The webserver needs to be able to write to some paths. On a development
machine, you can set your webserver to run as your user,
to avoid any issues related to permissions. *DO THIS ONLY IF YOU UNDERSTAND
THE IMPLICATIONS!*

### Apache

To change the user in Apache, you need to modify the
`/etc/apache2/httpd.conf` file. Open it in your editor of choice
==with `sudo`== and search for lines that look like this:

```apache
#
# If you wish httpd to run as a different user or group, you must run
# httpd as root initially and it will switch.  
#
# User/Group: The name (or #number) of the user/group to run httpd as.
# It is usually good practice to create a dedicated user and group for
# running httpd, as with most system services.
#
User _www
Group _www
```

Change them to match your user and group, for example:

```apache
User calin
Group staff
```

To find your user and group, do a `ls -l` in a random directory, e.g.:

```sh
$ ls -l
total 16
drwxr-xr-x  18 calin  staff  612 Nov  9 13:55 App
-rw-r--r--   1 calin  staff  113 Nov  9 13:55 README.md
```

It's recommended to delete the session files as well:

```sh
sudo rm -f /var/tmp/sess_*
```

Restart apache:

```sh
sudo apachectl restart
```
