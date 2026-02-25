/**
 * laser.js — glowing laser-pointer tail that trails behind the cursor
 * Three-pass render: outer glow → mid haze → core beam
 */

const TRAIL_LEN = 42;

export class LaserTail {
  constructor() {
    this._pts = [];
  }

  update(x, y) {
    this._pts.push({ x, y });
    if (this._pts.length > TRAIL_LEN) this._pts.shift();
  }

  draw(ctx) {
    const pts = this._pts;
    if (pts.length < 2) return;
    const n = pts.length;

    ctx.save();
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < n; i++) {
      const a  = Math.pow(i / (n - 1), 2); // quadratic falloff: 0=oldest, 1=newest
      const p0 = pts[i - 1];
      const p1 = pts[i];

      // Pass 1 — outer glow
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = `rgba(66,133,244,${+(a * 0.12).toFixed(3)})`;
      ctx.lineWidth   = 15;
      ctx.stroke();

      // Pass 2 — mid haze
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = `rgba(100,180,255,${+(a * 0.36).toFixed(3)})`;
      ctx.lineWidth   = 5;
      ctx.stroke();

      // Pass 3 — bright core beam
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = `rgba(210,238,255,${+(a * 0.88).toFixed(3)})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // Tip radial burst
    const tip = pts[n - 1];
    const g   = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 10);
    g.addColorStop(0, 'rgba(200,228,255,0.72)');
    g.addColorStop(1, 'rgba(66,133,244,0)');
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.restore();
  }
}
