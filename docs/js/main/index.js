(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _MainMenu = require('../shared/menus/MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _UserMenu = require('../shared/menus/UserMenu');

var _UserMenu2 = _interopRequireDefault(_UserMenu);

var _CosmicBanner = require('../shared/banners/CosmicBanner');

var _CosmicBanner2 = _interopRequireDefault(_CosmicBanner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menu = new _MainMenu2.default();
var userMenu = new _UserMenu2.default();
var banner = new _CosmicBanner2.default();
},{"../shared/banners/CosmicBanner":2,"../shared/menus/MainMenu":4,"../shared/menus/UserMenu":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Script2 = require('../core/Script');

var _Script3 = _interopRequireDefault(_Script2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import SchmittTrigger from '../core/SchmittTrigger';

var CosmicBanner = function (_Script) {
  _inherits(CosmicBanner, _Script);

  function CosmicBanner() {
    _classCallCheck(this, CosmicBanner);

    var _this = _possibleConstructorReturn(this, (CosmicBanner.__proto__ || Object.getPrototypeOf(CosmicBanner)).call(this));

    _this._draw = _this._draw.bind(_this);
    return _this;
  }

  _createClass(CosmicBanner, [{
    key: 'loaded',
    value: function loaded() {
      var _this2 = this;

      this.$banner = document.querySelector('.banner');
      this.bannerHeight = this.$banner.clientHeight;

      this.$canvas = document.querySelector('.banner-canvas');
      this.$ctx = this.$canvas.getContext('2d');

      // const ref = this.bannerHeight;
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

      window.addEventListener('scroll', function (e) {
        _this2._updateHideBanner();
      });

      window.addEventListener('resize', function (e) {
        _this2._updateCanvasDimensions();
      });

      window.requestAnimationFrame(this._draw);
    }
  }, {
    key: '_updateHideBanner',
    value: function _updateHideBanner() {
      var offset = window.pageYOffset || document.documentElement.scrollTop;
      var hide = offset > 0;

      // eventually use schmitt trigger ...
      // this._schmitt.scroll(offset);

      if (!hide && this.$banner.classList.contains('hidden')) {
        this.$banner.classList.remove('hidden');
      } else if (hide && !this.$banner.classList.contains('hidden')) {
        this.$banner.classList.add('hidden');
      }
    }
  }, {
    key: '_draw',
    value: function _draw() {
      var _this3 = this;

      // update only if canvas is visible
      if (this.$banner.clientHeight > 0) {
        var ctx = this.$ctx;
        var w = this.$canvas.width;
        var h = this.$canvas.height;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, w, h);

        if (Math.random() < 0.25) {
          ctx.beginPath();
          var x = Math.random() * w;
          var y = Math.pow(Math.random(), 2.5) * h;
          ctx.arc(x, y, y * 5 / h, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
      }

      setTimeout(function () {
        window.requestAnimationFrame(_this3._draw);
      }, 33);
    }
  }, {
    key: '_updateCanvasDimensions',
    value: function _updateCanvasDimensions() {
      var c = this.$canvas;
      var ctx = this.$ctx;

      var w = c.clientWidth;
      var h = c.clientHeight;

      if (c.width !== w) {
        var buffer = document.createElement('canvas');

        buffer.width = c.width;
        buffer.height = c.height;
        var bufCtx = buffer.getContext('2d');
        bufCtx.drawImage(c, 0, 0, c.width, c.height);

        c.width = w;
        ctx.drawImage(buffer, 0, 0, w, h);
      }

      if (c.height !== h) {
        c.height = h;
      }
    }
  }]);

  return CosmicBanner;
}(_Script3.default);

;

exports.default = CosmicBanner;
},{"../core/Script":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Script = function () {
  function Script() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Script);

    this.options = options;
    var that = this;
    // window.addEventListener('load', function() {
    document.addEventListener('DOMContentLoaded', function () {
      // way faster than waiting for window.onload
      setTimeout(function () {
        that.loaded();
      }, 0);
    });
  }

  _createClass(Script, [{
    key: 'loaded',
    value: function loaded() {
      // placeholder for children classes
      console.log('window loaded');
    }
  }]);

  return Script;
}();

;

exports.default = Script;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Script2 = require('../core/Script');

var _Script3 = _interopRequireDefault(_Script2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainMenu = function (_Script) {
  _inherits(MainMenu, _Script);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).call(this));
  }

  _createClass(MainMenu, [{
    key: 'loaded',
    value: function loaded() {
      var _this2 = this;

      this.$navbar = document.querySelector('.navbar');
      this.navbarHeight = this.$navbar.clientHeight;
      this.$navbarMenu = document.querySelector('.navbar-mainmenu');
      this.$navbarOverlay = document.querySelector('.navbar-overlay');
      this.$navicon = document.querySelector('#navicon');

      // make sure the menu is not expanded when going back into history
      this.$navbarMenu.addEventListener('click', function (e) {
        if (_this2.$navbar.classList.contains('active')) {
          _this2.$navbar.classList.remove('active');
          _this2.$navbarOverlay.classList.remove('active');
        }
      });

      this.$navicon.addEventListener('click', function (e) {
        _this2.$navbar.classList.toggle('active');
      }, true);

      window.addEventListener('click', function (e) {
        if (_this2.$navbar.classList.contains('active') && !e.target.matches('#navicon')) {
          _this2.$navbar.classList.remove('active');
        }
      });
    }
  }]);

  return MainMenu;
}(_Script3.default);

;

exports.default = MainMenu;
},{"../core/Script":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Script2 = require('../core/Script');

var _Script3 = _interopRequireDefault(_Script2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserMenu = function (_Script) {
  _inherits(UserMenu, _Script);

  function UserMenu() {
    _classCallCheck(this, UserMenu);

    return _possibleConstructorReturn(this, (UserMenu.__proto__ || Object.getPrototypeOf(UserMenu)).call(this));
  }

  _createClass(UserMenu, [{
    key: 'loaded',
    value: function loaded() {
      var _this2 = this;

      this.$userContainer = document.querySelector('.user-container');
      this.$usericon = document.querySelector('#usericon');

      if (!this.$userContainer || !this.$usericon) {
        return;
      }

      this.$usericon.addEventListener('click', function (e) {
        _this2.$userContainer.classList.toggle('show');
      }, true);

      window.addEventListener('click', function (e) {
        if (_this2.$userContainer.classList.contains('show') && !e.target.matches('#usericon')) {
          _this2.$userContainer.classList.remove('show');
        }
      });
    }
  }]);

  return UserMenu;
}(_Script3.default);

;

exports.default = UserMenu;
},{"../core/Script":3}]},{},[1]);
