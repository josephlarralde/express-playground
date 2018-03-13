import path from 'path';
import config from './config/default';

const main = {
  main: {
    route: `/${config.root}`,
    text: 'Blog',
    picture: null
  },
  editor: {
    // route: 'editor',
    route: path.join(`/${config.root}`, 'editor'),
    text: 'Monitor',
    picture: null
  },
  github: {
    route: 'https://github.com/josephlarralde/express-playground',
    text: 'GitHub',
    picture: null
  }
};

const user = {
  loggedIn: {
    myAccount: {
      route: '/account-settings',
      text: 'My account',
    },
    logOut: {
      route: '#',
      text: 'Log out',
    }
  },
  loggedOut: {
    signIn: {
      route: '/sign-in',
      text: 'Sign in',
    },
    logIn: {
      route: '/log-in',
      text: 'Log in',
    }
  }
}

const apps = {
  title: 'Demo apps',
  freemix: {
    route: '/apps/freemix',
    text: 'Freemix',
  },
  grrr: {
    route: '/apps/grrr',
    text: 'Grrr',
  },
}

export default {
  main,
  user,
  apps,
};