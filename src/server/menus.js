const main = {
  main: {
    route: '/',
    text: 'Blog',
    picture: null
  },
  editor: {
    route: '/editor',
    text: 'Monitor',
    picture: null
  },
  truc: {
    route: '/truc',
    text: 'Truc',
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