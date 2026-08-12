import { useEffect, useRef, useState } from 'react';

// The surprise: a real, typeable terminal. Not a fake animation — actual
// commands with actual output, pulled from Raj's real info. This is the
// signature element: something a template portfolio generator would never
// think to build, because it's not a visual trick, it's a toy.

const HELP = [
  'available commands:',
  '  whoami        — who is this site about',
  '  skills        — current toolkit',
  '  projects      — list of shipped work',
  '  journey       — how we got here',
  '  contact       — get in touch',
  '  sudo hire-me  — try it',
  '  clear         — clear the screen',
  '  exit          — close this terminal',
];

function useCommands() {
  return {
    help: () => HELP,
    whoami: () => [
      'raj tivari',
      'student developer · bangalore, karnataka, india',
      'status: joining computer science engineering, 2026',
      'interests: web development, cybersecurity, systems',
    ],
    skills: () => [
      'languages     : C, JavaScript, HTML, CSS',
      'building_with : React, Git & GitHub, REST APIs',
      'learning      : Node.js, Databases, Cybersecurity fundamentals',
    ],
    projects: () => [
      '01 · ClimatePulse   — climate data tracker with alerts',
      '02 · Todo List      — real-time task manager',
      '03 · E-Commerce     — real-time storefront',
      '04 · Admin Dashboard— real-time admin panel',
      '',
      "type 'exit' and scroll to /projects for links.",
    ],
    journey: () => [
      '[✓] init — bangalore, karnataka',
      '[✓] learning curiosity.js',
      '[✓] build: 2nd puc',
      '[✓] run: first-projects --watch',
      '[▶] queue: cse-engineering@2026',
      '[…] status: compiling...',
    ],
    contact: () => ['email: tivariraj424@gmail.com', "fastest way to reach me. type 'exit' and use the contact form too."],
    'sudo hire-me': () => [
      'permission check...',
      'candidate: raj tivari',
      'eagerness: 100%',
      'coffee_required: true',
      '→ access granted. see /contact to proceed.',
    ],
  };
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([
    { type: 'sys', text: "type 'help' to see what this does." },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const commands = useCommands();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  // keyboard shortcut: press "t" anywhere (not typing) to toggle
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 't' && !open && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        setOpen(true);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((prev) => [...prev, { type: 'in', text: cmd }]);
    setHistory((prev) => [...prev, cmd]);
    setHistIdx(-1);

    const key = cmd.toLowerCase();
    if (key === 'clear') {
      setLines([]);
      return;
    }
    if (key === 'exit') {
      setLines((prev) => [...prev, { type: 'out', text: ['closing...'] }]);
      setTimeout(() => setOpen(false), 350);
      return;
    }
    if (commands[key]) {
      setLines((prev) => [...prev, { type: 'out', text: commands[key]() }]);
      return;
    }
    setLines((prev) => [
      ...prev,
      { type: 'err', text: [`command not found: ${cmd}`, "type 'help' for a list of commands."] },
    ]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setValue(history[history.length - 1 - next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setValue(''); }
      else { setHistIdx(next); setValue(history[history.length - 1 - next]); }
    }
  };

  return (
    <>
      <button
        className={`terminal-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open interactive terminal"
        data-magnetic
      >
        <span className="terminal-trigger-caret">█</span>
        {!open && <span className="terminal-trigger-hint">press T</span>}
      </button>

      {open && (
        <div className="terminal-overlay" role="dialog" aria-label="Interactive terminal">
          <div className="terminal-window">
            <div className="terminal-head">
              <span className="dot-r" onClick={() => setOpen(false)} />
              <span className="dot-y" />
              <span className="dot-g" />
              <span className="terminal-title">raj@localhost:~</span>
              <button className="terminal-close" onClick={() => setOpen(false)} aria-label="Close terminal">✕</button>
            </div>
            <div className="terminal-io-body" ref={bodyRef}>
              {lines.map((l, i) => (
                <div key={i} className={`tline t-${l.type}`}>
                  {l.type === 'in' && <><span className="t-prompt">❯</span> {l.text}</>}
                  {l.type !== 'in' && (
                    Array.isArray(l.text)
                      ? l.text.map((t, j) => <div key={j}>{t}</div>)
                      : l.text
                  )}
                </div>
              ))}
              <div className="tline t-live">
                <span className="t-prompt">❯</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                <span className="t-caret">█</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}