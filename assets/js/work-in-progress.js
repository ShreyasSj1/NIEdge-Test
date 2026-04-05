class SimplifiedApp {
  constructor() {
    this.particles = [];
    this.maxParticles = window.innerWidth > 768 ? 35 : 25;
    this.animationFrameId = null;
    this.isLoaded = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initParticleSystem();
    this.startLoadingSequence();
  }

  setupEventListeners() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 120);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationFrameId);
        return;
      }
      this.animateParticles();
    });
  }

  startLoadingSequence() {
    // NIEdge change: once the loader finishes, reveal the restored popup card instead of leaving the main content hidden.
    const loader = document.getElementById("loader");
    const progressFill = document.querySelector(".loader-fill");
    const percentage = document.querySelector(".loader-percentage");
    const mainContent = document.querySelector(".main-content");

    if (!loader || !progressFill || !percentage) {
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + (progress > 80 ? 4 : 9), 100);
      progressFill.style.width = progress + "%";
      percentage.textContent = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.style.opacity = "0";
          loader.style.transform = "scale(0.96)";
          setTimeout(() => {
            loader.classList.remove("active");
            loader.classList.add("hidden");
            if (mainContent) {
              mainContent.classList.add("loaded");
            }
            this.isLoaded = true;
          }, 500);
        }, 220);
      }
    }, 110);
  }

  initParticleSystem() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.maxParticles = window.innerWidth > 768 ? 35 : 25;
      this.createParticles(canvas);
    };

    resizeCanvas();
    this.animateParticles();
  }

  createParticles(canvas) {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i += 1) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: (Math.random() - 0.5) * 1.1,
        size: Math.random() * 4 + 1.5,
        opacity: Math.random() * 0.5 + 0.25,
        hue: Math.random() * 40 + 20
      });
    }
  }

  animateParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    const frame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        context.beginPath();
        context.fillStyle = "hsla(" + particle.hue + ", 90%, 65%, " + particle.opacity + ")";
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      this.animationFrameId = requestAnimationFrame(frame);
    };

    this.animationFrameId = requestAnimationFrame(frame);
  }

  handleResize() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.maxParticles = window.innerWidth > 768 ? 35 : 25;
    this.createParticles(canvas);
  }
}

class EmailSubscriptionHandler {
  constructor() {
    this.form = document.getElementById("subscriptionForm");
    this.emailInput = document.getElementById("emailInput");
    this.submitBtn = document.getElementById("submitBtn");
    this.message = document.getElementById("subscriptionMessage");
    this.isSubmitting = false;
    this.cooldownTimer = null;
    this.bindEvents();
  }

  bindEvents() {
    if (!this.form || !this.emailInput || !this.submitBtn) {
      return;
    }

    this.emailInput.addEventListener("input", () => this.validateEmail());
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  validateEmail() {
    const value = this.emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    this.submitBtn.disabled = !valid || this.isSubmitting;
    return valid;
  }

  showMessage(text, type) {
    // NIEdge change: keep feedback messages visible through the shared .show state used by the refreshed popup UI.
    if (!this.message) {
      return;
    }
    this.message.textContent = text;
    this.message.className = "subscription-message " + type + " show";
  }

  startCooldown() {
    this.isSubmitting = true;
    this.submitBtn.disabled = true;
    clearTimeout(this.cooldownTimer);
    this.cooldownTimer = setTimeout(() => {
      this.isSubmitting = false;
      this.submitBtn.disabled = !this.validateEmail();
      this.message.textContent = "";
      this.message.className = "subscription-message";
    }, 4000);
  }

  async handleSubmit() {
    if (this.isSubmitting) {
      this.showMessage("Please wait before trying again.", "error");
      return;
    }

    if (!this.validateEmail()) {
      this.showMessage("Enter a valid email address.", "error");
      return;
    }

    if (!window.firebaseDb || !window.firebaseCollections) {
      this.showMessage("Subscription service is still warming up. Please try again.", "error");
      return;
    }

    this.isSubmitting = true;
    this.submitBtn.disabled = true;

    const email = this.emailInput.value.trim().toLowerCase();

    try {
      const { collection, addDoc, Timestamp } = window.firebaseCollections;
      const { getDocs, query, where } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
      const subscribers = collection(window.firebaseDb, "subscribers");
      const existingQuery = query(subscribers, where("email", "==", email));
      const snapshot = await getDocs(existingQuery);

      if (!snapshot.empty) {
        this.showMessage("You're already subscribed.", "success");
        this.emailInput.value = "";
        this.startCooldown();
        return;
      }

      await addDoc(subscribers, {
        email: email,
        createdAt: Timestamp.now()
      });

      this.showMessage("Successfully subscribed.", "success");
      this.emailInput.value = "";
      this.startCooldown();
    } catch (error) {
      console.error("Subscription error:", error);
      this.isSubmitting = false;
      this.submitBtn.disabled = !this.validateEmail();
      this.showMessage("Something went wrong. Please try again.", "error");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.SimplifiedApp = new SimplifiedApp();
  new EmailSubscriptionHandler();
});
