// Animated favicon — "AH." mark, halftone light sweep. Drop-in, no dependencies.
// Usage: <script src="favicon.js"></script>  (fires itself on load)
// Options via window.AH_FAVICON = { ink:'#1f3fd8', dot:'#e6ff2e', bg:'#17150f', fps:12 }
(function () {
  var o = window.AH_FAVICON || {};
  var INK = o.ink || '#1f3fd8', DOT = o.dot || '#e6ff2e', BG = o.bg || '#17150f';
  var FPS = o.fps || 12, N = 64; // render at 64px, browsers downscale

  var cv = document.createElement('canvas'); cv.width = cv.height = N;
  var ctx = cv.getContext('2d');

  var link = document.querySelector('link[rel~="icon"]');
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/png';

  // 4x4 ordered (Bayer) dither threshold matrix
  var B = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];

  var t = 0, cell = 4;
  function frame() {
    t += 1 / FPS;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, N, N);

    // dithered light sweep travelling diagonally behind the letters
    ctx.fillStyle = INK;
    for (var y = 0; y < N; y += cell) {
      for (var x = 0; x < N; x += cell) {
        var u = (x + y) / (N * 2);
        var v = 0.5 + 0.5 * Math.sin(u * 6.283 * 1.5 - t * 2.4);
        v *= 0.55;
        if (v > (B[(y / cell) & 3][(x / cell) & 3] + 0.5) / 16) ctx.fillRect(x, y, cell, cell);
      }
    }

    // AH
    ctx.fillStyle = '#f4f1e8';
    ctx.font = '700 34px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('AH', 5, 46);

    // pulsing yellow period
    var p = 0.5 + 0.5 * Math.sin(t * 3.1);
    var r = 5 + p * 2.5;
    ctx.fillStyle = DOT;
    ctx.beginPath();
    ctx.arc(N - 11, 42, r, 0, 6.283);
    ctx.fill();

    link.href = cv.toDataURL('image/png');
  }

  function start() {
    frame();
    setInterval(function () { if (!document.hidden) frame(); }, 1000 / FPS);
  }

  if (document.fonts && document.fonts.load) {
    document.fonts.load('700 34px "Space Grotesk"').then(start, start);
  } else start();
})();
