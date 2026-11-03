// Assignment 5: class/attribute-based Day and Night themes on every page.
"use strict";
const themeButton = document.getElementById("theme-toggle");
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.setAttribute("data-bs-theme", theme);
  document.querySelectorAll("[data-bs-theme]").forEach(element => element.setAttribute("data-bs-theme", theme));
  document.body.style.backgroundColor = "";
  themeButton.textContent = theme === "light" ? "Night mode" : "Day mode";
  themeButton.setAttribute("aria-pressed", String(theme === "light"));
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("stepup-theme") || "dark"; } catch (error) { /* Storage can be disabled. */ }
setTheme(savedTheme === "light" ? "light" : "dark");
themeButton.addEventListener("click", function () {
  const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  setTheme(theme);
  try { localStorage.setItem("stepup-theme", theme); } catch (error) { /* Theme still works for this page. */ }
});
