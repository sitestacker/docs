---
title: Get Started with Site Stacker
category: Develop on Site Stacker
date: 2018-11-01 00:00:00
readtime: 3
---

The easiest way to get a development installation of Site Stacker on your local machine is to use [Docker](https://www.docker.com).

*If you encounter any issues please report them here: <https://git.sitestacker.com/sitestacker/sitestacker/issues/68> or [leave a comment](#disqus).*

## Prerequisites

Docker installation is required, see the [official installation docs](https://docs.docker.com/engine/installation/).

**Note:** Using a native Docker install instead of Docker Toolbox is recommended in order to use the persisted volumes

**Warning:** We do not officially support running on Docker for Windows. There are known issues with volume permissions, and potentially other unknown issues. If you are trying to run on Docker for Windows and run into issues, please seek help from other users.

## Start Site Stacker

Clone the Site Stacker repository anywhere you want on disk (e.g. `~/Sites/`):

```sh
git clone https://git.sitestacker.com/sitestacker/sitestacker
```

Run docker from the Site Stacker root:

```sh
docker-compose up -d
```

This will build and start a Site Stacker container and publish ports to access HTTP, HTTPS, SSH, MariaDB and Elasticsearch. Database data will be stored at `App/tmp/mysql/`.

**Note:** The containers will not restart automatically after a system reboot, so make sure you run `docker-compose up -d` from the Site Stacker root when you want them started.

## Cloning an installation

First, make sure you have the correct connection details in `App/Config/database.php`. If `database.php` doesn't exist, create it from `database.php.skel`.

You should configure two connections: `default` and `index`. The file should look like this:

```php
<?php
class DATABASE_CONFIG {
    public $default = array(
        'datasource' => 'Database/ExtendedMysql',
        'port' => '3306',
        'persistent' => false,
        'host' => 'mariadb',
        'login' => 'root',
        'password' => '',
        'database' => '<database-name>',
        'prefix' => '',
        //'unix_socket' => '/tmp/mysql.sock',
        'encoding' => 'utf8',
        //'UNC' => "/Users/joe/Public;\\\\COMPUTER\\Joe's Public Folder",
    );
    public $index = [
        'datasource' => 'Search.ElasticSource',
        'port' => '9200',
        'host' => 'elasticsearch',
    ];
}
```

**Note:** Replace `<database-name>` with a proper name for your database.

Make sure you have a personal access token for your account in GitLab <https://git.sitestacker.com/profile/personal_access_tokens>, because you'll need it for the `sitestacker login` command below.

Then, execute these commands in your cli (Terminal):

```sh
docker exec -ti sitestacker_nginx_1 bash
sitestacker login -t <gitlab_personal_access_token>

# Sync files
sitestacker sync <domain>

# Get database
sitestacker db -E -d <database-name> <domain>

App/Console/cake Search.Elastic indexAll -v
sitestacker doctor
App/Console/cake Sites.Sites addDomain -d <domain> --default --wildcards <site>.sped.pw

# Get files
sitestacker cp -u <domain> webroot/
sitestacker cp -e "**/FileManager/thumbnails/**" -e "**/SystemManager/installation-id" <domain> "webroot/data"
```

Replace the following accordingly:

- `<gitlab_personal_access_token>`
- `<domain>` The domain you're cloning from. E.g. `childrenscup.org`.
- `<database-name>` The database name. E.g. `childrenscup`.
- `<site>` A short prefix. E.g. `cc`.

You can now access the installation at `http://<site>.sped.pw/admin` (sped.pw is a domain that points to `127.0.0.1` and it's recommended to be able to use SAML login).

## Troubleshooting

### Ports already in use

You may encounter a similar error when trying to start the Site Stacker container:

*docker: Error response from daemon: driver failed programming external connectivity on endpoint ss (72d1a09c2c172cc42527627b642d1e718ab0d7e68c938ddf4d03c699a616f670): Error starting userland proxy: listen tcp 0.0.0.0:80: listen: address already in use.*

You probably already have Apache (or another web server) running on ports 80 and 443. To bypass this you can temporarily stop the browsers (e.g. `sudo apachectl stop`) or use different ports by changing the docker-compose.
