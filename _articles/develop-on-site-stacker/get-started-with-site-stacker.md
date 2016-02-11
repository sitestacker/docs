---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2017-02-05 00:00:00
readtime: 2
---

This guide explains how to get started developing on Site Stacker using Docker. This is the quickest and easiest setup since you don't need to install and configure a web and database server, everything you need is in the docker container where Site Stacker will run. If you're not using a docker container see [Not using a container?](#not-using-a-container).

This guide is intended for OS X and Windows. On Linux the setup is less complex since you don't need a VM to run docker containers, but this case isn't covered here.

## Prerequisites

- [Git](https://git-scm.com/downloads) (make sure you install the 64-bit version)
- [Docker](docker)

## Quick Start

1. [Clone Site Stacker](#clone-site-stacker) *(required only once)*
2. [Make sure docker is up and running](#start-docker)
3. [Start the container](#start-the-site-stacker-container)
4. [Configure Site Stacker](#configure-site-stacker) *(required only once)*
5. You're done! You can now [access Site Stacker](#access-site-stacker)

## Clone Site Stacker

*This is only needed once. If you already did it you should skip this section.*

Clone sitestacker **into a location in your users directory**. Note that you need to **specify your GitLab user and password in the url**.

<note>
Because Docker automatically mounts <code>C:\Users</code> (<code>/Users</code> on OS X) into the VM at <code>/c/Users</code>, you should clone sitestacker somewhere in this path so you can share the directory without any other configuration. See <a href="https://github.com/sitestacker/docs#clone-to-a-different-location">Clone to a different location</a> for a workaround (<i>not recommended</i>).
</note>

The following command clones sitestacker in `~/sitestacker`:

```sh
# don't forget to replace `<user>` and `<pass>` with your own
git clone https://<user>:<pass>@git.sitestacker.com/sitestacker/sitestacker.git ~/sitestacker
cd ~/sitestacker
```

## Start Docker

See [Docker: Start Docker](docker#start-docker).

## Start the Site Stacker container

:exclamation: On Windows, **run PowerShell as Administrator**.

```sh
# run this from the Site Stacker root (e.g. `cd ~/sitestacker`)
$ docker-compose up -d
Starting sitestacker-mysql
Starting sitestacker
```

### Get inside the container

:exclamation: On Windows, **run PowerShell as Administrator**.

```sh
$ docker exec -ti sitestacker bash
root@59803f3eaa93:/var/www/html#
```

## Configure Site Stacker

*This is only needed once. If you already did it you should skip this section.*

These commands setup the database access, create symlinks and everything else necessary for Site Stacker to run.

:exclamation: **The following commands should be executed [inside the container](#get-inside-the-container).**

```sh
$ sitestacker set-db --mysql -H mysql -u root -p "" -d sitestacker
database.php successfully saved
Type:     mysql
Host:     mysql
User:     root
Password:
Database: sitestacker
Port:
UNC:
database 'sitestacker' already exists

$ sitestacker doctor
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

## Access Site Stacker

Once the container is started (and Site Stacker was previously cloned and configured) you're successfully running Site Stacker on a [Debian 8 ("jessie")](https://www.debian.org/releases/jessie/) Linux with Apache 2, PHP 5.6.x and MySQL 5.x.

You can access Site Stacker from your preferred browser at the VMs IP address `192.168.99.100`. Example:

- <http://192.168.99.100/admin> Login with `admin@sitestacker.com` - `admin`.

## Appendix

### Configure PhpStorm

You should configure PhpStorm by following the [Configure PhpStorm](configure-phpstorm) guide. Besides this, to be able to debug the code inside the container you need to configure a server and set the correct mappings in *Settings &gt; Languages & Frameworks &gt; PHP &gt; Servers*.

The host should be `192.168.99.100` and the root should be mapped to `/var/www/html`, as seen in the image below:

![PHP Server](https://git.sitestacker.com/sitestacker/docs/uploads/783d5be704495150a8494554c6f7810e/image.png)

### Run Site Stacker cli commands

You can run any Site Stacker cli command **from [inside the container](#get-inside-the-container)**. Example:

```sh
# the current working directory is already the Site Stacker root
$ App/Console/cake ...
```

### Connect to the database

You can connect to the database using any MySQL client through TCP/IP (for example [HeidiSQL](http://www.heidisql.com/)). The credentials are.

Property | Value
---- | ----
Hostname / IP | `192.168.99.100`
User | `root`
Password | *(leave empty)*
Port | `3306`

### Use custom domains

Instead of using <http://192.168.99.100/>, you can use custom domains by [mapping them](https://en.wikipedia.org/wiki/Hosts_(file)) to the `192.168.99.100` IP in `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows). An example looks like this:

```
192.168.99.100   ss.dev
192.168.99.100   namb.dev
```

### Use an SQL Server database

The default setup uses a MySQL database, but if you need to use SQL Server see [Connect to SQL Server from Unix](connect-to-sql-server-from-unix).

### Get access to more powerful `sitestacker` commands

By default the Site Stacker service runs as `guest`. You can check this by running the following command:

:exclamation: **The following commands should be executed [inside the container](#get-inside-the-container).**

```sh
$ sitestacker login -s
Logged in with Guest (guest@bogus.com).
```

This user has limited access, so in order to get access to more powerful commands you should re-login with your own GitLab user:

```sh
$ sitestacker login -u <user>
Password: *****
Logged in with <user> (<email>).
```

## Not using a container?

If you're not using a docker container as explained in this guide, you're on your own configuring the web and database servers. However there are some things you might be interested in.

### Install the Site Stacker service

The [Site Stacker service](http://sitestacker.github.io/service/) comes with the `sitestacker` command which contains helpful utilities for a developer. It is highly recommended that every developer installs it.

The installation is extremely simple, the steps are very similar to the [instructions here](install-on-production#install-the-site-stacker-service), but instead of a client user you should use your own GitLab user and you only need *Developer* access to the [service/access](https://git.sitestacker.com/service/access) repository.

### Use an SQL Server database on OS X

If you're on a Mac you're probably using a MySQL or MariaDB database. However it's also possible to use an SQL Server database. See [Connect to SQL Server from Unix](connect-to-sql-server-from-unix).
