---
title:  Server Requirements - Linux
category: Install Site Stacker
date: 2016-05-17 00:00:00
---

## 1. Recommended Server Hardware

> Note: The server hardware configuration varies widely between hosting providers and greatly depends on the amount of traffic expected. The following are server recommendations that will fit most light to moderate cases.

* Processor: 2.5 GHz (4 Cores)
* Memory: 6-8GB
* Storage: 80GB


## 2. Operating System

We recommend Ubuntu 14.04 or later, but any distribution of CentOS, Redhat,
Debian, Ubuntu or Fedora should work.

Note that the **Linux kernel must be 3.10 at minimum** (e.g. Ubuntu 14.04+,
CentOS 7+, RHEL 7+, etc.).

To check your current kernel version, open a terminal and use `uname -r`
to display your kernel version:

```sh
$ uname -r
3.11.0-15-generic
```

## 3. Connection to server

* SSH (username/password or SSH Keys)
* Temporary Root permissions or user added to the sudoers list are needed.
* Need to assign a temporary URL to the server for the duration of the project (sub domains are fine.)


## 4. Web Server

* Apache 2.4.x or latest stable version
   * Apache must have permission to:
      * Create symlinks
      * Modify any file within the Site Stacker installation
   * Modules:
      * mod_rewrite
      * mod_deflate



## 5. Database

Either:

* MySQL 5.6 or later
  * InnoDB engine
  * Optional, but recommended:
     * PhpMyAdmin
* MariaDB 10.1 or later
  * MariaDB is a drop-in replacement for MySQL

## 6. PHP

* PHP 5.6 or later
* Extensions:
   * curl
   * gd2
   * [iconv](http://php.net/manual/en/iconv.installation.php) (enabled by default, but can be disabled with `--without-iconv`)
   * mbstring (needed by CakePdf)
   * openssl (with TLS v1.2)
   * pdo_sqlsrv
   * soap
   * sockets
* Settings:
   * short_open_tag=On
   * allow_url_fopen=On
   * session.auto_start=Off
   * session.cookie_httponly=1
   * date.timezone=[`the server’s timezone`]
   * memory_limit=512M
   * DOMDocument (don’t use `--disable-dom` when compiling PHP)

## 7. Java

* Optional, if Search component is used:
    * Java 8 update 45 or later. Only Oracle’s Java and the OpenJDK are supported. The same JVM version should be used on all Elasticsearch nodes and clients.


## 8. ElasticSearch

* Follow [this guide](https://github.com/sitestacker/sitestacker-wiki/wiki/Install-elasticsearch)
* The official guide can be found [here](https://www.google.com/url?q=https%3A%2F%2Fwww.elastic.co%2Fguide%2Fen%2Felasticsearch%2Freference%2Fcurrent%2Fsetup.html&sa=D&sntz=1&usg=AFQjCNG1Wa040IUIoTIfd3GoEbFqbH_o9Q)
* Is it very important to install ElasticSearch so it will restart automatically after server reboots.


## 9. Mail Server

* The server will need the default mail server setup and running.  Using the default mail server that comes with the OS should work with PHP without any tweeking.  (Changing the default mail server to something else has the potential of interrupting the interaction with PHP.) Make sure the mail server is setup and working.  

## 10. Backup

* It is very important to make sure daily backup is in place.  Because much of the project is labor and setup, it is critical this be in place and working.
* We recommend that a backup audit be done a couple times to insure all is well.
