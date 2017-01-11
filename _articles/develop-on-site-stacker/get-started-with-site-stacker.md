---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2017-01-05 00:00:00
readtime: 5
---

The easiest way to get a Site Stacker installation up and running on your local machine is by using [Docker](https://www.docker.com).

> Important: Currently this works on Linux and Mac. If you're on Windows, you'll have to configure the web and database servers manually.

*If you encounter any issues please report them here: <https://git.sitestacker.com/sitestacker/sitestacker/issues/68>.*

## Prerequisites

- [Docker](https://www.docker.com) - Install the corresponding version of Docker based on your machine

## Start Site Stacker

Once Docker is installed, run the command below to start Site Stacker (see important considerations below):

```sh
docker run -d --restart unless-stopped --name ss \
    -e GITLAB_USER=<USER> -e GITLAB_PASS=<PASS> \
    -e MYSQL_HOST=host -e MYSQL_USER=root -e MYSQL_PASSWORD="" -e MYSQL_DATABASE=sitestacker \
    --add-host host:172.17.0.1 \
    -p 80:80 -p 443:443 \
    -v "$(pwd):/var/www/html" \
    sitestacker/dev
```

After running the command, wait a few seconds before accessing Site Stacker at <http://sped.pw/admin> (sped.pw is a domain that points to `127.0.0.1`). You can login with SAML.

#### Considerations

- You need to specify your [GitLab](https://git.sitestacker.com) username and password first (replace `<USER>` and `<PASS>` accordingly)
- The command assumes you have a running MySQL server at `localhost:3306` (default MySQL port) which uses `root` without a password for connecting.
  - If your MySQL uses different credentials, you can specify them by changing `MYSQL_USER` and `MYSQL_PASSWORD` in the command.
  - If your MySQL uses a different port, you can specify it by using the `MYSQL_PORT` env var in the command.
  - If you don't have a running MySQL server, you can easily [start one with Docker](#mysql--mariadb).
- If you don't want to access the code from the host machine, you can skip the `-v ...` option.
- If you want to use other ports than the defaults (`80` and `443`), you can change them in the `-p <hostp>:<containerp>` option (e.g. `-p 8080:80`).
- :exclamation: To be sure it's working (especially if you're not on Linux), you should replace `172.17.0.1` with the local IP address of your machine (e.g. `192.169.0.5`)

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

Often times you don't want to start with a blank database, but clone an existing Site Stacker installation. To do this, run the following commands:

> Note: To provide security, the ability to run these commands are based on your GitLab user ACL. If you don't have enough access, the commands may fail.


```sh
docker exec -ti ss bash
export CLONE_URL="<URL>"
sitestacker import -f --add-domain sped.pw $CLONE_URL
sitestacker cp -u --exclude "**/FileManager/thumbnails/**" $CLONE_URL "webroot"
sitestacker sync -f $CLONE_URL
App/Console/cake Search.Elastic indexAll -v
sitestacker doctor
```

- Replace `<URL>` with the domain of the Site Stacker installation you want to clone (e.g. mydomain.com).
- The `sped.pw` domain points to `127.0.0.1` so you can use it locally to access the site.
- Note that the `sitestacker import` command will obfuscate the database for safety reasons (e.g. ".test" will be appended to all email addresses to prevent sending accidental emails, cron jobs and system messages will be disabled). If you don't want this check the command's help.

You can now access the cloned site at <http://sped.pw>.

> Tip: If you have multiple sites, you can use the hosts file to add dummy domains that point to `127.0.0.1` for every site.

## Database server

### MySQL / MariaDB

If you don't have a local MySQL / MariaDB instance, you can easily start a MySQL server using Docker:

```sh
docker run -d --restart unless-stopped \
  -e MYSQL_DATABASE=sitestacker -e MYSQL_ALLOW_EMPTY_PASSWORD=1 \
  -p 3306:3306 \
  mysql:5
```

Now you can connect to this database server as `root` with no password on the default MySQL port (3306), from the host machine or any docker container, using the `host` endpoint configured with the docker command `--add-host host:...`).

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

Now to connect to this database you need to change the `database.php` to look like this:

```php
<?php
class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/ExtendedSqlserver',
        'persistent' => false,
        'host' => 'host',
        'login' => 'sa',
        'password' => 'yourStrong(!)Password',
        'database' => 'namb',
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

## Troubleshooting

### Ports already in use

You may encounter a similar error when trying to start the Site Stacker container:

*docker: Error response from daemon: driver failed programming external connectivity on endpoint ss (72d1a09c2c172cc42527627b642d1e718ab0d7e68c938ddf4d03c699a616f670): Error starting userland proxy: listen tcp 0.0.0.0:80: listen: address already in use.*

You probably already have Apache (or another browser) running on ports 80 and 443. To bypass this you can temporarily stop the browsers (e.g. `sudo apachectl stop`) or use different ports in the docker command.
