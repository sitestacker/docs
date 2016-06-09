---
title: Install Redis Cache
category: Install Site Stacker
date: 2016-06-09 00:00:00
readtime: 5
---

This guide will run you trough the process of installing redis client and server

## Prerequisites

To install Redis cache you need:

- access to the web server (either RDP for Windows or SSH for Linux)
- php native redis client 
- redis server

## Installing on windows

- redis client

  locate the latest stable compiled dll at https://pecl.php.net/package/redis 
  You must use the dll compatible with the php version installed in IIS
  
  This dll must be placed under the "ext" folder located in the php home directory.
  
  This should be easily enabled later on in Php Manager section of IIS under enable/disable extensions
  
- redis server 

  Install the latest 2.x release located at https://github.com/MSOpenTech/redis/releases using defaults
  
  Create a folder called redisheap under C:\redisheap
  
  Edit the file located at "C:\Program Files\Redis\redis.windows-service.conf" and add the following lines
  
  - bind 127.0.0.1
  - maxheap 1024M
  - heapdir C:\\\\redisheap
  
  Go to Local Services and restart the Redis windows service
