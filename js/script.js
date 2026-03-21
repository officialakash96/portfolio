// =====================================================
// MOBILE NAVIGATION TOGGLE
// =====================================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// =====================================================
// COIN FLIP LOGO ANIMATION WITH MODAL EXPANSION
// ===================================================== 
const logoFlip = document.getElementById('logoFlip');
let isFlipped = false;
let isExpanded = false;
let isAnimating = false;
let escapeListenerBound = false;

// Pre-create modal to avoid reflow/repaint lag
const createImageModal = () => {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.id = 'imageModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';
    
    const expandedImage = document.createElement('img');
    expandedImage.src = 'static/profilePic.jpeg';
    expandedImage.alt = 'Akash Singh Profile - Expanded';
    expandedImage.className = 'expanded-profile-image';
    expandedImage.loading = 'lazy';
    
    const closeHint = document.createElement('div');
    closeHint.className = 'modal-close-hint';
    closeHint.textContent = 'Click to close or flip back';
    
    modalContent.appendChild(expandedImage);
    modalContent.appendChild(closeHint);
    modal.appendChild(modalContent);
    
    return modal;
};

const closeImageModal = () => {
    if (isAnimating) return;
    
    isAnimating = true;
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.remove();
            isExpanded = false;
            isFlipped = false;
            logoFlip.classList.remove('flipped');
            isAnimating = false;
        }, 420);
    }
};

const attachModalCloseListener = (modal) => {
    modal.addEventListener('click', (e) => {
        const clickedCloseHint = e.target.classList.contains('modal-close-hint');
        const clickedExpandedImage = e.target.classList.contains('expanded-profile-image');
        if (e.target === modal || clickedCloseHint || clickedExpandedImage) {
            closeImageModal();
        }
    });

    if (!escapeListenerBound) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isExpanded) {
                closeImageModal();
            }
        });
        escapeListenerBound = true;
    }
};

if (logoFlip) {
    logoFlip.addEventListener('click', (e) => {
        // Prevent overlapping animations
        if (isAnimating) return;
        
        if (isExpanded) {
            // Close the modal
            closeImageModal();
        } else {
            // Expand to full screen with optimized timing
            isAnimating = true;
            isFlipped = true;
            isExpanded = true;
            
            // Add flipped class immediately for smooth flip
            logoFlip.classList.add('flipped');
            
            // Create and append modal with minimal delay
            const modal = createImageModal();
            document.body.appendChild(modal);
            
            // Attach close listeners
            attachModalCloseListener(modal);
            
            // Use requestAnimationFrame for optimal timing
            requestAnimationFrame(() => {
                modal.classList.add('active');
                isAnimating = false;
            });
        }
    });
}

// =====================================================
// SMOOTH SCROLL BEHAVIOR FOR NAVIGATION
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// CONTACT FORM HANDLING
// =====================================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

const showFormMessage = (message, type) => {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }
};

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Since we don't have a backend, we'll simulate form submission
            // In a real scenario, you'd send this to your backend
            console.log('Form Data:', formData);

            // Show success message
            showFormMessage('Thank you! Your message has been received. I\'ll get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('success');
            }, 5000);
        } catch (error) {
            showFormMessage('An error occurred. Please try again.', 'error');
        }
    });
}

// =====================================================
// SCROLL REVEAL ANIMATIONS
// =====================================================
const revealTargets = document.querySelectorAll(
    '.section-header, .about-content, .timeline-item, .skill-category, .education-card, .interest-card, .contact-form, .contact-method'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
} else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
}

// =====================================================
// ACTIVE NAVIGATION INDICATOR
// =====================================================
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
};

updateActiveNavLink();


// =====================================================
// COUNTER ANIMATION (for statistics)
// =====================================================
const animateCounters = () => {
    const counters = document.querySelectorAll('.highlight-item h4');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.innerText.replace(/\D/g, '');
            const increment = target / speed;

            const updateCounter = () => {
                const count = +counter.innerText.replace(/\D/g, '');
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('+') ? '+' : '');
                    setTimeout(updateCounter, 50);
                } else {
                    counter.innerText = counter.getAttribute('data-original') || counter.innerText;
                }
            };

            updateCounter();
        };

        counter.setAttribute('data-original', counter.innerText);
    });
};

// Trigger counter animation when user scrolls to about section
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const observerCounters = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observerCounters.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observerCounters.observe(aboutSection);
}

// Hover effects are primarily handled in CSS for a cleaner feel.

// =====================================================
// DARK MODE TOGGLE (Optional Future Feature)
// =====================================================
// TODO: Dark mode is a planned enhancement. The placeholder below documents intent
// and should be implemented when adding theme CSS variables and toggling logic.
/*
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}
*/

// =====================================================
// LAZY LOADING IMAGES (Future Enhancement)
// =====================================================
// NOTE: The lazy-loading implementation below expects images to use `data-src`.
// The main profile image uses a standard `src` (and a <picture> WebP fallback) so
// it's intentionally excluded. If you convert additional large images, add
// `data-src="..."` and a low-res placeholder `src` and this observer will
// swap them in when they intersect. Also ensure to add `loading="lazy"` to imgs.

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // img.dataset.src must be present for this to work
                if (img.dataset && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =====================================================
// SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
// =====================================================
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothscroll = () => {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollBy(0, -currentScroll / 8);
        }
    };
}

// =====================================================
// PERFORMANCE MONITORING
// =====================================================
const DEBUG_MODE = false;

if (DEBUG_MODE && window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Get scroll percentage
function getScrollPercentage() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for search inputs
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// =====================================================
// INITIALIZE APP
// =====================================================
if (DEBUG_MODE) {
    console.log('Portfolio website loaded successfully.');
}
