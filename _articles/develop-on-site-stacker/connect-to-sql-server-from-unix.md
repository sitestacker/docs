---
title: Connect to SQL Server from Unix
category: Develop on Site Stacker
tags: mssql
date: 2017-02-05 00:00:00
readtime: 5
published: false
---

If you're running Site Stacker on a Mac OS X, Linux or in a [docker container](get-started-with-site-stacker), you may want to connect to an SQL Server database. For this you need 2 things:

- the [PDO_DBLIB](http://php.net/manual/en/ref.pdo-dblib.php) extension to be installed on the web server that's running Site Stacker
- an SQL Server database

If you run Site Stacker from a [docker container](get-started-with-site-stacker) PDO_DBLIB is already available. If you run it directly on your Mac OS X, see the [instructions on how to install PDO_DBLIB](#install-pdodblib-on-mac-os-x).

On Windows, you should already have SQL Server available (if not, it is easy to install). On Mac OS X and Linux however, you'll need to create a VM to run a Windows box.

## Create a Windows VM

*This section only applies if your machine is a Mac OS X or Linux. On Windows you have SQL Server natively so you don't need a VM.*

On Max OS X and Linux, you need a Windows VM to install and run a local instance of SQL Server. To do this you first need to install [Vagrant](https://www.vagrantup.com/docs/installation/).

Once Vagrant is installed, run the following commands **in the Site Stacker root**:

```sh
vagrant init sitestacker/win12-sql14
vagrant up
```

These commands will download and fire up the [sitestacker/win12-sql14](https://atlas.hashicorp.com/sitestacker/boxes/win12-sql14/) box with SQL Server installed and configured. To connect to it use `sitestacker` as the user and `password` as the password. The port is the default one (`1433`) but if it's already in use Vagrant will reconcile the conflict automatically and use a different port. To find out the port check the output of the command above, e.g.:

```sh
==> default: Forwarding ports...  
    default: 3389 (guest) => 3389 (host) (adapter 1)  
    default: 5985 (guest) => 5985 (host) (adapter 1)  
    default: 1433 (guest) => 2200 (host) (adapter 1) # <= 1433 was mapped to 2200 on the host
```

The only thing left to do is to configure the database access (see [Configure Database Credentials](#configure-database-credentials)).

To inspect the database, get into the VM using `vagrant rdp` or by opening it directly from **VirtualBox Manager** where you can use **Microsoft SQL Server Management Studio**.

### Common Issues

If you have problems, especially with the vagrant commands, see [COMMON ISSUES](https://www.vagrantup.com/docs/virtualbox/common-issues.html) on Vagrant Docs.

## Configure SQL Server

*This section only applies if you're not [using the VM](#create-a-windows-vm) (usually if you're on Windows), because in the VM the SQL Server is already configured properly.*

### Enable SQL Server Authentication mode

By default SQL Server only allows Windows Authentication. To enable both modes, see <https://support.microsoft.com/en-us/kb/555332>

### Create an SQL Server login

You can create a user login in **Microsoft SQL Server Management Studio**.

In the left tree expand *[SERVER] &gt; Security*, right click *Logins* and choose *New Login*. In the window enter a *Login name* (e.g. "sitestacker"), choose *SQL Server authentication*, enter a password (e.g. "password") and uncheck *Enforce password policy*. On the left click on *Server Roles* and check *sysadmin*.

### Check if connection is open

You can check if you can connect to the SQL Server from the web server using `telnet`. By default SQL Server runs on port `1433`.

==Block:Docker container==

**[Inside the docker container](get-started-with-site-stacker#get-inside-the-container)** run:

```sh
$ telnet host 1433
Trying 192.168.99.1...
Connected to host.
```

If you don't have `telnet` available you can install it using `apt-get update && apt-get install telnet -y`.

==/Block:Docker container==

==Mac==

In the Terminal run:

```bash
$ telnet host 1433
Trying 192.168.99.1...
Connected to host.
```

If you don't have `telnet` available you can install it using `brew install telnet`.

==/Mac==

Note that we're using `host` to connect to your host machine, which is mapped to `192.168.99.1` in `/etc/hosts`.

### Enable TCP port

If the `telnet` command hangs at `Trying 192.168.99.1...`, you first need to check if SQL Server is listening on a TCP port. To do this see <http://support.webecs.com/kb/a868/how-do-i-configure-sql-server-express-to-allow-remote-tcp-ip-connections-on-port-1433.aspx>

### Allow connection in Firewall

If the `telnet` command hangs at `Trying 192.168.99.1...`, it's possible your Firewall is denying the connection.

To allow it open **Windows Firewall with Advanced Security** on your Windows machine and click on *Inbound Rules &gt; New Rule*, select *Port*, on the next screen choose *TCP* and enter `1433` (or the port your SQL Server is running at) in *Specific local ports*. Hit Next until the end, giving it a name (e.g. "SQL Server").

### Run SQL Server as your user

To avoid permission problems, especially when restoring databases, the easiest solution is to run SQL Server as your own user. This might be considered a bad practice from a security point of view, but since this is a development machine this solution is acceptable and is guaranteed to always work.

To change the SQL Server user, open **Sql Server Configuration Manager**, select *SQL Server Services* on the left side, right click *SQL Server (SQLEXPRESS14)* (or whatever is called on your system) and hit Properties. On the *Log On* tab, choose *Log on as: This account* and enter your Windows user and password, then click OK. If you're [using a VM](#create-a-windows-vm), the user and password is `vagrant`.

You should end up with something like this:

![SQL Server running as your user](https://git.sitestacker.com/sitestacker/docs/uploads/9d35abea48b58d7836b9a06cb6706660/image.png)

## Configure Database Credentials

To configure the database credentials you can use the `sitestacker set-db` command or modify the **App/Config/database.php** file manually.

Assuming your SQL Server is listening on the default port `1433`, has user `sitestacker` and `password` for the password and you're using a database named `sitestacker`, your `$default` connection in **database.php** looks like this:

==Block:Docker container==

```php
<?php
public $default = array(
    'datasource' => 'Database/ExtendedSqlserver',
    'host' => 'host',
    'port' => '1433',
    'login' => 'sitestacker',
    'password' => 'password',
    'database' => 'sitestacker',
    'UNC' => # see below how to configure this
);
```

==/Block:Docker container==

==Block:Mac, Linux==

```php
<?php
public $default = array(
    'datasource' => 'Database/ExtendedSqlserver',
    'host' => 'localhost',
    'port' => '1433',
    'login' => 'sitestacker',
    'password' => 'password',
    'database' => 'sitestacker',
    'UNC' => # see below how to configure this
);
```

==/Block:Mac, Linux==

### Share folder with the database server

In order to perform database backup and restore operations with the Site Stacker service, the web server (where the service is running) needs to have a shared folder with the database server, to copy database backups over and make them available to the SQL Server for import.

This is the case when the SQL Server you're connecting to is remote, instead of local to your web server. For example when running Site Stacker on a Mac OS X machine or from a docker container (Linux), since the web and database servers have different file systems.

This is done by configuring the `UNC` attribute in the **database.php** file. Fortunately you can use the `App/tmp` directory of your Site Stacker installation because it is already shared with the database server, as long as the [SQL Server has access to that directory](#run-sql-server-as-your-user).

==Windows==

On Windows (using a docker container), specify the `UNC` mapping between `App/tmp` and the location of the same folder on the Windows machine (note that the path needs to be absolute), separated by `;`. For example:

```php
<?php
public $default = array(
    ...
    'UNC' => 'App/tmp;C:\Users\Calin\sitestacker\App\tmp', # <= replace with your own path
);
```

==/Windows==

==Block:Mac, Linux==

On Mac OS X or Linux (whether you're using a docker container or not), specify the `UNC` mapping between `App/tmp` and `\\VBOXSVR\vagrant\App\tmp`, separated by `;`:

```php
<?php
public $default = array(
    ...
    'UNC' => 'App/tmp;\\VBOXSVR\vagrant\App\tmp',
);
```

==/Block:Mac, Linux==

## Appendix

### Install PDO_DBLIB on Mac OS X

*This is only required if you run Site Stacker directly on your Mac, without using a docker container.*

Note that we're using `55`. This corresponds to your PHP version and you should change it accordingly (e.g. for PHP 5.6 use `56`). See below how to find the PHP version. You'll need [Homebrew](http://brew.sh/) installed.

```sh
brew update
brew install --with-msdblib freetds
brew tap homebrew/php
brew install --without-homebrew-php php55-pdo-dblib
sudo mkdir -p /Library/Server/Web/Config/php
sudo ln -s /usr/local/etc/php/5.5/conf.d/ext-pdo_dblib.ini /Library/Server/Web/Config/php/ext-pdo_dblib.ini
sudo apachectl restart
```

Find the PHP version by running:

```sh
$ php -v
PHP 5.5.30 (cli) (built: Oct 23 2015 17:21:45)
```

To check if it worked, open a `phpinfo()` page in your browser and search for "pdo_dblib".
