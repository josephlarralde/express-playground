import menus from './menus';

const mainMenu = menus.main;
const userMenu = null; // menus.user;

const routes = {
  home: {
    route: '/',
    template: 'default',
    data: {
      title: 'About',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [ 'about/presentation' ],
      menu: mainMenu,
      userMenu: userMenu,
    }
  },
  editor: {
    route: '/documentation',
    template: 'default',
    data: {
      title: 'Documentation',
      styles: [ 'main' ],
      scripts: [ 'main' ],
      format: 'articles',
      articles: [
        'documentation/scripts',
        'documentation/config',
        'documentation/routes',
        'documentation/menus',
      ],
      menu: mainMenu,
      userMenu: userMenu,
    }
  },
  notfound: {
    route: '/notfound',
    template: 'default',
    data: {
      title: '404', // this is how a static 404 page is built
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