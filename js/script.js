// Task 4: cycle through dark colors that keep the white text readable.
const backgroundColors = ["#111111", "#172338", "#263329", "#302238"];
let colorIndex = 0;
document.getElementById("change-background").addEventListener("click", function () {
  colorIndex = (colorIndex + 1) % backgroundColors.length;
  document.body.style.backgroundColor = backgroundColors[colorIndex];
});

// Task 5: Date uses the visitor's local timezone.
function updateTime() {
  const now = new Date();
  const clock = document.getElementById("current-time");
  clock.textContent = now.toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  clock.dateTime = now.toISOString();
}
updateTime();
setInterval(updateTime, 1000);

// Task 2: toggle each answer and its accessible expanded state.
const questions = document.querySelectorAll(".faq-question");
for (let i = 0; i < questions.length; i++) {
  questions[i].addEventListener("click", function () {
    const expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", String(!expanded));
    const answer = document.getElementById(this.getAttribute("aria-controls"));
    answer.classList.toggle("is-open", !expanded);
    answer.inert = expanded;
    this.querySelector("span").textContent = expanded ? "+" : "−";
  });
}

// Task 3: native dialog handles focus containment, Escape and focus return.
const subscriptionDialog = document.getElementById("subscription-dialog");
document.getElementById("open-subscription").addEventListener("click", function () {
  subscriptionDialog.showModal();
});
document.getElementById("close-subscription").addEventListener("click", function () {
  subscriptionDialog.close();
});
subscriptionDialog.addEventListener("click", function (event) {
  const bounds = subscriptionDialog.getBoundingClientRect();
  if (event.target === subscriptionDialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    subscriptionDialog.close();
  }
});

// Shared helpers display errors as text, never as HTML.
function showError(id, message) {
  const field = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  field.setAttribute("aria-invalid", String(message !== ""));
}
function validEmail(field) {
  return field.value.trim() !== "" && field.validity.valid;
}

// Task 1: required name, valid email, password length and confirmation.
const accountForm = document.getElementById("account-form");
if (accountForm) {
  accountForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("account-name");
    const email = document.getElementById("account-email");
    const password = document.getElementById("account-password");
    const confirm = document.getElementById("account-confirm");
    showError("account-name", name.value.trim() ? "" : "Enter your name.");
    showError("account-email", validEmail(email) ? "" : "Enter a valid email address.");
    showError("account-password", password.value.length >= 8 ? "" : "Use at least 8 characters.");
    showError("account-confirm", confirm.value && confirm.value === password.value ? "" : "Passwords must match and cannot be empty.");
    const firstError = accountForm.querySelector('[aria-invalid="true"]');
    document.getElementById("account-result").textContent = firstError ? "Please correct the fields above." : "Account was created";
    if (firstError) firstError.focus();
    else accountForm.reset();
  });
}

const subscriptionForm = document.getElementById("subscription-form");
subscriptionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("subscription-email");
  const valid = validEmail(email);
  document.getElementById("subscription-error").textContent = valid ? "" : "Enter a valid email address.";
  email.setAttribute("aria-invalid", String(!valid));
  document.getElementById("subscription-result").textContent = valid ? "Valid email! Demo only: no subscription was saved." : "";
  if (!valid) email.focus();
});

// Preserve the existing demo order form and validate its required controls.
const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("customer-name");
    name.setCustomValidity(name.value.trim() ? "" : "Enter your name.");
    const valid = orderForm.reportValidity();
    document.getElementById("form-result").textContent = valid ?
      "The form is valid. This is a demo; no request was sent." : "Please complete all required fields correctly.";
  });
  document.getElementById("customer-name").addEventListener("input", function () {
    this.setCustomValidity("");
  });
}
