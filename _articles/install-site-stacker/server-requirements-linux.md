---
title:  Server Requirements - Linux
category: Install Site Stacker
date: 2015-08-13 00:00:00
---

**1. Recommended Server Hardware**

> Note: The server hardware configuration varies widely between hosting providers and greatly depends on the amount of traffic expected. The following are server recommendations that will fit most light to moderate cases.

* Processor: 2.5 GHz (4 Cores)
* Memory: 4-6GB
* Storage: 80GB


**2. Operating System**
* CentOS, Redhat, Debian, Ubuntu, Fedora (latest stable version recommended)


**3. Connection to server**
* SSH (username/password or SSH Keys)
* Temporary Root permissions or user added to the sudoers list are needed.
* Need to assign a temporary URL to the server for the duration of the project (sub domains are fine.)


**4. Web Server**
* Apache 2.4.x or latest stable version
   * Apache must have permission to:
      * Create symlinks
      * Modify any file within the Site Stacker installation
   * Modules:
      * mod_rewrite
      * mod_deflate



**5. Database**
   * MySQL 5.6.x or latest stable version
      * InnoDB engine
      * Optional, but highly recommended:
         * PhpMyAdmin or MySQL Workbench


**6. PHP**
* PHP 5.6.x or latest stable version
* Extensions:
   * php_curl
   * php_gd2
   * php_pdo_sqlsrv
   * php_soap
   * php_sockets
   * php_mbstring (this is needed by CakePdf)
   * php_openssl
* Settings:
   * short_open_tag=On
   * allow_url_fopen=On
   * session.auto_start=Off
   * date.timezone=[`the server’s timezone`]
   * memory_limit=128M
   * DOMDocument (don’t use `--disable-dom` when compiling PHP)


**7. ionCube loader latest version ([link](http://www.google.com/url?q=http%3A%2F%2Fwww.ioncube.com%2Floaders.php&sa=D&sntz=1&usg=AFQjCNH2yLN9XjURVWA2ZIoDL3-EdsFG-g))**


**8. Java**
* Optional, if Search component is used:
* We recommend installing the **Java 8 update 45 or later**, or **Java 7 update 79 or later**. Previous versions of Java 7 are known to have bugs that can cause index corruption and data loss. Only Oracle’s Java and the OpenJDK are supported. The same JVM version should be used on all Elasticsearch nodes and clients.


**9. ElasticSearch**
* Install from here [Elasticsearch](https://github.com/sitestacker/sitestacker-wiki/wiki/Install-elasticsearch)
* The official guide can be found [Here](https://www.google.com/url?q=https%3A%2F%2Fwww.elastic.co%2Fguide%2Fen%2Felasticsearch%2Freference%2Fcurrent%2Fsetup.html&sa=D&sntz=1&usg=AFQjCNG1Wa040IUIoTIfd3GoEbFqbH_o9Q)
* Is it very important that ElasticSearch be setup to run always as a service and will restart automatically after server reboots.



**10. Mail Server**
* The server will need the default mail server setup and running.  Using the default mail server that comes with the OS should work with PHP without any tweeking.  (Changing the default mail server to something else has the potential of interrupting the interaction with PHP.) Make sure the mail server is setup and working.  

**11. Backup**
* It is very important to make sure daily backup is in place.  Because much of the project is labor and setup, it is critical this be in place and working.
* We recommend that a backup audit be done a couple times to insure all is well.
