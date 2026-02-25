/* ── Fluid cursor background — shared across all pages ── */
(function () {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Google brand palette
  const COLORS = [
    [66, 133, 244],   // blue
    [52, 168, 83],    // green
    [251, 188, 4],    // yellow
    [234, 67, 53],    // red
  ];

  let colorIdx = 0;
  const blobs = [];

  class Blob {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.1;
      this.vy = (Math.random() - 0.5) * 1.1;
      this.r = 90 + Math.random() * 120;
      this.color = color;
      this.alpha = 0.38 + Math.random() * 0.18;
      this.life = 1;
      this.decay = 0.004 + Math.random() * 0.003;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.r += 0.35;
      this.life -= this.decay;
    }
    draw() {
      const [r, g, b] = this.color;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, `rgba(${r},${g},${b},${(this.alpha * this.life).toFixed(3)})`);
      grad.addColorStop(0.45, `rgba(${r},${g},${b},${(this.alpha * this.life * 0.3).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  let frameCount = 0;
  window.addEventListener('mousemove', function (e) {
    frameCount++;
    if (frameCount % 3 === 0) {
      blobs.push(new Blob(e.clientX, e.clientY, COLORS[colorIdx % COLORS.length]));
      colorIdx++;
      if (blobs.length > 120) blobs.splice(0, blobs.length - 120);
    }
  }, { passive: true });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = blobs.length - 1; i >= 0; i--) {
      blobs[i].update();
      blobs[i].draw();
      if (blobs[i].life <= 0) blobs.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
