---
title: Configure Cluster Support
category: Install Site Stacker
date: 2017-01-03 00:00:00
readtime: 3
---

This guide explains how to configure cluster support in an environment where Site Stacker runs on multiple servers (e.g. behind a load balancer).

Running Site Stacker on multiple servers requires the following things to happen:

1. On an update, the changes should propagate to all servers, no matter what server performs the update
2. After an update, the cache should to be cleared on all servers (user cache and opcache)
3. Data files (e.g. user uploaded files) should be kept in sync 

## Allow proper access for the daemon user

To be able to make changes from one server to the others, you need to enter the logged in daemon username or email in the `~/.sitestacker/users` file (in the HOME directory of the user the daemon runs as), **on each server**. For example, you can use the following cli command in PowerShell or bash (use `sudo` if the daemon runs as root):

```bash
echo "<USERNAME_OR_EMAIL>" >> ~/.sitestacker/users
```

To find the daemon user run this command (on any server):

```
$ sitestacker login
Logged in with My User (user@email.com).
```

> Note: All servers must use the same daemon user. You can login using the `sitestacker login` command.

## Configure local URLs for all servers

To make the Site Stacker daemon aware of all the servers in the cluster, you need to specify local URLs for each server in a `sitestacker.yml` file in the root of Site Stacker. An example file looks like this:

```yaml
urls: ["http://192.168.7.8", "http://192.168.7.9:81", "http://10.80.2.15"]
```

There are some important considerations:

- the first URL in the list should be the one for the current server
- all URLs should point to the corresponding Site Stacker installation on each server
- URLs can include the schema or just the domain, but it's recommended to include the full URL (e.g. http://...)

For the URLs to work correctly you might need to configure proper bindings in IIS or Server Alias'es in Apache, so that they point to the corresponding Site Stacker installation.

> Tip: If there are multiple Site Stacker installations on a server, you can use the `hosts` file to setup bogus domains that point to a specific installation on a server.

### Test the local URLs 

To test if the URLs are working correctly, run the `sitestacker status` command on each server.

An example output looks like this:

```
$ sitestacker status
Hostname: DWIGHT01
Path: /home/dwight01/Sites/sitestacker
Database: 5.7.17
  Size: 29 MB
Is Locked: false
Repositories: 
  REPOSITORY              	  HEAD                                        	  UPDATED ON	  UPDATED BY	
  [core]                  	  6212a58 (master, origin/master, origin/HEAD)	            	            	
  packages/templates/ACSSA	  27d9bb7 (1.0.0, 27d9bb7)                    	            	            	
  packages/templates/NAMB 	  4375fe1 (1.1.0-beta, 4375fe1)               	            	            	
Cluster URL: 172.17.0.1:8082

SERVER: 172.17.0.1:8081
Hostname: 50c95878554b
Path: /var/www/html
Database: 5.7.17
  Size: 29 MB
Is Locked: false
Repositories: 
  REPOSITORY	  HEAD                                        	  UPDATED ON	  UPDATED BY	
  [core]    	  6212a58 (master, origin/master, origin/HEAD)	            	            	
The following actions will be performed:
OK: . is in sync
clone: packages/templates/ACSSA at 27d9bb77457e12f3ac06043f1b3b3f61959e96de
clone: packages/templates/NAMB at 4375fe16d42634dc31807f558ae809b7f948182f
Stop because of '--dry-run', nothing changed.
```

You should analyze this output to make sure each URL points to the correct server (pay specific attention to the `Hostname` entries). Also note that if any problems are detected (e.g. database connection fails) the command will return an exit code and error message.

If the output looks fine, you've successfully configured cluster support!