(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _MainMenu = require('../shared/menus/MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menu = new _MainMenu2.default();
},{"../shared/menus/MainMenu":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"../core/Script":2}]},{},[1]);
