# express-playground

#### starter project for express based websites

Clone this repository, `cd` into it, then :

`npm install`
`npm run build`

The `build` command will run a watcher that will :

- transpile your es6 code on each modification in the `src/server` directory and restart the server
- transpile your es6 code on each modification in the `src/client` directory and browserify relevant `index.js` files
- generate the `css` files on each modification in the `styles` directory

Once the website built, it can be simply started by running `node dist/index.js`.

#### structure

This project uses the `ejs` template engine for rendering html.
The main html template is the `views/default.ejs` file, providing the basic
structure of a responsive website.

The main entry point to modify the architecture of the website is the `src/server/routes.js` file.
Each route specifies its own `ejs` template file, as well as relevant data to populate it.

When using the `default.ejs` template, the relevant data includes html contents,
specified in the `data.articles` field, which will be looked for in the `contents` directory.
It also includes the menu definition, specified in the `data.menu` field.
The menu designed to be used with the `default.ejs` template is defined in the `src/server/menus.js` file.

