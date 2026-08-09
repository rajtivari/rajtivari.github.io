/*
  EDIT THIS OBJECT when you are ready to personalize the portfolio.
  Keep empty strings empty until you have real links or files.
*/
const PORTFOLIO_DATA = {
  name: "Raj Tivari",
  fullName: "Raj Tivari Kokil Tivari",
  location: "Bangalore, Karnataka, India",
  title: "Student Developer | Web Developer",
  email: "tivariraj424@gmail.com",
  education: {
    degree: "Computer Science Engineering",
    year: "2026",
    focus: "Computer Science, Cybersecurity",
    college: "ADD_LATER"
  },
  skills: [
    { label: "C / C++", group: "Languages", number: "01" },
    { label: "Python", group: "Languages", number: "02" },
    { label: "HTML / CSS", group: "Web", number: "03" },
    { label: "JavaScript", group: "Web", number: "04" },
    { label: "React", group: "Web", number: "05" },
    { label: "Firebase", group: "Web", number: "06" },
    { label: "Git / GitHub", group: "Tools", number: "07" },
    { label: "VS Code / Replit", group: "Tools", number: "08" }
  ],
  projects: [
    {
      title: "Project title coming soon",
      eyebrow: "01 / IN THE WORKSHOP",
      description: "A space reserved for a practical project built while learning.",
      detail: "This editable case study is ready for Raj to replace with a future non-trading project: the problem, the build decisions, what changed, and what was learned.",
      technologies: ["Technology", "Technology"],
      image: "",
      github: "",
      demo: ""
    },
    {
      title: "Project title coming soon",
      eyebrow: "02 / IN THE WORKSHOP",
      description: "A second canvas for a thoughtful web or software build.",
      detail: "Add an image, a short narrative, technologies, GitHub URL and Live Demo URL in script.js when ready.",
      technologies: ["Technology", "Technology"],
      image: "",
      github: "",
      demo: ""
    },
    {
      title: "Project title coming soon",
      eyebrow: "03 / IN THE WORKSHOP",
      description: "A third slot for the next idea worth shipping.",
      detail: "Keep this entry honest and specific. The modal is already wired for a full case study.",
      technologies: ["Technology", "Technology"],
      image: "",
      github: "",
      demo: ""
    }
  ],
  certificate: {
    title: "C Language / C Programming Certificate",
    issuer: "Details to be added later.",
    image: ""
  },
  socials: {
    github: "",
    linkedin: "",
    instagram: ""
  },
  resume: ""
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function renderSkills(activeGroup = "All") {
  const grid = $("#skills-grid");
  grid.innerHTML = PORTFOLIO_DATA.skills
    .filter((skill) => activeGroup === "All" || skill.group === activeGroup)
    .map((skill) => `
      <article class="skill-card glass magnetic">
        <div class="skill-top"><span>${skill.number}</span><span class="skill-arrow">↗</span></div>
        <h3>${skill.label}</h3>
        <p>${skill.group}</p>
      </article>
    `).join("");
  bindMagneticElements();
}

function renderProjects() {
  $("#projects-grid").innerHTML = PORTFOLIO_DATA.projects.map((project, index) => `
    <button class="project-card glass magnetic" type="button" data-project-index="${index}">
      <div class="project-art">
        <span>${project.image ? `<img src="${project.image}" alt="${project.title}" />` : "[ image / add later ]"}</span>
        <b class="project-index">0${index + 1}</b>
      </div>
      <div class="project-copy">
        <p class="project-eyebrow">${project.eyebrow}</p>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-open"><span>Open case study</span><span>↗</span></div>
      </div>
    </button>
  `).join("");
  $$("[data-project-index]").forEach((card) => {
    card.addEventListener("click", () => openProjectModal(PORTFOLIO_DATA.projects[card.dataset.projectIndex]));
  });
  bindMagneticElements();
}

function renderEditableData() {
  $("#education-degree").textContent = PORTFOLIO_DATA.education.degree;
  $("#education-year").textContent = PORTFOLIO_DATA.education.year;
  $("#education-focus").textContent = PORTFOLIO_DATA.education.focus;
  $("#education-college").textContent = PORTFOLIO_DATA.education.college;
  $("#certificate-title").textContent = PORTFOLIO_DATA.certificate.title;
  $("#certificate-issuer").textContent = PORTFOLIO_DATA.certificate.issuer;
  $("#certificate-modal-title").textContent = PORTFOLIO_DATA.certificate.title;
  $("#email-text").textContent = PORTFOLIO_DATA.email;
  $("#email-link").href = `mailto:${PORTFOLIO_DATA.email}`;
}

function renderFilters() {
  const groups = ["All", "Languages", "Web", "Tools"];
  $("#skill-filters").innerHTML = groups.map((group) => `<button class="filter-button ${group === "All" ? "active" : ""}" type="button" data-filter="${group}">${group}</button>`).join("");
  $$(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderSkills(button.dataset.filter);
    });
  });
}

