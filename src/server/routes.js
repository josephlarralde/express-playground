import path from 'path';
import menus from './menus';

// const userMenu = null;
const mainMenu = menus.main;
const userMenu = menus.user;

function copy(obj) { return JSON.parse(JSON.stringify(obj)); }

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
      articles: [ 'marwanarzanawar', 'blougoulf' ],
      menu: mainMenu,
      userMenu: userMenu,
      // menu: copy(mainMenu),
      // userMenu: copy(userMenu),
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
      // menu: copy(mainMenu),
      // userMenu: copy(userMenu),
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
      // menu: copy(mainMenu),
      // userMenu: copy(userMenu),
    }
  }
};

export default routes;