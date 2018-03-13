import menus from './menus';

// const userMenu = null;
const userMenu = menus.user;
// const userMenu = menus.apps;

const routes = {
  home: {
    route: '/',
    template: 'default',
    data: {
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
    route: '/editor',
    template: 'default',
    data: {
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