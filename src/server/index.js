import http from 'http';
import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import express from 'express';
import serveFavicon from 'serve-favicon';

import routes from './routes';
import config from './config/default';

const cwd = process.cwd();
const port = process.env.PORT || config.port;

const app = express();

app.use(serveFavicon(path.join(cwd, 'public', 'favicon.ico')));
app.use(express.static(path.join(cwd, 'public'), {
  extensions: ['css', 'js', 'JPG', 'JPEG', 'jpg', 'jpeg', 'PNG', 'png']
}));
app.set('view engine', 'ejs');

const server = http.createServer(app).listen(port, function () {
  console.log('Server started: http://127.0.0.1:' + port);
});

const loadContents = function loadContents(route) {
  if (Array.isArray(route.data.articles)) {
    const a = route.data.articles;
    route.data.contents = [];

    for (let i = 0; i < a.length; i++) {
      const filepath = path.join(cwd, 'contents', a[i] + '.html');
      route.data.contents.push(fs.readFileSync(filepath));
    }
  }
};

const render = function render(res, route) {
  return res.render(route.template, route);
};

for (let r in routes) {
  app.get(routes[r]['route'], function (req, res) {
    loadContents(routes[r]);
    render(res, routes[r]);
  });
};

app.use(function (req, res) {
  render(res, routes['notfound']);
});