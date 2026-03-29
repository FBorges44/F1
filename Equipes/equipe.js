/* ============================================================
   EQUIPES — equipes.js
   Troca de painéis de equipe com animação suave
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const buttons = document.querySelectorAll('.tn-btn');
    const panels  = document.querySelectorAll('.team-panel');

    function switchTeam(teamId) {
        // Remove active de todos
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Ativa o botão certo
        const activeBtn = document.querySelector(`[data-team="${teamId}"]`);
        const activePanel = document.getElementById(`team-${teamId}`);

        if (!activeBtn || !activePanel) return;

        activeBtn.classList.add('active');
        activePanel.classList.add('active');

        // Pega a cor da equipe e atualiza CSS var para a borda do botão
        const color = activePanel.dataset.color;
        document.documentElement.style.setProperty('--active-color', color);

        // Scroll suave para o topo do painel (em mobile)
        if (window.innerWidth < 900) {
            activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Anima as barras de histórico
        const bar = activePanel.querySelector('.thb-fill');
        if (bar) {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.width = targetWidth;
                });
            });
        }

        // Anima os números do stats grid
        activePanel.querySelectorAll('.tpsg-val').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.4s, transform 0.4s';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 60);
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTeam(btn.dataset.team);
        });
    });

    // Keyboard nav: setas para navegar entre equipes
    const teamIds = Array.from(buttons).map(b => b.dataset.team);
    let currentIndex = 0;

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            currentIndex = (currentIndex + 1) % teamIds.length;
            switchTeam(teamIds[currentIndex]);
            document.querySelector(`[data-team="${teamIds[currentIndex]}"]`).focus();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            currentIndex = (currentIndex - 1 + teamIds.length) % teamIds.length;
            switchTeam(teamIds[currentIndex]);
            document.querySelector(`[data-team="${teamIds[currentIndex]}"]`).focus();
        }
    });

    // Init: ativa primeira equipe e dispara a barra
    switchTeam('ferrari');
});