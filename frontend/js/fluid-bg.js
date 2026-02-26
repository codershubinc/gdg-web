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
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.r = 60 + Math.random() * 80;
            this.color = color;
            this.alpha = 0.18 + Math.random() * 0.1;
            this.life = 1;
            this.decay = 0.006 + Math.random() * 0.004;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.988;
            this.vy *= 0.988;
            this.r += 0.2;
            this.life -= this.decay;
        }
        draw() {
            const [r, g, b] = this.color;
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            grad.addColorStop(0, `rgba(${r},${g},${b},${(this.alpha * this.life).toFixed(3)})`);
            grad.addColorStop(0.5, `rgba(${r},${g},${b},${(this.alpha * this.life * 0.2).toFixed(3)})`);
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
        if (frameCount % 5 === 0) {
            blobs.push(new Blob(e.clientX, e.clientY, COLORS[colorIdx % COLORS.length]));
            colorIdx++;
            if (blobs.length > 60) blobs.splice(0, blobs.length - 60);
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
