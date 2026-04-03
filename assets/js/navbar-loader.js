/**
 * navbar-loader.js
 * Fetches /navbar.html and injects it into the page.
 * Also handles the hamburger menu toggle for mobile.
 */
(function () {
  "use strict";

  // Find the placeholder or insert at body start
  function injectNavbar(html) {
    var placeholder = document.getElementById("navbar-placeholder");
    if (placeholder) {
      placeholder.outerHTML = html;
    } else {
      document.body.insertAdjacentHTML("afterbegin", html);
    }
  }

  function setupHamburger() {
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        hamburger.classList.contains("active") &&
        !hamburger.contains(e.target) &&
        !navLinks.contains(e.target)
      ) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });

    // Close menu on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && hamburger.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  }

  // Fetch and inject navbar
  fetch("/navbar.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      injectNavbar(html);
      setupHamburger();
      // Dispatch event so other scripts know navbar is ready
      document.dispatchEvent(new Event("navbarLoaded"));
    })
    .catch(function (err) {
      console.error("Failed to load navbar:", err);
    });
})();
