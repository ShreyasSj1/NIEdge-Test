const eventsData = [
    {
        title: "ANNUAL INNOVATIONATHON 2024",
        date: "26-10-2024",
        description: "Cash Prizes! Tech Swag!",
        image: "assets/images/innovationathon.jpg",
        link: "/register-innovationathon.html",
        featured: true
    },
    {
        title: "Web Development Bootcamp",
        date: "15-11-2024",
        description: "Learn modern web development with hands-on projects and real-world applications.",
        image: "assets/images/web-bootcamp.jpg",
        link: "/register-web-bootcamp.html",
        featured: false
    },
    {
        title: "AI & ML Workshop",
        date: "22-11-2024",
        description: "Dive deep into artificial intelligence and machine learning fundamentals.",
        image: "assets/images/ai-workshop.jpg",
        link: "/register-ai-workshop.html",
        featured: false
    },
    {
        title: "Competitive Coding Contest",
        date: "05-12-2024",
        description: "Test your problem-solving skills in this intense coding competition.",
        image: "assets/images/coding-contest.jpg",
        link: "/register-coding-contest.html",
        featured: false
    }
];

const clubsData = [
    { icon: "fas fa-code", link: "/clubs/coding.html" },
    { icon: "fas fa-palette", link: "/clubs/design.html" },
    { icon: "fas fa-robot", link: "/clubs/robotics.html" },
    { icon: "fas fa-camera", link: "/clubs/photography.html" },
    { icon: "fas fa-music", link: "/clubs/music.html" },
    { icon: "fas fa-theater-masks", link: "/clubs/drama.html" }
];

