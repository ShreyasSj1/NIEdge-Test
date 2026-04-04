document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSearch();
  initScrollEffects();
  initSubjectCards();
  initBackToTop();
  injectRuntimeStyles();
});

function initMobileMenu() {
  const toggle = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  const body = document.body;
  const nav = document.querySelector('.navbar');
  if (!toggle || !links) return;

  const toggleMenu = () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
    body.classList.toggle('menu-open');
    links.querySelectorAll('a').forEach((a, i) => {
      a.style.animation = links.classList.contains('active') ? `fadeInUp 0.5s ease ${i * 0.1}s both` : '';
    });
  };

  toggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }});

  const closeMenu = () => {
    toggle.classList.remove('active');
    links.classList.remove('active');
    body.classList.remove('menu-open');
  };

  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => { if (nav && !nav.contains(e.target) && links.classList.contains('active')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
}

function initSearch() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const grid = document.getElementById('subjects');
  const empty = document.getElementById('results-empty');
  const count = document.getElementById('results-count');
  const cards = [...document.querySelectorAll('.subject__card')];
  if (!input || !clearBtn || !grid || !empty || !count) return;

  let timer;
  const data = cards.map(card => {
    const nameEl = card.querySelector('.subject__name');
    const descEl = card.querySelector('.subject__desc');
    const name = nameEl.textContent.toLowerCase();
    const desc = descEl.textContent.toLowerCase();
    return { element: card, nameEl, descEl, name, desc, search: `${name} ${desc}` };
  });

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    clearBtn.classList.toggle('active', q.length > 0);
    clearTimeout(timer);
    timer = setTimeout(() => performSearch(q), 150);
  });

  const performSearch = (q) => {
    const term = q.toLowerCase().trim();
    let visible = 0, any = false;
    grid.classList.add('loading');

    setTimeout(() => {
      data.forEach((item, idx) => {
        const match = !term || item.search.includes(term) || item.name.includes(term) || item.desc.includes(term);
        if (match) {
          item.element.style.display = 'flex';
          item.element.style.opacity = '0';
          item.element.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.element.style.opacity = '1';
            item.element.style.transform = 'translateY(0)';
          }, visible * 50);
          visible++; any = true;
          if (term) highlight(item, term); else clearHighlight(item);
        } else {
          item.element.style.display = 'none';
          clearHighlight(item);
        }
      });

      updateCount(visible, term);
      if (!any && term) {
        empty.style.display = 'block';
        grid.style.display = 'none';
      } else {
        empty.style.display = 'none';
        grid.style.display = 'grid';
      }
      grid.classList.remove('loading');
    }, 100);
  };

  const updateCount = (n, term) => {
    count.textContent = term ? `${n} subject${n !== 1 ? 's' : ''} found for "${term}"` : `${n} subjects found`;
    count.style.transform = 'scale(1.05)';
    setTimeout(() => { count.style.transform = 'scale(1)'; }, 200);
  };

  const highlight = (item, term) => {
    const rx = new RegExp(`(${escapeRegExp(term)})`,'gi');
    if (!item.nameEl.dataset.original) item.nameEl.dataset.original = item.nameEl.textContent;
    if (!item.descEl.dataset.original) item.descEl.dataset.original = item.descEl.textContent;
    item.nameEl.innerHTML = item.nameEl.dataset.original.replace(rx, '<span class="highlight">$1</span>');
    item.descEl.innerHTML = item.descEl.dataset.original.replace(rx, '<span class="highlight">$1</span>');
  };

  const clearHighlight = (item) => {
    if (item.nameEl.dataset.original) item.nameEl.textContent = item.nameEl.dataset.original;
    if (item.descEl.dataset.original) item.descEl.textContent = item.descEl.dataset.original;
  };

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  document.getElementById('search-clear').addEventListener('click', () => {
    input.value = '';
    document.getElementById('search-clear').classList.remove('active');
    performSearch('');
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstVisible = document.querySelector('.subject__card[style*="display: flex"], .subject__card:not([style*="display: none"])');
      if (firstVisible) { firstVisible.focus(); firstVisible.click(); }
    }
  });
}

function initSubjectCards() {
  const cards = document.querySelectorAll('.subject__card');
  cards.forEach(card => {
    card.setAttribute('tabindex','0');

    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = ''; }, 150);
      ripple(this);
      setTimeout(() => {}, 300);
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });

    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.subject__icon i');
        const arrow = this.querySelector('.subject__arrow i');
        if (icon) { icon.style.animation = 'pulse 1s ease'; setTimeout(() => { icon.style.animation = ''; }, 1000); }
        if (arrow) { arrow.style.animation = 'bounce .8s ease'; setTimeout(() => { arrow.style.animation = ''; }, 800); }
      }
    });
  });

  function ripple(el) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2, y = rect.height / 2;
    const r = document.createElement('div');
    r.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;width:0;height:0;border-radius:50%;
      background:rgba(255,193,7,.3);transform:translate(-50%,-50%);pointer-events:none;z-index:0;
    `;
    el.style.position = 'relative';
    el.appendChild(r);
    r.animate([{width:'0',height:'0',opacity:1},{width:size+'px',height:size+'px',opacity:0}],{duration:600,easing:'ease-out'}).onfinish=()=>r.remove();
  }
}

function initScrollEffects() {
  let lastY = window.scrollY, ticking = false;
  const nav = document.querySelector('.header-nav');

  if (nav) {
    nav.style.transform = 'translateY(0)';
    nav.style.top = '0';
  }

  const run = () => {
    const y = window.scrollY;
    if (nav) {
      if (y > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.backdropFilter = 'blur(25px)';
        nav.style.boxShadow = '0 10px 30px rgba(255, 193, 7, 0.2)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.15)';
      }
      if (window.innerWidth > 768) {
        nav.style.transform = 'translateY(0)';
      }
    }
    document.querySelectorAll('.shape').forEach((s, i) => {
      const speed = 0.1 + (i * 0.02);
      s.style.transform = `translateY(${y * speed}px) rotate(${y * 0.05}deg)`;
    });
    lastY = y; ticking = false;
  };

  const req = () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } };
  window.addEventListener('scroll', req, { passive:true });
  run();
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 300);
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
    window.scrollTo({ top:0, behavior:'smooth' });
  });
  btn.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' '){ e.preventDefault(); btn.click(); }});
  toggle();
  window.addEventListener('scroll', toggle, { passive:true });
}

function injectRuntimeStyles(){
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    .menu-open { overflow:hidden; }
    @keyframes pulse { 0% { transform:scale(1); } 50% { transform:scale(1.05); } 100% { transform:scale(1); } }
    @keyframes bounce { 0%,100% { transform:translateY(0); } 25% { transform:translateY(-3px); } 50% { transform:translateY(0); } 75% { transform:translateY(-1px); } }
  `;
  document.head.appendChild(style);
}

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  const header = document.querySelector('.section-header');
  const search = document.querySelector('.search');
  if (header) header.style.animation = 'fadeInUp 1s ease both';
  if (search) search.style.animation = 'fadeInUp 1s ease .2s both';

  setTimeout(() => {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in'); obs.unobserve(e.target); } });
    }, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });
    document.querySelectorAll('.subject__card').forEach(el => io.observe(el));
  }, 100);
});

window.addEventListener('error', (e) => { console.error('JavaScript Error:', e.error); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const input = document.getElementById('search-input');
    if (input && input === document.activeElement) input.blur();
    const toggle = document.querySelector('.hamburger');
    const links = document.querySelector('.nav-links');
    if (links && links.classList.contains('active')) {
      toggle && toggle.classList.remove('active');
      links.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }
});
