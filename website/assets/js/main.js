/* =========================================
   COMPUTER HALLEY — main.js
   ========================================= */

/* ---- Custom Cursor ---- */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0;
    let fx = 0, fy = 0;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    }, { passive: true });

    (function trackFollower() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        cursorFollower.style.left = fx + 'px';
        cursorFollower.style.top  = fy + 'px';
        raf = requestAnimationFrame(trackFollower);
    })();

    document.querySelectorAll('a, button, .svc-card, .step, .abt-card, .cdet-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hov'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hov'));
    });
}

/* ---- Navbar scroll state ---- */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function onScroll() {
    const y = window.scrollY;
    if (y > 30) {
        navbar.classList.add('stuck');
    } else {
        navbar.classList.remove('stuck');
    }
    lastScroll = y;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile menu ---- */
const toggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
    });
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(s => activeObserver.observe(s));

/* ---- Counter animation ---- */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

/* ---- Intersection Observer for scroll reveals ---- */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Apply delay from data attribute if present
        const delay = el.dataset.delay;
        if (delay) el.style.transitionDelay = delay + 'ms';

        el.classList.add('in');

        // Counter trigger
        el.querySelectorAll('.stat-value[data-target]').forEach(v => {
            if (!v.dataset.counted) {
                v.dataset.counted = '1';
                animateCounter(v);
            }
        });

        revealObserver.unobserve(el);
    });
}, { threshold: 0.12 });

const revealTargets = [
    '[data-reveal]',
    '.reveal-up',
    '.reveal-left',
    '.reveal-right',
    '.reveal-card',
    '.reveal-step',
].join(',');

document.querySelectorAll(revealTargets).forEach(el => revealObserver.observe(el));

// Trigger hero elements on load
window.addEventListener('load', () => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });
});

/* ---- Counter for hero stats (separate pass) ---- */
const heroStatsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-value[data-target]').forEach(v => {
            if (!v.dataset.counted) {
                v.dataset.counted = '1';
                animateCounter(v);
            }
        });
        heroStatsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatsObserver.observe(heroStats);

/* ---- Contact form ---- */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Basic client-side validation
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                valid = false;
                field.addEventListener('input', () => field.style.borderColor = '', { once: true });
            }
        });
        if (!valid) return;

        // Loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate async submission (replace with actual fetch to backend)
        await new Promise(r => setTimeout(r, 1600));

        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        submitBtn.querySelector('.btn-text').textContent = 'Messaggio inviato! ✓';
        submitBtn.querySelector('.btn-arrow').style.display = 'none';

        setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.querySelector('.btn-text').textContent = 'Invia Richiesta';
            submitBtn.querySelector('.btn-arrow').style.display = '';
            submitBtn.disabled = false;
            form.reset();
        }, 4000);
    });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ---- Pause ticker on hover ---- */
const tickerInner = document.querySelector('.ticker-inner');
const tickerWrap  = document.querySelector('.ticker');
if (tickerInner && tickerWrap) {
    tickerWrap.addEventListener('mouseenter', () => {
        tickerInner.style.animationPlayState = 'paused';
    });
    tickerWrap.addEventListener('mouseleave', () => {
        tickerInner.style.animationPlayState = 'running';
    });
}
