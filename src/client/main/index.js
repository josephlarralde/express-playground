window.onload = (function() {

let top = true;
let banner, bannerHeight, canvas, ctx,
    navbar, navbarHeight,
    menubar, menubarOverlay,
    navicon;
let prevScroll = undefined;

function generateRandomColor() {
  var letters = '0123456789ABCDEF';
  // var letters = '89ABCDEF';
  var tint = '#';
  for (var i = 0; i < 6; i++) {
    tint += letters[Math.floor(Math.random() * 16)];
    // tint += letters[Math.floor(Math.random() * 8)];
  }
  return tint;
}

function checkDimensions() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  if (canvas.width !== w) {
    const buffer = document.createElement('canvas');

    buffer.width = canvas.width;
    buffer.height = canvas.height;
    const bufCtx = buffer.getContext('2d');
    bufCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    canvas.width = w;

    ctx.drawImage(buffer, 0, 0, w, h);
  }

  if (canvas.height !== h) {
    canvas.height = h;
  }
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;

  // ctx.clearRect(0, 0, w, h);
  // ctx.fillStyle = generateRandomColor(); //r > 0.5 ? '#000' : '#fff';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.166)';
  ctx.fillRect(0, 0, w, h);

  ctx.beginPath();
  const x = Math.random() * w;
  const y = Math.pow(Math.random(), 2.5) * h
  ctx.arc(x, y, y * 5 / h, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#fff';
  // ctx.fillStyle = generateRandomColor();
  ctx.fill();

  setTimeout(function() {
    window.requestAnimationFrame(draw);
  }, 33);
}

setTimeout(function() {
  banner = document.querySelector('.banner');
  bannerHeight = banner.clientHeight;
  navbar = document.querySelector('.navbar');
  menubar = document.querySelector('.menubar-mainmenu');
  menubarOverlay = document.querySelector('.menubar-overlay');
  navicon = document.querySelector('.navicon > img');
  canvas = document.querySelector('.banner-canvas');
  ctx = canvas.getContext('2d');

  // canvas.width = 0;
  checkDimensions();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  window.requestAnimationFrame(draw);

  window.addEventListener('resize', function(e) {
    checkDimensions();
  });

  navicon.addEventListener('click', function(e) {
    if (menubar.classList.contains('active')) {
      menubar.classList.remove('active');
      menubarOverlay.classList.remove('active');
    } else {
      menubar.classList.add('active');
      menubarOverlay.classList.add('active');
    }
  }, false);
}, 0);


window.addEventListener('scroll', function(e) {
  const offset = window.pageYOffset || document.documentElement.scrollTop;
  const cropped = Math.max(0, bannerHeight - offset);

  banner.style.height = `${cropped}px`;
  navbar.style.top = `${cropped}px`;
  // navbar.style.marginTop = `${cropped}px`;
});

})();
