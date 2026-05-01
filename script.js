// Get the circle menu button
const toggle = document.getElementById("menu-toggle");

// Get navigation menu
const nav = document.getElementById("nav");

/*
  When user clicks the circle button:
  - toggle "active" on button (turns into X)
  - toggle "active" on nav (shows/hides menu)
*/
toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  nav.classList.toggle("active");
});