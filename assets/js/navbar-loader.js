(function () {
  "use strict";

  const PLACEHOLDER_HREF = "/work-in-progress.html";

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

  function addUnavailableBadge(link) {
    if (link.dataset.statusEnhanced === "true") {
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
