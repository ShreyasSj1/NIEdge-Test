(function () {
  "use strict";

  const PLACEHOLDER_HREF = "/work-in-progress.html";
  const NAVBAR_LOGO_SRC = "/assets/images/LOGO.jpg";

  function preloadNavbarLogo() {
    if (document.head.querySelector('link[rel="preload"][href="' + NAVBAR_LOGO_SRC + '"]')) {
      return;
    }

    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = NAVBAR_LOGO_SRC;
    document.head.appendChild(preload);
  }

  function injectNavbar(html) {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) {
      return;
    }

    placeholder.outerHTML = html;
  }

  function markCurrentPage() {
    const current = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      const url = new URL(link.href, window.location.origin);
      const linkPath = url.pathname.replace(/\/index\.html$/, "/");

      if (url.hash && current === "/" && url.pathname === "/index.html") {
        return;
      }

      if (linkPath === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initMobileMenu() {
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!navbar || !hamburger || !navLinks || hamburger.dataset.menuBound === "true") {
      return;
    }

    hamburger.dataset.menuBound = "true";

    function closeMenu() {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    }

    function toggleMenu(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const isOpen = hamburger.classList.toggle("active");
      navLinks.classList.toggle("active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    hamburger.setAttribute("aria-expanded", "false");

    hamburger.addEventListener("click", toggleMenu);
    hamburger.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        toggleMenu(event);
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
      if (!navbar.contains(event.target) && navLinks.classList.contains("active")) {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  function addUnavailableBadge(link) {
    if (link.dataset.statusEnhanced === "true") {
      return;
    }

    if (link.closest(".nav-links")) {
      return;
    }

    if (link.dataset.hidePlaceholderBadge === "true") {
      return;
    }

    link.dataset.statusEnhanced = "true";
    link.classList.add("niedge-unavailable-link");
    link.setAttribute("aria-label", "Coming soon");
    link.setAttribute("title", "This section is still being built.");

    const badgeTarget =
      link.querySelector(
        ".subject__card, .resource-card, .module-card, .notes-card, .year-card, .language-card, .btn"
      ) || link;

    if (!badgeTarget.querySelector(".niedge-status-badge")) {
      const badge = document.createElement("span");
      badge.className = "niedge-status-badge";
      badge.textContent = "Coming soon";
      badgeTarget.appendChild(badge);
    }
  }

  function annotateUnavailableLinks() {
    document.querySelectorAll('a[href$="work-in-progress.html"], a[href="/work-in-progress.html"]').forEach(addUnavailableBadge);
  }

  preloadNavbarLogo();

  fetch("/navbar.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load navbar");
      }
      return response.text();
    })
    .then(function (html) {
      injectNavbar(html);
      markCurrentPage();
      initMobileMenu();
      annotateUnavailableLinks();
      document.dispatchEvent(new Event("navbarLoaded"));
    })
    .catch(function (error) {
      console.error("Failed to load navbar:", error);
    });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", annotateUnavailableLinks);
  } else {
    annotateUnavailableLinks();
  }
})();
