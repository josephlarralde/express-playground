import http from 'http';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import serveFavicon from 'serve-favicon';
import compression from 'compression';
import express from 'express';

import routes from './routes';
import config from './config/default';

const cwd = process.cwd();
const port = process.env.PORT || config.port;
const publicDir = process.argv.length > 3 ? process.argv[3] : 'public';

const app = express();

app.use(serveFavicon(path.join(cwd, publicDir, 'favicon.ico')));
app.use(compression());
app.use(express.static(path.join(cwd, publicDir), {
  extensions: ['css', 'js', 'JPG', 'JPEG', 'jpg', 'jpeg', 'PNG', 'png']
}));
app.set('view engine', 'ejs');

const server = http.createServer(app).listen(port, function () {
  console.log('Server started: http://127.0.0.1:' + port);
});

function loadContents(route) {
  if (Array.isArray(route.data.articles)) {
    const a = route.data.articles;
    route.data.contents = [];

    for (let i = 0; i < a.length; i++) {
      const filepath = path.join(cwd, 'contents', a[i] + '.html');
      route.data.contents.push(fs.readFileSync(filepath));
    }
  }
};

function render(res, route) {
  loadContents(route);
  return res.render(route.template, route);
};

for (let r in routes) {
  routes[r].config = config;
  app.get(routes[r]['route'], function (req, res) {
    render(res, routes[r]);
  });
};

app.use(function (req, res) {
  render(res, routes['notfound']);
});