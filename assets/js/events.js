const EVENTS_DATA_PATH = "/data/events.json";

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

async function loadEventsData() {
  try {
    const response = await fetch(EVENTS_DATA_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load event data");
    }
    return await response.json();
  } catch (error) {
    console.error("Unable to load events data:", error);
    return {
      featured: null,
      upcoming: [],
      archive: [],
      clubs: [],
      pastGallery: []
    };
  }
}

function formatDisplayDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function buildCardContent(event, imageClass, titleClass, dateClass, descriptionClass) {
  return `
    <div class="${titleClass}">${event.title}</div>
    <p class="${dateClass}">${formatDisplayDate(event.date)}</p>
    <p class="${descriptionClass}">${event.description}</p>
  `;
}

function renderFeaturedEvent(featured) {
  const container = document.getElementById("featured-event");
  if (!container) {
    return;
  }

  if (!featured) {
    container.innerHTML = `
      <div class="featured-event-card featured-event-card--empty">
        <div class="featured-event-content">
          <span class="featured-badge">STATUS</span>
          <h1 class="featured-event-title">No featured event right now</h1>
          <p class="featured-event-description">
            We archived the old 2024 event cycle and will publish new events here when registrations reopen.
          </p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <article class="featured-event-card">
      <div class="featured-event-content">
        <span class="featured-badge">FEATURED EVENT</span>
        <h1 class="featured-event-title">${featured.title}</h1>
        <p class="featured-event-date">${formatDisplayDate(featured.date)}</p>
        <p class="featured-event-description">${featured.description}</p>
      </div>
    </article>
  `;
}

function renderUpcomingEvents(events) {
  const container = document.getElementById("upcoming-events");
  if (!container) {
    return;
  }

  if (!events.length) {
    container.innerHTML = `
      <div class="no-events-message">
        No upcoming events are live right now. Check back here for the next NIEdge launch.
      </div>
    `;
    return;
  }

  container.innerHTML = events
    .map(
      (event) => `
        <article class="upcoming-event-card">
          <div class="upcoming-event-content">
            <h3 class="upcoming-event-title">${event.title}</h3>
            <p class="upcoming-event-date">${formatDisplayDate(event.date)}</p>
            <p class="upcoming-event-description">${event.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderClubs(clubs) {
  const container = document.getElementById("clubs-grid");
  if (!container) {
    return;
  }

  if (!clubs.length) {
    container.innerHTML = `
      <div class="no-events-message">
        Club pages are being redesigned. We will relaunch them with real content instead of placeholder routes.
      </div>
    `;
    return;
  }

  container.innerHTML = clubs
    .map(
      (club) => `
        <div class="club-card" aria-label="${club.name}">
          <i class="${club.icon}" aria-hidden="true"></i>
        </div>
      `
    )
    .join("");
}

function renderPastEvents(items) {
  const container = document.getElementById("past-events-grid");
  if (!container) {
    return;
  }

  if (!items.length) {
    container.innerHTML = `
      <div class="no-events-message">
        Past-event gallery entries will appear here once we publish the refreshed archive.
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="past-event-card">
          <div class="past-event-image" role="img" aria-label="${item.title}"></div>
        </article>
      `
    )
    .join("");
}

function renderCalendar(events) {
  const grid = document.getElementById("calendar-grid");
  const legend = document.getElementById("calendar-legend");
  const modalGrid = document.getElementById("modal-calendar-grid");
  const modalLegend = document.getElementById("modal-calendar-legend");

  if (!grid || !legend || !modalGrid || !modalLegend) {
    return;
  }

  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const headers = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const eventDays = new Set(events.map((event) => new Date(event.date).getDate()));

  let html = headers.map((header) => `<div class="calendar-day-header">${header}</div>`).join("");
  for (let i = 0; i < firstDay; i += 1) {
    html += '<div class="calendar-day empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const className = eventDays.has(day) ? "calendar-day event-day" : "calendar-day";
    html += `<div class="${className}">${day}</div>`;
  }

  grid.innerHTML = html;
  modalGrid.innerHTML = html;

  if (!events.length) {
    const empty = '<div class="legend-item"><span>No live event dates scheduled</span></div>';
    legend.innerHTML = empty;
    modalLegend.innerHTML = empty;
    return;
  }

  const legendMarkup = events
    .slice(0, 3)
    .map(
      (event) => `
        <div class="legend-item">
          <div class="legend-color"></div>
          <span>${formatDisplayDate(event.date)} - ${event.title}</span>
        </div>
      `
    )
    .join("");

  legend.innerHTML = legendMarkup;
  modalLegend.innerHTML = legendMarkup;
}

document.addEventListener("DOMContentLoaded", async function () {
  initMobileMenu();
  const data = await loadEventsData();
  renderFeaturedEvent(data.featured);
  renderUpcomingEvents(data.upcoming || []);
  renderClubs(data.clubs || []);
  renderPastEvents(data.pastGallery || []);
  renderCalendar(data.upcoming || []);
});
