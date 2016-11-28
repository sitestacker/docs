---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2016-11-29 00:00:00
readtime: 5
---

The easiest way to get a Site Stacker installation up and running on your local machine is by using [Docker](https://www.docker.com). This guide is intended for all three major platforms: Mac OS, Windows and Linux.

## Start Site Stacker

Once you have Docker installed, run the command below in your cli to start Site Stacker.

> Note: You have to run this command in an empty directory (Site Stacker will be cloned inside) or an existing Site Stacker root directory (if it's already cloned).

```sh
docker run \
    -e GITLAB_USER=<USER> -e GITLAB_PASS=<PASS> \
    -e MYSQL_HOST=host -e MYSQL_USER=root -e MYSQL_PASSWORD="" -e MYSQL_DATABASE=sitestacker \
    --add-host host:172.17.0.1 \
    -p 80:80 -p 443:443 \
    -v "$(pwd):/var/www/html" \
    --restart unless-stopped \
    --name sitestacker \
    -d \
    sitestacker/dev
```

- Replace `<USER>` and `<PASS>` with your [GitLab](https://git.sitestacker.com) username and password.
- The command assumes you have a running MySQL server at `localhost:3306` (default MySQL port) which uses `root` without a password for connecting.
  - If your MySQL uses different credentials, you can specify them by changing `MYSQL_USER` and `MYSQL_PASSWORD` in the command.
  - If you don't have a running MySQL server, you can easily start one with Docker by running (before the command above):
  
  ```sh
  docker run \
      --restart unless-stopped \
      -e MYSQL_DATABASE=sitestacker -e MYSQL_ALLOW_EMPTY_PASSWORD=1 \
      -p 3306:3306 \
      --name mysql \
      -d \
      mysql:5
  ```

You can now access Site Stacker at <http://sped.pw/admin> and login with SAML (sped.pw is a domain that points to your localhost).

## Clone an existing Site Stacker installation

Often times you don't want to start with a blank database, but clone an existing Site Stacker installation. To do this, run the following commands:

> Note: To provide security, the ability to run these commands are based on your GitLab user ACL. If you don't have enough access, the commands may fail.


```sh
docker exec -ti sitestacker bash
export CLONE_URL="<URL>"
sitestacker db -f $CLONE_URL
sitestacker cp \
    --exclude "**/FileManager/thumbnails/**" \
    --exclude "webroot/css/**" \
    --exclude "webroot/img/**" \
    --exclude "webroot/js/**" \
    --exclude "webroot/lib/**" \
    --exclude "webroot/.htaccess" \
    --exclude "webroot/*.ico" \
    --exclude "webroot/*.php" \
    --exclude "webroot/*.config" \
    --exclude "webroot/*.skel" \
    $CLONE_URL "webroot"
sitestacker sync -f $CLONE_URL
App/Console/cake Sites addDomain --default -d $CLONE_URL sped.pw
App/Console/cake SystemManager.Update obfuscate
App/Console/cake Search.Elastic indexAll -v
sitestacker doctor
```

- Replace `<URL>` with the domain of the Site Stacker installation you want to clone (e.g. mydomain.com).
- The `obfuscate` command will obfuscate the database data (e.g. all email addresses will have `.test` appended to prevent sending accidental emails, cron jobs and system messages will be disabled). This is not required but it's highly recommended.

You can now access the cloned site at <http://sped.pw>.

## Microsoft SQL Server

**OUTDATED!**

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

The only thing left to do is to configure the database access in `database.php`.

## Advanced usage

### Restarting a process inside the container

To restart a process inside the container you have to use [Supervisor](http://supervisord.org) instead of the regular `service <name> restart` because all the processes are managed by Supervisor.

For example you may want to restart Apache to pick up some changes you did in the php.ini or httpd.conf. To do this run:
 
```sh
docker exec sitestacker supervisorctl restart apache
```

## Troubleshooting

### Ports already in use

You may encounter a similar error when trying to start the Site Stacker container:

*docker: Error response from daemon: driver failed programming external connectivity on endpoint sitestacker (72d1a09c2c172cc42527627b642d1e718ab0d7e68c938ddf4d03c699a616f670): Error starting userland proxy: listen tcp 0.0.0.0:80: listen: address already in use.*

You probably already have Apache (or another browser) running on ports 80 and 443. To bypass this you can temporarily stop the browsers (e.g. `sudo apachectl stop`).
