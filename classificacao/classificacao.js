/* ============================================================
   CLASSIFICAÇÃO — classificacao.js v2
   API Ergast + Hero dinâmico + Pilotos + Construtores
   ============================================================ */

// ── Dados das equipes ────────────────────────────────────────
const TEAM_DATA = {
    'Red Bull':        { color: '#3671C6', flag: '🇦🇹' },
    'Mercedes':        { color: '#27F4D2', flag: '🇩🇪' },
    'Ferrari':         { color: '#E8002D', flag: '🇮🇹' },
    'McLaren':         { color: '#FF8000', flag: '🇬🇧' },
    'Aston Martin':    { color: '#229971', flag: '🇬🇧' },
    'Alpine F1 Team':  { color: '#0093CC', flag: '🇫🇷' },
    'Williams':        { color: '#64C4FF', flag: '🇬🇧' },
    'AlphaTauri':      { color: '#5E8FAA', flag: '🇮🇹' },
    'RB F1 Team':      { color: '#6692FF', flag: '🇮🇹' },
    'Alfa Romeo':      { color: '#C92D4B', flag: '🇨🇭' },
    'Haas F1 Team':    { color: '#B6BABD', flag: '🇺🇸' },
    'Sauber':          { color: '#52E252', flag: '🇨🇭' },
};

const FLAGS = {
    'British':'🇬🇧','Dutch':'🇳🇱','Monégasque':'🇲🇨','Mexican':'🇲🇽',
    'Spanish':'🇪🇸','Australian':'🇦🇺','Canadian':'🇨🇦','Finnish':'🇫🇮',
    'French':'🇫🇷','German':'🇩🇪','Japanese':'🇯🇵','Danish':'🇩🇰',
    'Chinese':'🇨🇳','Brazilian':'🇧🇷','Thai':'🇹🇭','American':'🇺🇸',
    'Italian':'🇮🇹','Polish':'🇵🇱','New Zealander':'🇳🇿','Austrian':'🇦🇹',
    'Belgian':'🇧🇪','Swiss':'🇨🇭','Argentine':'🇦🇷',
};

function teamColor(name) {
    for (const [k, v] of Object.entries(TEAM_DATA)) {
        if (name.includes(k)) return v.color;
    }
    return '#888896';
}

function teamFlag(name) {
    for (const [k, v] of Object.entries(TEAM_DATA)) {
        if (name.includes(k)) return v.flag;
    }
    return '🏳️';
}

function driverAbbr(d) {
    return d.code || d.familyName.substring(0, 3).toUpperCase();
}

function posClass(n) {
    if (n == 1) return 'pos-gold';
    if (n == 2) return 'pos-silver';
    if (n == 3) return 'pos-bronze';
    return 'pos-normal';
}

function setState(id, state) {
    const loading = document.getElementById('loading' + id);
    const error   = document.getElementById('error'   + id);
    const data    = document.getElementById(id === 'Drivers' ? 'driversTable' : 'constructorsList');
    if (loading) loading.classList.toggle('hidden', state !== 'loading');
    if (error)   error.classList.toggle('hidden', state !== 'error');
    if (data)    data.classList.toggle('hidden', state !== 'data');
}

// ── HERO: top 3 líderes ──────────────────────────────────────
function renderHeroLeaders(list) {
    const container = document.getElementById('heroLeaders');
    if (!container) return;

    const top3 = list.slice(0, 3);
    container.innerHTML = top3.map(item => {
        const d     = item.Driver;
        const t     = item.Constructors[0];
        const color = teamColor(t?.name || '');
        const abbr  = driverAbbr(d);

        return `
        <div class="hero-leader" style="--lc:${color}">
            <div class="hl-pos">${item.position}</div>
            <div class="hl-abbr" style="color:${color}">${abbr}</div>
            <div class="hl-info">
                <div class="hl-name">${d.givenName} <strong>${d.familyName}</strong></div>
                <div class="hl-team">${t?.name || '—'}</div>
            </div>
            <div>
                <div class="hl-pts">${item.points}</div>
                <div class="hl-pts-label">pts</div>
            </div>
        </div>`;
    }).join('');
}

