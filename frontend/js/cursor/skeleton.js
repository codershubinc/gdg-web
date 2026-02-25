/**
 * skeleton.js — RoboSkeleton class
 *
 * Draws a segmented robotic skeleton that follows the cursor:
 *   • Spine  — 12 rigid joints, tapered bones with rivets
 *   • Arms   — 3-joint chains branching from the shoulder joint
 *   • Legs   — 3-joint chains branching from the hip joint
 *   • Head   — robot skull with antenna, blinking eyes, mouth grill
 *
 * All draw primitives (_bone, _dot, _rect, _a) are module-private.
 */

// ── config ────────────────────────────────────────────────────────────────────
const SPINE_N = 12;
const SPINE_SEG = 13;   // px between spine joints
const ARM_N = 3;    // joints per arm (shoulder + 2)
const ARM_SEG = 9;
const LEG_N = 3;    // joints per leg (hip + 2)
const LEG_SEG = 11;
const SHOULDER = 2;    // spine index where arms attach
const HIP = SPINE_N - 3; // = 9

const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];
const DARK = '#0a0a0f';

// ── exported class ────────────────────────────────────────────────────────────
export class RoboSkeleton {
  constructor() {
    this.spine = _mkChain(SPINE_N);
    this.armL = _mkChain(ARM_N);
    this.armR = _mkChain(ARM_N);
    this.legL = _mkChain(LEG_N);
    this.legR = _mkChain(LEG_N);

    this._eyeOpen = true;
    this._blinkTick = 0;
    this._blinkSeq = [];      // sequence of [closedFrames, openFrames, ...]
    this._blinkSeqIdx = 0;
    this._blinkWait = _nextBlinkWait(); // frames until next blink sequence starts
  }

  /** Call every animation frame with the current cursor position. */
  update(mx, my) {
    // Head chases cursor
    _lerp(this.spine[0], mx, my, 0.28);

    // Rigid spine: each joint is constrained to SPINE_SEG behind the previous
    for (let i = 1; i < SPINE_N; i++) {
      _pull(this.spine[i], this.spine[i - 1], SPINE_SEG);
    }

    // Arms branch from shoulder joint, perpendicular to spine
    _branch(this.armL, this.spine[SHOULDER], this.spine[SHOULDER + 1], -1, ARM_SEG);
    _branch(this.armR, this.spine[SHOULDER], this.spine[SHOULDER + 1], 1, ARM_SEG);

    // Legs branch from hip joint
    _branch(this.legL, this.spine[HIP], this.spine[HIP - 1], -1, LEG_SEG);
    _branch(this.legR, this.spine[HIP], this.spine[HIP - 1], 1, LEG_SEG);

    // Blink patterns: random interval 500–700 ms, with single/double/triple/rapid styles
    this._blinkTick++;
    if (this._blinkSeq.length === 0) {
      // Waiting for next blink
      if (this._blinkTick >= this._blinkWait) {
        this._blinkTick = 0;
        this._blinkSeq = _pickBlinkSeq();
        this._blinkSeqIdx = 0;
      }
    } else {
      // Executing blink sequence: alternating [closed, open, closed, open …]
      const dur = this._blinkSeq[this._blinkSeqIdx];
      if (this._blinkTick >= dur) {
        this._blinkTick = 0;
        this._blinkSeqIdx++;
        if (this._blinkSeqIdx >= this._blinkSeq.length) {
          // Sequence done — eyes open, schedule next blink
          this._eyeOpen = true;
          this._blinkSeq = [];
          this._blinkWait = _nextBlinkWait();
        } else {
          this._eyeOpen = !this._eyeOpen;
        }
      }
    }
  }

  /** Draw everything onto ctx. */
  draw(ctx) {
    // Layer order: legs → spine → arms → head (front)
    _drawChain(ctx, this.legL, 0.42, 4.0, 1);
    _drawChain(ctx, this.legR, 0.42, 4.0, 2);
    _drawSpine(ctx, this.spine);
    _drawChain(ctx, this.armL, 0.60, 5.0, 0);
    _drawChain(ctx, this.armR, 0.60, 5.0, 1);
    _drawHead(ctx, this.spine[0], this.spine[1], this._eyeOpen);
  }
}

