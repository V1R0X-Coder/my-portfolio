/* PRIME FORM — shared interactions and page-specific features */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Shared navigation and footer utilities
  const menuButton = $(".menu-toggle");
  const navigation = $(".main-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });
    $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }));
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const backTop = $(".back-top");
  if (backTop) {
    const updateBackTop = () => backTop.classList.toggle("visible", window.scrollY > 500);
    window.addEventListener("scroll", updateBackTop, { passive: true });
    updateBackTop();
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Fitness calculator: Mifflin–St Jeor BMR and activity-adjusted TDEE.
  const fitnessForm = $("#fitness-form");
  if (fitnessForm) {
    const steps = $$(".calc-step", fitnessForm);
    const progress = $("#progress-fill");
    const stepLabel = $("#step-label");
    const errorBox = $("#calc-error");
    const resultPanel = $("#calc-result");
    let currentStep = 1;

    const showStep = step => {
      currentStep = step;
      steps.forEach(section => section.classList.toggle("active", Number(section.dataset.step) === step));
      if (progress) progress.style.width = `${step / 3 * 100}%`;
      if (stepLabel) stepLabel.textContent = `STEP 0${step} / 03`;
      if (errorBox) errorBox.textContent = "";
    };

    const validateStep = step => {
      const section = steps.find(item => Number(item.dataset.step) === step);
      const controls = $$("input, select", section);
      for (const control of controls) {
        if (control.type === "radio") {
          const group = $$(`input[name="${control.name}"]`, section);
          if (!group.some(item => item.checked)) {
            errorBox.textContent = "Please select an option before continuing.";
            return false;
          }
          continue;
        }
        if (!control.checkValidity()) {
          control.reportValidity();
          errorBox.textContent = step === 1 && control.name === "age" && Number(control.value) < 18
            ? "This estimate is for adults aged 18 and over. For younger people, please seek individual guidance from a qualified healthcare professional."
            : "Please complete the highlighted field with a valid value.";
          control.focus();
          return false;
        }
      }
      return true;
    };

    $$(".next-step", fitnessForm).forEach(button => button.addEventListener("click", () => {
      if (validateStep(currentStep)) showStep(Math.min(3, currentStep + 1));
    }));
    $$(".prev-step", fitnessForm).forEach(button => button.addEventListener("click", () => showStep(Math.max(1, currentStep - 1))));

    fitnessForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!validateStep(3) || !validateStep(1) || !validateStep(2)) return;

      const data = new FormData(fitnessForm);
      const age = Number(data.get("age"));
      const height = Number(data.get("height"));
      const weight = Number(data.get("weight"));
      const gender = data.get("gender");
      const activity = Number(data.get("activity"));
      const goal = data.get("goal");

      if (age < 18) {
        showStep(1);
        errorBox.textContent = "This estimate is for adults aged 18 and over. For younger people, please seek individual guidance from a qualified healthcare professional.";
        return;
      }

      // Mifflin–St Jeor: male +5; female −161.
      const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === "male" ? 5 : -161);
      const tdee = bmr * activity;
      $("#bmr-value").textContent = `${Math.round(bmr).toLocaleString()}`;
      $("#tdee-value").textContent = `${Math.round(tdee).toLocaleString()}`;
      $("#activity-value").textContent = activity.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
      $("#goal-value").textContent = goal;
      fitnessForm.hidden = true;
      $(".form-progress").hidden = true;
      resultPanel.hidden = false;
      resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const resetButton = $(".reset-calculator");
    if (resetButton) resetButton.addEventListener("click", () => {
      fitnessForm.reset();
      fitnessForm.hidden = false;
      $(".form-progress").hidden = false;
      resultPanel.hidden = true;
      showStep(1);
      $(".calculator-card").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Booking enquiry: validate locally, then open a WhatsApp message.
  const bookingForm = $("#booking-form");
  if (bookingForm) {
    const error = $("#booking-error");
    const dateInput = $('input[name="date"]', bookingForm);
    if (dateInput) {
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.min = localToday;
    }

    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      error.textContent = "";

      const fields = $$("input:not([type=checkbox]), select", bookingForm);
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          error.textContent = "Please check the highlighted field and try again.";
          field.focus();
          return;
        }
      }
      const consent = $('input[name="consent"]', bookingForm);
      if (!consent.checked) {
        error.textContent = "Please agree to the enquiry consent before continuing.";
        consent.focus();
        return;
      }

      const data = new FormData(bookingForm);
      const phone = String(data.get("phone")).trim();
      if (phone.replace(/\D/g, "").length < 7) {
        error.textContent = "Please enter a valid phone number.";
        $('input[name="phone"]', bookingForm).focus();
        return;
      }

      const message = [
        "Hello Prime Form! I'd like to enquire about a coaching session.",
        "",
        `*Name:* ${String(data.get("fullName")).trim()}`,
        `*Phone:* ${phone}`,
        `*Email:* ${String(data.get("email")).trim()}`,
        `*Preferred date:* ${data.get("date")}`,
        `*Preferred time:* ${data.get("time")}`,
        `*Training type:* ${data.get("trainingType")}`,
        "",
        "Please let me know the next steps. Thank you!"
      ].join("\n");

      // Replace this sample number with the gym's WhatsApp number, digits only.
      const whatsappNumber = "";
      if (!/^\d{10,15}$/.test(whatsappNumber)) {
        error.textContent = "This is a demo form. Add the business WhatsApp number in prime-form.js to enable enquiries.";
        return;
      }
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      const opened = window.open(whatsappURL, "_blank", "noopener,noreferrer");
      if (!opened) {
        error.textContent = "Your browser blocked the WhatsApp window. Allow pop-ups or open WhatsApp Web and try again.";
      }
    });
  }
})();