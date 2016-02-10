# Site Stacker Docs

Jekyll 3 site for the [Site Stacker Documentation](http://docs.sitestacker.com). Uses GitHub Pages to build the site automatically on every push.

## Get Started

To run the site locally and be able to make changes, the easiest way is to use [Docker](https://www.docker.com/).

### Clone repository

Since Docker automatically mounts `C:\Users` on Windows (`/Users` on Mac OS X) into the VM at `/c/Users`, you should clone the repository somewhere in this path ([see below](#clone-to-a-different-location) if you want to clone it somewhere else). For example the command below clones it at `~/docs`.

```sh
git clone https://github.com/sitestacker/docs ~/docs
cd ~/docs
```

### Start the site

Once [Docker is running](http://docs.sitestacker.com/articles/docker), start Jekyll using:

```sh
# inside the repository root
docker-compose up -d
```

You can now access the site at:

- <http://192.168.99.100:4000>

**Note:** `192.168.99.100` is the IP of the Docker VM on Mac OS X and Windows. If the URL doesn't work, you can check if it's the correct IP using `docker-machine ip default`.

## Clone to a different location

If you don't want to clone the repository somewhere in the users path, you need to mount the directory manually in VirtualBox.

Let's say we want to clone the repository at `D:\server\docs`. This means we'll need to share and mount `D:\server` into `/d/server` inside the VM.

First, you need to share the folder in the **Oracle VM VirtualBox Manager**. Right click the `default` VM and in *Settings* under *Shared Folders* enter:

Folder Path | Folder Name | Auto-mount | Make Permanent
--- | --- | --- | ---
`d:\server` | `d/server` | :heavy_check_mark: | :heavy_check_mark:

Now you need to mount it inside the VM. To do this ssh inside and run the following command (as explained [here](https://github.com/docker/machine/issues/1826#issuecomment-143863060)):

```sh
docker-machine ssh default
# replace "d/server" with your Folder Name
export MOUNT="d/server"
echo "#!/bin/sh" | sudo tee /var/lib/boot2docker/bootlocal.sh
echo "mkdir -p /$MOUNT" | sudo tee -a /var/lib/boot2docker/bootlocal.sh
echo "mount -t vboxsf -o uid=1000,gid=1000 $MOUNT /$MOUNT" | sudo tee -a /var/lib/boot2docker/bootlocal.sh
sudo sh /var/lib/boot2docker/bootlocal.sh
```
