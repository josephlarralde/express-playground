import path from 'path';
import menus from './menus';

const mainMenu = menus.main;
const userMenu = menus.user;

const routes = {
  home: {
    route: '/',
    template: 'default',
    data: {
      // logged: true,
      title: 'Blog',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [ 'static-website', 'blougoulf' ],
      menu: mainMenu,
      userMenu: userMenu,
    }
  },
  editor: {
    route: '/editor',
    template: 'default',
    data: {
      title: 'Monitor',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'raw',
      articles: [ 'monitor' ],
      menu: mainMenu,
      userMenu: userMenu,
    }
  },
  notfound: {
    route: '/notfound',
    template: 'default',
    data: {
      title: '404',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [ 'notfound' ],
      menu: mainMenu,
      userMenu: userMenu,
    }
  }
};

export default routes;