// ── blink helpers ─────────────────────────────────────────────────────────────
// Returns frames to wait before starting the next blink (500–700 ms at ~60 fps)
function _nextBlinkWait() {
  return Math.round((300 + Math.random() * 200) / 1000 * 60);
}

// Returns a blink sequence as [closedFrames, openFrames, closedFrames, …]
// First entry is always "closed", last entry is always "closed".
// Eyes start closed when sequence begins, so odd indices = open, even = closed.
function _pickBlinkSeq() {
  const CLOSE = 4;   // frames eyes stay shut per blink (~67 ms)
  const GAP = 5;   // frames eyes stay open between blinks in a multi-blink

  const roll = Math.random();
  if (roll < 0.40) {
    // single blink
    return [CLOSE];
  } else if (roll < 0.65) {
    // double blink
    return [CLOSE, GAP, CLOSE];
  } else if (roll < 0.82) {
    // triple blink
    return [CLOSE, GAP, CLOSE, GAP, CLOSE];
  } else {
    // rapid burst: 4 quick blinks with tiny gaps
    return [3, 3, 3, 3, 3, 3, 3];
  }
}

// ── kinematics ────────────────────────────────────────────────────────────────
function _mkChain(n) {
  return Array.from({ length: n }, () => ({ x: -600, y: -600 }));
}

function _lerp(j, tx, ty, f) {
  j.x += (tx - j.x) * f;
  j.y += (ty - j.y) * f;
}

/** Constrain joint so it stays exactly `len` px from anchor. */
function _pull(joint, anchor, len) {
  const dx = joint.x - anchor.x;
  const dy = joint.y - anchor.y;
  const d = Math.hypot(dx, dy) || 0.001;
  joint.x = anchor.x + (dx / d) * len;
  joint.y = anchor.y + (dy / d) * len;
}

/**
 * Update a limb chain.
 * The root (limb[0]) is placed perpendicular to the spine at `anchor`,
 * then the chain is rigid from the root.
 * side: -1 = left, +1 = right (relative to movement direction)
 */
function _branch(limb, anchor, behind, side, seg) {
  const angle = Math.atan2(anchor.y - behind.y, anchor.x - behind.x) + (Math.PI / 2) * side;
  _lerp(limb[0],
    anchor.x + Math.cos(angle) * seg * 0.65,
    anchor.y + Math.sin(angle) * seg * 0.65,
    0.32,
  );
  for (let i = 1; i < limb.length; i++) _pull(limb[i], limb[i - 1], seg);
}

// ── draw functions ────────────────────────────────────────────────────────────
function _drawSpine(ctx, s) {
  // Bones — tail → head so head bone renders on top
  for (let i = SPINE_N - 2; i >= 0; i--) {
    const t = 1 - i / (SPINE_N - 2);
    _bone(ctx, s[i], s[i + 1], 2.5 + t * 6.5, COLORS[i % 4], 0.18 + t * 0.72);
  }
  // Joints — skip index 0 (head module draws it)
  for (let i = SPINE_N - 1; i >= 1; i--) {
    const t = 1 - i / (SPINE_N - 1);
    _dot(ctx, s[i], 1.4 + t * 3.5, COLORS[i % 4], 0.18 + t * 0.72);
  }
}

function _drawChain(ctx, joints, aBase, wBase, colorOffset) {
  const n = joints.length;
  for (let i = 0; i < n - 1; i++) {
    const t = 1 - i / Math.max(n - 2, 1);
    _bone(ctx, joints[i], joints[i + 1],
      wBase * (0.55 + t * 0.45),
      COLORS[(i + colorOffset) % 4],
      aBase * (0.45 + t * 0.55),
    );
  }
  for (let i = 0; i < n; i++) {
    const t = 1 - i / (n - 1);
    _dot(ctx, joints[i], 1.3 + t * 2.5, COLORS[(i + colorOffset) % 4], aBase * (0.45 + t * 0.55));
  }
}

