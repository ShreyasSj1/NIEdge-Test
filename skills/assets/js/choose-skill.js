document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initSearch();
  initScrollEffects();
  initCards();
  initScrollToTop();
});

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (!hamburger || !navLinks || !navbar) {
    return;
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  hamburger.addEventListener("click", function (event) {
    event.stopPropagation();
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
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

function initSearch() {
  const input = document.getElementById("languageSearchInput");
  const clear = document.getElementById("clearLanguageSearch");
  const grid = document.getElementById("languagesGrid");
  const empty = document.getElementById("noLanguagesFound");
  const count = document.getElementById("languageCount");
  const cards = Array.from(document.querySelectorAll(".language-card"));

  if (!input || !clear || !grid || !empty || !count) {
    return;
  }

  const data = cards.map(function (card) {
    const title = card.querySelector(".language-title");
    const summary = card.querySelector(".language-summary");
    return {
      card: card,
      title: title ? title.textContent.toLowerCase() : "",
      summary: summary ? summary.textContent.toLowerCase() : ""
    };
  });

  function performSearch() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    data.forEach(function (item) {
      const match = !query || item.title.includes(query) || item.summary.includes(query);
      const link = item.card.closest(".language-link");
      if (link) {
        link.style.display = match ? "" : "none";
      }
      if (match) {
        visible += 1;
      }
    });

    count.textContent = query
      ? visible + " language" + (visible === 1 ? "" : "s") + ' found for "' + query + '"'
      : visible + " languages found";

    empty.style.display = visible ? "none" : "block";
  }

  input.addEventListener("input", function () {
    clear.classList.toggle("active", input.value.trim().length > 0);
    performSearch();
  });

  clear.addEventListener("click", function () {
    input.value = "";
    clear.classList.remove("active");
    performSearch();
    input.focus();
  });
}

function initScrollEffects() {
  const navbar = document.querySelector(".navbar");
  const elements = document.querySelectorAll(".code-element");
  let lastScrollY = 0;
  let ticking = false;

  if (navbar) {
    navbar.style.transform = "translateY(0)";
    navbar.style.top = "0";
  }

  function update() {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.style.background = scrollY > 100 ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = scrollY > 100 ? "0 10px 30px rgba(255, 193, 7, 0.2)" : "0 8px 25px rgba(255, 193, 7, 0.15)";
      if (window.innerWidth > 768) {
        navbar.style.transform = "translateY(0)";
      }
    }

    elements.forEach(function (shape, index) {
      shape.style.transform = "translateY(" + scrollY * (0.08 + index * 0.015) + "px) rotate(" + scrollY * 0.04 + "deg)";
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

function initCards() {
  document.querySelectorAll(".language-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.style.transform = "translateY(-6px) scale(0.985)";
      setTimeout(function () {
        card.style.transform = "";
      }, 180);
    });
  });
}

function initScrollToTop() {
  const button = document.getElementById("scrollToTop");
  if (!button) {
    return;
  }

  function toggle() {
    button.classList.toggle("visible", window.scrollY > 300);
  }

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
}
