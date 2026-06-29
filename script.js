// ============================================
// BMK Spoofer — Main Script
// Scroll animations, counter, FAQ, nav
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ---- Counter Animation ----
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.count);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isFloat) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll(
        '.features-grid > *, .bypass-grid > *, .pricing-grid > *, .faq-list > *'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- FAQ Accordion ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Typing Effect for Dashboard Logs ----
    const logsContainer = document.querySelector('.logs-container');
    if (logsContainer) {
        const logEntries = logsContainer.querySelectorAll('.log-entry');
        logEntries.forEach((entry, i) => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateX(-10px)';
            entry.style.transition = `opacity 0.3s ease ${i * 0.1}s, transform 0.3s ease ${i * 0.1}s`;
        });

        const logsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const logs = entry.target.querySelectorAll('.log-entry');
                    logs.forEach(log => {
                        log.style.opacity = '1';
                        log.style.transform = 'translateX(0)';
                    });
                    logsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        logsObserver.observe(logsContainer);
    }

    // ---- Progress Bar Animation ----
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 300);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressObserver.observe(progressBar.parentElement);
    }

    // ---- Dashboard Preview Hover Parallax ----
    const dashPreview = document.querySelector('.dashboard-preview');
    if (dashPreview) {
        dashPreview.addEventListener('mousemove', (e) => {
            const rect = dashPreview.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            dashPreview.style.transform = `
                translateY(-4px)
                perspective(1000px)
                rotateX(${y * -4}deg)
                rotateY(${x * 4}deg)
            `;
        });

        dashPreview.addEventListener('mouseleave', () => {
            dashPreview.style.transform = 'translateY(0)';
        });
    }

    // ---- Active Nav Link Highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--accent)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
});
