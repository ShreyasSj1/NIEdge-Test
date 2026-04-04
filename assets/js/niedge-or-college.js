document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initScrollEffects();
  initNotesCards();
  revealPage();
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

function initScrollEffects() {
  const navbar = document.querySelector(".navbar");
  const shapes = document.querySelectorAll(".shape");
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

    shapes.forEach(function (shape, index) {
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

function initNotesCards() {
  document.querySelectorAll(".notes-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.style.transform = "translateY(-6px) scale(0.985)";
      setTimeout(function () {
        card.style.transform = "";
      }, 180);
    });
  });
}

function revealPage() {
  const header = document.querySelector(".page-header");
  if (header) {
    header.style.opacity = "1";
    header.style.transform = "translateY(0)";
  }
}
