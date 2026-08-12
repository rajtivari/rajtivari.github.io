import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import WireGrid from './components/WireGrid';
import Cursor from './components/Cursor';
import BootSequence from './components/BootSequence';
import Marquee from './components/Marquee';
import Terminal from './components/Terminal';
import { projects } from './data/projects';
import { journey } from './data/journey';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { id: 'about', label: 'About', n: '01' },
  { id: 'journey', label: 'Journey', n: '02' },
  { id: 'skills', label: 'Skills', n: '03' },
  { id: 'projects', label: 'Projects', n: '04' },
  { id: 'contact', label: 'Contact', n: '05' },
];

const SKILLS = [
  { group: 'Languages', items: ['C', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Building with', items: ['React', 'Git & GitHub', 'REST APIs'] },
  { group: 'Learning toward', items: ['Node.js', 'Databases', 'Cybersecurity fundamentals'] },
];

function useReveal(deps = []) {
  useEffect(() => {
    const targets = gsap.utils.toArray('[data-reveal]');
    const triggers = targets.map((el) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%' },
        }
      )
    );
    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.scrollTrigger?.kill());
  }, deps);
}

function GlitchText({ text, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`glitch ${className}`} data-text={text}>
      {text}
    </Tag>
  );
}

function JourneySection() {
  const railRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(railRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.journey-track',
          start: 'top 30%',
          end: 'bottom 70%',
          scrub: 0.4,
        },
      });

      stepRefs.current.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey">
      <div className="wrap">
        <span className="eyebrow" data-reveal>02 / build log</span>
        <h2 className="section-title" data-reveal>
          Nothing shipped <em>without a commit.</em>
        </h2>

        <div className="journey-layout">
          <aside className="journey-sidebar">
            <div className="journey-terminal">
              <div className="terminal-head">
                <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
                <span className="terminal-title">build.log</span>
              </div>
              <div className="terminal-body">
                {journey.map((j, i) => (
                  <div
                    key={j.step}
                    className={`terminal-row ${i === activeStep ? 'is-active' : ''} ${i < activeStep ? 'is-done' : ''}`}
                  >
                    <span className="t-bracket">
                      {i < activeStep ? '✓' : i === activeStep ? '▶' : '·'}
                    </span>
                    <span className="t-cmd">{j.cmd}</span>
                  </div>
                ))}
              </div>
              <div className="terminal-progress">
                <div className="terminal-progress-fill" style={{ width: `${((activeStep + 1) / journey.length) * 100}%` }} />
              </div>
            </div>
          </aside>

          <div className="journey-track">
            <div className="journey-rail-bg" />
            <div className="journey-rail-fill" ref={railRef} />
            {journey.map((j, i) => (
              <div
                className="journey-step"
                key={j.step}
                ref={(el) => (stepRefs.current[i] = el)}
                data-reveal
              >
                <div className={`journey-node ${j.status}`} />
                <div className="journey-content">
                  <span className={`journey-status status-${j.status}`}>
                    {j.status === 'done' ? 'compiled' : j.status === 'next' ? 'queued' : 'in progress'}
                  </span>
                  <h3>{j.title}</h3>
                  <p>{j.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState('about');
  const [navOpen, setNavOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const heroRef = useRef(null);

  useReveal([booted]);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [booted]);

  useEffect(() => {
    if (!booted) return;
    gsap.fromTo(heroRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 });
  }, [booted]);

  return (
    <>
      <BootSequence onDone={() => setBooted(true)} />
      <Cursor />
      <Terminal />

      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="nav-mark" data-magnetic>RT</a>
          <nav className="nav-links">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} data-magnetic>
                <span className="nav-num">{n.n}</span>{n.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="nav-cta" data-magnetic>connect ↗</a>
          <button className="nav-burger" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
        {navOpen && (
          <div className="nav-mobile">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setNavOpen(false)}>{n.n} / {n.label}</a>
            ))}
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <WireGrid />
          <div className="wrap hero-inner" ref={heroRef}>
            <p className="hero-status">
              <span className="dot" /> Bangalore, Karnataka, India · available to learn
            </p>
            <h1 className="hero-name">
              <GlitchText text="RAJ" /><br /><GlitchText text="TIVARI." />
            </h1>
            <p className="hero-role">&gt; student developer / web developer</p>
            <p className="hero-desc">
              A young builder from Bangalore, curious about the systems behind the screen —
              and ready for the next chapter.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary" data-magnetic>view projects ↘</a>
              <a href="#contact" className="btn btn-ghost" data-magnetic>contact me ✉</a>
            </div>
          </div>
          <div className="hero-console">raj@localhost:~/future <span className="console-caret">█</span></div>
          <a href="#about" className="scroll-cue" data-magnetic>↓ scroll to inspect</a>
        </section>

        <Marquee items={['STUDENT DEVELOPER', 'BANGALORE', 'CSE · 2026', 'BUILDING', 'LEARNING', 'CURIOUS BY DEFAULT']} />

        {/* ABOUT */}
        <section id="about">
          <div className="wrap about-grid">
            <div data-reveal>
              <span className="eyebrow">01 / whoami</span>
              <h2 className="section-title">Curiosity is <em>the entry point.</em></h2>
            </div>
            <div className="about-body" data-reveal>
              <p>
                I'm Raj — a student developer based in Bangalore, preparing to join Computer
                Science Engineering in 2026. I like understanding how things work, making them
                useful, and learning what sits underneath.
              </p>
              <p>
                I have completed 2nd PUC and am joining Computer Science Engineering in 2026.
                I'm interested in software development, web development, and cybersecurity —
                continuously learning and building practical projects.
              </p>
              <div className="about-stats">
                <div><span>2026</span><small>cse begins</small></div>
                <div><span>∞</span><small>things to learn</small></div>
              </div>
            </div>
          </div>
        </section>

        <div className="trace-divider wrap" />

        <JourneySection />

        <Marquee items={['C', 'JAVASCRIPT', 'REACT', 'HTML', 'CSS', 'GIT', 'REST APIS', 'CYBERSECURITY']} />

        {/* SKILLS */}
        <section id="skills">
          <div className="wrap">
            <span className="eyebrow" data-reveal>03 / toolkit</span>
            <h2 className="section-title" data-reveal>Components on <em>the board.</em></h2>
            <div className="skills-grid">
              {SKILLS.map((s) => (
                <div className="skill-card" key={s.group} data-reveal data-magnetic>
                  <span className="skill-corner tl" /><span className="skill-corner tr" />
                  <span className="skill-corner bl" /><span className="skill-corner br" />
                  <h3>{s.group}</h3>
                  <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="wrap">
            <span className="eyebrow" data-reveal>04 / selected work</span>
            <h2 className="section-title" data-reveal>Nothing shipped <em>without a lesson.</em></h2>
            <div className="projects-grid">
              {projects.map((p) => (
                <article className="project-card" key={p.id} data-reveal data-magnetic>
                  <div className="project-thumb">
                    {p.image ? <img src={p.image} alt={p.title} /> : <span className="thumb-placeholder">⌁ project visual / add image later</span>}
                  </div>
                  <div className="project-body">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="project-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                    <div className="project-links">
                      <a href={p.github} target="_blank" rel="noreferrer">github ↗</a>
                      <a href={p.live} target="_blank" rel="noreferrer">live demo ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="wrap contact-grid">
            <div data-reveal>
              <span className="eyebrow">05 / open channel</span>
              <h2 className="section-title">Let's make <em>something.</em></h2>
              <p className="contact-desc">
                Have a project, a question, or an opportunity to learn together?
                The fastest way to reach me is email.
              </p>
              <a href="mailto:tivariraj424@gmail.com" className="contact-email" data-magnetic>
                ✉ tivariraj424@gmail.com
              </a>
            </div>
            <form
              className="contact-form"
              data-reveal
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target);
                const subject = encodeURIComponent(data.get('subject') || 'Portfolio contact');
                const body = encodeURIComponent(data.get('message') || '');
                window.location.href = `mailto:tivariraj424@gmail.com?subject=${subject}&body=${body}`;
              }}
            >
              <label>subject<input name="subject" type="text" placeholder="Let's build something" /></label>
              <label>message<textarea name="message" rows="4" placeholder="Tell me a bit about it..." /></label>
              <button type="submit" className="btn btn-primary" data-magnetic>open email draft ↗</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a href="#top">Raj Tivari.</a>
          <p>Building. Learning. Evolving.</p>
          <p>© {new Date().getFullYear()} · Bangalore, IN</p>
        </div>
      </footer>
    </>
  );
}