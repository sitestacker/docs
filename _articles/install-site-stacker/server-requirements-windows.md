---
title:  Server Requirements - Windows
category: Install Site Stacker
date: 2017-02-23 00:00:00
---

## 1. Recommended Server Hardware

> Note: The server hardware configuration varies widely between hosting providers and greatly depends on the amount of traffic expected. The following are server recommendations that will fit most light to moderate cases.

* Processor: 2.7 GHz (8 Cores)
* Memory: 16GB
* Storage: 80GB


## 2. Operating System

* Windows Server 2012 or newer


## 3. Access to the server

* Remote Desktop Access (username/password)
* Temporary Admin permissions are required.
* Need to assign a temporary URL to the server for the duration of the project (sub domains are fine.)


## 4. Web Server

* Internet Information Services (IIS) 8.0 or newer
* Modules:
   * [URL Rewrite](http://www.google.com/url?q=http%3A%2F%2Fwww.iis.net%2Fdownloads%2Fmicrosoft%2Furl-rewrite&sa=D&sntz=1&usg=AFQjCNHslW_84Io3PnG3NyHM07RQ0Jzy8Q)
* IIS must have permission to:
   * Create symlinks
      * **The default IIS user “IUSER” cannot create symlinks. A different user must be created.**
   * Modify any file within the Site Stacker installation

### IIS Settings

The [FastCGI Settings](https://www.iis.net/configreference/system.webserver/fastcgi) `Activity Timeout`, `Idle Timeout` and `Request Timeout` need to be increased to a large enough value (e.g. `99999`) because these are controlled from PHP. You can do this from the IIS Manager UI by following [these steps](http://stackoverflow.com/a/35756128/1104534).

The `maxUrl` and `maxQueryString` request limits need to be increased to a larger value. This can be done from Powershell (run as administrator) with the following two commands:

```sh
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST'  -filter "system.webServer/security/requestFiltering/requestLimits" -name "maxUrl" -value 10999
```
```sh
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST'  -filter "system.webServer/security/requestFiltering/requestLimits" -name "maxQueryString" -value 2097151
```

or from Command Prompt (run as administrator) using the following command:

```sh
appcmd.exe set config  -section:system.webServer/security/requestFiltering /requestLimits.maxUrl:"10999" /requestLimits.maxQueryString:"2097151"  /commit:apphost
```

## 5. Database Server

* Microsoft SQL Server 2014 or higher (latest is recommended)
  * The connection to the database server can be made with either SQL Authentication or Windows Authentication
     * If Windows Authentication will be used the user under which IIS process is running must map to a valid SQL Server login in order to establish a connection.
  * Optional, but highly recommended:
     * SQL Server Management Studio
  * Note: Use of MySQL with Windows Server is NOT an option.

### Database Access

The user used to connect to the database server needs the following access:

- Server Roles (server-wide security privileges): `bulkadmin`, `dbcreator`
- User Mapping (database role membership): `db_owner` (on the designated database)

If `dbcreator` cannot be granted, a second (empty) database called `sitestacker_test` needs to be created and the user should be a `db_owner` on that database.


## 6. PHP

* Latest PHP 5.x (minimum is PHP 5.6)
   * Download PHP [here](http://php.iis.net/)
   * Same PHP must be available in CLI as well
* Extensions:
   * curl
   * gd2
   * [iconv](http://php.net/manual/en/iconv.installation.php) (enabled by default, but can be disabled with `--without-iconv`)
   * mbstring (needed by CakePdf)
   * openssl (with TLS v1.2)
   * pdo_sqlsrv
   * soap
   * sockets
   * mcrypt (required if using the Payeezy payment processor)
   * [wincache 1.3.5+](http://windows.php.net/downloads/pecl/releases/wincache/) (optional, recommended)
      * WinCache must be disabled in CLI (`wincache.enablecli=Off`) - default is Off
      * If WinCache 1.3.7 or newer is installed: `wincache.reroute_enabled=Off`
      * `wincache.ucenabled=On`
      * `wincache.ucachesize=85`
* Settings:
   * short_open_tag=On
   * allow_url_fopen=On
   * session.auto_start=Off
   * session.cookie_httponly=1
   * date.timezone=[`the server’s timezone`]
   * memory_limit=512M
   * soap.wsdl_cache_enabled=On
   * soap.wsdl_cache_dir=C:\Windows\Temp
   * DOMDocument (don’t use `--disable-dom` when compiling PHP)


## 7. Java

Java 8 update 45 or later. Only Oracle’s Java and the OpenJDK are supported. The same JVM version should be used on all Elasticsearch nodes and clients.


## 8. ElasticSearch

Latest Elasticsearch 1.7.x (Elasticsearch 1.7.6 at the time of this writing).

1. Installation: check out the official guide at <https://www.elastic.co/guide/en/elasticsearch/reference/1.7/_installation.html>.
2. Run as a Service: check out <https://www.elastic.co/guide/en/elasticsearch/reference/1.7/setup-service-win.html>.
3. Index data: Once Elasticsearch is running, you can index the data from the cli (recommended) by running `App/Console/cake Search.Elastic indexAll -v`. Alternatively, you can index the data in Site Planner by right clicking a site in Content Explorer (left side).

> Note: Is it very important to configure Run as a Service so ElasticSearch will restart automatically after a server restart.


## 9. Mail Server

* The server will need the default mail server setup and running.  Using the default mail server that comes with the OS should work with PHP without any tweeking.  (Changing the default mail server to something else has the potential of interrupting the interaction with PHP.) Make sure the mail server is setup and working.  


## 10. Backup

* It is very important to make sure daily backup is in place.  Because much of the project is labor and setup, it is critical this be in place and working.
* We recommend that a backup audit be done a couple times to insure all is well.
