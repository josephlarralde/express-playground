import Script from '../core/Script';
// import SchmittTrigger from '../core/ScmittTrigger';

class MainMenu extends Script {
  constructor(options = {}) {
    super(options);

    this._draw = this._draw.bind(this);
  }

  loaded() {
    this.$banner = document.querySelector('.banner');
    this.bannerHeight = this.$banner.clientHeight;

    this.$canvas = document.querySelector('.banner-canvas');
    this.$ctx = this.$canvas.getContext('2d');

    this.$navbar = document.querySelector('.navbar');
    this.navbarHeight = this.$navbar.clientHeight;
    this.$navbarMenu = document.querySelector('.navbar-mainmenu');
    this.$navbarOverlay = document.querySelector('.navbar-overlay');

    if (this.options.user) {
      this.$userContainer = document.querySelector('.user-container');
      this.$usericon = document.querySelector('#usericon');
      this.$usermenu = document.querySelector('.usermenu');
    }

    this.$navicon = document.querySelector('#navicon');

    // this._schmitt = new SchmittTrigger(ref * 0.5, ref * 0.75, (hide) => {
    //   if (!hide && this.$banner.classList.contains('hidden')) {
    //     this.$banner.classList.remove('hidden');
    //   } else if (hide && !this.$banner.classList.contains('hidden')) {
    //     this.$banner.classList.add('hidden');
    //   }
    // });

    this._updateCanvasDimensions();

    this.$ctx.fillStyle = '#000';
    this.$ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height);

    window.requestAnimationFrame(this._draw);

    // make sure the menu is not expanded when going back into history
    this.$navbarMenu.addEventListener('click', (e) => {
      if (this.$navbar.classList.contains('active')) {
        this.$navbar.classList.remove('active');
        this.$navbarOverlay.classList.remove('active');
      }
    });

    if (this.options.user) {
      this.$usericon.addEventListener('click', (e) => {
        console.log('clicked user icon');
        this.$userContainer.classList.toggle('show');
      }, true);
    }

    this.$navicon.addEventListener('click', (e) => {
      this.$navbar.classList.toggle('active');
    }, true);

    window.addEventListener('click', (e) => {
      if (this.options.user &&
          this.$userContainer.classList.contains('show') &&
          !e.target.matches('#usericon')) {
        this.$userContainer.classList.remove('show');
      }

      if (this.$navbar.classList.contains('active') &&
          !e.target.matches('#navicon')) {
        this.$navbar.classList.remove('active');
      }
    });

    window.addEventListener('scroll', (e) => {
      this._updateHideBanner();
    })

    window.addEventListener('resize', (e) => {
      this._updateCanvasDimensions();
    });
  }

  _updateHideBanner() {
      const offset = window.pageYOffset || document.documentElement.scrollTop;
      const hide = offset > 0;

      if (!hide && this.$banner.classList.contains('hidden')) {
        this.$banner.classList.remove('hidden');
      } else if (hide && !this.$banner.classList.contains('hidden')) {
        this.$banner.classList.add('hidden');
      }

  }

  _draw() {
    // update only if canvas is visible
    if (this.$banner.clientHeight > 0) {
      const ctx = this.$ctx;
      const w = this.$canvas.width;
      const h = this.$canvas.height;

      // ctx.clearRect(0, 0, w, h);
      // ctx.fillStyle = generateRandomColor(); //r > 0.5 ? '#000' : '#fff';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);

      if (Math.random() < 0.25) {
        ctx.beginPath();
        const x = Math.random() * w;
        const y = Math.pow(Math.random(), 2.5) * h
        ctx.arc(x, y, y * 5 / h, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#fff';
        // ctx.fillStyle = generateRandomColor();
        ctx.fill();
      }
    }

    setTimeout(() => {
      window.requestAnimationFrame(this._draw);
    }, 33);
  }

  _updateCanvasDimensions() {
    const c = this.$canvas;
    const ctx = this.$ctx;

    const w = c.clientWidth;
    const h = c.clientHeight;

    if (c.width !== w) {
      const buffer = document.createElement('canvas');

      buffer.width = c.width;
      buffer.height = c.height;
      const bufCtx = buffer.getContext('2d');
      bufCtx.drawImage(c, 0, 0, c.width, c.height);

      c.width = w;
      ctx.drawImage(buffer, 0, 0, w, h);
    }

    if (c.height !== h) {
      c.height = h;
    }
  }

};

export default MainMenu;
