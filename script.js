/* ======================================================================
   script.js — three independent features on this site:
   1. Mobile nav toggle   (runs on every page)
   2. Hero terminal typing effect  (index.html only)
   3. Project filter buttons       (projects.html only)

   Each block below starts by checking whether its target element exists
   on the current page (`if (toggle) { ... }`). This is the same reason
   you'd null-check an object in Java before calling a method on it —
   without the check, `document.getElementById(...)` returns null on
   pages that don't have that element, and calling `.addEventListener`
   on null throws and stops the WHOLE script, breaking every page.
   ====================================================================== */

/* ----------------------------------------------------------------------
   1. MOBILE NAV TOGGLE
   ---------------------------------------------------------------------- */
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    // classList.toggle() adds the class if missing, removes it if present —
    // like `flag = !flag;` but for a CSS class instead of a boolean.
    toggle.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // Close the menu automatically when a link is tapped, so the overlay
  // doesn't stay open after navigating — a small but real UX bug if skipped.
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      nav.classList.remove("active");
    });
  });
}

/* ----------------------------------------------------------------------
   2. HERO TERMINAL TYPING EFFECT (index.html)
   The hero terminal has lines pre-written in the HTML but hidden
   (opacity: 0 via the "line" class start-state), and this script reveals
   them one at a time with a short delay — like a loading loop, but for
   visual reveal instead of data. If the visitor has "reduce motion"
   turned on at the OS level, we skip straight to showing everything.
   ---------------------------------------------------------------------- */
const terminalLines = document.querySelectorAll(".terminal-body .line");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (terminalLines.length > 0) {
  if (prefersReducedMotion) {
    // Skip the animation entirely — just show every line immediately.
    terminalLines.forEach((line) => (line.style.opacity = "1"));
  } else {
    // reveal() shows one line, then schedules the next line after a delay.
    // This is a recursive pattern, similar to a loop where each iteration
    // is delayed — Java's Thread.sleep() would block the whole program,
    // but setTimeout() in JS schedules work for later WITHOUT blocking,
    // so the rest of the page stays interactive while this plays out.
    let i = 0;
    function reveal() {
      if (i >= terminalLines.length) return; // base case — stop recursing
      terminalLines[i].style.opacity = "1";
      i++;
      setTimeout(reveal, 450); // ~0.45s between lines
    }
    setTimeout(reveal, 300); // small delay before the first line, on page load
  }
}

/* ----------------------------------------------------------------------
   3. PROJECT FILTER (projects.html)
   Every filter button carries a `data-filter` attribute (e.g. "java",
   "cpp", "web", "all"). Every project card carries a `data-category`
   attribute with the same vocabulary. Clicking a button hides every
   card whose category doesn't match — this is just a loop + an if,
   the same shape as filtering an ArrayList<Project> in Java:

     for (Project p : projects) {
       if (filter.equals("all") || p.getCategory().equals(filter)) {
         p.show();
       } else {
         p.hide();
       }
     }
   ---------------------------------------------------------------------- */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0 && projectCards.length > 0) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter; // reads the data-filter="..." attribute

      // Move the "active" highlight to whichever button was just clicked.
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide each card based on whether its category matches.
      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
}
