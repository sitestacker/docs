---
title: Docker
date: 2016-09-12 00:00:00
readtime: 2
published: false
---

**DEPRECATED!** - this guide is using Docker Toolbox instead of the new native Docker for Windows/Mac so it is not actual anymore.

When working on Site Stacker, or any other distributed application, it's a very good idea to use [Docker](https://www.docker.com/) to help you build and run your applications with zero configuration and in seconds.

This guide explains how to install and configure your shell to use `docker` commands, especially on Mac OS X and Windows where you need extra steps since Docker only runs on Linux.

If you're a non-technical user interested in learning about Docker, you should read these very explanatory and easy to follow guides, based on your platform:

- [Get Started with Docker for Windows](https://docs.docker.com/windows/)
- [Get Started with Docker for Mac OS X](https://docs.docker.com/mac/)
- [Get Started with Docker Engine for Linux](https://docs.docker.com/linux/)

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

The easiest method is to open [**Docker Quickstart Terminal**](#docker-quickstart-terminal) (:exclamation: On Windows, **run it as Administrator**), which should start the VM automatically and configure your shell.

If this doesn't work for some reason, or your prefer not to use Docker Quickstart Terminal (maybe to use PowerShell instead of the bash shell on Windows), [start the vm](#start-the-vm) and [configure your shell for docker](#configure-your-shell-for-docker) manually.

:thumbsup: You're done! You can now run `docker` commands. Check the Appendix below for other tips.

## Appendix

### Docker Quickstart Terminal

Using **Docker Quickstart Terminal** is the recommended way to use Docker on Windows and Mac OS X. This is because when you open it, it makes sure your VM is running and you can start using `docker` commands right away.

#### Docker Quickstart Terminal on Windows

##### Shortcut `bash.exe` not found

![Missing Shortcut](https://git.sitestacker.com/sitestacker/docs/uploads/902a0ec14fbdad1897a761ef98343426/image.png)

If the **Docker Quickstart Terminal** doesn't start and complains about a missing shortcut, make sure the `Target` field in the shortcut *Properties* has the correct path to the Git Bash, e.g.:

Property | Value
--- | ---
`Target` | `C:\Users\USERNAME\AppData\Local\Programs\Git\bin\bash.exe --login -i "C:\Program Files\Docker Toolbox\start.sh"`

_* Replace `USERNAME` with your user._  
_* Make sure the path to Git Bash is correct, change it accordingly._

##### Run Docker Quickstart Terminal as administrator

On Windows, to make it even easier to work with, configure it to always run as Administrator, so you don't have to do it each time:

![](https://git.sitestacker.com/sitestacker/docs/uploads/03d4bcc861fa7c50cf09018cc136d2a2/start-menu.png)
![](https://git.sitestacker.com/sitestacker/docs/uploads/699ce3488e5f7da299f339e9052d10a4/properties.png)
![](https://git.sitestacker.com/sitestacker/docs/uploads/406103e32e79b69396c24fe1f04cc1e6/advanced.png)
![](https://git.sitestacker.com/sitestacker/docs/uploads/1cf603f3dfa2f417df0e0bd55872c62a/administrator.png)

### Start the VM

*This is only necessary if you're not using [Docker Quickstart Terminal](#docker-quickstart-terminal).*

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

*This is only necessary if you're not using [Docker Quickstart Terminal](#docker-quickstart-terminal).*

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

### Upgrade Docker

If you want to upgrade Docker on your system, you can check the current version using `docker version`:

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
