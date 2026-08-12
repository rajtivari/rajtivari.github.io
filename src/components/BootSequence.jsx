import { useEffect, useRef, useState } from 'react';

const LINES = [
  { text: 'RAJ_OS v2026.1 — boot sequence initiated', delay: 0 },
  { text: 'checking hardware... Bangalore, Karnataka, IN', delay: 90 },
  { text: 'mounting /curiosity ................ OK', delay: 90 },
  { text: 'loading modules: html, css, javascript ... OK', delay: 70 },
  { text: 'loading modules: react ................. OK', delay: 60 },
  { text: 'compiling 2nd_puc.pkg .................. DONE', delay: 90 },
  { text: 'scanning for bugs... found: none fatal', delay: 80 },
  { text: 'queueing cse_engineering.pkg (2026) .... PENDING', delay: 90 },
  { text: 'status: curious, available, compiling', delay: 70 },
  { text: 'welcome.', delay: 140 },
];

export default function BootSequence({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState([]);
  const [exiting, setExiting] = useState(false);
  const skippedRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('raj_booted') === '1') {
      setVisible(false);
      onDone();
      return;
    }

    let i = 0;
    let timeouts = [];
    const runLine = () => {
      if (skippedRef.current || i >= LINES.length) return;
      const lineText = LINES[i].text;
      setShown((prev) => [...prev, lineText]);
      i++;
      if (i < LINES.length) {
        timeouts.push(setTimeout(runLine, LINES[i].delay));
      } else {
        timeouts.push(setTimeout(finish, 500));
      }
    };
    const finish = () => {
      setExiting(true);
      setTimeout(() => {
        sessionStorage.setItem('raj_booted', '1');
        setVisible(false);
        onDone();
      }, 550);
    };
    timeouts.push(setTimeout(runLine, 250));

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const skip = () => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    setExiting(true);
    setTimeout(() => {
      sessionStorage.setItem('raj_booted', '1');
      setVisible(false);
      onDone();
    }, 400);
  };

  if (!visible) return null;

  return (
    <div className={`boot ${exiting ? 'boot-exit' : ''}`} onClick={skip}>
      <div className="boot-inner">
        {shown.map((line, idx) => (
          <div className="boot-line" key={idx}>
            <span className="boot-caret">&gt;</span> {line}
          </div>
        ))}
        <span className="boot-cursor">_</span>
      </div>
      <button className="boot-skip" onClick={skip}>skip ↵</button>
    </div>
  );
}