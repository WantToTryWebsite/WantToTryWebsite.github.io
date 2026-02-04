document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (To be implemented if needed for responsiveness details)
    console.log('Want To Try Site Loaded');

    // Scroll Animations (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.section-title, .section-header p, .candidate-card, .policy-card, .news-card, .value-card, .member-card, .president-info, .president-image-wrapper');

    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');

        // Add zoom-in effect to cards
        if (el.classList.contains('candidate-card') || el.classList.contains('policy-card') || el.classList.contains('news-card')) {
            el.classList.add('zoom-in');
        } else {
            el.classList.add('fade-up');
        }

        // Stagger animations for grids
        if (el.parentElement.classList.contains('candidates-grid') || el.parentElement.classList.contains('policy-grid') || el.parentElement.classList.contains('values-grid')) {
            // Simple stagger based on index in parent
            const siblings = Array.from(el.parentElement.children);
            const position = siblings.indexOf(el);
            const delay = (position % 5) * 100; // 0, 100, 200, 300, 400
            el.style.transitionDelay = `${delay}ms`;
        }

        observer.observe(el);
    });

    // Simplified Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Countdown Timer Logic
    const countdownDate = new Date("Feb 13, 2026 08:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            const banner = document.getElementById("countdown-banner");
            if (banner) banner.style.display = "none";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    };

    // Update immediately and then every second
    if (document.getElementById("countdown")) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Policy Search Logic
    const searchInput = document.getElementById('policySearch');
    const clearBtn = document.getElementById('clearSearch');
    const categories = document.querySelectorAll('.policy-category');
    const noResults = document.getElementById('noResults');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            let totalFound = 0;

            if (term === "") {
                categories.forEach(cat => cat.style.display = 'block');
                document.querySelectorAll('.policy-card').forEach(card => card.style.display = 'flex');
                noResults.style.display = 'none';
                return;
            }

            categories.forEach(cat => {
                let catFoundCount = 0;
                const catCards = cat.querySelectorAll('.policy-card');

                catCards.forEach(card => {
                    const title = card.querySelector('h3').innerText.toLowerCase();
                    const desc = card.querySelector('.policy-desc').innerText.toLowerCase();

                    if (title.includes(term) || desc.includes(term)) {
                        card.style.display = 'flex';
                        catFoundCount++;
                        totalFound++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                cat.style.display = (catFoundCount > 0) ? 'block' : 'none';
            });

            noResults.style.display = (totalFound === 0) ? 'block' : 'none';
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = "";
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
            });
        }
    }
});

function scrollToPolicy(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 100; // Header height + padding
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// --- Floating Action Button (FAB) Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const fabContainer = document.getElementById('quickContactFab');
    if (fabContainer) {
        const fabBtn = fabContainer.querySelector('.fab-button');
        fabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fabContainer.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target)) {
                fabContainer.classList.remove('active');
            }
        });
    }

    // --- Contact Form Submission (Apps Script Integration) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const statusDiv = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnContent = submitBtn.innerHTML;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set loading state
            statusDiv.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> กำลังส่ง...';

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            data.timestamp = new Date().toISOString();

            // Google Apps Script Web App URL (IMPORTANT: User must update this)
            // Example: https://script.google.com/macros/s/XXX/exec
            const scriptURL = 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL';

            if (scriptURL === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL') {
                // Mock success for demonstration if URL not set
                setTimeout(() => {
                    statusDiv.className = 'form-status success';
                    statusDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ส่งข้อมูลสำเร็จ! ข้อมูลของคุณถูกรวบรวมไว้แล้ว (Mock Mode)';
                    statusDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    contactForm.reset();

                    // In real GAS mode, you'd fetch() here
                    console.log('Form Data collected:', data);
                }, 1500);
                return;
            }

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors', // Apps Script requires no-cors for simple POST or explicit CORS headers
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                statusDiv.className = 'form-status success';
                statusDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ส่งข้อมูลสำเร็จ! เราจะรีบดำเนินการตรวจสอบความผิดที่แจ้งมาครับ';
                statusDiv.style.display = 'block';
                contactForm.reset();
            } catch (error) {
                console.error('Submission error:', error);
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่ในภายหลัง';
                statusDiv.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});

// Mobile Hamburger Menu Toggle
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links') || document.querySelector('.nav-linkss');

    if (hamburger && navLinks) {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }
}

// Close menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-links.active') || document.querySelector('.nav-linkss.active');

            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});
