/* SHARP CUTS — business settings and service prices are edited here. */
const SHOP = {
  // Replace with the shop's WhatsApp number in international format, digits only.
  // Example Nigeria: 2348012345678 (do not include +, spaces or leading 0).
  whatsappNumber: "",
  shopName: "Sharp Cuts"
};

// Edit service prices (₦) and durations (minutes) here.
const SERVICES = {
  haircut: { name: "Haircut", price: 5000, duration: 45 },
  beard:   { name: "Beard Trim", price: 3000, duration: 25 },
  shave:   { name: "Classic Shave", price: 4000, duration: 30 },
  dye:     { name: "Hair Dye", price: 8000, duration: 60 }
};

const selectedServices = new Set();
const naira = value => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0
}).format(value);

const serviceCards = document.querySelectorAll(".service-card");
const summaryServices = document.getElementById("summary-services");
const summaryTotal = document.getElementById("summary-total");
const summaryDuration = document.getElementById("summary-duration");
const bookingForm = document.getElementById("booking-form");
const formError = document.getElementById("form-error");
const dateInput = document.getElementById("appointment-date");

function getBookingTotals() {
  return [...selectedServices].reduce((totals, key) => {
    totals.price += SERVICES[key].price;
    totals.duration += SERVICES[key].duration;
    return totals;
  }, { price: 0, duration: 0 });
}

function updateSummary() {
  const totals = getBookingTotals();
  if (!selectedServices.size) {
    summaryServices.textContent = "No services selected yet.";
  } else {
    summaryServices.innerHTML = [...selectedServices].map(key =>
      `<div class="summary-service-line"><span>${SERVICES[key].name}</span><strong>${naira(SERVICES[key].price)}</strong></div>`
    ).join("");
  }
  summaryTotal.textContent = naira(totals.price);
  summaryDuration.textContent = `${totals.duration} min`;
}

serviceCards.forEach(card => {
  const key = card.dataset.service;
  const button = card.querySelector(".select-service");
  button.addEventListener("click", () => {
    if (selectedServices.has(key)) selectedServices.delete(key);
    else selectedServices.add(key);
    const isSelected = selectedServices.has(key);
    card.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.firstChild.textContent = isSelected ? "Added " : "Add service ";
    updateSummary();
  });
});

// Set the minimum appointment date to today using the visitor's local date.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split("T")[0];
dateInput.min = localToday;
document.getElementById("year").textContent = new Date().getFullYear();

bookingForm.addEventListener("submit", event => {
  event.preventDefault();
  formError.textContent = "";

  if (!selectedServices.size) {
    formError.textContent = "Please select at least one service before booking.";
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!bookingForm.reportValidity()) return;

  const data = new FormData(bookingForm);
  const customerName = String(data.get("customerName")).trim();
  const phone = String(data.get("phone")).trim();
  const date = String(data.get("date"));
  const time = String(data.get("time"));
  const notes = String(data.get("notes")).trim();
  if (!customerName || !phone || !date || !time) {
    formError.textContent = "Please complete all required fields.";
    return;
  }
  if (date < localToday) {
    formError.textContent = "Please choose today or a future date.";
    dateInput.focus();
    return;
  }

  const totals = getBookingTotals();
  const serviceLines = [...selectedServices].map(key =>
    `• ${SERVICES[key].name} — ${naira(SERVICES[key].price)} (${SERVICES[key].duration} min)`
  ).join("\n");
  const message = [
    `Hello ${SHOP.shopName}, I'd like to request an appointment.`,
    "",
    `Name: ${customerName}`,
    `Phone: ${phone}`,
    `Date: ${date}`,
    `Time: ${time}`,
    "",
    "Selected services:",
    serviceLines,
    "",
    `Estimated total: ${naira(totals.price)}`,
    `Estimated duration: ${totals.duration} minutes`,
    notes ? `Notes: ${notes}` : "",
    "",
    "I understand this appointment is not confirmed until the shop replies."
  ].filter(Boolean).join("\n");

  if (!/^\d{10,15}$/.test(SHOP.whatsappNumber)) {
    formError.textContent = "The shop WhatsApp number has not been configured yet. Please contact the shop directly.";
    return;
  }
  const whatsappUrl = `https://wa.me/${SHOP.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}
menuToggle.addEventListener("click", () => {
  const open = !navLinks.classList.contains("open");
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", open);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

// Sticky header and back-to-top
const header = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");
function updateScrollUI() {
  header.classList.toggle("scrolled", window.scrollY > 25);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Gallery lightbox with keyboard and previous/next controls.
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
let currentImageIndex = 0;
let previousFocus = null;

function showGalleryImage(index) {
  currentImageIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImageIndex];
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.querySelector("span").textContent;
}
function openLightbox(index) {
  previousFocus = document.activeElement;
  showGalleryImage(index);
  lightbox.hidden = false;
  lightbox.querySelector(".lightbox-close").focus();
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (previousFocus) previousFocus.focus();
}
galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(currentImageIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(currentImageIndex + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showGalleryImage(currentImageIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(currentImageIndex + 1);
});

// Reveal sections as they enter view. Content remains visible if reduced motion is preferred.
const revealTargets = document.querySelectorAll(".section-heading, .service-card, .gallery-item, .about-photo, .about-copy, .booking-form, .testimonial, .contact-details");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach(element => element.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
}
