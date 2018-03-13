import path from 'path';
import menus from './menus';
import config from './config/default';

// const userMenu = null;
const userMenu = menus.user;
// const userMenu = menus.apps;

const routes = {
  home: {
    route: config.root,
    template: 'default',
    data: {
      root: config.root,
      logged: true,
      title: 'Blog',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [ 'marwanarzanawar', 'blougoulf' ],
      menu: menus.main,
      userMenu: userMenu,
    }
  },
  editor: {
    route: path.join(config.root, 'editor'),
    template: 'default',
    data: {
      root: config.root,
      title: 'Monitor',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'raw',
      articles: [ 'monitor' ],
      menu: menus.main,
      userMenu: userMenu,
    }
  },
  notfound: {
    route: '/notfound',
    template: 'default',
    data: {
      root: config.root,
      title: '404',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [ 'notfound' ],
      menu: menus.main,
      userMenu: userMenu,
    }
  }
};

export default routes;