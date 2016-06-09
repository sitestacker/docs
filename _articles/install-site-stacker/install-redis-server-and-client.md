---
title: Install redis server and client
category: Install Site Stacker
date: 2016-06-09 00:00:00
readtime: 5
---

This guide will run you trough the process of installing [redis server](http://redis.io/) and [PHP client extension](https://pecl.php.net/package/redis)

## Prerequisites

To install Redis cache you need:

- access to the web server (either RDP for Windows or SSH for Linux)

## Installing on Windows

- PHP redis client:

  Locate the latest stable compiled dll at <https://pecl.php.net/package/redis>.
  
  You must use the dll compatible with the PHP version installed in IIS.
  
  This dll must be placed under the "ext" folder located in the PHP installation directory.
  
  This should be easily enabled later on in [PHP Manager](https://phpmanager.codeplex.com/) section of IIS under enable/disable extensions section.
  
- redis server: 

  Install the latest 2.x release located at <https://github.com/MSOpenTech/redis/releases> using defaults.
  
  Create a folder called redisheap under C:\redisheap.
  
  Edit the file located at "C:\Program Files\Redis\redis.windows-service.conf" and add the following lines:
  
  ```ini
  bind 127.0.0.1
  maxheap 1024M
  heapdir C:\\redisheap
  ```
  
  Go to Local Services and restart the redis Windows service.
  
  Verify that the server is working correctly by running the following command:
  
  ```cmd
  C:\Program Files\Redis>redis-cli -h 127.0.0.1 ping
  PONG
  C:\Program Files\Redis>
  ```
