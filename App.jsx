import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import WireGrid from './components/WireGrid';
import { projects } from './data/projects';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { id: 'about', label: 'About', n: '01' },
  { id: 'skills', label: 'Skills', n: '02' },
  { id: 'projects', label: 'Projects', n: '03' },
  { id: 'education', label: 'Education', n: '04' },
  { id: 'contact', label: 'Contact', n: '05' },
];

const SKILLS = [
  { group: 'Languages', items: ['C', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Building with', items: ['React', 'Git & GitHub', 'REST APIs'] },
  { group: 'Learning toward', items: ['Node.js', 'Databases', 'Cybersecurity fundamentals'] },
];

function useReveal() {
  useEffect(() => {
    const targets = gsap.utils.toArray('[data-reveal]');
    targets.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
}

export default function App() {
  const [active, setActive] = useState('about');
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef(null);

  useReveal();

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 }
    );
  }, []);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="nav-mark">RT</a>
          <nav className="nav-links">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''}>
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="nav-cta">Let's connect ↗</a>
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
        <section className="hero" style={{ borderTop: 'none' }}>
          <WireGrid />
          <div className="wrap hero-inner" ref={heroRef}>
            <p className="hero-status">
              <span className="dot" /> Bangalore, Karnataka, India · available to learn
            </p>
            <h1 className="hero-name">Raj<br />Tivari.</h1>
            <p className="hero-role">Student Developer · Web Developer</p>
            <p className="hero-desc">
              A young builder from Bangalore, curious about the systems behind the screen —
              and ready for the next chapter.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View projects ↘</a>
              <a href="#contact" className="btn btn-ghost">Contact me ✉</a>
            </div>
          </div>
          <div className="hero-console">
            <span className="console-dim">raj@localhost:~/future</span> <span className="console-caret">⌘</span>
          </div>
          <a href="#about" className="scroll-cue">↓ Scroll to explore</a>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="wrap about-grid">
            <div data-reveal>
              <span className="eyebrow">01 / The person behind the code</span>
              <h2 className="section-title">Curiosity is<br /><em>the starting point.</em></h2>
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
                <div><span>2026</span><small>CSE begins</small></div>
                <div><span>∞</span><small>things to learn</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="wrap">
            <span className="eyebrow" data-reveal>02 / Current toolkit</span>
            <h2 className="section-title" data-reveal>Tools for turning<br /><em>ideas into reality.</em></h2>
            <div className="skills-grid">
              {SKILLS.map((s) => (
                <div className="skill-card" key={s.group} data-reveal>
                  <h3>{s.group}</h3>
                  <ul>
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="wrap">
            <span className="eyebrow" data-reveal>03 / Selected work</span>
            <h2 className="section-title" data-reveal>Nothing shipped<br /><em>without a lesson.</em></h2>
            <div className="projects-grid">
              {projects.map((p) => (
                <article className="project-card" key={p.id} data-reveal>
                  <div className="project-thumb">
                    {p.image ? (
                      <img src={p.image} alt={p.title} />
                    ) : (
                      <span className="thumb-placeholder">⌁ project visual / add image later</span>
                    )}
                  </div>
                  <div className="project-body">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="project-tags">
                      {p.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                    <div className="project-links">
                      <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                      <a href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education">
          <div className="wrap education-grid">
            <div data-reveal>
              <span className="eyebrow">04 / The next chapter</span>
              <h2 className="section-title">Starting with<br /><em>strong fundamentals.</em></h2>
            </div>
            <div className="education-card" data-reveal>
              <span className="edu-tag">UP NEXT</span>
              <h3>Computer Science Engineering</h3>
              <p className="edu-sub">Joining in 2026</p>
              <div className="edu-meta">
                <div><small>Focus</small><span>Computer Science, Cybersecurity</span></div>
                <div><small>College</small><span>ADD_LATER</span></div>
              </div>
              <p className="edu-note">College details are intentionally left editable.</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="wrap contact-grid">
            <div data-reveal>
              <span className="eyebrow">05 / Open channel</span>
              <h2 className="section-title">Let's make<br /><em>something.</em></h2>
              <p className="contact-desc">
                Have a project, a question, or an opportunity to learn together?
                The fastest way to reach me is email.
              </p>
              <a href="mailto:tivariraj424@gmail.com" className="contact-email">
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
              <label>Subject
                <input name="subject" type="text" placeholder="Let's build something" />
              </label>
              <label>Message
                <textarea name="message" rows="4" placeholder="Tell me a bit about it..." />
              </label>
              <button type="submit" className="btn btn-primary">Open email draft ↗</button>
              <span className="form-hint">➤ opens your email client</span>
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
