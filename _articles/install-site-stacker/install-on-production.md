---
title: Install on Production
category: Install Site Stacker
date: 2016-02-04 00:00:00
readtime: 5
---

This guide will run you trough the process of installing a fresh copy of
Site Stacker on a production server.

## Prerequisites

To install Site Stacker you need:

- access to the web server (either RDP for Windows or SSH for Linux)
- credentials for connecting to the database server

## Install the Site Stacker Service

The first thing to do is to install the [Site Stacker Service (daemon)](http://sitestacker.github.io/service/)
on the web server where Site Stacker will run. For this you need to connect to the server.

TODO: Figure out how to handle load balancing.

### Site Stacker GitLab user

<note>
You need to be an <a href="https://git.sitestacker.com/admin/users?filter=admins">admin on GitLab</a> to create/manage users.
</note>

First, make sure a user for that client exists in
[GitLab](https://git.sitestacker.com/admin/users).
If not, you'll need to [create one](https://git.sitestacker.com/admin/users/new).

Upon creation, the user needs *Reporter* access to the
[sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker)
repository and *Developer* access to all the [templates](https://git.sitestacker.com/groups/templates),
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
sitestacker version x.x.x
```

If you don't see the version printed as above, the service is not installed
and you cannot continue.

## Install Site Stacker

### Clone Site Stacker and the subrepos

A Site Stacker installation includes the core
[sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker)
repository and one or many sub-repositories like templates, components and/or
themes built specifically for that client. The `sitestacker init` command
will clone all these repositories for you (it's recommended to check the
command's help first: `sitestacker init -h`).

You have two options to initialize the sub-repositories:

1. Using the `--all-subrepos` flag to initialize *all* sub-repositories the user
has access to.
2. Specifying each sub-repository individually, e.g. `templates/Wycliffe`.

Example (you will be prompted to enter the password for the given &lt;user&gt;):

```sh
# clone all repos the user has access to:
$ sitestacker init -u <user> --all-subrepos [<path-to-sitestacker>]

# or specify sub-repositories individually:
$ sitestacker init -u <user> <subrepo>... [<path-to-sitestacker>]
```

Where:

- `<user>` is the [GitLab user created above](#site-stacker-gitlab-user)
- `[<path-to-sitestacker>]` is the path to the Site Stacker root (**note** that
the webserver's DOCUMENT_ROOT should point to
`<path-to-sitestacker>/webroot`); this is
optional if you're already in the directory where you want to install Site Stacker
- `<subrepo>` is any template, component or theme the user has access to,
given as `<group>/<repo-name>` (e.g. `templates/Wycliffe`,
`components/Wycliffe`, `themes/Contributions-LifeUnited`)

#### Example 1

Clone Site Stacker at `C:\inetpub\wwwroot\sitestacker` with *all*
sub-repositories the user has access to:

```powershell
$ sitestacker init -u namb --all-subrepos C:\inetpub\wwwroot\sitestacker
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

<tip>
You can use the <code>sitestacker init</code> command at any time <i>in a Site Stacker
installation</i> to clone any sub-repository(ies) you want, by running
something like <code>sitestacker init templates/Wycliffe [components/GenSend ...]</code>.
</tip>

### Server Requirements

The server needs to meet the following requirements, depending on the platform:

- [Windows Server Requirements](server-requirements-windows)
- [Linux Server Requirements](server-requirements-linux)

You can check the server requirements automatically with:

```sh
sitestacker reqs <URL>
```

<note>
You need to provide a URL where the Site Stacker installation can be accessed.
</note>

### Checkout a different branch

The `sitestacker init` command will clone and point the repositories to their default branch, which is `master` in most cases. However you might need to change this, maybe you want to point them to a tag or to a release branch.

You can do this using the `sitestacker checkout` command. See the command help with `sitestacker checkout -h` for possible usages.

To checkout sitestacker to the `release` branch do:

```sh
$ sitestacker checkout release
sitestacker checked out at 0ecb3de41e6c031b808cda6ebd116556428fe58d
```

### Configure DB access

To configure the database access, you need to enter the database connection
information in `database.php`. To do this you can use the
`sitestacker set-db` command.

For example, to set up a local db server on Windows using Windows
Authentication, run (this will also create an empty database if doesn't exist):

```powershell
# inside the Site Stacker root directory
$ sitestacker set-db --mssql -H localhost --user="" --password="" -d MYDB_NAME --create
```

To see all available flags run:

```sh
$ sitestacker set-db -h
```

### Finish installation

To finish a Site Stacker installation run `sitestacker doctor` as below:

```sh
$ sitestacker doctor '<URL>'
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

<note>
You need to provide a URL where the current Site Stacker installation can be accessed. Any URL that points to the vhost (or IIS site) will do.
</note>

<tip>
You can run the <code>sitestacker doctor</code> command at any time on any existing
Site Stacker installation, to make sure Site Stacker runs fine.
</tip>

### Login in admin

:thumbsup: You're done! You can now access the admin interface at [http://&lt;your-domain&gt;/admin](),
and login with `admin@sitestacker.com` / `admin`.

## Setup the Cron

For the cron jobs defined in the **Cron** component to work, you need to
configure a master cron job for the entire installation. To do this check
out the following guides, based on your platform:

- [Setting up Cron on Windows](setting-up-cron-on-windows)
- [Setting up Cron on Linux](setting-up-cron-on-linux)

## Full Example on Windows

In the following example we will install Site Stacker on a Windows
machine at `C:\inetput\wwwroot\sitestacker`, for the
[`namb` GitLab user](https://git.sitestacker.com/admin/users/namb), and
two of the [sub-repositories the user has access to](https://git.sitestacker.com/admin/users/namb/projects),
[templates/MobilizeMe](https://git.sitestacker.com/templates/MobilizeMe)
and [components/GenSend](https://git.sitestacker.com/components/GenSend).

Since IIS doesn't let you create a site without the path existing,
we need to create it after we've run the `sitestacker init` command,
and point it to `C:\inetput\wwwroot\sitestacker\webroot`, accessible
at <http://localhost>.

![IIS Site Stacker site](https://git.sitestacker.com/sitestacker/docs/uploads/777e12c4e5a4ff79b34fc32f71754d29/image.png)

The database is a local SQL Server 2014 using Windows Authentication,
with the following connection information:

Type | Host | Port | User | Password | Database
--- | --- | --- | --- | --- | ---
MSSQL | `localhost` | `1433` | | | `sitestackerdb`

Following are all the commands for this installation (including the output):

```powershell
# check if the daemon is installed
$ sitestacker -v
sitestacker version x.x.x

# initialize Site Stacker and two subrepos for the 'namb' user
$ sitestacker init -u namb templates/MobilizeMe components/GenSend C:\inetput\wwwroot\sitestacker
Password: *******
sitestacker initialized successfully at 'C:\inetpub\wwwroot\sitestacker'
'packages/components/GenSend' initialized successfully
'packages/templates/MobilizeMe' initialized successfully

$ cd C:\inetput\wwwroot\sitestacker

# configure the database access
$ sitestacker set-db --create --mssql -H localhost --user="" --password="" -d sitestackerdb
database.php successfully saved
Type:     mssql
Host:     localhost
User:
Password:
Database: sitestackerdb
Port:
UNC:
database 'sitestackerdb' does not exist
database 'sitestackerdb' successfully created

# finish installation
$ sitestacker doctor 'localhost'
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

:thumbsup: You're done! Go to <http://localhost/admin>
and login with the default user (see above).

## Full Example on Linux (or OS X)

In the following example we will install Site Stacker on a Linux (or OS X)
machine at `/Users/user/Sites/sitestacker`, for the [`namb` GitLab user](https://git.sitestacker.com/admin/users/namb),
including [all the sub-repositories the user has access to](https://git.sitestacker.com/admin/users/namb/projects).

We already have a vhost configured, pointing at `/Users/user/Sites/sitestacker/webroot`
and accessible at <http://localhost>. Here is the vhost code:

```conf
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

Following are all the commands for this installation (including the output):

```sh
# check if the daemon is installed
$ sitestacker -v
sitestacker version x.x.x

# initialize all Site Stacker repos for the 'namb' user
$ sitestacker init -u namb --all-subrepos /Users/user/Sites/sitestacker
Password: *******
sitestacker initialized successfully at '/Users/user/Sites/sitestacker'
'packages/templates/NAMBContributions' initialized successfully
'packages/templates/NAMB' initialized successfully
'packages/templates/MobilizeMe' initialized successfully
'packages/components/GenSend' initialized successfully

$ cd /Users/user/Sites/sitestacker

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
Module mod_deflate is not available.
error: server does not meet the requirements, aborting

$ sitestacker doctor 'localhost'
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

:thumbsup: You're done! Go to <http://localhost/admin>
and login with the default user (see above).

## Next Steps

You might want to check out [Setting up the first site](setting-up-the-first-site).
