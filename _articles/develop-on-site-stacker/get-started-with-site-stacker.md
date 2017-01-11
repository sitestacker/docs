---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2017-01-12 00:00:00
readtime: 5
---

The easiest way to get a Site Stacker installation up and running on your local machine is by using [Docker](https://www.docker.com).

> Important: Currently this works on Linux and Mac. If you're on Windows, you'll have to configure the web and database servers manually.

*If you encounter any issues please report them here: <https://git.sitestacker.com/sitestacker/sitestacker/issues/68> or [leave a comment](#disqus).*

## Prerequisites

- [Docker](https://www.docker.com) - Install the corresponding version of Docker based on your machine
- A [Site Stacker GitLab](https://git.sitestacker.com) user with proper access
- MySQL or SQL Server running locally (see [Database Server](#database-server) below to spin up a database server)

## Start Site Stacker

Make sure you have the latest docker image first:

```sh
docker pull sitestacker/dev
```

Before running the command below, make sure to:

- **Replace `172.17.0.1` with the local IP address of your machine (e.g. `192.169.0.5`)** :exclamation:
- Replace `<USER>` and `<PASS>` with your GitLab user
- If your MySQL uses different credentials, change the `MYSQL_*` variables accordingly
- If you're using SQL Server instead of MySQL, replace `MYSQL_` variables with `MSSQL_`
- If you want to use other ports than the defaults (`80` and `443`), you can change them in the `-p <hostp>:<containerp>` option (e.g. `-p 8080:80`)

Run the command below in an empty directory or, if you already cloned Site Stacker, in the Site Stacker root directory:

```sh
docker run -d --restart unless-stopped --name ss \
    -e GITLAB_USER=<USER> -e GITLAB_PASS=<PASS> \
    -e MYSQL_HOST=host -e MYSQL_PORT=3306 -e MYSQL_USER=root -e MYSQL_PASSWORD="" -e MYSQL_DATABASE=sitestacker \
    --add-host host:172.17.0.1 \
    -p 80:80 -p 443:443 \
    -v "$(pwd):/var/www/html" \
    sitestacker/dev
```

After running the command, open the container logs and watch for the line `INFO exited: startup (exit status 0; expected)`, which means the setup finished and you're ready to roll. Here's an example:

```sh
$ docker logs -f ss
2017-01-11 19:51:15,841 CRIT Supervisor running as root (no user in config file)
2017-01-11 19:51:15,841 WARN Included extra file "/etc/supervisor/conf.d/supervisord.conf" during parsing
...
...
2017-01-11 19:51:21,250 INFO exited: startup (exit status 0; expected)
```

You can now access Site Stacker at <http://sped.pw/admin> (sped.pw is a domain that points to `127.0.0.1` and it's recommended to be able to use SAML login).

## Running all commands inside the container

Any cli commands you need to run (e.g. `sitestacker ...`, `Console/cake ...`) need to be inside the container, and not directly on your host machine.

The easiest is to go inside the container using:

```sh
docker exec -ti ss bash
```

> Note: The working directory is the Site Stacker root.

Then run the commands as usual. Example:

```sh
$ docker exec -ti ss bash
root@77979d10ab61:/var/www/html# sitestacker version
sitestacker version x.x.x
```

You can also run a single command using:

```sh
docker exec ss <command>
```

## Clone a Site Stacker installation

Often times you don't want to start with a blank database, but clone an existing Site Stacker installation. For this, you can use the `ssimport` command inside the container, which will run all the necessary commands for you. Check the command's help (`ssimport -h`) for usage.

> Note: To provide security, the ability to run these commands are based on your GitLab user ACL. If you don't have enough access, the commands may fail.

> Tip: If you have multiple sites, you can use the hosts file to add dummy domains that point to `127.0.0.1` for every site.

## Database Server

Based on your requirements, you can spin up a MySQL / MariaDB database server or a SQL Server instance, or both, using Docker.

### MySQL / MariaDB

If you don't have a local MySQL / MariaDB instance, you can easily start a MySQL server using Docker:

```sh
docker run -d --restart unless-stopped \
  -e MYSQL_DATABASE=sitestacker -e MYSQL_ALLOW_EMPTY_PASSWORD=1 \
  -p 3306:3306 \
  mysql:5
```

To connect to this database you need to change the `App/Config/database.php` file to look like this:

```php
<?php
class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/ExtendedMysql',
        'persistent' => false,
        'host' => 'host',
        'port' => 3306,
        'login' => 'root',
        'password' => '',
        'database' => 'sitestacker',
        'prefix' => '',
        //'unix_socket' => '/tmp/mysql.sock',
        'encoding' => 'utf8',
        //'UNC' => "/Users/joe/Public;\\\\COMPUTER\\Joe's Public Folder",
    );
    // ...
}
```

### Microsoft SQL Server

Microsoft recently released [SQL Server on Linux](https://docs.microsoft.com/en-us/sql/linux/), so now it's easy to spin up a SQL Server database on a Linux or Mac machine using Docker. You can read more about the Docker image here: <https://hub.docker.com/r/microsoft/mssql-server-linux/>. Make sure you meet the requirements.

To start a SQL Server instance run this in your Site Stacker root:

```sh
docker run -d --restart unless-stopped \
  -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=yourStrong(!)Password' \
  -p 1433:1433 \
  -v "$(pwd)/App/tmp:/sstmp" \
  microsoft/mssql-server-linux
```

To connect to this database you need to change the `App/Config/database.php` file to look like this:

```php
<?php
class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/ExtendedSqlserver',
        'persistent' => false,
        'host' => 'host',
        'login' => 'sa',
        'password' => 'yourStrong(!)Password',
        'database' => 'sitestacker',
        'prefix' => '',
        //'unix_socket' => '/tmp/mysql.sock',
        //'encoding' => 'utf8',
        'UNC' => 'App/tmp;/sstmp',
    );
    // ...
}
```

It's very important to set the `UNC` as shown, otherwise you won't be able to import databases.

## Advanced usage

### Restarting a process inside the container

To restart a process inside the container you have to use [Supervisor](http://supervisord.org) instead of the regular `service <name> restart` because all the processes are managed by Supervisor.

For example you may want to restart Apache to pick up some changes you did in the php.ini or httpd.conf. To do this run:
 
```sh
docker exec ss supervisorctl restart apache
```

### Update container when image changes

Your Site Stacker container should not store application data, which means you can remove and re-create it anytime. In order to update the container when its image changed, you first need to stop and remove it (`docker stop ss && docker rm ss`), then pull the new image and run the same command you used to start the container (see the `docker pull` and `docker run` commands at the begginning of this guide).

## Troubleshooting

### Ports already in use

You may encounter a similar error when trying to start the Site Stacker container:

*docker: Error response from daemon: driver failed programming external connectivity on endpoint ss (72d1a09c2c172cc42527627b642d1e718ab0d7e68c938ddf4d03c699a616f670): Error starting userland proxy: listen tcp 0.0.0.0:80: listen: address already in use.*

You probably already have Apache (or another browser) running on ports 80 and 443. To bypass this you can temporarily stop the browsers (e.g. `sudo apachectl stop`) or use different ports in the docker command.