const pastEventsData = [
    { image: "assets/images/past1.jpg", link: "/events/past/tech-talk.html" },
    { image: "assets/images/past2.jpg", link: "/events/past/hackathon.html" },
    { image: "assets/images/past3.jpg", link: "/events/past/workshop.html" },
    { image: "assets/images/past4.jpg", link: "/events/past/seminar.html" },
    { image: "assets/images/past5.jpg", link: "/events/past/competition.html" },
    { image: "assets/images/past6.jpg", link: "/events/past/meetup.html" }
];

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatDisplayDate(dateStr) {
    const date = parseDate(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function categorizeEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const featured = eventsData.filter(e => e.featured);
    const upcoming = eventsData.filter(e => parseDate(e.date) >= today);
    const past = eventsData.filter(e => parseDate(e.date) < today);

    return { featured, upcoming, past };
}

function renderFeaturedEvent() {
    const featuredContainer = document.getElementById('featured-event');
    const { featured } = categorizeEvents();
    
    if (!featured || featured.length === 0) {
        featuredContainer.style.display = 'none';
        return;
    }
    
    const event = featured[0];
    
    featuredContainer.innerHTML = `
        <div class="featured-event-card" onclick="window.location.href='${event.link}'">
            <img src="${event.image}" alt="${event.title}" class="featured-event-image" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 800 450\\'%3E%3Crect fill=\\'%23FFF9C4\\' width=\\'800\\' height=\\'450\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Poppins\\' font-size=\\'32\\' font-weight=\\'700\\' fill=\\'%23FF8F00\\'%3EFEATURED EVENT%3C/text%3E%3C/svg%3E'">
            <div class="featured-event-content">
                <span class="featured-badge">FEATURED EVENT</span>
                <h1 class="featured-event-title">${event.title}</h1>
                <p class="featured-event-date">${formatDisplayDate(event.date)}</p>
                <p class="featured-event-description">${event.description}</p>
                <a href="${event.link}" class="featured-event-btn">
                    <span>REGISTER NOW</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

function renderUpcomingEvents() {
    const upcomingContainer = document.getElementById('upcoming-events');
    const { upcoming } = categorizeEvents();
    
    if (!upcoming || upcoming.length === 0) {
        upcomingContainer.innerHTML = '<div class="no-events-message">No upcoming events at the moment.</div>';
        return;
    }
    
    upcomingContainer.innerHTML = upcoming.map(event => `
        <div class="upcoming-event-card" onclick="window.location.href='${event.link}'">
            <img src="${event.image}" alt="${event.title}" class="upcoming-event-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 140 140\\'%3E%3Crect fill=\\'%23FFF9C4\\' width=\\'140\\' height=\\'140\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Poppins\\' font-size=\\'16\\' fill=\\'%23FF8F00\\'%3EEvent%3C/text%3E%3C/svg%3E'">
            <div class="upcoming-event-content">
                <h3 class="upcoming-event-title">${event.title}</h3>
                <p class="upcoming-event-date">${formatDisplayDate(event.date)}</p>
                <p class="upcoming-event-description">${event.description}</p>
            </div>
        </div>
    `).join('');
}

function renderClubs() {
    const clubsGrid = document.getElementById('clubs-grid');
    
    clubsGrid.innerHTML = clubsData.map(club => `
        <div class="club-card" onclick="window.location.href='${club.link}'">
            <i class="${club.icon}"></i>
        </div>
    `).join('');
}

function renderPastEvents() {
    const pastEventsGrid = document.getElementById('past-events-grid');
    
    pastEventsGrid.innerHTML = pastEventsData.map(event => `
        <div class="past-event-card" onclick="window.location.href='${event.link}'">
            <img src="${event.image}" alt="Past Event" class="past-event-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Crect fill=\\'%23f8f9fa\\' width=\\'100\\' height=\\'100\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Poppins\\' font-size=\\'12\\' fill=\\'%23757575\\'%3EPast%3C/text%3E%3C/svg%3E'">
        </div>
    `).join('');
}

function renderCalendar(containerId, monthSelectId, yearSelectId, isModal = false) {
    const calendarGrid = document.getElementById(containerId);
    const monthSelect = document.getElementById(monthSelectId);
    const yearSelect = document.getElementById(yearSelectId);
    
    const currentDate = new Date();
    let displayMonth = parseInt(monthSelect.value);
    let displayYear = parseInt(yearSelect.value);
    
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let calendarHTML = '';
    
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDayDate = new Date(displayYear, displayMonth, day);
        const hasEvent = eventsData.some(e => isSameDay(parseDate(e.date), currentDayDate));
        
        let classes = 'calendar-day';
        
        if (isSameDay(currentDayDate, today)) {
            classes += ' today';
        }
        
        if (hasEvent) {
            classes += ' event-day';
        }
        
        const dateStr = `${day}-${displayMonth + 1}-${displayYear}`;
        calendarHTML += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }
    
    calendarGrid.innerHTML = calendarHTML;
    
    calendarGrid.querySelectorAll('.calendar-day.event-day').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const dateStr = dayEl.getAttribute('data-date');
            showEventsForDate(dateStr);
            if (isModal) {
                closeCalendarModal();
            }
        });
    });
    
    renderCalendarLegend(isModal);
}

function renderCalendarLegend(isModal) {
    const legendId = isModal ? 'modal-calendar-legend' : 'calendar-legend';
    const calendarLegend = document.getElementById(legendId);
    
    const eventDates = eventsData.map(e => {
        const date = parseDate(e.date);
        return {
            date: date,
            title: e.title,
            dateStr: e.date
        };
    }).sort((a, b) => a.date - b.date);
    
    if (eventDates.length === 0) {
        calendarLegend.innerHTML = '<div class="legend-item"><span>No events scheduled</span></div>';
        return;
    }
    
    calendarLegend.innerHTML = eventDates.slice(0, 3).map(event => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const displayDate = `${months[event.date.getMonth()]} ${event.date.getDate()}`;
        return `
            <div class="legend-item">
                <div class="legend-color"></div>
                <span>${displayDate} - ${event.title}</span>
            </div>
        `;
    }).join('');
}

function showEventsForDate(dateStr) {
    const eventsForDate = eventsData.filter(e => e.date === dateStr);
    
    if (eventsForDate.length === 0) return;
    
    const upcomingContainer = document.getElementById('upcoming-events');
    upcomingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    upcomingContainer.innerHTML = eventsForDate.map(event => `
        <div class="upcoming-event-card" onclick="window.location.href='${event.link}'">
            <img src="${event.image}" alt="${event.title}" class="upcoming-event-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 140 140\\'%3E%3Crect fill=\\'%23FFF9C4\\' width=\\'140\\' height=\\'140\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Poppins\\' font-size=\\'16\\' fill=\\'%23FF8F00\\'%3EEvent%3C/text%3E%3C/svg%3E'">
            <div class="upcoming-event-content">
                <h3 class="upcoming-event-title">${event.title}</h3>
                <p class="upcoming-event-date">${formatDisplayDate(event.date)}</p>
                <p class="upcoming-event-description">${event.description}</p>
            </div>
        </div>
    `).join('');
    
    const heading = document.querySelector('.upcoming-events-wrapper .section-heading');
    heading.textContent = `Events on ${formatDisplayDate(dateStr)}`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Show All Upcoming Events';
    resetBtn.style.cssText = 'margin-top: 20px; padding: 12px 24px; background: var(--dark-color); color: var(--white); border: none; border-radius: 8px; cursor: pointer; font-family: Poppins; font-weight: 600;';
    resetBtn.onclick = () => {
        heading.textContent = 'Upcoming Events';
        renderUpcomingEvents();
    };
    
    upcomingContainer.insertAdjacentElement('afterend', resetBtn);
    setTimeout(() => resetBtn.remove(), 10000);
}

function initializeCalendarControls(prevBtnId, nextBtnId, monthSelectId, yearSelectId, gridId, isModal = false) {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const monthSelect = document.getElementById(monthSelectId);
    const yearSelect = document.getElementById(yearSelectId);
    
    const currentDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthSelect.innerHTML = months.map((m, i) => 
        `<option value="${i}" ${i === currentDate.getMonth() ? 'selected' : ''}>${m}</option>`
    ).join('');
    
    const currentYear = currentDate.getFullYear();
    yearSelect.innerHTML = '';
    for (let year = currentYear - 2; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
    
    const updateCalendar = () => renderCalendar(gridId, monthSelectId, yearSelectId, isModal);
    
    prevBtn.addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        
        monthSelect.value = month;
        yearSelect.value = year;
        updateCalendar();
    });
    
    nextBtn.addEventListener('click', () => {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        
        monthSelect.value = month;
        yearSelect.value = year;
        updateCalendar();
    });
    
    monthSelect.addEventListener('change', updateCalendar);
    yearSelect.addEventListener('change', updateCalendar);
    
    updateCalendar();
}

function initMobileCalendar() {
    const mobileBtn = document.getElementById('mobile-calendar-btn');
    const modal = document.getElementById('calendar-modal');
    const closeBtn = document.getElementById('calendar-close-btn');
    
    mobileBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', closeCalendarModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCalendarModal();
        }
    });
}

function closeCalendarModal() {
    const modal = document.getElementById('calendar-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedEvent();
    renderUpcomingEvents();
    renderClubs();
    renderPastEvents();
    
    initializeCalendarControls('prev-month', 'next-month', 'month-select', 'year-select', 'calendar-grid', false);
    initializeCalendarControls('modal-prev-month', 'modal-next-month', 'modal-month-select', 'modal-year-select', 'modal-calendar-grid', true);
    
    initMobileCalendar();
    initMobileMenu();
});