function renderSocials() {
  const socials = [
    ["GitHub", PORTFOLIO_DATA.socials.github],
    ["LinkedIn", PORTFOLIO_DATA.socials.linkedin],
    ["Instagram", PORTFOLIO_DATA.socials.instagram]
  ];
  $("#social-links").innerHTML = socials.map(([label, url]) => `
    <a class="${url ? "" : "disabled"}" href="${url || "#"}" ${url ? 'target="_blank" rel="noreferrer"' : 'aria-disabled="true"'}>${label} ${url ? "↗" : "<small>(soon)</small>"}</a>
  `).join("");
  $$(".social-links a.disabled").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));
}

function openProjectModal(project) {
  $("#project-modal-eyebrow").textContent = project.eyebrow;
  $("#project-modal-title").textContent = project.title;
  $("#project-modal-detail").textContent = project.detail;
  $("#project-modal-tags").innerHTML = project.technologies.map((tag) => `<span>${tag}</span>`).join("");
  setModalLink($("#modal-github"), project.github, "GitHub");
  setModalLink($("#modal-demo"), project.demo, "Live demo");
  $("#project-modal").hidden = false;
  document.body.classList.add("menu-open");
}

function setModalLink(link, url, label) {
  link.textContent = `${label} ${url ? "↗" : "(add later)"}`;
  link.href = url || "#";
  link.classList.toggle("disabled-link", !url);
  link.onclick = (event) => { if (!url) event.preventDefault(); };
}

function closeModals() {
  $$(".modal-backdrop").forEach((modal) => { modal.hidden = true; });
  document.body.classList.remove("menu-open");
}

function setupNavigation() {
  const header = $("#site-header");
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), { passive: true });
  const mobileMenu = $("#mobile-menu");
  const openMenu = () => { mobileMenu.classList.add("active"); mobileMenu.setAttribute("aria-hidden", "false"); $("#menu-toggle").setAttribute("aria-expanded", "true"); document.body.classList.add("menu-open"); };
  const closeMenu = () => { mobileMenu.classList.remove("active"); mobileMenu.setAttribute("aria-hidden", "true"); $("#menu-toggle").setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); };
  $("#menu-toggle").addEventListener("click", openMenu);
  $("#menu-close").addEventListener("click", closeMenu);
  $$("#mobile-menu a").forEach((link) => link.addEventListener("click", closeMenu));
  $$("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModals));
  $$(".modal-backdrop").forEach((backdrop) => backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModals(); }));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); closeModals(); } });
}

function setupContactForm() {
  const form = $("#contact-form");
  const success = $("#success-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const subject = encodeURIComponent(values.get("subject"));
    const message = encodeURIComponent(values.get("message"));
    window.location.href = `mailto:${PORTFOLIO_DATA.email}?subject=${subject}&body=${message}`;
    form.hidden = true;
    success.hidden = false;
  });
  $("#reset-message").addEventListener("click", () => { form.reset(); form.hidden = false; success.hidden = true; });
}

function setupScrollReveal() {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal-section").forEach((section) => observer.observe(section));
  setTimeout(() => $$(".hero .reveal").forEach((item) => item.classList.add("is-visible")), 80);
}

function setupTyping() {
  const target = $("#typed-code");
  const text = "<build future />";
  let index = 0;
  const timer = setInterval(() => {
    target.textContent = text.slice(0, index + 1);
    index += 1;
    if (index >= text.length) clearInterval(timer);
  }, 90);
}

function bindMagneticElements() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  $$(".magnetic").forEach((element) => {
    if (element.dataset.magneticBound) return;
    element.dataset.magneticBound = "true";
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .08;
      const y = (event.clientY - rect.top - rect.height / 2) * .08;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener("mouseleave", () => { element.style.transform = ""; });
  });
}

function setupCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.body.classList.add("has-cursor");
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  window.addEventListener("mousemove", (event) => {
    dot.style.left = `${event.clientX - 2}px`;
    dot.style.top = `${event.clientY - 2}px`;
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
  });
  document.addEventListener("mouseover", (event) => {
    if (event.target.closest("a, button, input, textarea")) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("mouseout", (event) => {
    if (event.target.closest("a, button, input, textarea")) document.body.classList.remove("cursor-hover");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderEditableData();
  renderFilters();
  renderSkills();
  renderProjects();
  renderSocials();
  setupNavigation();
  setupContactForm();
  setupScrollReveal();
  setupTyping();
  bindMagneticElements();
  setupCursor();
  $("#certificate-button").addEventListener("click", () => { $("#certificate-modal").hidden = false; document.body.classList.add("menu-open"); });
  $("#copyright-year").textContent = new Date().getFullYear();
});
