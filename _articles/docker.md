---
title: Docker
date: 2016-02-10 00:00:00
readtime: 2
---

When working on Site Stacker, or any other distributed application, it's a very good idea to use [Docker](https://www.docker.com/) to help you build and run your applications with zero configuration and in seconds.

This guide explains how to install and configure your shell to use `docker` commands, especially on Mac OS X and Windows where you need extra steps since Docker only runs on Linux.

## Check if Docker is running

In your shell (Terminal, PowerShell, etc.), run:

```sh
docker info
```

If you get `Command not found`, you probably need to [install Docker](#install-docker).

If you get `An error occurred trying to connect` or similar, you need to make sure [Docker VM is up and running](#start-docker) and your shell is properly configured.

## Install Docker

- [Installation on Mac OS X](https://docs.docker.com/engine/installation/mac/)
- [Installation on Windows](https://docs.docker.com/engine/installation/windows/)
- [Installation on Linux](https://docs.docker.com/engine/installation/)

## Start Docker

*This is only needed on Mac OS X and Windows. Linux users run Docker natively.*

The easiest method is to open **Docker Quickstart Terminal** (:exclamation: On Windows, **run it as Administrator**), which should start the VM automatically and configure your shell.

If this doesn't work for some reason, or your prefer to do this manually (maybe to use PowerShell instead of the bash shell on Windows), follow the steps below.

### Start the VM

You can check if the VM is running using `docker-machine status` (:exclamation: On Windows, **run PowerShell as Administrator**):

```sh
$ docker-machine status default
Stopped
```

If it's stopped, start it using `docker-machine start`:

```sh
$ docker-machine start default
Starting "default"...
(default) Waiting for an IP...
Machine "default" was started.
Started machines may have new IP addresses. You may need to re-run the `docker-machine env` command.
```

### Configure your shell for `docker`

If the VM is running but you still can't run `docker info` without errors, it's probably because your shell doesn't know how to connect to the VM.

You can configure your shell (*Terminal* on OS X or *PowerShell* on Windows) by running the appropriate command printed by `docker-machine env`:

==Windows==

```powershell
$ docker-machine env default
$Env:DOCKER_TLS_VERIFY = "1"
$Env:DOCKER_HOST = "tcp://192.168.99.100:2376"
$Env:DOCKER_CERT_PATH = "C:\Users\Calin\.docker\machine\machines\default"
$Env:DOCKER_MACHINE_NAME = "default"
# Run this command to configure your shell:
# & "C:\Program Files\Docker Toolbox\docker-machine.exe" env default | Invoke-Expression
```

```powershell
& "C:\Program Files\Docker Toolbox\docker-machine.exe" env default | Invoke-Expression
```

==/Windows==

==Mac==

```bash
$ docker-machine env default
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/Users/calin/.docker/machine/machines/default"
export DOCKER_MACHINE_NAME="default"
# Run this command to configure your shell:
# eval "$(docker-machine env default)"
```

```bash
eval "$(docker-machine env default)"
```

==/Mac==

To check if it worked, run `docker info` and make sure it runs without errors.

## Upgrade Docker

You can check the current version using `docker version`:

```sh
$ docker version
Client:
 Version:      1.9.1
 API version:  1.21
 Go version:   go1.4.3
 Git commit:   a34a1d5
 Built:        Fri Nov 20 17:56:04 UTC 2015
 OS/Arch:      windows/amd64

Server:
 Version:      1.9.1
 API version:  1.21
 Go version:   go1.4.3
 Git commit:   a34a1d5
 Built:        Fri Nov 20 17:56:04 UTC 2015
 OS/Arch:      linux/amd64
```

On Max OS X and Windows, you can upgrade Docker by re-installing the [Docker Toolbox](https://www.docker.com/products/docker-toolbox).