// ── PILOTOS ──────────────────────────────────────────────────
async function loadDrivers() {
    setState('Drivers', 'loading');
    try {
        const res  = await fetch('https://ergast.com/api/f1/2024/driverStandings.json');
        if (!res.ok) throw new Error('API');
        const json = await res.json();

        const sl     = json.MRData.StandingsTable.StandingsLists[0];
        const list   = sl.DriverStandings;
        const round  = sl.round;
        const season = sl.season;

        // Hero
        renderHeroLeaders(list);

        // Season info
        const rn = document.getElementById('roundNum');
        const rm = document.getElementById('remainNum');
        if (rn) rn.textContent = round;
        if (rm) rm.textContent = Math.max(0, 24 - parseInt(round));

        // Updated label
        const upd = document.getElementById('dataUpdated');
        if (upd) upd.textContent = `Round ${round} · Temporada ${season}`;

        const maxPts = parseInt(list[0]?.points || 1);
        const body   = document.getElementById('driversBody');
        if (!body) return;

        body.innerHTML = list.map((item, i) => {
            const d     = item.Driver;
            const t     = item.Constructors[0];
            const color = teamColor(t?.name || '');
            const abbr  = driverAbbr(d);
            const pts   = parseInt(item.points);
            const pct   = Math.round((pts / maxPts) * 100);
            const wins  = parseInt(item.wins);
            const flag  = FLAGS[d.nationality] || '🏳️';
            const pos   = parseInt(item.position);

            return `
            <div class="cl-row" style="--rc:${color}" data-i="${i}">
                <div class="cr-pos">
                    <span class="pos-medal ${posClass(pos)}">${pos}</span>
                </div>
                <div class="cr-driver">
                    <span class="cr-abbr" style="color:${color}">${abbr}</span>
                    <div class="cr-driver-info">
                        <span class="cr-name">${d.givenName} <strong>${d.familyName}</strong></span>
                        <div class="cr-pts-bar">
                            <div class="cr-pts-bar-fill" style="width:${pct}%;background:${color}"></div>
                        </div>
                    </div>
                </div>
                <div class="cr-team">
                    <span class="cr-team-dot" style="background:${color}"></span>
                    <span>${t?.name || '—'}</span>
                </div>
                <div class="cr-nat">${flag}</div>
                <div class="cr-wins">
                    ${wins > 0
                        ? `<span class="win-badge">${wins}</span>`
                        : `<span class="no-wins">—</span>`
                    }
                </div>
                <div class="cr-pts">
                    <span class="pts-big">${pts}</span>
                </div>
            </div>`;
        }).join('');

        setState('Drivers', 'data');

        // Stagger row animation
        setTimeout(() => {
            document.querySelectorAll('.cl-row').forEach((row, i) => {
                setTimeout(() => row.classList.add('row-in'), i * 35);
            });
        }, 80);

    } catch (e) {
        console.error(e);
        setState('Drivers', 'error');
    }
}

// ── CONSTRUTORES ─────────────────────────────────────────────
async function loadConstructors() {
    setState('Constructors', 'loading');
    try {
        const res  = await fetch('https://ergast.com/api/f1/2024/constructorStandings.json');
        if (!res.ok) throw new Error('API');
        const json = await res.json();

        const list   = json.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        const maxPts = parseInt(list[0]?.points || 1);
        const el     = document.getElementById('constructorsList');
        if (!el) return;

        el.innerHTML = list.map((item, i) => {
            const c     = item.Constructor;
            const color = teamColor(c.name);
            const flag  = teamFlag(c.name);
            const pts   = parseInt(item.points);
            const pct   = Math.round((pts / maxPts) * 100);
            const pos   = parseInt(item.position);
            const wins  = item.wins;

            return `
            <div class="cl-constructor-row" data-i="${i}">
                <div class="ccr-stripe" style="background:${color}"></div>
                <div class="ccr-pos ${posClass(pos)}">${pos}</div>
                <div class="ccr-info">
                    <div class="ccr-name" style="color:${color}">${c.name}</div>
                    <div class="ccr-origin">${flag} ${c.nationality}</div>
                </div>
                <div class="ccr-meta">
                    <span class="ccr-wins">${wins} vitória${wins != 1 ? 's' : ''}</span>
                </div>
                <div class="ccr-pts-wrap">
                    <span class="ccr-pts-num">${pts}</span>
                    <span class="ccr-pts-label">pontos</span>
                    <div class="ccr-bar">
                        <div class="ccr-bar-fill" style="width:${pct}%;background:${color}"></div>
                    </div>
                </div>
            </div>`;
        }).join('');

        setState('Constructors', 'data');

        setTimeout(() => {
            document.querySelectorAll('.cl-constructor-row').forEach((row, i) => {
                setTimeout(() => row.classList.add('row-in'), i * 60);
            });
        }, 80);

    } catch (e) {
        console.error(e);
        setState('Constructors', 'error');
    }
}

// ── TABS ─────────────────────────────────────────────────────
let constructorsLoaded = false;

document.querySelectorAll('.cl-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.cl-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cl-tab-content').forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + target).classList.add('active');

        if (target === 'constructors' && !constructorsLoaded) {
            constructorsLoaded = true;
            loadConstructors();
        }
    });
});

// ── INIT ─────────────────────────────────────────────────────
loadDrivers();