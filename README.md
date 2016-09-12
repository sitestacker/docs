# Site Stacker Docs

Jekyll 3 site for the [Site Stacker Documentation](http://docs.sitestacker.com). Uses GitHub Pages to build the site automatically on every push.

## Get Started

To run the site locally and be able to make changes, the easiest way is to use [Docker](https://www.docker.com/).

> IMPORTANT: Make sure you shared your drive in **Docker Settings -> Shared Drives**.

### Clone repository

```sh
git clone https://github.com/sitestacker/docs ~/docs
cd ~/docs
```

*The location of the cloned repository needs to be shared in Docker (see above).*

### Start the site

```sh
docker-compose up -d
```

You can now access the site at:

- <http://localhost:4000>
