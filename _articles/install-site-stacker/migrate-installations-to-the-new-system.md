---
title: Migrate installations to the new system
category: Install Site Stacker
date: 2016-01-07 00:00:00
---

This article explains how to migrate an existing (old) Site Stacker
installation to the new system that uses the Site Stacker Service
and the new System Manager.

## Prerequisites

You need access to the web server where Site Stacker is installed
(either RDP access for Windows or SSH for Linux).
All the actions below need to be run on this server.

Also **all available updates in System Manager should be run** prior to the
migration. This is because the
installation will be migrated to the latest stable version of Site Stacker,
so it will get all available updates once the migration takes place.

Before migrating, make sure System Manager shows a clean state:

![System Manager](https://git.sitestacker.com/sitestacker/docs/uploads/066152ec7f3da827b7eba13b77fc67fa/image.png)

## Install the Site Stacker Service

*At this point you should be logged in into the web server.*

[See the section on how to install the service here](install-on-production#install-the-site-stacker-service).

## Migrate the installation

Once you have the service installed, you can migrate the files by
running the `sitestacker migrate` command on the remote server's cli. As
always you should check the command's help first: `sitestacker migrate -h`.

It is recommended to run the command with the `--dry-run` (`-n`) flag
first to check for errors without making any changes. The command is
as following:

```sh
$ sitestacker migrate -u <user> [--dry-run] [<path-to-sitestacker>]
```

Where:

- `<user>` is the client's GitLab user created when you installed the service
- `[<path-to-sitestacker>]` is the path to the Site Stacker root; this is
optional if you're already in the directory you want to migrate

An example of a successful migration looks like this:

```sh
# we're already in 'C:\inetpub\wwwroot\sitestacker'
$ sitestacker migrate -u <user>
Password: *****
initializing sitestacker at 'C:\inetpub\wwwroot\sitestacker'
packages/components/MyComponent
packages/templates/Clean
```

After the `migrate` command runs successfully, run the `doctor` command to make
sure everything is working fine:

```sh
$ sitestacker doctor --ignore-reqs '<URL>'
```

<note>
The `<URL>` is where the system can be accessed in the browser. Also we're
ignoring any server requirements problems (`--ignore-reqs`) because the
system already ran on this server, although any errors should be examined.
</note>

### Done

:thumbsup: At this point the installation is migrated and the system should be
working as normal. To check the new System Manager, refresh the admin interface
and click on the System Manager icon. The new UI should open in a new tab.

### Configure branch filters

One thing you might want to do is to filter the branches that are visible
in System Manager, so the installation only receives updates from those branches.

You can do this in System Manager, by clicking the bottom right icon to
open **Settings** and follow the instructions there.