function _drawHead(ctx, pos, neck, eyeOpen) {
  const W = 30, H = 24, R = 7;
  ctx.save();
  ctx.translate(pos.x, pos.y);

  // ── Skull plate ───────────────────────────────────────────────────
  ctx.beginPath();
  _rect(ctx, -W / 2, -H / 2, W, H, R);
  ctx.fillStyle = 'rgba(18,18,28,0.93)';
  ctx.strokeStyle = COLORS[0] + 'cc';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  // ── Antenna shaft ─────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(0, -H / 2);
  ctx.lineTo(0, -H / 2 - 13);
  ctx.strokeStyle = COLORS[0] + '88';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Antenna tip with radial glow
  const ty = -H / 2 - 16;
  const ag = ctx.createRadialGradient(0, ty, 0, 0, ty, 8);
  ag.addColorStop(0, COLORS[1] + 'bb');
  ag.addColorStop(1, COLORS[1] + '00');
  ctx.beginPath();
  ctx.arc(0, ty, 8, 0, Math.PI * 2);
  ctx.fillStyle = ag;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, ty, 3, 0, Math.PI * 2);
  ctx.fillStyle = COLORS[1];
  ctx.fill();

  // ── Eyes ──────────────────────────────────────────────────────────
  const ey = -1;
  [[-7.5, COLORS[0]], [7.5, COLORS[2]]].forEach(([ex, col]) => {
    // Socket recess
    ctx.beginPath();
    ctx.arc(ex, ey, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fill();

    if (eyeOpen) {
      // Glow halo
      ctx.beginPath();
      ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = col + '28';
      ctx.fill();
      // Iris
      ctx.beginPath();
      ctx.arc(ex, ey, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      // Pupil
      ctx.beginPath();
      ctx.arc(ex, ey, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = DARK;
      ctx.fill();
      // Specular flare
      ctx.beginPath();
      ctx.arc(ex - 1.1, ey - 1.1, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fill();
    } else {
      // Closed — squint line
      ctx.beginPath();
      ctx.moveTo(ex - 3.8, ey);
      ctx.lineTo(ex + 3.8, ey);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
  });

  // ── Mouth grill (3 vertical bars) ────────────────────────────────
  for (let i = 0; i < 3; i++) {
    const gx = -4.5 + i * 4.5;
    ctx.beginPath();
    ctx.moveTo(gx, H / 2 - 8);
    ctx.lineTo(gx, H / 2 - 3);
    ctx.strokeStyle = COLORS[2] + '66';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

// ── draw primitives ───────────────────────────────────────────────────────────

/** Rectangular bone plate between points a and b. */
function _bone(ctx, a, b, bw, color, alpha) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < 1) return;

  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));

  // Outer shell
  ctx.beginPath();
  _rect(ctx, 1, -bw * 0.5, len - 2, bw, bw * 0.42);
  ctx.fillStyle = color + _a(alpha * 0.18);
  ctx.strokeStyle = color + _a(alpha * 0.85);
  ctx.lineWidth = 1.2;
  ctx.fill();
  ctx.stroke();

  // Centre spine line
  if (len > bw * 2) {
    ctx.beginPath();
    ctx.moveTo(bw * 0.65, 0);
    ctx.lineTo(len - bw * 0.65, 0);
    ctx.strokeStyle = color + _a(alpha * 0.38);
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  // Rivets (only on longer bones)
  if (len > 14) {
    [0.3, 0.7].forEach(p => {
      ctx.beginPath();
      ctx.arc(len * p, 0, 1.15, 0, Math.PI * 2);
      ctx.fillStyle = color + _a(alpha * 0.65);
      ctx.fill();
    });
  }

  ctx.restore();
}

/** Ball-socket joint dot. */
function _dot(ctx, p, r, color, alpha) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color + _a(alpha * 0.28);
  ctx.strokeStyle = color + _a(alpha);
  ctx.lineWidth = 1.3;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = color + _a(alpha * 0.85);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p.x, p.y, r * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = DARK;
  ctx.fill();
}

/** Rounded rect path. Uses native roundRect when available. */
function _rect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
}

/** alpha 0..1 → 2-char lowercase hex suffix for 8-digit hex colours */
function _a(v) {
  return Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
}
