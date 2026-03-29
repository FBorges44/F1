/* ============================================================
   F1 GUIDE — script.js  v2.0
   Correções de bugs + Animações + Transições de página
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = window.matchMedia('(max-width: 900px)').matches;

    // ── 1. CURSOR PERSONALIZADO ──────────────────────────────
    const cursor      = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');

    if (cursor && cursorTrail && !isMobile) {
        let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        (function animateTrail() {
            trailX += (mouseX - trailX) * 0.12;
            trailY += (mouseY - trailY) * 0.12;
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top  = trailY + 'px';
            requestAnimationFrame(animateTrail);
        })();

        document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorTrail.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorTrail.style.opacity = '1'; });

        // Expand ao passar em links
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
                cursor.style.background = 'transparent';
                cursor.style.border = '1.5px solid var(--red)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                cursor.style.background = 'var(--red)';
                cursor.style.border = 'none';
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none';
        if (cursorTrail) cursorTrail.style.display = 'none';
    }

    // ── 2. NAVBAR SCROLL ─────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── 3. MENU MOBILE ───────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ── 4. CONTADORES ANIMADOS ───────────────────────────────
    function animateCounter(el, target, duration = 1800) {
        const start = performance.now();
        const run = now => {
            const p = Math.min((now - start) / duration, 1);
            const e = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(e * target).toLocaleString('pt-BR');
            if (p < 1) requestAnimationFrame(run);
            else el.textContent = target.toLocaleString('pt-BR');
        };
        requestAnimationFrame(run);
    }

    if ('IntersectionObserver' in window) {
        const cObs = new IntersectionObserver(entries => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting) {
                    animateCounter(target, parseInt(target.dataset.target, 10));
                    cObs.unobserve(target);
                }
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));
    }

    // ── 5. SCROLL REVEAL UNIVERSAL ───────────────────────────
    const revealSels = [
        '.feature-card','.stat-card','.menu-card','.era-text','.era-image',
        '.hstat-card','.bio-text','.bio-timeline','.senna-quote',
        '.monaco-text','.monaco-img','.spotlight-text','.spotlight-img',
        '.section-header', '.team-card', '.tire-card'
    ].join(',');

    if ('IntersectionObserver' in window) {
        const rObs = new IntersectionObserver(entries => {
            entries.forEach(({ isIntersecting, target }) => {
                if (isIntersecting) {
                    const delay = parseInt(target.dataset.index || 0) * 90;
                    setTimeout(() => target.classList.add('visible'), delay);
                    rObs.unobserve(target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll(revealSels).forEach(el => {
            el.classList.add('reveal');
            rObs.observe(el);
        });
    }

    // ── 6. PARALLAX HERO ─────────────────────────────────────
    const heroBg = document.querySelector('.hero-img, .page-hero-img, .senna-hero-img');
    if (heroBg && !isMobile) {
        window.addEventListener('scroll', () => {
            heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        }, { passive: true });
    }

    // ── 7. TILT 3D (só desktop) ──────────────────────────────
    if (!isMobile) {
        document.querySelectorAll('.feature-card, .menu-card, .team-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -5;
                const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  *  5;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });
    }

    // ── 8. TICKER ────────────────────────────────────────────
    const ticker = document.getElementById('ticker');
    if (ticker) {
        ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
        ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
    }

    // ── 9. ACTIVE NAV LINK ───────────────────────────────────
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(link => {
        if (link.getAttribute('href').split('/').pop() === page) link.classList.add('nav-active');
    });

    // ── 10. TRANSIÇÃO SUAVE ENTRE PÁGINAS ────────────────────
    document.body.classList.add('page-loaded');

    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => window.location.href = href, 320);
            });
        }
    });

    // ── 11. PROGRESSO DE SCROLL ──────────────────────────────
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const total  = document.body.scrollHeight - window.innerHeight;
            const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
            progressBar.style.width = pct + '%';
        }, { passive: true });
    }

    console.log('%c🏎️  F1 GUIDE v2.0 — Online', 'font-family:monospace;color:#e10600;font-size:13px;font-weight:bold');
});