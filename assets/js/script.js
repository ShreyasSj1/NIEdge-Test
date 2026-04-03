function initHomePage() {
  initMobileMenu();
  initSmoothAnchors();
  initScrollEffects();
  initHeroIntro();
  initRevealAnimations();
  initCounters();
  initInteractiveCards();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePage, { once: true });
} else {
  initHomePage();
}

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

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"], a[href^="/index.html#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");
      const hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : "";
      if (!hash || window.location.pathname !== "/index.html" && href.startsWith("/index.html#")) {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 72,
        behavior: "smooth"
      });
    });
  });
}

function initScrollEffects() {
  const navbar = document.querySelector(".navbar");
  const shapes = document.querySelectorAll(".shape");
  const floatItems = document.querySelectorAll(".float-item, .skill-icon, .doc");
  let lastScrollY = 0;
  let ticking = false;

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
      shape.style.transform = "translateY(" + scrollY * (0.08 + index * 0.015) + "px) rotate(" + scrollY * 0.04 + "deg)";
    });

    floatItems.forEach(function (item, index) {
      const drift = Math.sin(scrollY * 0.002 + index) * 10;
      item.style.transform = "translateY(" + drift + "px)";
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

function initHeroIntro() {
  const title = document.querySelector(".hero-title");
  const subtitle = document.querySelector(".hero-subtitle");
  const button = document.querySelector(".explore-btn");

  [title, subtitle, button].forEach(function (element, index) {
    if (!element) {
      return;
    }

    element.style.opacity = "0";
    element.style.transform = "translateY(24px)";
    setTimeout(function () {
      element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 120 * index + 120);
  });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("animated");
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document
    .querySelectorAll(".section-header, .feature, .member-card, .feedback-card, .connect, .stat-item")
    .forEach(function (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(24px)";
      element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      observer.observe(element);
    });
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  let hasAnimated = false;
  let startTimeoutId = null;

  if (!counters.length) {
    return;
  }

  function setCounterFinal(counter) {
    const targetText = counter.getAttribute("data-target") || counter.textContent;
    const numericTarget = parseInt(targetText.replace(/[^\d]/g, ""), 10);
    const suffix = targetText.replace(/[\d]/g, "");
    const progressValue = parseInt(counter.getAttribute("data-progress") || "0", 10);
    const progressBar = counter.parentElement
      ? counter.parentElement.querySelector(".progress-bar")
      : null;

    counter.textContent = numericTarget.toLocaleString() + suffix;
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = progressValue + "%";
    }
  }

  function resetCounters() {
    counters.forEach(function (counter) {
      const progressBar = counter.parentElement
        ? counter.parentElement.querySelector(".progress-bar")
        : null;

      counter.textContent = "0";
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
    });
  }

  function runCounters() {
    if (hasAnimated) {
      return;
    }

    hasAnimated = true;
    if (startTimeoutId) {
      clearTimeout(startTimeoutId);
      startTimeoutId = null;
    }
    counters.forEach(function (counter) {
      animateCounter(counter);
    });
  }

  function scheduleCounters(delay) {
    if (hasAnimated) {
      return;
    }

    if (startTimeoutId) {
      clearTimeout(startTimeoutId);
    }

    startTimeoutId = setTimeout(runCounters, delay);
  }

  resetCounters();
  scheduleCounters(180);

  if (document.readyState !== "complete") {
    window.addEventListener("load", function () {
      scheduleCounters(120);
    }, { once: true });
  }

  window.addEventListener("pageshow", function () {
    if (hasAnimated) {
      counters.forEach(setCounterFinal);
      return;
    }

    resetCounters();
    scheduleCounters(80);
  });

  document.addEventListener("visibilitychange", function () {
    if (!hasAnimated && document.visibilityState === "visible") {
      scheduleCounters(80);
    }
  });

  setTimeout(function () {
    if (!hasAnimated) {
      runCounters();
    }
  }, 1000);
}

function animateCounter(counter) {
  const targetText = counter.getAttribute("data-target") || counter.textContent;
  const numericTarget = parseInt(targetText.replace(/[^\d]/g, ""), 10);
  const suffix = targetText.replace(/[\d]/g, "");
  const progressValue = parseInt(counter.getAttribute("data-progress") || "0", 10);
  const progressBar = counter.parentElement
    ? counter.parentElement.querySelector(".progress-bar")
    : null;
  const duration = 1200;
  const start = performance.now();
  if (progressBar) {
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const value = Math.floor(easedProgress * numericTarget);
    counter.textContent = value.toLocaleString() + suffix;
    if (progressBar) {
      progressBar.style.width = Math.round(easedProgress * progressValue) + "%";
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    counter.textContent = numericTarget.toLocaleString() + suffix;
    if (progressBar) {
      progressBar.style.width = progressValue + "%";
    }
  }

  requestAnimationFrame(frame);
}

function initInteractiveCards() {
  document.querySelectorAll(".feature, .member-card, .stat-item, .btn").forEach(function (element) {
    element.addEventListener("click", function () {
      element.style.transform += " scale(0.985)";
      setTimeout(function () {
        element.style.transform = element.style.transform.replace(" scale(0.985)", "");
      }, 140);
    });
  });
}
