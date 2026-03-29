/* ============================================================
   REGRAS — regras.js
   DRS interativo + scroll spy no índice
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── DRS INTERATIVO ───────────────────────────────────────
    const drsToggle = document.getElementById('drsToggle');
    const drsWing   = document.getElementById('drsWing');
    const drsStatus = document.getElementById('drsStatus');
    const drsSpeed  = document.getElementById('drsSpeedVal');

    let drsOn = false;

    if (drsToggle && drsWing) {
        drsToggle.addEventListener('click', () => {
            drsOn = !drsOn;

            if (drsOn) {
                drsWing.classList.add('open');
                drsToggle.classList.add('active');
                drsStatus.textContent = '⏸ DESATIVAR DRS';

                // Anima velocidade subindo
                let speed = 320;
                const up = setInterval(() => {
                    speed = Math.min(335, speed + 1);
                    if (drsSpeed) {
                        drsSpeed.textContent = speed;
                        drsSpeed.style.color = '#22c55e';
                    }
                    if (speed >= 335) clearInterval(up);
                }, 40);
            } else {
                drsWing.classList.remove('open');
                drsToggle.classList.remove('active');
                drsStatus.textContent = '▶ ATIVAR DRS';

                // Anima velocidade descendo
                let speed = 335;
                const down = setInterval(() => {
                    speed = Math.max(320, speed - 1);
                    if (drsSpeed) {
                        drsSpeed.textContent = speed;
                        drsSpeed.style.color = speed <= 320 ? 'var(--white)' : '#22c55e';
                    }
                    if (speed <= 320) clearInterval(down);
                }, 40);
            }
        });
    }

    // ── SCROLL SPY: destaca capítulo ativo no índice ─────────
    const chapters = document.querySelectorAll('.rg-ch');
    const sections = document.querySelectorAll('.rg-section');

    if (chapters.length && sections.length && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    chapters.forEach(ch => {
                        ch.classList.toggle('ch-active', ch.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(s => obs.observe(s));
    }

    // ── ANIMA BARRAS DOS PNEUS ───────────────────────────────
    if ('IntersectionObserver' in window) {
        const tireSection = document.getElementById('pneus');
        if (tireSection) {
            const tireObs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    document.querySelectorAll('.tm-bar > div').forEach((bar, i) => {
                        const target = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.transition = 'width 0.8s var(--ease-out)';
                            bar.style.width = target;
                        }, i * 80);
                    });
                    tireObs.unobserve(tireSection);
                }
            }, { threshold: 0.2 });
            tireObs.observe(tireSection);
        }
    }

    // ── ANIMA BARRAS DO PÓDIO ────────────────────────────────
    if ('IntersectionObserver' in window) {
        const ptsSection = document.getElementById('pontuacao');
        if (ptsSection) {
            const ptsObs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    document.querySelectorAll('.pts-bar').forEach((bar, i) => {
                        bar.style.height = '0';
                        setTimeout(() => {
                            bar.style.transition = 'height 0.8s var(--ease-out)';
                            if (bar.classList.contains('pts-1st')) bar.style.height = '100%';
                            if (bar.classList.contains('pts-2nd')) bar.style.height = '75%';
                            if (bar.classList.contains('pts-3rd')) bar.style.height = '62%';
                        }, i * 120);
                    });
                    ptsObs.unobserve(ptsSection);
                }
            }, { threshold: 0.3 });
            ptsSection && ptsObs.observe(ptsSection);
        }
    }
});