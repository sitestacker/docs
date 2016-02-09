---
title: Migrate installations to the new system
category: Install Site Stacker
date: 2016-01-27 00:00:00
readtime: 3
---

This article explains how to migrate an existing (old) Site Stacker installation to the new system that uses the Site Stacker Service and the new System Manager.

## Prerequisites

You need access to the web server where Site Stacker is installed (either RDP access for Windows or SSH for Linux). All the actions below need to be run on this server.

Also **all available updates in System Manager should be run** prior to the migration. This is because the installation will be migrated to the latest stable version of Site Stacker, so it will get all available updates once the migration takes place.

Before migrating, make sure System Manager shows a clean state:

![System Manager](https://git.sitestacker.com/sitestacker/docs/uploads/066152ec7f3da827b7eba13b77fc67fa/image.png)

## Install the Site Stacker Service

*At this point you should be logged in into the web server.*

[See the section on how to install the service here](install-on-production#install-the-site-stacker-service).

## Migrate the installation

Once you have the service installed, you can migrate the files by running the `sitestacker migrate` command on the remote server's cli. As always you should check the command's help first: `sitestacker migrate -h`.

The command is:

```sh
sitestacker migrate -u <user> [--dry-run] [<path-to-sitestacker>]
```

Where:

- `<user>` is the client's GitLab user created when you installed the service
- `[<path-to-sitestacker>]` is the path to the Site Stacker root; this is optional if you're already in the directory you want to migrate

### Ensure proper access for the user

Before you can run the `migrate` command, the `<user>` you'll be using with the command needs to have at least *Reporter* access for the [`sitestacker/sitestacker`](https://git.sitestacker.com/sitestacker/sitestacker) repository. After this access is granted [in GitLab](https://git.sitestacker.com/sitestacker/sitestacker/project_members), running the command in `--dry-run` (`-n`) mode will tell you all the repositories he needs access to:

```sh
$ sitestacker migrate -u <user> -n
Password: *******
cloning sitestacker into temporary location '/tmp/sitestacker-migrate-081162076'
packages/templates/Clean
error: Unexpected HTTP status code: 404
packages/themes/Contributions/LifeUnited
error: Unexpected HTTP status code: 404
No changes were made because the --dry-run (-n) flag was specified.
```

In the output you see that the `<user>` needs (at least) *Reporter* access to [`templates/Clean`](https://git.sitestacker.com/templates/Clean) and [`themes/Contributions-LifeUnited`](https://git.sitestacker.com/themes/Contributions-LifeUnited) repositories. Once it has the proper access, you should see no errors:

```sh
$ sitestacker migrate -u <user> -n
Password: *******
cloning sitestacker into temporary location '/tmp/sitestacker-migrate-791163659'
packages/templates/Clean
packages/themes/Contributions/LifeUnited
No changes were made because the --dry-run (-n) flag was specified.
```

At this point you can do the actual migration.

### Perform the migration

An example of a successful migration looks like this:

```sh
# we're already in 'C:\inetpub\wwwroot\sitestacker'
$ sitestacker migrate -u <user>
Password: *****
initializing sitestacker at 'C:\inetpub\wwwroot\sitestacker'
packages/templates/Clean
packages/themes/Contributions/LifeUnited
```

After the `migrate` command runs successfully, run the `doctor` command to make sure everything is working fine:

```sh
$ sitestacker doctor '<URL>'
```

<note>
The <code>&lt;URL&gt;</code> is where the system can be accessed in the browser.
</note>

:thumbsup: At this point the installation is migrated and the system should be working as normal. To check the new System Manager, refresh the admin interface and click on the System Manager icon. The new UI should open in a new tab.

### Configure branch filters

One thing you might want to do is to filter the branches that are visible in System Manager, so the installation only receives updates from those branches.

You can do this in System Manager, by clicking the bottom right icon to open **Settings** and follow the instructions there.

## Troubleshooting

### sh: Console/cake: Permission denied

If you get this error when opening System Manager, it's most probably because SELinux prevents Apache from executing the Cake executable. In `syslog` you will see something like this:

> Jan 26 12:22:52 web audit: <audit-1400> avc:  denied  { execute } for  pid=27429 comm="sh" name="cake" dev="dm-0" ino=1076943158 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:httpd_sys_rw_content_t:s0 tclass=file permissive=0

To fix this problem, you need to change the SELinux fcontext to `httpd_sys_script_exec_t` for the Cake executable using:

```sh
# note: replace `/var/www/html` with your own path
$ semanage fcontext -a -t httpd_sys_script_exec_t /var/www/html/App/Console/cake
$ restorecon -R -v /var/www/html/App/Console/cake
restorecon reset /var/www/html/App/Console/cake context unconfined_u:object_r:httpd_sys_rw_content_t:s0->unconfined_u:object_r:httpd_sys_script_exec_t:s0
```

If you get an error like `ValueError: Type httpd_sys_script_exec_t is invalid, must be a file or device type`, you can list available SELinux contexts using:

```sh
$ semanage fcontext -l |grep httpd_sys
/srv/([^/]*/)?web(/.*)? all files system_u:object_r:httpd_sys_content_t:s0
/srv/([^/]*/)?www(/.*)? all files system_u:object_r:httpd_sys_content_t:s0
/var/www(/.*)? all files system_u:object_r:httpd_sys_content_t:s0
/var/www/[^/]*/cgi-bin(/.*)? all files system_u:object_r:httpd_sys_script_exec_t:s0
/etc/htdig(/.*)? all files system_u:object_r:httpd_sys_content_t:s0
/var/www/svn(/.*)? all files system_u:object_r:httpd_sys_rw_content_t:s0
...
```

To check the SELinux status use:

```sh
$ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      29
```

If anything goes wrong you can temporarily change SELinux to `permissive` mode using:

```sh
$ setenforce 0
```
