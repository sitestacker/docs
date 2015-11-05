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

#### Using PhpStorm

In PhpStorm, use _Check out from Version Control_ as shown below:

![PhpStorm Clone](https://git.sitestacker.com/sitestacker/docs/uploads/6e9eebb784c864e3656303d04215b8f4/Screen_Shot_2015-11-09_at_2.06.48_PM__2_.png)

Enter the repository URL and local path:

![PhpStorm Clone URL](https://git.sitestacker.com/sitestacker/docs/uploads/1051dfc1a0e2f63e95f13eba8f13ceb0/PHPStorm_Checkout_1.PNG)

And you'll be prompted for a login and password. These are the same as your
[GitLab account](#gitlab-account):

![GitLab user pwd](https://git.sitestacker.com/sitestacker/docs/uploads/1275371b7c155eab2edd4840fdd348a6/PHPStorm_Checkout_2.PNG)

#### Using the terminal

```sh
# using SSH (replace "~/Sites/sitestacker" with your own path)
git clone "git@git.sitestacker.com:sitestacker/sitestacker.git" ~/Sites/sitestacker

# using HTTPS (replace "~/Sites/sitestacker" with your own path)
git clone "https://git.sitestacker.com/sitestacker/sitestacker.git" ~/Sites/sitestacker
# you'll be asked to enter your GitLab credentials
cd ~/Sites/sitestacker
```

#### Copy your `database.php` and `email.php` files

Copy the `database.php` and `emai.php` files from your old folder into
the new clone at `App/Config/`.

#### Run After VCS Update

After you cloned the Site Stacker core repository, don't forget to
run the _Run After VCS Update_ action from `/dev` to set up the symlinks.

<important>
At this point you should configure your [git identity](#configure-git-identity)
so you can commit without problems.
</important>

### Clone components, templates, themes

You'll notice your new Site Stacker folder doesn't include any templates,
client components or client themes. You'll need to clone these separately.
You don't need to clone them all at once, clone only what you need.

<note>
The commands below should be run from the Site Stacker root folder.
</note>

#### Clone a template

You can see all the available templates in the
[`templates/`](https://git.sitestacker.com/templates) group (right side).
You can clone any template in there with:

```sh
# replace TEMPLATE twice with your template name
# replace <CLONE-URL>
git clone <CLONE-URL>templates/TEMPLATE.git packages/templates/TEMPLATE
```

<important>
After you add one or more templates to your repository, don't forget to
run the _Run After VCS Update_ action from `/dev`.
</important>

#### Clone a component

You can see all the available components in the
[`components/`](https://git.sitestacker.com/components) group (right side).
You can clone any component in there with:

```sh
# replace COMPONENT twice with your component name
# replace <CLONE-URL>
git clone <CLONE-URL>components/COMPONENT.git packages/components/COMPONENT
```

<important>
After you add one or more components to your repository, don't forget to
run the _Run After VCS Update_ action from `/dev`.
</important>

#### Clone a theme

You can see all the available themes in the
[`themes/`](https://git.sitestacker.com/themes) group (right side).
Notice the theme name includes the component and the theme, separated by a `-`
(dash), as in `COMPONENT-THEME`.

```sh
# replace COMPONENT and THEME twice with your component and theme name
# replace <CLONE-URL>
git clone <CLONE-URL>themes/COMPONENT-THEME.git packages/themes/COMPONENT/THEME
```

<important>
After you add one or more themes to your repository, don't forget to
run the _Run After VCS Update_ action from `/dev`.
</important>

## Configure Git Identity

The repositories will reject any commit that has an unknown author
(the user **name** and **email** needs to match the user in GitLab).

Assuming your user name in GitLab is **Joe Doe** and the email is
**joedoe@example.com**, you can configure the git user globally or
per repository.

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