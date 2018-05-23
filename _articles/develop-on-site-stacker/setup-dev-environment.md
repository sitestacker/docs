---
title: Setup Dev Environment
category: Develop on Site Stacker
date: 2015-11-11 00:00:00
---

## React

> Note: For now, we'll use `.jsx` files and transform them one by one into `.js` files, using a configured File Watcher in PhpStorm/WebStorm. Then, every `.js` file will be included using the usual `$this->Html->script()` helper in the necessary views (`.ctp` files).
>
> In the future we should investigate more complex methods like [Webpack](https://webpack.github.io/).

To be able to write [JSX files](https://facebook.github.io/react/docs/jsx-in-depth.html) and transform them into plain JavaScript you'll need to install the following prerequisites:

- [Node.js®](https://nodejs.org/en/) (follow the install instructions on the site)
- [Babel](https://babeljs.io/)

  ```sh
  npm install --global babel-cli
  ```

- [Babel React preset](https://babeljs.io/docs/plugins/preset-react/) (global installation is not possible at the moment: [SO question](http://stackoverflow.com/questions/33538403/error-couldnt-find-preset-react-when-installed-using-npm-install-global-ba))

  ```sh
  # from the Site Stacker root
  npm install babel-preset-react
  ```

- [Babel ES2015 preset](http://babeljs.io/docs/plugins/preset-es2015/) - [Learn ES2015](http://babeljs.io/docs/learn-es2015/)

  ```sh
  npm install babel-preset-es2015
  ```

### Configure React in PhpStorm/WebStorm

See [Using ReactJS in JavaScript and TypeScript](https://www.jetbrains.com/webstorm/help/using-reactjs-in-javascript-and-typescript.html).

### PhpStorm/WebStorm File Watcher

In PhpStorm/WebStorm, configure a [file watcher](https://www.jetbrains.com/webstorm/help/file-watchers.html) for your `.jsx` files as below:

![jsx-watcher](https://git.sitestacker.com/sitestacker/docs/uploads/464809a852443001fac624e84bb924af/image.png)

Make sure the **Program** points to the babel executable (on Windows this will be a `.exe`), replace the default **Arguments** field with the following:

```
--presets react,es2015 --source-maps --out-file $FileNameWithoutExtension$.js $FilePath$
```

and in the **Environment variables** field add `NODE_ENV=production` to prevent babel from inlining the `__source` key in the generated JS files.

Now, you can create `.jsx` files that will be automatically transformed into corresponding `.js` files in the same directory, on every save.
