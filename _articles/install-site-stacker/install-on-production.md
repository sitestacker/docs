---
title: Install on Production
category: Install Site Stacker
date: 2015-12-23 00:00:00
---

This guide will run you trough the process of installing a fresh copy of
Site Stacker on a production server.

## Prerequisites

To install Site Stacker, you need to have access to the web server (either
RDP access for Windows or SSH for Linux), and the credentials for connecting
to the database server.

Also make sure the servers meet the requirements (Site Stacker will check
the server requirements automatically, see below the `doctor` command):

- Windows: [Server Requirements](server-requirements-windows)
- Linux: [Server Requirements](server-requirements-linux)

## Install the Site Stacker daemon

The first thing to do is to install the [Site Stacker Service (daemon)](http://sitestacker.github.io/service/)
on the web server where Site Stacker will run.

TODO: Figure out how to handle load balancing.

### Site Stacker GitLab user

<note>
You need to be an [admin on GitLab](https://git.sitestacker.com/admin/users?filter=admins) to create/manage users.
</note>

First, make sure a user for that client exists in
[GitLab](https://git.sitestacker.com/admin/users).
If not, you'll need to [create one](https://git.sitestacker.com/admin/users/new).

Upon creation, the user needs *Reporter* access to the
[sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker)
repository and *Developer* access to all its [templates](https://git.sitestacker.com/groups/templates),
[components](https://git.sitestacker.com/groups/components) and
[themes](https://git.sitestacker.com/groups/themes)
that were built specifically for that client (at least one template),
in the **Projects** tab on the user's admin view. Also you'll need
to give him *Guest* access to the [service/access](https://git.sitestacker.com/service/access)
repository, as seen below:

![user projects](https://git.sitestacker.com/sitestacker/docs/uploads/bc35c15d4091d2640edb69e12c92e842/image.png)

After you have the user, check the
[instructions on the site](http://sitestacker.github.io/service/)
to install the service.

### Check the daemon installation

To check if the Site Stacker Service is successfully installed, run the
following command in a cli (PowerShell, cmd.exe, Terminal, ...):

```sh
$ sitestacker -v
sitestacker version 0.0.137
```

If you don't see the version printed as above, the service is not installed
and you cannot continue.

## Install Site Stacker

### Clone Site Stacker and the subrepos

A Site Stacker installation includes the core
[sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker)
repository and one or many sub-repositories like templates, components and/or
themes built specifically for that client.

You have two options to initialize these sub-repositories:

1. Using the `--all` flag to initialize *all* sub-repositories the user
has access to.
2. Specifying each sub-repository individually, e.g. `templates/Wycliffe`.

To clone Site Stacker repos you should use the `sitestacker init` command in a
cli, as follows (you will be prompted to enter the password for the given
&lt;user&gt;):

```sh
# clone all repos the user has access to:
$ sitestacker init -u <user> --all <path-to-sitestacker>

# or specify sub-repositories individually:
$ sitestacker init -u <user> <subrepo>... <path-to-sitestacker>
```

Where:

- `<user>` is the [GitLab user created above](#site-stacker-gitlab-user)
- `<path-to-sitestacker>` is the path to the Site Stacker core (**note**
that the webserver's DOCUMENT_ROOT should point to
`<path-to-sitestacker>/webroot`)
- `<subrepo>` is any template, component or theme the user has access to,
given as `<group>/<repo-name>` (e.g. `templates/Wycliffe`,
`components/Wycliffe`, `themes/Contributions-LifeUnited`)

#### Example 1

Clone Site Stacker at `C:\inetpub\wwwroot\sitestacker` with *all*
sub-repositories the user has access to:

```PowerShell
$ sitestacker init -u namb --all C:\inetpub\wwwroot\sitestacker
Password: *******
sitestacker initialized successfully at 'C:\inetpub\wwwroot\sitestacker'
'packages/templates/NAMBContributions' initialized successfully
'packages/templates/NAMB' initialized successfully
'packages/templates/MobilizeMe' initialized successfully
'packages/components/GenSend' initialized successfully
```

#### Example 2

Clone Site Stacker at `/Users/myuser/Sites/sitestacker` with 2 subrepos:

```sh
$ sitestacker init -u namb templates/NAMB components/GenSend /Users/myuser/Sites/sitestacker
Password: *******
sitestacker initialized successfully at '/Users/myuser/Sites/sitestacker'
'packages/templates/NAMB' initialized successfully
'packages/components/GenSend' initialized successfully
```

### Configure DB access

To configure the database access, you need to enter the database connection
information in `database.php`. To do this you can use the
`sitestacker set-db` command.

For example, to set up a local db server on Windows using Windows
Authentication, run (this will also create an empty database if doesn't exist):

```PowerShell
# inside the Site Stacker root directory
$ sitestacker set-db --mssql -H localhost -u '' -p '' -d MYDB_NAME --create
```

To see all available flags run:

```sh
$ sitestacker set-db -h
```

### Finish installation

To finish a Site Stacker installation run `sitestacker doctor` as below:

```sh
$ sitestacker doctor 'localhost'
checking server requirements...
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

<note>
You need to provide a URL where the current Site Stacker installation
can be accessed. Any URL that points to the vhost (or IIS site) will do.
</note>

If the server doesn't meet the requirements, you can ignore the error and continue
with the other steps by specifying the `--ignore-reqs` flag. However **only
do this if you know what are you doing**.

<tip>
You can run the `sitestacker doctor` command at any time on any existing
Site Stacker installation, to make sure Site Stacker runs fine.
</tip>

### Login in admin

:thumbsup: You're done! You can now access the admin interface at [http://&lt;your-domain&gt;/admin](),
and login with `admin@sitestacker.com` / `admin`.

## Full Example on Linux (or OS X)

In the following example we will install Site Stacker on a Linux (or OS X)
machine at `/Users/user/Sites/sitestacker`, for the [`namb` GitLab user](https://git.sitestacker.com/admin/users/namb),
including [all the sub-repositories the user has access to](https://git.sitestacker.com/admin/users/namb/projects).

We already have a vhost configured, pointing at `/Users/user/Sites/sitestacker/webroot`
and accessible at http://localhost. Here is the vhost code:

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "/Users/user/Sites/sitestacker/webroot"
    ServerName localhost
    ServerAlias *.localhost
    ErrorLog "/private/var/log/apache2/sitestacker-error_log"
    CustomLog "/private/var/log/apache2/sitestacker-access_log" common

    <Directory "/Users/user/Sites/sitestacker/webroot">
        DirectoryIndex index.php
        Options FollowSymLinks Multiviews
        MultiviewsMatch Any
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

The database is a local MySQL server with the following connection information:

Type | Host | Port | User | Password | Database
--- | --- | --- | --- | --- | ---
MySQL | `localhost` | `3306` | `root` | | `sitestackerdb`

Following are all the commands for this installation:

```sh
# check if the daemon is installed
$ sitestacker -v
sitestacker version x.x.x

# initialize all Site Stacker repos for the 'namb' user
$ sitestacker init -u namb --all /Users/user/Sites/sitestacker
Password: *******
sitestacker initialized successfully at '/Users/user/Sites/sitestacker'
'packages/templates/NAMBContributions' initialized successfully
'packages/templates/NAMB' initialized successfully
'packages/templates/MobilizeMe' initialized successfully
'packages/components/GenSend' initialized successfully

$ cd ~/Sites/sitestacker

# configure the database access
$ sitestacker set-db --create --mysql -H localhost -P 3306 -u root -p '' -d sitestackerdb
database.php successfully saved
Type:     mysql
Host:     localhost
User:     root
Password:
Database: sitestackerdb
Port:     3306
UNC:      
database 'sitestackerdb' does not exist
database 'sitestackerdb' successfully created

# finish installation
$ sitestacker doctor 'localhost'
checking server requirements...
Module mod_deflate is not available.
error: server does not meet the requirements, aborting

# since the mod_deflate module is not critical, we're ignoring the error with '--ignore-reqs'
$ sitestacker doctor 'localhost' --ignore-reqs
checking server requirements...
Module mod_deflate is not available.
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

:thumbsup: You're done! Go to http://localhost/admin
and login with the default user (see above).

## Next Steps

You might want to check out [Setting up the first site](setting-up-the-first-site).