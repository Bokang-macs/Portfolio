/* =============================================================================
   script.js — Portfolio Website JavaScript
   
   DEPENDENCY & DEFENSIVE CODING RULE:
   Each feature below starts with a null/length check (e.g., `if (toggle && nav)`).
   This ensures that if a script runs on a page missing certain HTML elements 
   (e.g., running the terminal animation logic on `contact.html`), JavaScript 
   will safely skip it instead of throwing an error that crashes the rest of the file.
   ============================================================================= */


/* ==========================================================================
   1. MOBILE NAV TOGGLE
   Controls the mobile hamburger menu open/close behavior and auto-closes 
   the overlay menu whenever a navigation link is clicked.
   ========================================================================== */

// Grab the hamburger button element by its HTML ID "menu-toggle"
const toggle = document.getElementById("menu-toggle");

// Grab the navigation container element by its HTML ID "nav"
const nav = document.getElementById("nav");

// Safety Check: Only run this code if BOTH the toggle button and nav exist on the current page
if (toggle && nav) {

  // Listen for a click event on the hamburger button
  toggle.addEventListener("click", () => {
    // Add the "active" CSS class if missing, or remove it if present (opens/closes menu)
    toggle.classList.toggle("active");
    // Toggle the "active" class on the navigation container to slide it into view
    nav.classList.toggle("active");
  });

  // Find all anchor tags (<a>) inside the navigation menu and loop through them
  nav.querySelectorAll("a").forEach((link) => {

    // Listen for a click event on each individual navigation link
    link.addEventListener("click", () => {
      // Remove the "active" class from the toggle button when a link is clicked
      toggle.classList.remove("active");
      // Remove the "active" class from the nav menu to close the overlay automatically
      nav.classList.remove("active");
    });
  });
}


/* ==========================================================================
   2. HERO TERMINAL TYPING EFFECT (index.html)
   Reveals lines in the home page terminal block sequentially with a delay.
   If the visitor has "prefers-reduced-motion" enabled in their OS, 
   animations are skipped for accessibility.
   ========================================================================== */

// Select all elements with the class "line" inside the element with class "terminal-body"
const terminalLines = document.querySelectorAll(".terminal-body .line");

// Check if the user's operating system is set to prefer reduced motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Safety Check: Only run if there is at least one terminal line on the page
if (terminalLines.length > 0) {

  // ACCESSIBILITY PATH: If reduced motion is enabled, show all lines instantly
  if (prefersReducedMotion) {
    // Loop through every line and set its opacity directly to 1 (fully visible)
    terminalLines.forEach((line) => (line.style.opacity = "1"));

  // ANIMATION PATH: Reveal lines one by one with a timed delay
  } else {
    // Track the index of the line currently being revealed
    let i = 0;

    // Define a recursive function that reveals one line at a time
    function reveal() {
      // Base Case: Stop executing if we have revealed all available lines
      if (i >= terminalLines.length) return;

      // Make the current line visible by setting opacity to 1
      terminalLines[i].style.opacity = "1";

      // Move to the next line index
      i++;

      // Wait 450 milliseconds (~0.45 seconds), then call reveal() again for the next line
      setTimeout(reveal, 450);
    }

    // Start the reveal sequence after a 300 millisecond delay on initial page load
    setTimeout(reveal, 300);
  }
}


/* ==========================================================================
   3. PROJECT FILTER (projects.html)
   Filters project cards on the projects page based on category buttons.
   Hides non-matching cards using the "is-hidden" CSS class.
   ========================================================================== */

// Select all category filter buttons on the page
const filterButtons = document.querySelectorAll(".filter-btn");

// Select all project card container elements on the page
const projectCards = document.querySelectorAll(".project-card");

// Safety Check: Only run if filter buttons AND project cards exist on the page
if (filterButtons.length > 0 && projectCards.length > 0) {

  // Loop through each filter button and attach a click event listener
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {

      // Extract the value of the button's "data-filter" attribute (e.g., "java", "python", "all")
      const filter = btn.dataset.filter;

      // Remove the "active" highlighting class from all filter buttons
      filterButtons.forEach((b) => b.classList.remove("active"));

      // Add the "active" class to the specific button that was just clicked
      btn.classList.add("active");

      // Loop through every project card to determine if it should be shown or hidden
      projectCards.forEach((card) => {

        // Check if the current filter is "all" OR if the card's category matches the filter
        const matches = filter === "all" || card.dataset.category === filter;

        // Toggle the "is-hidden" CSS class: adds "is-hidden" if matches is false (hides card),
        // and removes "is-hidden" if matches is true (shows card)
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
}


/* ==========================================================================
   4. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to detect when section containers scroll into 
   view and adds a "revealed" class to trigger smooth CSS entry animations.
   ========================================================================== */

// Select all container elements inside section tags across the site
const revealElements = document.querySelectorAll("section > .container");

// Safety Check: Only run if containers exist AND reduced motion is disabled
if (revealElements.length > 0 && !prefersReducedMotion) {

  // Create an IntersectionObserver instance to monitor when elements enter the screen
  const revealObserver = new IntersectionObserver((entries) => {

    // Loop through all observed elements that had a visibility change
    entries.forEach((entry) => {

      // Check if the element is currently visible inside the viewport
      if (entry.isIntersecting) {

        // Add the "revealed" CSS class to trigger the visual animation
        entry.target.classList.add("revealed");

        // Stop watching this element so the animation only plays once
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    // Trigger the callback when at least 10% (0.1) of the element is visible
    threshold: 0.1,
    // Shift detection boundary 50px up from the bottom for earlier triggering
    rootMargin: "0px 0px -50px 0px"
  });

  // Prepare each element for animation and register it with the observer
  revealElements.forEach((el) => {
    // Add initial CSS class "reveal" (sets initial state like opacity: 0)
    el.classList.add("reveal");

    // Tell the IntersectionObserver to start monitoring this element
    revealObserver.observe(el);
  });
}


/* ==========================================================================
   5. SMOOTH SCROLL FOR ANCHOR LINKS
   Intercepts clicks on in-page anchor links (href="#...") and smoothly
   scrolls to the target element.
   ========================================================================== */

// Select all anchor tags whose href attribute starts with '#'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  // Listen for clicks on each anchor link
  anchor.addEventListener('click', function (e) {

    // Prevent the default instant jumping browser behavior
    e.preventDefault();

    // Find the target element using the ID string specified in the href attribute
    const target = document.querySelector(this.getAttribute('href'));

    // If the target element exists on the page, scroll smoothly to it
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth', // Smooth animation instead of instant jump
        block: 'start'      // Align top of target element to top of screen
      });
    }
  });
});


/* ==========================================================================
   6. ACTIVE NAV LINK HIGHLIGHTING
   Detects the current page URL path and highlights the corresponding nav link.
   ========================================================================== */

// Get the current HTML filename from the URL path (defaults to 'index.html' if on root '/')
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Select all navigation links inside the nav element
const navLinks = document.querySelectorAll('.nav a');

// Loop through each navigation link to compare its link target against the current page
navLinks.forEach(link => {

  // Extract the target file name from the link's href attribute (e.g., "about.html")
  const linkPage = link.getAttribute('href');

  // If the link's target matches the page currently being viewed
  if (linkPage === currentPage) {
    // Add the "active" class to highlight the current page in the menu
    link.classList.add('active');
  } else {
    // Remove the "active" class from non-matching page links
    link.classList.remove('active');
  }
});