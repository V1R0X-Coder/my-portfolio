const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menu-toggle");
const nav = $("#primary-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}));

// Theme toggle; remembers the choice on this device when storage is available.
const themeToggle = $("#theme-toggle");
try {
  if (localStorage.getItem("niya-theme") === "dark") document.body.classList.add("dark-theme");
} catch {}
function updateThemeButton() {
  const dark = document.body.classList.contains("dark-theme");
  themeToggle.textContent = dark ? "☼" : "◐";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  try { localStorage.setItem("niya-theme", document.body.classList.contains("dark-theme") ? "dark" : "light"); } catch {}
  updateThemeButton();
});

// Reading progress indicator
const progress = $("#reading-progress");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Project filtering and search
const filterButtons = $$(".filter-button");
const projectCards = $$(".project-card");
const projectSearch = $("#project-search");
const noResults = $("#no-results");
let activeFilter = "all";
function filterProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let visible = 0;
  projectCards.forEach(card => {
    const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchMatch = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
    const show = categoryMatch && searchMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  noResults.hidden = visible !== 0;
}
filterButtons.forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  filterProjects();
}));
projectSearch.addEventListener("input", filterProjects);

// Project case-study dialog
const projectData = {
  sharp: {
    kicker: "BUSINESS WEBSITE / SHARP CUTS",
    title: "Sharp Cuts",
    description: "A boutique grooming website with a warm, confident visual identity. The experience helps visitors explore services, understand pricing and move toward a booking.",
    highlights: ["Service selection and pricing interactions", "Booking journey and gallery experience", "Responsive layouts for desktop and mobile", "Standalone project preview included in this portfolio"],
    note: "This preview contains the Sharp Cuts project files included in the portfolio package. Any real booking/contact integration should be connected to the business's approved details.",
    demo: "sharp-cuts.html"
  },
  prime: {
    kicker: "FITNESS WEBSITE / PRIME FORM",
    title: "Prime Form",
    description: "A multi-page fitness and personal-training experience with a bold visual system and a guided calculator journey.",
    highlights: ["BMR and TDEE estimate calculator", "Guided multi-step input flow", "Dedicated booking and calculator pages", "Responsive layout and interactive UI"],
    note: "Calculator outputs are estimates for general information, not medical advice. The complete Prime Form project is included as a standalone preview.",
    demo: "prime-form.html"
  },
  luma: {
    kicker: "EVENT DISCOVERY / ORIGINAL CONCEPT",
    title: "Luma Events",
    description: "An original event-discovery website concept designed around the feeling of finding something exciting to do. It combines editorial event cards with search, category filters and saved events.",
    highlights: ["Search events by name or location", "Filter by event category", "Open event details in an interactive panel", "Save favourites on the current device", "Email-based registration enquiry"],
    note: "Luma Events is a self-initiated demo concept. Event listings are sample content; no real tickets are sold and no real event is being advertised.",
    demo: "luma-events.html"
  },
  aurel: {
    kicker: "ORIGINAL DESIGN CONCEPT / AUREL LIVING",
    title: "AUREL Living",
    description: "A premium furniture-store concept exploring editorial product storytelling, calm product discovery and a polished shopping experience.",
    highlights: ["Premium storefront art direction", "Product category and discovery layout concept", "Product detail and shopping journey planning", "Responsive design direction"],
    note: "AUREL Living is a self-initiated design concept, not a commissioned client website or a live online store.",
    demo: "aurel-living.html"
  },
  bytebite: {
    kicker: "CAFE WEBSITE / BYTEBITE",
    title: "ByteBite Café",
    description: "A bright, friendly cafe website with a filterable menu, add-to-basket interactions and a clear order summary.",
    highlights: ["Filter menu items by category", "Add and remove items from the basket", "Adjust quantities and see the total update", "Prepare an order summary for WhatsApp", "Responsive layout for mobile and desktop"],
    note: "ByteBite is a portfolio demo. Menu items, prices and contact details are sample content; no real orders are placed.",
    demo: "bytebite.html"
  }
};
const dialog = $("#project-dialog");
$$(".details-button").forEach(button => button.addEventListener("click", () => {
  const project = projectData[button.dataset.project];
  if (!project) return;
  $("#dialog-kicker").textContent = project.kicker;
  $("#dialog-title").textContent = project.title;
  $("#dialog-description").textContent = project.description;
  $("#dialog-highlights").replaceChildren(...project.highlights.map(item => {
    const li = document.createElement("li"); li.textContent = item; return li;
  }));
  $("#dialog-disclaimer").textContent = project.note;
  const demoLink = $("#dialog-demo");
  if (project.demo) {
    demoLink.href = project.demo;
    demoLink.hidden = false;
  } else {
    demoLink.hidden = true;
    demoLink.removeAttribute("href");
  }
  dialog.showModal();
}));
$("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
$("#dialog-contact").addEventListener("click", () => dialog.close());

// Toast and copy-email action
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
$("#copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("ericushie3@gmail.com");
    showToast("Email address copied.");
  } catch {
    showToast("Email: ericushie3@gmail.com");
  }
});

// Contact form creates a pre-addressed email; it does not silently send or store data.
$("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Niya Gigs enquiry — ${data.get("project")}`;
  const body = [
    `Hello Eric,`,
    ``,
    `My name: ${data.get("name")}`,
    `My email: ${data.get("email")}`,
    `Project type: ${data.get("project")}`,
    ``,
    `Message:`,
    `${data.get("message")}`,
    ``,
    `Sent from the Niya Gigs portfolio contact form.`
  ].join("\n");
  $("#form-hint").textContent = "Opening your email app with the message details. Please review and press Send in your email app.";
  window.location.href = `mailto:ericushie3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// Small reveal effect with a graceful fallback.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".skill-card, .project-card, .about-copy, .about-grid h2, .process-list article").forEach(el => {
    el.classList.add("will-reveal");
    revealObserver.observe(el);
  });
}
