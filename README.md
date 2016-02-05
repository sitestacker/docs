# Site Stacker Docs

Jekyll 3 site for the [Site Stacker Documentation](http://docs.sitestacker.com). Uses GitHub Pages to build the site automatically on every push.

## Get Started

```sh
git clone https://github.com/sitestacker/docs
cd docs
```

To run the site locally and be able to make changes, the easiest way is to use [Docker](https://www.docker.com/).

Once [Docker is running](http://docs.sitestacker.com/articles/docker), start Jekyll using (from the repository root):

```sh
docker-compose up
```

You can now access the site at:

- <http://192.168.99.100:4000>

**Note:** `192.168.99.100` is the IP of the Docker VM on Mac OS X and Windows. If the URL doesn't work, you can check if it's the correct IP using `docker-machine ip default`.
