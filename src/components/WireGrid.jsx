import { useEffect, useRef } from 'react';

// Signature element: a horizon-line wireframe grid that warps toward the
// cursor, like terrain lit from below — a quiet nod to "the systems behind
// the screen" without literally being a 3D avatar/globe.
export default function WireGrid() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let width, height, dpr;

    const cols = 34;
    const rows = 16;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;
    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, width, height);

      const pts = [];
      for (let j = 0; j <= rows; j++) {
        pts[j] = [];
        for (let i = 0; i <= cols; i++) {
          const x = (i / cols) * width;
          const yBase = (j / rows) * height;

          const wave = Math.sin(i * 0.4 + t * 2 + j * 0.2) * 4;

          let dx = 0, dy = 0;
          if (mouse.current.active) {
            const mdx = x - mouse.current.x;
            const mdy = yBase - mouse.current.y;
            const dist = Math.sqrt(mdx * mdx + mdy * mdy);
            const radius = 220;
            if (dist < radius) {
              const force = (1 - dist / radius) * 26;
              const ang = Math.atan2(mdy, mdx);
              dx = Math.cos(ang) * force * -1;
              dy = Math.sin(ang) * force * -1;
            }
          }

          pts[j][i] = [x + dx, yBase + wave + dy];
        }
      }

      ctx.lineWidth = 1;
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        const fade = 0.34 - Math.abs(j - rows / 2) / rows * 0.24;
        ctx.strokeStyle = `rgba(0,229,255,${Math.max(0.05, fade)})`;
        for (let i = 0; i <= cols; i++) {
          const [x, y] = pts[j][i];
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,229,255,0.10)';
        for (let j = 0; j <= rows; j++) {
          const [x, y] = pts[j][i];
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (mouse.current.active) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 10
        );
        grad.addColorStop(0, 'rgba(255,46,196,0.9)');
        grad.addColorStop(1, 'rgba(255,46,196,0)');
        ctx.fillStyle = grad;
        ctx.arc(mouse.current.x, mouse.current.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="wire-grid" aria-hidden="true" />;
}