// Assignment 5: store interactions. Each initializer only runs on its own page.
"use strict";

// Object with methods: one shared audio context and one voice prevent overlap.
const storeSound = {
  enabled: false,
  context: null,
  voice: null,
  async play() {
    if (!this.enabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.context) this.context = new AudioContext();
      await this.context.resume();
      if (this.voice) this.voice.stop();
      const oscillator = this.context.createOscillator();
      const volume = this.context.createGain();
      oscillator.connect(volume);
      volume.connect(this.context.destination);
      oscillator.frequency.value = 660;
      volume.gain.setValueAtTime(0.06, this.context.currentTime);
      volume.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.12);
      oscillator.start();
      oscillator.stop(this.context.currentTime + 0.13);
      this.voice = oscillator;
      oscillator.onended = () => {
        oscillator.disconnect();
        volume.disconnect();
        if (this.voice === oscillator) this.voice = null;
      };
    } catch (error) {
      // Browsers may block audio. All store interactions still work silently.
    }
  }
};
const soundToggle = document.getElementById("sound-toggle");
soundToggle.addEventListener("click", function () {
  storeSound.enabled = !storeSound.enabled;
  this.setAttribute("aria-pressed", String(storeSound.enabled));
  this.textContent = storeSound.enabled ? "Sound: on" : "Sound: off";
  if (!storeSound.enabled && storeSound.voice) storeSound.voice.stop();
  storeSound.play();
});

// Keyboard events: normal Tab navigation remains available as well.
const menuLinks = Array.from(document.querySelectorAll("#mainMenu .nav-link"));
menuLinks.forEach((link, index) => {
  link.addEventListener("keydown", function (event) {
    let next;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": next = (index + 1) % menuLinks.length; break;
      case "ArrowLeft": case "ArrowUp": next = (index - 1 + menuLinks.length) % menuLinks.length; break;
      case "Home": next = 0; break;
      case "End": next = menuLinks.length - 1; break;
      default: return;
    }
    event.preventDefault();
    menuLinks[next].focus();
  });
});

function animateElement(element) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  element.getAnimations().forEach(animation => animation.cancel());
  element.animate([
    { opacity: 0.35, transform: "translateY(10px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 260, easing: "ease-out" });
}

function initializeCatalog() {
  const filters = document.getElementById("catalog-filters");
  if (!filters) return;
  const brand = document.getElementById("brand-filter");
  const budget = document.getElementById("price-filter");
  const search = document.getElementById("sneaker-search");
  // Read the existing cards into objects instead of duplicating product data.
  const products = Array.from(document.querySelectorAll("#catalog-products .product-card")).map(card => ({
    card,
    name: card.querySelector("h2").textContent.trim(),
    brand: card.querySelector(".product-brand").textContent.trim(),
    price: Number(card.querySelector(".product-price").textContent.replace(/\D/g, "")),
    rating: 0
  }));

  function matchesBudget(product) {
    switch (budget.value) {
      case "under60": return product.price < 60000;
      case "from60": return product.price >= 60000;
      default: return true;
    }
  }
  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    // filter is a higher-order function: it receives a predicate callback.
    const matches = products.filter(product =>
      (brand.value === "all" || product.brand === brand.value) &&
      matchesBudget(product) && product.name.toLowerCase().includes(query)
    );
    products.forEach(product => { product.card.hidden = !matches.includes(product); });
    document.getElementById("catalog-count").textContent = `${matches.length} of ${products.length} sneakers shown`;
    document.getElementById("catalog-empty").hidden = matches.length !== 0;
    animateElement(document.getElementById("catalog-products"));
  }
  filters.addEventListener("input", applyFilters);
  filters.addEventListener("submit", event => event.preventDefault());
  filters.addEventListener("reset", function (event) {
    event.preventDefault();
    brand.value = "all";
    budget.value = "all";
    search.value = "";
    applyFilters();
  });

  products.forEach((product, index) => {
    const rating = document.createElement("div");
    rating.className = "product-rating";
    rating.setAttribute("role", "group");
    rating.setAttribute("aria-label", `Rate ${product.name}`);
    const message = document.createElement("p");
    message.className = "rating-message";
    message.id = `rating-message-${index}`;
    message.setAttribute("role", "status");
    message.textContent = "Your rating: not rated";
    // A for loop creates five real buttons; Enter and Space work natively.
    for (let value = 1; value <= 5; value++) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "rating-star";
      star.textContent = "★";
      star.setAttribute("aria-label", `${value} out of 5 stars for ${product.name}`);
      star.setAttribute("aria-pressed", "false");
      star.addEventListener("click", function () {
        product.rating = value;
        rating.querySelectorAll("button").forEach((button, position) => {
          button.classList.toggle("is-selected", position < product.rating);
          button.setAttribute("aria-pressed", String(position + 1 === product.rating));
        });
        message.textContent = `Your rating: ${product.rating} / 5 (this visit)`;
        animateElement(message);
        storeSound.play();
      });
      rating.append(star);
    }
    product.card.querySelector(".card-body").append(rating, message);
  });
  applyFilters();
}

function initializeOrderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll(".order-step"));
  const back = document.getElementById("order-back");
  const next = document.getElementById("order-next");
  const submit = document.getElementById("order-submit");
  const result = document.getElementById("form-result");
  const name = document.getElementById("customer-name");
  let currentStep = 0;

  function validateStep(index) {
    name.setCustomValidity(name.value.trim() ? "" : "Enter your name.");
    const controls = steps[index].querySelectorAll("input, select, textarea");
    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }
    return true;
  }
  name.addEventListener("input", () => name.setCustomValidity(""));

  const request = {
    getDetails() {
      const model = document.getElementById("sneaker-model");
      return {
        Name: name.value.trim(),
        Email: document.getElementById("customer-email").value.trim(),
        Model: model.options[model.selectedIndex].textContent,
        Size: form.querySelector('[name="size"]:checked')?.value || "Not selected",
        Color: document.getElementById("favorite-color").value,
        Message: document.getElementById("customer-message").value.trim() || "No message"
      };
    },
    renderSummary() {
      const summary = document.getElementById("order-summary");
      summary.replaceChildren();
      Object.entries(this.getDetails()).forEach(([label, value]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value; // User input is never inserted as HTML.
        summary.append(term, description);
      });
    }
  };
  function showStep(index, focus = true) {
    currentStep = index;
    steps.forEach((step, position) => { step.hidden = position !== index; });
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    submit.hidden = index !== steps.length - 1;
    document.getElementById("order-progress").textContent = `Step ${index + 1} of 3: ${steps[index].querySelector("legend").textContent}`;
    if (index === 2) request.renderSummary();
    result.textContent = "";
    animateElement(steps[index]);
    if (focus) steps[index].querySelector("input, select, textarea").focus();
  }
  // Higher-order function: the callback renders the step after navigation.
  function moveStep(direction, onStepChange) {
    if (direction > 0 && !validateStep(currentStep)) return;
    const target = currentStep + direction;
    if (target >= 0 && target < steps.length) onStepChange(target);
  }
  next.addEventListener("click", () => moveStep(1, showStep));
  back.addEventListener("click", () => moveStep(-1, showStep));
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (currentStep < steps.length - 1) {
      moveStep(1, showStep);
      return;
    }
    // Reveal a step before reporting invalid controls, so focus never targets hidden inputs.
    for (let index = 0; index < steps.length; index++) {
      name.setCustomValidity(name.value.trim() ? "" : "Enter your name.");
      const invalid = Array.from(steps[index].querySelectorAll("input, select, textarea")).some(control => !control.checkValidity());
      if (invalid) { showStep(index); validateStep(index); return; }
    }
    result.textContent = `Thanks, ${name.value.trim()}! Your request is valid. Demo only: no order was sent or saved.`;
    animateElement(result);
    storeSound.play();
  });
  form.addEventListener("reset", function () {
    // Reset's default action runs after this handler; wait before updating the UI.
    queueMicrotask(() => {
      name.setCustomValidity("");
      document.getElementById("order-summary").replaceChildren();
      showStep(0);
    });
  });
  showStep(0, false);
}
initializeCatalog();
initializeOrderForm();
