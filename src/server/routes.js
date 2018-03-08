import menus from './menus';

const routes = {
  home: {
    route: '/',
    template: 'default',
    data: {
      title: 'Blog',
      style: 'main',
      script: 'main',
      format: 'articles',
      articles: ['marwanarzanawar', 'blougoulf'],
      menu: menus.main
    }
  },
  editor: {
    route: '/editor',
    template: 'default',
    data: {
      title: 'Monitor',
      style: 'main',
      script: 'main',
      format: 'raw',
      articles: ['monitor'],
      menu: menus.main
    }
  },
  notfound: {
    route: '/notfound',
    template: 'default',
    data: {
      title: '404',
      style: 'main',
      script: 'main',
      format: 'articles',
      articles: ['notfound'],
      menu: menus.main
    }
  }
};

export default routes;