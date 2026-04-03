document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initScrollEffects(".shape");
  initYearCards();
  revealOnLoad(".page-header", ".academics-grid");
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

  function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  }

  hamburger.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
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

function initScrollEffects(shapeSelector) {
  let lastScrollY = window.scrollY;
  let ticking = false;
  const navbar = document.querySelector(".navbar");
  const shapes = Array.from(document.querySelectorAll(shapeSelector));

  function update() {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.style.background = scrollY > 100 ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = scrollY > 100 ? "0 10px 30px rgba(255, 193, 7, 0.2)" : "0 8px 25px rgba(255, 193, 7, 0.15)";

      if (window.innerWidth > 768) {
        navbar.style.transform = scrollY > lastScrollY && scrollY > 220 ? "translateY(-100%)" : "translateY(0)";
      }
    }

    shapes.forEach(function (shape, index) {
      const offset = scrollY * (0.08 + index * 0.015);
      shape.style.transform = "translateY(" + offset + "px) rotate(" + scrollY * 0.04 + "deg)";
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
}

function initYearCards() {
  const cards = document.querySelectorAll(".year-card, .year-card-link");
  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      const progress = card.querySelector(".loading-progress");
      if (progress) {
        progress.style.filter = "brightness(1.08)";
      }
    });

    card.addEventListener("mouseleave", function () {
      const progress = card.querySelector(".loading-progress");
      if (progress) {
        progress.style.filter = "";
      }
    });
  });
}

function revealOnLoad() {
  Array.from(arguments).forEach(function (selector, index) {
    const element = document.querySelector(selector);
    if (!element) {
      return;
    }

    setTimeout(function () {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 120 * index);
  });
}
