---
title:  Server Requirements - Linux
category: Install Site Stacker
date: 2020-06-09 00:00:00
---

## 1. Recommended Server Hardware

> Note: The server hardware configuration varies widely between hosting providers and greatly depends on the amount of traffic expected. The following are server recommendations that will fit most light to moderate cases.

* Processor: 2.7 GHz (8 Cores)
* Memory: 16GB
* Storage: 80GB
* SSD - **highly recommended** this is the most important


## 2. Operating System

We recommend the latest Ubuntu LTS (e.g. Ubuntu 20.04 at the time of this writing), but other distributions like CentOS, Redhat, Debian, Fedora will also work, just make sure you're using the latest version.

Whichever Linux distribution you choose, **make sure the Linux kernel is at least 3.10 or later**. You can check the kernel version by running:

```sh
$ uname -r
3.11.0-15-generic
```

## 3. Connection to server

* SSH (username/password or SSH Keys)
* Temporary Root permissions or user added to the sudoers list is required.
* Need to assign a temporary URL to the server for the duration of the project (sub domains are fine.)


## 4. Web Server

* Apache 2.4.x or latest stable version
   * Recommended 2.4.18 or later for HTTP/2 support
      * Some distros cap at 2.4.6
   * Apache must have permission to:
      * Create symlinks
      * Modify any file within the Site Stacker installation
   * Modules:
      * mod_rewrite
      * mod_deflate


## 5. Database

MariaDB 10.3.x or higher. InnoDB engine is required.

## 6. PHP

* PHP 5.x (minimum is PHP 5.6, recommended is latest 5.x)
   * Same PHP must be available in CLI as well
* Extensions:
   * curl
   * gd2
   * [iconv](http://php.net/manual/en/iconv.installation.php) (enabled by default, but can be disabled with `--without-iconv`)
   * intl
   * mbstring (needed by CakePdf)
   * openssl (with TLS v1.2)
   * soap
   * sockets
   * mcrypt (required if using the Payeezy payment processor)
   * zip
* Settings:
   * short_open_tag=On
   * allow_url_fopen=On
   * session.auto_start=Off
   * session.cookie_httponly=1
   * date.timezone=[`the server’s timezone`]
   * memory_limit=512M
   * DOMDocument (don’t use `--disable-dom` when compiling PHP)
       * if missing can be resolved by installing `php-xml` extension

PHP 7 is not supported for production environments at this time, but if you are using it for other environments you need to do one of the following:

- set `Configure::write('Security.useOpenSsl', true);` in Config/core.php and create a utility to decrypt all the Mcrypt Rijndael encrypted strings and re-encrypt with OpenSSL AES-256 (**recommended**)
- install `mcrypt` via PECL (**not recommended** - see https://github.com/cakephp/cakephp/issues/12044)

## 7. Java

Java 8 update 45 or later. Only Oracle’s Java and the OpenJDK are supported. The same JVM version should be used on all Elasticsearch nodes and clients.

**Note:** JDK 8 or 9 are supported, but 10 or later are not.


## 8. ElasticSearch

Elasticsearch 1.7.x (Elasticsearch 1.7.6 at the time of this writing, but latest 1.7.x is recommended).

1. Installation: check out the official guide at <https://www.elastic.co/guide/en/elasticsearch/reference/1.7/_installation.html>.
2. Configure scripting by adding this setting to the `config/elasticsearch.yml` file in all nodes in the cluster: `script.engine.groovy.inline.search: true`.
3. Run as a Service: check out <https://www.elastic.co/guide/en/elasticsearch/reference/1.7/setup-service.html>.
4. Index data: Once Elasticsearch is running, you can index the data from the cli (recommended) by running `App/Console/cake Search.Elastic indexAll -v`. Alternatively, you can index the data in Site Planner by right clicking a site in Content Explorer (left side).

> Note: Is it very important to configure Run as a Service so ElasticSearch will restart automatically after a server restart.


## 9. Mail Server

* The server will need the default mail server setup and running.  Using the default mail server that comes with the OS should work with PHP without any tweeking.  (Changing the default mail server to something else has the potential of interrupting the interaction with PHP.) Make sure the mail server is setup and working.  

## 10. wkhtmltopdf

[https://wkhtmltopdf.org/](https://wkhtmltopdf.org/)

## 11. QPDF

[https://github.com/qpdf/qpdf](https://github.com/qpdf/qpdf)

*This is required for the Print Templates component (e.g. exporting a report as PDF) and the Letters component.*

Usually there is no need to add anything in `bootstrap.user.php`. However, if it's not working add:

```php
Configure::write('Qpdf',[
    'path' => '/usr/bin/qpdf',
]);
```

## 12. Backup

* It is very important to make sure daily backup is in place.  Because much of the project is labor and setup, it is critical this be in place and working.
* We recommend that a backup audit be done a couple times to insure all is well.
