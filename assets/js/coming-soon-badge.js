(function () {
  if (window.location.pathname.endsWith("/index.html") || window.location.pathname === "/" || window.location.pathname === "") {
    return;
  }

  function normalizeHref(href) {
    if (!href) {
      return "";
    }

    try {
      return new URL(href, window.location.href).pathname.replace(/\/+$/, "");
    } catch (error) {
      return href.replace(/\/+$/, "");
    }
  }

  function isWorkInProgressLink(link) {
    var href = normalizeHref(link.getAttribute("href"));
    return href === "/work-in-progress.html" || href.endsWith("/work-in-progress.html");
  }

  function installStyles() {
    if (document.getElementById("niedge-coming-soon-styles")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "niedge-coming-soon-styles";
    style.textContent = [
      ".niedge-unavailable-link{position:relative;}",
      ".niedge-unavailable-link.subject__link,",
      ".niedge-unavailable-link.resource-link,",
      ".niedge-unavailable-link.module-card,",
      ".niedge-unavailable-link.notes-card,",
      ".niedge-unavailable-link.year-card-link,",
      ".niedge-unavailable-link.language-card{position:relative;}",
      ".niedge-unavailable-card{position:relative;}",
      ".niedge-unavailable-link .subject__card,",
      ".niedge-unavailable-link .resource-card,",
      ".niedge-unavailable-link .module-card,",
      ".niedge-unavailable-link .notes-card,",
      ".niedge-unavailable-link .year-card,",
      ".niedge-unavailable-link .language-card,",
      ".niedge-unavailable-link .btn,",
      ".niedge-unavailable-link.btn{position:relative;}",
      ".niedge-status-badge{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(33,33,33,.88);color:#fff;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 10px 22px rgba(0,0,0,.12);white-space:nowrap;}",
      ".niedge-unavailable-link .subject__card+.niedge-status-badge,",
      ".niedge-unavailable-link .resource-card+.niedge-status-badge,",
      ".niedge-unavailable-link .module-card+.niedge-status-badge,",
      ".niedge-unavailable-link .notes-card+.niedge-status-badge,",
      ".niedge-unavailable-link .year-card+.niedge-status-badge,",
      ".niedge-unavailable-link .language-card+.niedge-status-badge,",
      ".niedge-unavailable-link.subject__link>.niedge-status-badge,",
      ".niedge-unavailable-link.resource-link>.niedge-status-badge,",
      ".niedge-unavailable-link.module-card>.niedge-status-badge,",
      ".niedge-unavailable-link.notes-card>.niedge-status-badge,",
      ".niedge-unavailable-link.year-card-link>.niedge-status-badge,",
      ".niedge-unavailable-link.language-card>.niedge-status-badge,",
      ".niedge-unavailable-card>.niedge-status-badge{position:absolute;top:14px;right:14px;z-index:2;}",
      ".nav-links .niedge-unavailable-link,.quick-links .niedge-unavailable-link,footer .niedge-unavailable-link{display:inline-flex;align-items:center;gap:8px;}",
      ".nav-links .niedge-status-badge,.quick-links .niedge-status-badge,footer .niedge-status-badge{position:static;padding:2px 8px;font-size:10px;box-shadow:none;background:rgba(255,143,0,.12);color:#ff8f00;}",
      ".niedge-unavailable-link:hover .niedge-status-badge{transform:translateY(-1px);}"
    ].join("");
    document.head.appendChild(style);
  }

  function addBadge(link) {
    if (!isWorkInProgressLink(link) || link.dataset.hidePlaceholderBadge === "true") {
      return;
    }

    if (link.closest(".nav-links") || link.closest(".navbar")) {
      return;
    }

    var cardWrapper =
      link.parentElement &&
      link.parentElement.classList &&
      link.parentElement.classList.contains("resource-card")
        ? link.parentElement
        : null;

    if (link.querySelector(".niedge-status-badge") || (cardWrapper && cardWrapper.querySelector(".niedge-status-badge"))) {
      return;
    }

    link.classList.add("niedge-unavailable-link");

    var badge = document.createElement("span");
    badge.className = "niedge-status-badge";
    badge.textContent = "Coming soon";

    var blockTargets = [
      ".subject__card",
      ".resource-card",
      ".module-card",
      ".notes-card",
      ".year-card",
      ".language-card"
    ];

    var linkIsCard =
      link.matches(".subject__link") ||
      link.matches(".resource-link") ||
      link.matches(".module-card") ||
      link.matches(".notes-card") ||
      link.matches(".year-card-link") ||
      link.matches(".language-card");

    var hasCardTarget = blockTargets.some(function (selector) {
      return link.querySelector(selector);
    });

    if (cardWrapper) {
      cardWrapper.classList.add("niedge-unavailable-card");
      cardWrapper.appendChild(badge);
    } else if (hasCardTarget || linkIsCard) {
      link.appendChild(badge);
    } else {
      link.appendChild(document.createTextNode(" "));
      link.appendChild(badge);
    }
  }

  function cleanupInvalidBadges() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      var cardWrapper =
        link.parentElement &&
        link.parentElement.classList &&
        link.parentElement.classList.contains("resource-card")
          ? link.parentElement
          : null;

      if (link.dataset.hidePlaceholderBadge === "true" || !isWorkInProgressLink(link)) {
        link.classList.remove("niedge-unavailable-link");
        link.querySelectorAll(".niedge-status-badge").forEach(function (badge) {
          badge.remove();
        });

        if (cardWrapper && !isWorkInProgressLink(link)) {
          cardWrapper.classList.remove("niedge-unavailable-card");
          cardWrapper.querySelectorAll(":scope > .niedge-status-badge").forEach(function (badge) {
            badge.remove();
          });
        }
      }
    });
  }

  function init() {
    installStyles();
    cleanupInvalidBadges();
    document.querySelectorAll("a[href]").forEach(addBadge);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
