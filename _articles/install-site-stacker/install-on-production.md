---
title: Install on Production
category: Install Site Stacker
date: 2016-06-09 00:00:00
readtime: 5
---

This guide will run you trough the process of installing a fresh copy of Site Stacker on a production server.

## Prerequisites

To install Site Stacker you need:

- access to the web server (either RDP for Windows or SSH for Linux)
- credentials for connecting to the database server

## Install the Site Stacker Service

The first thing to do is to install the [Site Stacker Service (daemon)](http://sitestacker.github.io/service/) on the web server where Site Stacker will run. For this you need to connect to the server.

*TODO: Figure out how to handle load balancing.*

### Site Stacker GitLab user

> Note: You need to be an [admin on GitLab](https://git.sitestacker.com/admin/users?filter=admins) to create/manage users.

First, make sure a user for that client exists in [GitLab](https://git.sitestacker.com/admin/users). If not, you'll need to [create one](https://git.sitestacker.com/admin/users/new).

Upon creation, the user needs to be granted **Reporter** role (or higher) to the [sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker) repository and all other sub-repositories required for that installation (e.g. [templates](https://git.sitestacker.com/groups/templates), [components](https://git.sitestacker.com/groups/components), [themes](https://git.sitestacker.com/groups/themes)). Also you'll need to give him **Guest** access to the [service/access](https://git.sitestacker.com/service/access) repository, as seen below:

![user projects](https://git.sitestacker.com/sitestacker/docs/uploads/bc35c15d4091d2640edb69e12c92e842/image.png)

After you have the user set up, check the [instructions on the site](http://sitestacker.github.io/service/) to install the service.

### Check the daemon installation

To check if the Site Stacker Service is successfully installed, run the following command in a cli (PowerShell, Terminal, ...):

```sh
$ sitestacker version
sitestacker version x.x.x
```

If you don't see the version printed as above, the service is not installed and you cannot continue.

## Install Site Stacker

### Clone Site Stacker and the subrepos

A Site Stacker installation includes the core [sitestacker/sitestacker](https://git.sitestacker.com/sitestacker/sitestacker) repository and one or many sub-repositories like [templates](https://git.sitestacker.com/templates), [components](https://git.sitestacker.com/components) and/or [themes](https://git.sitestacker.com/themes) built specifically for a client. The `sitestacker clone` command will clone all these repositories for you - see the command help (`sitestacker clone -h`) for usage.

You have two options to clone the sub-repositories:

1. Using the `--all-subrepos` flag to clone all sub-repositories the user has access to.
2. Specifying each sub-repository individually, e.g. `templates/Wycliffe`.

Example (you will be prompted to enter the password for the given &lt;user&gt;):

```sh
# clone all repos the user has access to:
$ sitestacker clone -u <user> --all-subrepos [<path>]

# or specify sub-repositories individually:
$ sitestacker clone -u <user> [<repo>...] [<path>]
```

Where:

- `<user>` is the [GitLab user created above](#site-stacker-gitlab-user)
- `[<path>]` is the path to the Site Stacker root (**note** that the webserver's DOCUMENT_ROOT should point to
`<path-to-sitestacker>/webroot`); this is optional if you're already in the directory where you want to install Site Stacker
- `<subrepo>` is any template, component or theme the user has access to, given as `<group>/<repo-name>` (e.g. `templates/Wycliffe`, `components/Wycliffe`, `themes/Contributions-LifeUnited`)

> Tip: You can use the `sitestacker clone` command at any time in a Site Stacker installation to clone any sub-repository(ies) you want, by running something like `sitestacker clone templates/Wycliffe [components/GenSend ...]`.

### Configure the VirtualHost

At this point you should configure the VirtualHost (or Site in IIS) to point to the `./webroot` directory in the Site Stacker root folder.

### Server Requirements

The server needs to meet the following requirements, depending on the platform:

- [Windows Server Requirements](server-requirements-windows)
- [Linux Server Requirements](server-requirements-linux)

You can check the server requirements automatically by running the `sitestacker reqs` command on the webserver where you do the install. See the help for examples:

```sh
sitestacker reqs -h
```

### Checkout a different branch

The `sitestacker clone` command will clone and point the repositories to their default branch, which is `master` in most cases. However you might need to change this, maybe you want to point them to a tag or to a release branch.

You can do this using the `sitestacker checkout` command. See the command help (`sitestacker checkout -h`) for usage.

For example, to checkout sitestacker to the `2.x` branch do:

```sh
$ sitestacker checkout origin/2.x
sitestacker checked out at 0ecb3de41e6c031b808cda6ebd116556428fe58d
```

### Configure DB access

To configure the database access, you need to enter the database connection information in `database.php`. To do this you can use the `sitestacker set-db` command.

For example, to set up a local db server on Windows using Windows Authentication, run (this will also create an empty database if doesn't exist):

```powershell
# inside the Site Stacker root directory
$ sitestacker set-db --mssql -H localhost --user="" --password="" -d MYDB_NAME --create
```

Check the command help (`sitestacker set-db -h`) to see all available flags.

### Finish installation

To finish the Site Stacker installation run `sitestacker doctor` as below:

```sh
$ sitestacker doctor <URL>
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

> Note: You need to provide the `<URL>` where the Site Stacker installation can be accessed. This requires a working vhost.

> Tip: You can run the `sitestacker doctor` command at any time on any existing Site Stacker installation, to make sure Site Stacker runs fine.

### Login in admin

:thumbsup: You're done! You can now access the admin interface at [http://&lt;your-domain&gt;/admin](), and login with SAML.

## Setup the Cron

For the cron jobs defined in the **Cron** component to work, you need to configure a master cron job for the entire installation. To do this check out the following guides, based on your platform:

- [Setting up Cron on Windows](setting-up-cron-on-windows)
- [Setting up Cron on Linux](setting-up-cron-on-linux)

## Full Example on Windows

In the following example we will install Site Stacker on a Windows machine at `C:\inetput\wwwroot\sitestacker`, for the [`namb` GitLab user](https://git.sitestacker.com/admin/users/namb), and two of the [sub-repositories the user has access to](https://git.sitestacker.com/admin/users/namb/projects), [templates/MobilizeMe](https://git.sitestacker.com/templates/MobilizeMe) and [components/GenSend](https://git.sitestacker.com/components/GenSend).

Let's start by cloning Site Stacker and the sub-repositories:

```powershell
# check if the daemon is installed
$ sitestacker version
sitestacker version x.x.x

# clone Site Stacker and two subrepos for the 'namb' user
$ sitestacker clone -u namb templates/MobilizeMe components/GenSend C:\inetput\wwwroot\sitestacker
Password: *******
sitestacker cloned successfully at C:\inetpub\wwwroot\sitestacker
components/GenSend cloned successfully at packages/components/GenSend
templates/MobilizeMe cloned successfully at packages/templates/MobilizeMe
```

Now we can configure the Site in IIS, accessible at <http://localhost>. Note that we're pointing it at the `./webroot` directory.

![IIS Site Stacker site](https://git.sitestacker.com/sitestacker/docs/uploads/777e12c4e5a4ff79b34fc32f71754d29/image.png)

The only remaining thing is to configure the database access and finish the installation.

The database is a local SQL Server 2014 using Windows Authentication, with the following connection information:

Type | Host | Port | User | Password | Database
--- | --- | --- | --- | --- | ---
MSSQL | `localhost` | `1433` | | | `sitestackerdb`

```powershell
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

:thumbsup: You're done! Go to <http://localhost/admin> and login.

## Full Example on Linux (or OS X)

In the following example we will install Site Stacker on a Linux (or OS X) machine at `/Users/user/Sites/sitestacker`, for the [`namb` GitLab user](https://git.sitestacker.com/admin/users/namb), including [all the sub-repositories the user has access to](https://git.sitestacker.com/admin/users/namb/projects).

We already have a vhost configured, pointing at `/Users/user/Sites/sitestacker/webroot` and accessible at <http://localhost>. Here is the vhost code:

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
$ sitestacker version
sitestacker version x.x.x

# clone all Site Stacker repos for the 'namb' user
$ sitestacker clone -u namb --all-subrepos /Users/user/Sites/sitestacker
Password: *******
sitestacker cloned successfully at /Users/user/Sites/sitestacker
templates/NAMBContributions cloned successfully at packages/templates/NAMBContributions
templates/NAMB cloned successfully at packages/templates/NAMB
templates/MobilizeMe cloned successfully at packages/templates/MobilizeMe
components/GenSend cloned successfully at packages/components/GenSend

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
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

:thumbsup: You're done! Go to <http://localhost/admin> and login.

## Next Steps

You might want to check out [Setting up the first site](setting-up-the-first-site).
