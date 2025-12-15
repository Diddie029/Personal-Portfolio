/* script.js
   - Handles:
     * Mobile nav toggle
     * Smooth scrolling for internal links
     * Typing animation in hero
     * Projects rendering & simple filtering
     * Contact form (client-side validation & mailto fallback)
     * Scroll-to-top visibility & action
   - Keep this file small and dependency-free for fast loading
*/

/* ========== Data (Customize your projects here) ========== */
const PROJECTS = [
  {
    id: "p1",
    title: "TaskMaster (Todo App)",
    desc: "A responsive todo app with local storage and filtering. Built with vanilla JS, HTML and CSS.",
    tech: ["web", "javascript"],
    github: "https://github.com/Diddie029/taskmaster",
    demo: "#"
  },
  {
    id: "p2",
    title: "Student Portal (PHP + MySQL)",
    desc: "A simple student portal with authentication, CRUD operations built using PHP and MySQL.",
    tech: ["backend", "database", "php"],
    github: "https://github.com/Diddie029/student-portal",
    demo: "#"
  },
  {
    id: "p3",
    title: "Portfolio API",
    desc: "A small RESTful API built with Node.js and Express to serve project metadata and contact messages.",
    tech: ["backend", "web"],
    github: "https://github.com/Diddie029/portfolio-api",
    demo: "#"
  },
  {
    id: "p4",
    title: "Library DB Design",
    desc: "Database design and normalization exercises with complex queries and stored procedures (SQL).",
    tech: ["database", "sql"],
    github: "https://github.com/Diddie029/library-db",
    demo: "#"
  }
];

/* ========== Utility helpers ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ========== DOMContentLoaded ========== */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initSmoothScroll();
  initTypingEffect();
  renderProjects(PROJECTS);
  initProjectFilters();
  initContactForm();
  initScrollTop();
  setCurrentYear();
  // Animate skill bars (small delay so paint is ready)
  setTimeout(() => {
    $$(".skill-fill").forEach( el => {
      // width already set inline in HTML for progressive enhancement
      el.style.opacity = 1;
    });
  }, 300);
});

/* ========== Navigation (mobile) ========== */
function initNav(){
  const toggle = $("#nav-toggle");
  const nav = document.querySelector(".nav");
  if(!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close nav on link click (mobile)
  $$("a[data-scroll]").forEach(a=>{
    a.addEventListener("click", () => {
      if(nav.classList.contains("open")) nav.classList.remove("open");
      $("#nav-toggle")?.setAttribute("aria-expanded", "false");
    });
  });
}

/* ========== Smooth internal scrolling for anchors ========== */
function initSmoothScroll(){
  $$("[data-scroll]").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if(!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:"smooth", block:"start"});
        // Update focus for accessibility
        setTimeout(()=> target.setAttribute("tabindex","-1") , 600);
      }
    });
  });
}

/* ========== Typing effect (lightweight) ========== */
function initTypingEffect(){
  const el = document.getElementById("typed");
  if(!el) return;
  const phrases = ["Aspiring Software Developer", "Full-Stack Learner", "Problem Solver"];
  let idx = 0, char = 0, forward = true;

  function tick(){
    const current = phrases[idx];
    if(forward){
      char++;
      el.textContent = current.slice(0,char);
      if(char === current.length){
        forward = false;
        setTimeout(tick, 1200);
        return;
      }
    } else {
      char--;
      el.textContent = current.slice(0,char);
      if(char === 0){
        forward = true;
        idx = (idx + 1) % phrases.length;
      }
    }
    setTimeout(tick, forward ? 90 : 40);
  }
  tick();
}

/* ========== Projects rendering & filtering ========== */
function renderProjects(list){
  const grid = $("#projects-grid");
  if(!grid) return;
  grid.innerHTML = ""; // clear

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.tags = p.tech.join(" ");
    card.innerHTML = `
      <div class="project-body" style="flex:1">
        <h3 style="margin:0 0 0.4rem 0">${p.title}</h3>
        <p class="project-meta">${p.desc}</p>
        <div class="project-actions">
          ${p.github ? `<a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}
          ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ""}
        </div>
      </div>
      <div style="min-width:120px; text-align:right;">
        <div style="font-size:0.9rem; color:var(--muted);">Tech</div>
        <div style="margin-top:0.4rem;">
          ${p.tech.map(t => `<span style="display:inline-block;background:rgba(255,255,255,0.03);padding:0.25rem 0.5rem;border-radius:8px;margin-left:0.2rem;font-weight:700;color:var(--muted);font-size:0.8rem">${t}</span>`).join("")}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initProjectFilters(){
  const buttons = $$(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      applyProjectFilter(filter);
    });
  });
}

function applyProjectFilter(filter){
  const cards = $$(".project-card");
  cards.forEach(card => {
    if(!filter || filter === "all"){ card.style.display = ""; return; }
    const tags = card.dataset.tags || "";
    if(tags.includes(filter)) card.style.display = "";
    else card.style.display = "none";
  });
}

/* ========== Contact form handling (client-side only) ========== */
function initContactForm(){
  const form = $("#contact-form");
  const status = $("#form-status");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();

    // Simple validation
    if(!name || !email || !message){
      status.textContent = "Please fill in all fields.";
      return;
    }
    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
      status.textContent = "Please provide a valid email.";
      return;
    }

    // For demo: open mailto as fallback
    const subject = encodeURIComponent("Portfolio contact from " + name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:kiprotichsawe99@gmail.com?subject=${subject}&body=${body}`;
    // show message to user
    status.textContent = "Opening your email client...";
    setTimeout(() => {
      window.location.href = mailto;
      status.textContent = "If your mail client didn't open, please email directly at kiprotichsawe99@gmail.com";
    }, 350);
  });
}

/* ========== Scroll to top button ========== */
function initScrollTop(){
  const btn = $("#scroll-top");
  if(!btn) return;
  window.addEventListener("scroll", () => {
    const show = window.scrollY > 400;
    btn.style.display = show ? "flex" : "none";
  });
  btn.addEventListener("click", () => {
    window.scrollTo({top:0, behavior:"smooth"});
  });
}

/* ========== small helpers ========== */
function setCurrentYear(){
  const el = $("#year");
  if(el) el.textContent = new Date().getFullYear();
}