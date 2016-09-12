---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2016-09-12 00:00:00
readtime: 2
---

This guide explains how to configure a development environment with [Docker](https://www.docker.com) for running Site Stacker on your local computer. This is the quickest and easiest setup since you don't need to install anything, everything you need is in the docker container.

This guide is intended for all three major platforms: macOS (OS X), Windows and Linux. The container will run on [Debian 8 ("jessie")](https://www.debian.org/releases/jessie/) Linux with Apache 2, PHP 5.6.x, MySQL 5.x and elasticsearch pre-installed.

> Important: This setup **doesn't currently work on Windows** because [Symlinks on shared volumes are not supported](https://forums.docker.com/t/symlinks-on-shared-volumes-not-supported/9288) in Docker for Windows, and Site Stacker relies on symlinks.

## Prerequisites

- [Git](https://git-scm.com/downloads) (make sure you install the 64-bit version)
- [Docker](https://www.docker.com)
- [Vagrant](https://www.vagrantup.com) *(macOS and Linux only)*

## Quick Start

1. [Clone Site Stacker](#clone-site-stacker) *(required only once)*
2. [Start the container](#start-the-site-stacker-container)
3. [Configure database access](#configure-database-access) *(required only once)*

You're done! You can now [access Site Stacker](#access-site-stacker)

## Clone Site Stacker

*This is only needed once. Skip this section if you already did it.*

> Important: On Windows, make sure the drive where you clone Site Stacker is shared in **Docker Settings -> Shared Drives**.

When cloning, you'll need to **specify your GitLab user and password in the url**.

```sh
git clone https://<user>:<pass>@git.sitestacker.com/sitestacker/sitestacker.git ~/sitestacker
cd ~/sitestacker
```

## Start the Site Stacker container

Run this from the Site Stacker root (e.g. `cd ~/sitestacker`).

```sh
$ docker-compose up -d
Starting sitestacker-mysql
Starting sitestacker
```

### Get inside the container

```sh
$ docker exec -ti sitestacker bash
root@59803f3eaa93:/var/www/html#
```

## Configure database access

*This is only needed once. Skip this section if you already did it.*

### MySQL / MariaDB

MySQL comes pre-installed in the docker container so you don't need to install anything else.

### Microsoft SQL Server

To connect to a local SQL Server, things are more complicated, since SQL Server isn't available on macOS and Linux. Thankfully you can use Vagrant to install it in a VM box almost immediately.

> Note: On Windows, you'll have to configure SQL Server manually by following [Configure SQL Server](connect-to-sql-server-from-unix#configure-sql-server).

On macOS and Linux, run the following Vagrant commands in the Site Stacker root to download and fire up the [sitestacker/win12-sql14](https://atlas.hashicorp.com/sitestacker/boxes/win12-sql14/) box with SQL Server installed and configured:

```sh
vagrant init sitestacker/win12-sql14
vagrant up
```

To connect to it use `sitestacker` as the user and `password` as the password. The port is the default one (`1433`) but if it's already in use Vagrant will reconcile the conflict automatically and use a different port. To find out the port check the output of the command above, e.g.:

```sh
==> default: Forwarding ports...  
    default: 3389 (guest) => 3389 (host) (adapter 1)  
    default: 5985 (guest) => 5985 (host) (adapter 1)  
    default: 1433 (guest) => 2200 (host) (adapter 1) # <= 1433 was mapped to 2200 on the host
```

To inspect the database, get into the VM using `vagrant rdp` or open it directly from **VirtualBox Manager**, where you can use **Microsoft SQL Server Management Studio**.

The only thing left to do is to configure the database access (see below).

### Setup access credentials in `database.php`

The recommended setup is to create 2 database configurations in `App/Config/database.php`, one for MySQL (`$mysql`) and another one for SQL Server (`$mssql`). Then, since you need to have a `$default` configuration, simply rename one or the other, as you need.

An example `database.php` file looks like this:

```php
<?php
class DATABASE_CONFIG
{
    public $mysql = array(
        'datasource' => 'Database/ExtendedMysql',
        'persistent' => false,
        'host' => 'mysql',
        'login' => 'root',
        'password' => '',
        'database' => 'sitestacker',
        'prefix' => '',
        'encoding' => 'utf8',
    );
    public $mssql = array(
        'datasource' => 'Database/ExtendedSqlserver',
        'persistent' => false,
        'host' => 'host',
        'port' => '1433',
        'login' => 'sitestacker',
        'password' => 'password',
        'database' => 'sitestacker',
        'prefix' => '',

        // The 'UNC' property represents a mapping between a local path
        // and a remote path on the database server, accessible as UNC.
        // It is only used when connecting to a remote SQL Server, from
        // a dev environment. In this case it is required by the restore
        // operation to be able to restore a database backup.
        'UNC' => 'App/tmp;\\VBOXSVR\vagrant\App\tmp',
    );
}
```

> Note: Don't forget to rename `$mysql` or `$mssql` to `$default`, otherwise you'll get a connection error.

> Tip: Don't use a `__contruct()` to specify the `$default` database like `$this->default = $this->mssql;` because some daemon commands like `import` won't work properly.

## Access Site Stacker

Once the container is started, you can access Site Stacker in your browser. However, before accessing it for the first time, run this command to configure the symlinks and everything else ([inside the container](#get-inside-the-container)):

```sh
$ sitestacker doctor
creating symlinks...
setting permissions...
checking db access...
executing 'Console/cake schema create DbAcl --yes --nodrop --quiet'
executing 'Console/cake schema create -p Migrations --yes --nodrop --quiet'
executing 'Console/cake SystemManager.Update'
```

You can now access Site Stacker at <http://sped.pw/admin> and login with SAML (sped.pw is a domain that points to your localhost so you can use SAML).

## Appendix

### Configure PhpStorm

**OUTDATED!** - will be updated soon.

You should configure PhpStorm by following the [Configure PhpStorm](configure-phpstorm) guide. Besides this, to be able to debug the code inside the container you need to configure a server and set the correct mappings in *Settings &gt; Languages & Frameworks &gt; PHP &gt; Servers*.

The host should be [`192.168.99.100`](#vm-ip-address) and the root should be mapped to `/var/www/html`, as seen in the image below:

![PHP Server](https://git.sitestacker.com/sitestacker/docs/uploads/783d5be704495150a8494554c6f7810e/image.png)

### Run Site Stacker cli commands

You can run any Site Stacker cli command **from [inside the container](#get-inside-the-container)**. Example:

```sh
# the current working directory is already the Site Stacker root
$ App/Console/cake ...
```

### Connect to the database

**OUTDATED!** - will be updated soon.

You can connect to the database using any MySQL client through TCP/IP (for example [HeidiSQL](http://www.heidisql.com/)). The credentials are.

Property | Value
---- | ----
Hostname / IP | [`192.168.99.100`](#vm-ip-address)
User | `root`
Password | *(leave empty)*
Port | `3306`

### Connect to elasticsearch

**OUTDATED!** - will be updated soon.

Elasticsearch default port `9200` is exposed to the VM, so you can connect to it using the [VM's IP address](#vm-ip-address), e.g.:

- <http://192.168.99.100:9200>

### Use custom domains

**OUTDATED!** - will be updated soon.

Instead of using [http://192.168.99.100/](#vm-ip-address), you can use custom domains by [mapping them](https://en.wikipedia.org/wiki/Hosts_(file)) to the [VM's IP](#vm-ip-address) in `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows). An example looks like this:

```
192.168.99.100   docker
192.168.99.100   ss.dev
192.168.99.100   namb.dev
```

Tip: It is highly recommended to use custom domains instead of the <a href="#vm-ip-address">VM IP address</a> because the IP can change.

### Get access to more powerful `sitestacker` commands

By default the Site Stacker service inside the container runs as `guest`. You can check this by running the following command:

> Note: The following commands should be executed [inside the container](#get-inside-the-container).

```sh
$ sitestacker login
Logged in with Guest (guest@bogus.com).
```

The `guest` user has limited access, so in order to get access to more powerful commands you should re-login with your own GitLab user:

```sh
$ sitestacker login -u <user>
Password: *****
Logged in with <user> (<email>).
```

## Not using a container?

If you're not using a docker container as explained in this guide, you're on your own configuring the web and database servers. However there are some things you might be interested in.

### Install the Site Stacker service

The [Site Stacker service](http://sitestacker.github.io/service/) comes with the `sitestacker` command which contains helpful utilities for a developer. It is highly recommended that every developer installs it.

### Connect to SQL Server from macOS (OS X)

If you're on a Mac you're probably using a MySQL or MariaDB database. However it's also possible to use an SQL Server database. See [Connect to SQL Server from Unix](connect-to-sql-server-from-unix).
