document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollEffects();
    initDownloadHandlers();
    initPageAnimations();
});

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        animateNavLinks();
    }

    function animateNavLinks() {
        const links = navLinks.querySelectorAll('a');
        links.forEach((link, index) => {
            if (navLinks.classList.contains('active')) {
                link.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            } else {
                link.style.animation = '';
            }
        });
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));
}

// Scroll effects with performance optimization
function initScrollEffects() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    let ticking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Navbar effects
        if (navbar) {
            if (scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(25px)';
                navbar.style.boxShadow = '0 10px 30px rgba(255, 193, 7, 0.2)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.15)';
            }
            
            // Hide/show navbar on scroll (desktop only)
            if (window.innerWidth > 768) {
                if (scrollY > lastScrollY && scrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
        }
        
        // Parallax effect for floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.02);
            shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.05}deg)`;
        });
        
        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// Download handlers with proper file downloads
function initDownloadHandlers() {
    // Questions card click handler
    const questionsCard = document.querySelector('[data-type="questions"]');
    if (questionsCard) {
        questionsCard.addEventListener('click', function(e) {
            e.preventDefault();
            createClickEffect(e, this);
            showDownloadIndicator('Questions');
            
            // Trigger actual download
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 500);
        });
    }

    // Solution option handlers
    const solutionOptions = document.querySelectorAll('.solution-option');
    solutionOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const solutionType = this.getAttribute('data-type');
            const downloadUrl = this.getAttribute('data-url');
            
            createClickEffect(e, this);
            showDownloadIndicator(solutionType.toUpperCase());
            
            // Trigger actual download
            setTimeout(() => {
                if (downloadUrl) {
                    window.open(downloadUrl, '_blank');
                } else {
                    console.warn('No download URL provided for', solutionType);
                }
            }, 500);
        });
    });
}

// Create click ripple effect
function createClickEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 193, 7, 0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    ripple.animate([
        { width: '0', height: '0', opacity: 1 },
        { width: '300px', height: '300px', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    }).onfinish = () => ripple.remove();
}

// Show download indicator
function showDownloadIndicator(type) {
    const indicator = document.createElement('div');
    let message = `Downloading ${type.toLowerCase()}...`;
    
    indicator.innerHTML = `
        <div class="download-indicator">
            <i class="fas fa-download"></i>
            <span>${message}</span>
        </div>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    const downloadIndicatorContent = indicator.querySelector('.download-indicator');
    downloadIndicatorContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
    `;
    
    // Add pulsing animation to icon
    const iconStyle = document.createElement('style');
    iconStyle.textContent = `
        .download-indicator i {
            animation: pulse 1.5s infinite;
        }
    `;
    document.head.appendChild(iconStyle);
    
    document.body.appendChild(indicator);
    
    // Animate in
    indicator.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
    ], {
        duration: 300,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    // Remove after 2 seconds
    setTimeout(() => {
        indicator.animate([
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            indicator.remove();
            iconStyle.remove();
        };
    }, 2000);
}

// Page animations and effects
function initPageAnimations() {
    // Cards hover effects
    const notesCards = document.querySelectorAll('.notes-card');
    notesCards.forEach((card, index) => {
        // Enhanced hover effects for desktop
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                createCardParticles(this);
            }
        });
        
        // Add loading animation
        setTimeout(() => {
            card.classList.add('loaded');
        }, 100 * index);
    });
    
    // Intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    notesCards.forEach(card => {
        observer.observe(card);
    });
}

// Create particle effects for cards
function createCardParticles(card) {
    if (window.innerWidth <= 768) return;
    
    const rect = card.getBoundingClientRect();
    const cardType = card.getAttribute('data-type');
    const color = cardType === 'questions' ? '#FFC107' : '#FF8F00';
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.95); }
    }
    
    .loaded {
        animation-fill-mode: forwards;
    }
`;
document.head.appendChild(style);

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.style.opacity = '1';
        pageHeader.style.transform = 'translateY(0)';
    }
});