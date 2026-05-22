/* ════════════════════════════════════════════════
   JECTAR ONE — particles.js
   Animated canvas particle network
════════════════════════════════════════════════ */

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Resize ─────────────────────────────────────
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Particle factory ────────────────────────────
  const COLORS = ['#00d4ff', '#7c3aed', '#10b981'];
  const MAX_DIST = 90;
  const isMobile = window.innerWidth < 768;

  function makeParticle() {
    return {
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.4 + 0.4,
      dx:  (Math.random() - 0.5) * 0.32,
      dy:  (Math.random() - 0.5) * 0.32,
      op:  Math.random() * 0.42 + 0.08,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  const count = isMobile ? 20 : Math.min(45, Math.floor(window.innerWidth / 22));
  const pts   = Array.from({ length: count }, makeParticle);

  // ── Draw loop ───────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move & draw dots
    pts.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle  = p.col;
      ctx.globalAlpha = p.op;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle  = '#00d4ff';
          ctx.globalAlpha  = (1 - dist / MAX_DIST) * 0.07;
          ctx.lineWidth    = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
})();
