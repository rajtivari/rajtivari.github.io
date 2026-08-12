import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const hovering = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      particles.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (particles.current.length > 18) particles.current.shift();

      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering.current = !!el?.closest('a, button, [data-magnetic]');
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        const scale = hovering.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = hovering.current ? 'var(--magenta)' : 'var(--cyan)';
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.life -= 0.07;
      });
      particles.current = particles.current.filter((p) => p.life > 0);
      particles.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.life * 0.5})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}