/* =========================================================
   PROJECT DATA
   ---------------------------------------------------------
   Add your real projects here. Each object becomes a card.
   Set "featured: true" on your strongest project to give it
   a larger card. Leave "github" / "demo" empty ('') if you
   don't have a link yet — the button will show as disabled
   instead of linking anywhere fake.

   Example:
   {
     name: "Project Name",
     description: "One or two sentence summary of what it is.",
     problem: "What problem it solves.",
     built: "What you personally built.",
     tech: ["HTML", "CSS", "JavaScript"],
     github: "https://github.com/username/repo",
     demo: "https://your-demo-link.com",
     image: "assets/project-1.jpg",
     overview: "Longer overview for the modal.",
     features: ["Feature one", "Feature two"],
     challenges: "A real challenge you ran into.",
     learned: "What you learned building it.",
     featured: true
   }
========================================================= */
const PROJECTS = [
  // Add project objects here once ready.
];

/* =========================================================
   TERMINAL BOOT SEQUENCE
========================================================= */
const terminalLines = [
  { text: "whoami", type: "prompt" },
  { text: "Raj Tivari Kokil Tivari", type: "output" },
  { text: "cat status.txt", type: "prompt" },
  { text: "> Preparing to start Computer Science Engineering, 2026", type: "output" },
  { text: "> Building web apps with HTML, CSS, JS, React", type: "output" },
  { text: "> Learning C / C++ and cybersecurity fundamentals", type: "output" },
  { text: "cat focus.txt", type: "prompt" },
  { text: "> Looking for a software development internship", type: "output" },
];

function typeTerminal(){
  const el = document.getElementById("terminalBody");
  if(!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(reduceMotion){
    el.innerHTML = terminalLines.map(l =>
      l.type === "prompt"
        ? `<span class="line-prompt">$ ${l.text}</span>`
        : `<span class="line-comment">${l.text}</span>`
    ).join("\n");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let buffer = "";

  function typeChar(){
    if(lineIndex >= terminalLines.length){
      el.innerHTML = buffer + '<span class="terminal-cursor"></span>';
      return;
    }

    const line = terminalLines[lineIndex];
    const prefix = line.type === "prompt" ? "$ " : "";
    const full = prefix + line.text;
    const cls = line.type === "prompt" ? "line-prompt" : "line-comment";

    if(charIndex <= full.length){
      const partial = full.slice(0, charIndex);
      el.innerHTML = buffer + `<span class="${cls}">${partial}</span>` + '<span class="terminal-cursor"></span>';
      charIndex++;
      setTimeout(typeChar, line.type === "prompt" ? 45 : 12);
    } else {
      buffer += `<span class="${cls}">${full}</span>\n`;
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, 220);
    }
  }

  typeChar();
}

/* =========================================================
   MOBILE NAV
========================================================= */
function initNav(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================================
   ACTIVE SECTION INDICATOR
========================================================= */
function initActiveSection(){
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
function initReveal(){
  const items = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* =========================================================
   NAVBAR BACKGROUND + BACK TO TOP
========================================================= */
function initScrollUI(){
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   PROJECTS RENDER
========================================================= */
function linkButton(url, label, iconClass){
  if(url && url.trim() !== ""){
    return `<a href="${url}" class="btn btn-secondary" target="_blank" rel="noopener"><i class="${iconClass}"></i> ${label}</a>`;
  }
  return `<span class="btn btn-secondary" disabled><i class="${iconClass}"></i> ${label}</span>`;
}

function renderProjects(){
  const grid = document.getElementById("projectsGrid");

  if(PROJECTS.length === 0){
    grid.innerHTML = [1,2,3].map(n => `
      <div class="project-card is-placeholder">
        <div class="placeholder-body">
          <i class="fa-solid fa-code-branch"></i>
          <h3>Project ${n} — coming soon</h3>
          <p>Add this project's details to the PROJECTS array in script.js.</p>
        </div>
      </div>
    `).join("");
    return;
  }

  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="project-card ${p.featured ? "is-featured" : ""}" data-index="${i}">
      <div class="project-image">
        ${p.image ? `<img src="${p.image}" alt="${p.name} screenshot">` : `<i class="fa-solid fa-image"></i>`}
      </div>
      <div class="project-body">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
        <div class="project-tags">
          ${(p.tech || []).map(t => `<span>${t}</span>`).join("")}
        </div>
        <div class="project-links">
          ${linkButton(p.github, "GitHub", "fa-brands fa-github")}
          ${linkButton(p.demo, "Live Demo", "fa-solid fa-arrow-up-right-from-square")}
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => openModal(PROJECTS[card.dataset.index]));
  });
}

/* =========================================================
   PROJECT MODAL
========================================================= */
function openModal(p){
  const overlay = document.getElementById("projectModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h3 id="modalTitle">${p.name}</h3>
    <div class="modal-tags project-tags">${(p.tech || []).map(t => `<span>${t}</span>`).join("")}</div>

    <h4>Overview</h4>
    <p>${p.overview || p.description || ""}</p>

    ${p.features && p.features.length ? `
      <h4>Features</h4>
      <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
    ` : ""}

    ${p.built ? `<h4>What I Built</h4><p>${p.built}</p>` : ""}
    ${p.challenges ? `<h4>Challenges</h4><p>${p.challenges}</p>` : ""}
    ${p.learned ? `<h4>What I Learned</h4><p>${p.learned}</p>` : ""}

    <div class="project-links">
      ${linkButton(p.github, "GitHub", "fa-brands fa-github")}
      ${linkButton(p.demo, "Live Demo", "fa-solid fa-arrow-up-right-from-square")}
    </div>
  `;

  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(){
  const overlay = document.getElementById("projectModal");
  overlay.hidden = true;
  document.body.style.overflow = "";
}

function initModal(){
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("projectModal").addEventListener("click", (e) => {
    if(e.target.id === "projectModal") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeModal();
  });
}

/* =========================================================
   CONTACT FORM (mailto — no backend on GitHub Pages)
========================================================= */
function initContactForm(){
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value;
    const email = document.getElementById("cf-email").value;
    const message = document.getElementById("cf-message").value;

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:tivariraj424@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  typeTerminal();
  initNav();
  initActiveSection();
  initReveal();
  initScrollUI();
  renderProjects();
  initModal();
  initContactForm();
});
