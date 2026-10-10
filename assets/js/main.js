(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.topbar nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('nav-open', !open);
      menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el, i) => {
      if (i < 2) el.classList.add('is-visible');
      observer.observe(el);
    });
  }

  if (window.Lenis && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, smoothTouch: false });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  const canvas = document.getElementById('crystal-canvas');
  if (!canvas || !window.THREE) return;
  let renderer, scene, camera, crystal, frameId, pointerDown = false, lastX = 0, lastY = 0, dragMoved = false;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(canvas.clientWidth || 500, canvas.clientHeight || 500, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8c7668, 1.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 5, 6); scene.add(key);
    const rim = new THREE.PointLight(0xf26b45, 2.3, 15); rim.position.set(-4, 1, 3); scene.add(rim);
    const cool = new THREE.PointLight(0xa6b5d5, 1.7, 15); cool.position.set(3, -3, 2); scene.add(cool);
    crystal = new THREE.Group(); scene.add(crystal);
    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xe7ded0, metalness: 0.17, roughness: 0.16, transmission: 0.22, thickness: 1.2, clearcoat: 1, clearcoatRoughness: 0.12, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat); crystal.add(mesh);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x8e8277, transparent: true, opacity: 0.32 }));
    crystal.add(wire);
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.76, 0), new THREE.MeshStandardMaterial({ color: 0xe8481c, metalness: 0.3, roughness: 0.3, flatShading: true }));
    inner.scale.set(0.85, 1.1, 0.8); crystal.add(inner);
    const resize = () => {
      const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas.parentElement); else window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', e => { pointerDown = true; dragMoved = false; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      if (!pointerDown) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;
      crystal.rotation.y += dx * 0.008; crystal.rotation.x += dy * 0.008;
      lastX = e.clientX; lastY = e.clientY;
    });
    const release = () => { pointerDown = false; };
    canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!pointerDown && !reduced) { crystal.rotation.y += 0.0026; crystal.rotation.x += Math.sin(Date.now() * 0.00035) * 0.0008; }
      crystal.position.y = reduced ? 0 : Math.sin(Date.now() * 0.00065) * 0.09;
      renderer.render(scene, camera);
    };
    resize(); animate();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frameId); }
      else { cancelAnimationFrame(frameId); animate(); }
    });
  } catch (error) {
    canvas.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'crystal-fallback'; fallback.textContent = '◇';
    canvas.parentElement.appendChild(fallback);
    console.warn('3D crystal could not initialize:', error);
  }
})();