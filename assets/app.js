'use strict';
/* =====================================================================
   Macroeconomia ITA — app de estudo
   Rotas (hash): #/inicio · #/aula/<n>/<resumo|lab|questoes|cards>
                 #/todas · #/erros · #/simulado · #/cards · #/formulas · #/pegadinhas
   ===================================================================== */

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (n, d = 1) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (a, b) => (b ? Math.round(100 * a / b) : 0);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }
};
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- dados ---------- */
const KEY_ANS = 'macro_ita_full_v2'; // mesma chave da versão anterior: o progresso é mantido
let answers = LS.get(KEY_ANS, {});
let known = LS.get('macro_ita_cards', {});
const MODS = AULAS.map((a, i) => Object.assign({}, a, { idx: i, qs: QUESTOES[a.id] || [] }));
const TOTAL = MODS.reduce((s, m) => s + m.qs.length, 0);
const ui = { filter: 'all', search: '' };

function stats(only) {
  let tot = 0, ans = 0, ok = 0;
  MODS.forEach((m, i) => {
    if (only !== undefined && i !== only) return;
    m.qs.forEach((q, j) => { tot++; const a = answers[i + '-' + j]; if (a !== undefined) { ans++; if (a === q.c) ok++; } });
  });
  return { tot, ans, ok, bad: ans - ok };
}
function saveAnswers() { LS.set(KEY_ANS, answers); }

/* =====================================================================
   GRÁFICOS (SVG)
   Curvas são descritas como x = g(y) (quantidade em função do preço/juros),
   ou retas verticais {x}. Coordenadas em unidades do gráfico.
   ===================================================================== */
function clipSeg(c, xr, yr) {
  const ylo = yr[0] + (yr[1] - yr[0]) * 0.03, yhi = yr[1] - (yr[1] - yr[0]) * 0.07;
  let A, B;
  if (c.x !== undefined) { A = [c.x, ylo]; B = [c.x, yhi]; }
  else { A = [c.g(ylo), ylo]; B = [c.g(yhi), yhi]; }
  const xlo = xr[0] + (xr[1] - xr[0]) * 0.02, xhi = xr[1] - (xr[1] - xr[0]) * 0.07;
  let t0 = 0, t1 = 1; const dx = B[0] - A[0];
  if (Math.abs(dx) < 1e-9) { if (A[0] < xlo || A[0] > xhi) return null; }
  else {
    let ta = (xlo - A[0]) / dx, tb = (xhi - A[0]) / dx; if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb); if (t0 >= t1) return null;
  }
  const P = t => [A[0] + t * dx, A[1] + t * (B[1] - A[1])];
  return [P(t0), P(t1)];
}
function chart(o) {
  const W = o.w || 360, H = o.h || 300, m = Object.assign({ l: 30, r: 34, t: o.title ? 30 : 16, b: 28 }, o.m || {});
  const [x0, x1] = o.xr, [y0, y1] = o.yr;
  const X = x => +(m.l + (x - x0) / (x1 - x0) * (W - m.l - m.r)).toFixed(1);
  const Y = y => +(H - m.b - (y - y0) / (y1 - y0) * (H - m.t - m.b)).toFixed(1);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="${esc(o.aria || o.title || 'gráfico')}">
  <defs><marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--warn)"/></marker></defs>`;
  if (o.title) s += `<text class="ptitle" x="${W / 2}" y="16" text-anchor="middle">${o.title}</text>`;
  s += `<line class="ax" x1="${X(x0)}" y1="${Y(y0)}" x2="${W - m.r + 12}" y2="${Y(y0)}"/><line class="ax" x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x0)}" y2="${m.t - 8}"/>`;
  s += `<text class="axl" x="${W - m.r + 12}" y="${H - 6}" text-anchor="end">${o.xl}</text><text class="axl" x="${X(x0) + 6}" y="${m.t - 2}">${o.yl}</text>`;
  for (const c of (o.curves || [])) {
    const seg = clipSeg(c, o.xr, o.yr); if (!seg) continue;
    const [[ax, ay], [bx, by]] = seg;
    s += `<line class="cv ${c.cls || ''}" x1="${X(ax)}" y1="${Y(ay)}" x2="${X(bx)}" y2="${Y(by)}"/>`;
    if (c.lab) {
      const [lx, ly] = c.labEnd === 'a' ? [ax, ay] : [bx, by];
      s += `<text class="cvl ${c.cls || ''}" x="${X(lx) + (c.dx ?? 5)}" y="${Y(ly) + (c.dy ?? -2)}" text-anchor="${c.anchor || 'start'}">${c.lab}</text>`;
    }
  }
  for (const a of (o.arrows || [])) s += `<line class="shift" x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(a[2])}" y2="${Y(a[3])}" marker-end="url(#arw)"/>`;
  for (const p of (o.points || [])) {
    if (p.guide !== false) s += `<path class="gd" d="M${X(p.x)} ${Y(p.y)} V${Y(y0)} M${X(p.x)} ${Y(p.y)} H${X(x0)}"/>`;
    if (p.xt) s += `<text class="tick" x="${X(p.x)}" y="${Y(y0) + 14}" text-anchor="middle">${p.xt}</text>`;
    if (p.yt) s += `<text class="tick" x="${X(x0) - 4}" y="${Y(p.y) + 4}" text-anchor="end">${p.yt}</text>`;
  }
  for (const p of (o.points || [])) {
    s += `<circle class="pt ${p.cls || ''}" cx="${X(p.x)}" cy="${Y(p.y)}" r="5"/>`;
    if (p.lab) s += `<text class="ptl" x="${X(p.x) + (p.dx ?? 8)}" y="${Y(p.y) + (p.dy ?? -8)}">${p.lab}</text>`;
  }
  return s + '</svg>';
}
const anims = {};
function tween(key, from, to, draw, dur = 550) {
  cancelAnimationFrame(anims[key]);
  if (REDUCE) { draw(to); return; }
  const t0 = performance.now();
  const step = now => {
    let k = Math.min(1, (now - t0) / dur); k = 1 - Math.pow(1 - k, 3);
    const cur = {}; for (const p in to) cur[p] = from[p] + (to[p] - from[p]) * k;
    draw(cur);
    if (k < 1) anims[key] = requestAnimationFrame(step);
  };
  anims[key] = requestAnimationFrame(step);
}
const near = (a, b) => Math.abs(a - b) < 0.02;
const arrow = (v, b, inv) => near(v, b) ? '<i class="muted">=</i>' : ((v > b) !== !!inv ? '<i class="up">▲</i>' : '<i class="dn">▼</i>');

/* ---------- modelos ---------- */
// Fundos emprestáveis (economia fechada): S = 1 + 0,5r + s ; I = 7 − 0,5r + i
const FE = p => { const r = 6 + p.i - p.s; return { r, q: 1 + 0.5 * r + p.s }; };
function feChart(p, base, title) {
  const e = FE(p), e0 = FE(base);
  const moved = !near(p.s, base.s) || !near(p.i, base.i);
  const curves = [];
  if (!near(p.s, base.s)) curves.push({ g: y => 1 + 0.5 * y + base.s, cls: 'ghost', lab: 'S₁' });
  if (!near(p.i, base.i)) curves.push({ g: y => 7 - 0.5 * y + base.i, cls: 'ghost', lab: 'D₁' });
  curves.push({ g: y => 1 + 0.5 * y + p.s, cls: 's', lab: moved && !near(p.s, base.s) ? 'S₂' : 'S (poupança)' });
  curves.push({ g: y => 7 - 0.5 * y + p.i, cls: 'd', lab: moved && !near(p.i, base.i) ? 'D₂' : 'D (investimento)' });
  const pts = [];
  if (moved) pts.push({ x: e0.q, y: e0.r, cls: 'old', lab: 'A', yt: 'r₁' });
  pts.push({ x: e.q, y: e.r, lab: moved ? 'B' : 'A', yt: moved ? 'r₂' : 'r*', xt: moved ? '' : 'Q*' });
  return chart({ xr: [0, 8], yr: [0, 11], xl: 'Fundos emprestáveis', yl: 'r (juros)', curves, points: pts, title, h: 290 });
}
// Economia aberta: S = 2 + 0,5r + s ; I = 5 − 0,4r + i ; IEL = 3 − 0,3r + f ; EL(E) = 3 − 0,3E + t
const OPEN = p => {
  const r = (6 + p.i + p.f - p.s) / 1.2;
  const I = 5 - 0.4 * r + p.i, IEL = 3 - 0.3 * r + p.f, S = 2 + 0.5 * r + p.s, E = (3 + p.t - IEL) / 0.3;
  return { r, I, IEL, S, E, EL: IEL };
};
function openCharts(p, base) {
  const e = OPEN(p), e0 = OPEN(base);
  const ch = (a, b) => !near(a, b);
  const fe = [], iel = [], fx = [];
  if (ch(p.s, base.s)) fe.push({ g: y => 2 + 0.5 * y + base.s, cls: 'ghost', lab: 'S₁' });
  if (ch(p.i + p.f, base.i + base.f)) fe.push({ g: y => 8 + base.i + base.f - 0.7 * y, cls: 'ghost', lab: 'D₁' });
  fe.push({ g: y => 2 + 0.5 * y + p.s, cls: 's', lab: 'S' });
  fe.push({ g: y => 8 + p.i + p.f - 0.7 * y, cls: 'd', lab: 'I + IEL' });
  if (ch(p.f, base.f)) iel.push({ g: y => 3 - 0.3 * y + base.f, cls: 'ghost', lab: 'IEL₁' });
  iel.push({ g: y => 3 - 0.3 * y + p.f, cls: 'v', lab: 'IEL' });
  if (ch(e.IEL, e0.IEL)) fx.push({ x: e0.IEL, cls: 'ghost', lab: 'O₁', anchor: 'end', dx: -4 });
  if (ch(p.t, base.t)) fx.push({ g: y => 3 + base.t - 0.3 * y, cls: 'ghost', lab: 'D₁' });
  fx.push({ x: e.IEL, cls: 'v', lab: 'Oferta = IEL' , anchor: 'middle', dx: 0, dy: -6 });
  fx.push({ g: y => 3 + p.t - 0.3 * y, cls: 'd', lab: 'Demanda = EL' });
  const moved = ['s', 'i', 'f', 't'].some(k => ch(p[k], base[k]));
  const P = (x, y, x0, y0, yt) => moved && (ch(x, x0) || ch(y, y0)) ? [{ x: x0, y: y0, cls: 'old', lab: 'A' }, { x, y, lab: 'B', yt }] : [{ x, y, lab: 'A', yt }];
  return [
    chart({ title: '1 · Fundos emprestáveis', xr: [0, 10], yr: [0, 10], xl: 'Fundos', yl: 'r', curves: fe, points: P(e.S, e.r, e0.S, e0.r, 'r'), w: 300, h: 270 }),
    chart({ title: '2 · Investimento externo líquido', xr: [0, 5], yr: [0, 10], xl: 'IEL', yl: 'r', curves: iel, points: P(e.IEL, e.r, e0.IEL, e0.r, 'r'), w: 300, h: 270 }),
    chart({ title: '3 · Mercado de câmbio', xr: [0, 5], yr: [0, 10], xl: 'Reais (R$)', yl: 'E', curves: fx, points: P(e.IEL, e.E, e0.IEL, e0.E, 'E'), w: 300, h: 270 })
  ];
}
// OA–DA: DA: Y = 10 + d − P ; OAcp: Y = YN + (P − PE − c) ; OAlp: Y = YN
const ADAS = p => { const P = (10 + p.d - p.YN + p.PE + p.c) / 2; return { P, Y: 10 + p.d - P }; };
function adasChart(p, ghost, pts, title, arrows) {
  const curves = [];
  if (ghost) {
    if (!near(ghost.YN, p.YN)) curves.push({ x: ghost.YN, cls: 'ghost', lab: 'OAlp₁', anchor: 'middle', dx: 0, dy: -6 });
    if (!near(ghost.YN - ghost.PE - ghost.c, p.YN - p.PE - p.c)) curves.push({ g: y => ghost.YN + y - ghost.PE - ghost.c, cls: 'ghost', lab: 'OAcp₁' });
    if (!near(ghost.d, p.d)) curves.push({ g: y => 10 + ghost.d - y, cls: 'ghost', lab: 'DA₁' });
  }
  curves.push({ x: p.YN, cls: 'v', lab: 'OAlp', anchor: 'middle', dx: 0, dy: -6 });
  curves.push({ g: y => p.YN + y - p.PE - p.c, cls: 's', lab: 'OAcp' });
  curves.push({ g: y => 10 + p.d - y, cls: 'd', lab: 'DA' });
  return chart({ xr: [0, 10], yr: [0, 10.5], xl: 'Y (PIB real)', yl: 'P (preços)', curves, points: pts, title, arrows, h: 300 });
}

/* ---------- figuras das questões ---------- */
const defasagemSVG = () => {
  const W = 420, H = 210, X = t => 34 + t * 30, Y = v => 105 - v * 26;
  const semP = [], comP = [];
  for (let t = 0; t <= 12; t += 0.25) {
    const base = (t > 1 && t < 7) ? -2 * Math.sin(Math.PI * (t - 1) / 6) : 0;
    semP.push(`${X(t)},${Y(base)}`);
    const est = (t > 6 && t < 12) ? 2.1 * Math.sin(Math.PI * (t - 6) / 6) : 0;
    comP.push(`${X(t)},${Y(base + est)}`);
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Estímulo com defasagem">
    <line class="ax" x1="34" y1="190" x2="${W - 8}" y2="190"/><line class="ax" x1="34" y1="190" x2="34" y2="10"/>
    <line class="gd" x1="34" y1="105" x2="${W - 8}" y2="105"/><text class="tick" x="${W - 10}" y="100" text-anchor="end">tendência</text>
    <polyline class="cv ghost" points="${semP.join(' ')}"/>
    <polyline class="cv o" points="${comP.join(' ')}"/>
    <rect x="${X(6)}" y="14" width="${X(12) - X(6)}" height="172" fill="var(--warnbg)"/>
    <text class="tick" x="${X(9)}" y="28" text-anchor="middle">estímulo faz efeito</text>
    <text class="cvl ghost" x="${X(3.6)}" y="${Y(-2) + 18}">sem política</text>
    <text class="cvl o" x="${X(9)}" y="${Y(2.1) - 8}" text-anchor="middle">com estímulo tardio</text>
    <text class="axl" x="${W - 8}" y="206" text-anchor="end">tempo</text><text class="axl" x="40" y="12">atividade</text>
  </svg>`;
};
const gVsTSVG = (pm = 0.6) => {
  const h = v => v * 1.5;
  return `<svg viewBox="0 0 360 210" class="chart" role="img" aria-label="Efeito direto de G e de corte de impostos">
    <line class="ax" x1="40" y1="180" x2="340" y2="180"/>
    <rect class="bar" x="80" y="${180 - h(100)}" width="80" height="${h(100)}" fill="var(--c2)"/>
    <rect class="bar" x="220" y="${180 - h(100 * pm)}" width="80" height="${h(100 * pm)}" fill="var(--c1)"/>
    <rect x="220" y="${180 - h(100)}" width="80" height="${h(100 - 100 * pm)}" fill="none" stroke="var(--mut)" stroke-dasharray="4 4"/>
    <text class="ptl" x="120" y="${172 - h(100)}" text-anchor="middle">R$ 100</text>
    <text class="ptl" x="260" y="${172 - h(100 * pm)}" text-anchor="middle">R$ ${fmt(100 * pm, 0)}</text>
    <text class="tick" x="260" y="${180 - h(100) + 14}" text-anchor="middle">poupado: R$ ${fmt(100 - 100 * pm, 0)}</text>
    <text class="axl" x="120" y="198" text-anchor="middle">+R$ 100 de G</text>
    <text class="axl" x="260" y="198" text-anchor="middle">−R$ 100 de impostos</text>
  </svg>`;
};
const A0 = { d: 0, YN: 5, PE: 5, c: 0 };
const FIGS = {
  'Aula 2|7': { when: 'after', cap: 'Resolução gráfica: incentivo à poupança', svg: () => feChart({ s: 1.5, i: 0 }, { s: 0, i: 0 }) },
  'Aula 2|8': { when: 'after', cap: 'Resolução gráfica: incentivo ao investimento', svg: () => feChart({ s: 0, i: 1.5 }, { s: 0, i: 0 }) },
  'Aula 2|12': { when: 'after', cap: 'Resolução gráfica: déficit orçamentário', svg: () => feChart({ s: -1.5, i: 0 }, { s: 0, i: 0 }) },
  'Aula 2|15': { when: 'after', cap: 'Resolução gráfica: déficit e crowding-out', svg: () => feChart({ s: -1.5, i: 0 }, { s: 0, i: 0 }) },
  'Aula 5|12': { when: 'after', cap: 'Os três mercados após o déficit', svg: () => '<div class="lab-grid three">' + openCharts({ s: -1.2, i: 0, f: 0, t: 0 }, { s: 0, i: 0, f: 0, t: 0 }).join('') + '</div>' },
  'Aula 5|18': { when: 'after', cap: 'Fuga de capitais nos três mercados', svg: () => '<div class="lab-grid three">' + openCharts({ s: 0, i: 0, f: 1.2, t: 0 }, { s: 0, i: 0, f: 0, t: 0 }).join('') + '</div>' },
  'Aula 5|19': { when: 'after', cap: 'Fuga de capitais nos três mercados', svg: () => '<div class="lab-grid three">' + openCharts({ s: 0, i: 0, f: 1.2, t: 0 }, { s: 0, i: 0, f: 0, t: 0 }).join('') + '</div>' },
  'Aula 6.2|5': { when: 'before', cap: 'Gráfico 1 — Queda da demanda', svg: () => {
    const B = Object.assign({}, A0, { d: -2 }), C = Object.assign({}, B, { PE: 3 });
    const b = ADAS(B), c = ADAS(C);
    return adasChart(C, A0, [{ x: 5, y: 5, lab: 'A', cls: 'old' }, { x: b.Y, y: b.P, lab: 'B', cls: 'old' }, { x: c.Y, y: c.P, lab: 'C' }]);
  } },
  'Aula 6.2|6': { when: 'before', cap: 'Gráfico 2 — Choque adverso de custos', svg: () => {
    const B = Object.assign({}, A0, { c: 2 }), b = ADAS(B);
    return adasChart(B, A0, [{ x: 5, y: 5, lab: 'A', cls: 'old' }, { x: b.Y, y: b.P, lab: 'B' }]);
  } },
  'Aula 7.2|2': { when: 'before', cap: 'Gráfico 1 — Estímulo com defasagem (trajetórias hipotéticas)', svg: defasagemSVG },
  'Aula 7.2|4': { when: 'before', cap: 'Gráfico 2 — Efeitos diretos, antes das rodadas adicionais', svg: () => gVsTSVG(0.6) }
};

/* =====================================================================
   QUESTÕES
   ===================================================================== */
function qCard(mi, qi, tag) {
  const m = MODS[mi], q = m.qs[qi], key = mi + '-' + qi, a = answers[key], done = a !== undefined;
  const fig = FIGS[m.id + '|' + qi];
  const figHtml = f => `<figure class="qfig"><figcaption>${f.cap}</figcaption>${f.svg()}</figure>`;
  const opts = q.o.map((o, k) => {
    let c = '';
    if (done) c = k === q.c ? 'right' : (k === a ? 'wrong' : 'dim');
    return `<button class="opt ${c}" data-act="ans" data-m="${mi}" data-q="${qi}" data-o="${k}" ${done ? 'disabled' : ''}>${esc(o)}</button>`;
  }).join('');
  const ok = a === q.c;
  const st = done ? (ok ? '<span class="q-st ok">✓ acertou</span>' : '<span class="q-st no">✗ errou</span>') : '';
  return `<article class="q" id="q-${key}" style="--a:${m.cor}">
    <div class="q-h"><span class="q-tag">${tag}</span>${st}</div>
    <p class="q-txt">${esc(q.q)}</p>
    ${fig && fig.when === 'before' ? figHtml(fig) : ''}
    <div class="opts">${opts}</div>
    ${done ? `<div class="fb ${ok ? 'ok' : 'no'}"><div class="fb-h"><span>${ok ? '✅ Correto!' : '❌ Incorreto — a certa é a ' + 'ABCDE'[q.c]}</span><button data-act="retry" data-m="${mi}" data-q="${qi}">Tentar de novo</button></div><p>${esc(q.e)}</p>${fig && fig.when === 'after' ? figHtml(fig) : ''}</div>` : ''}
  </article>`;
}
function passes(mi, qi) {
  const q = MODS[mi].qs[qi], a = answers[mi + '-' + qi];
  if (ui.filter === 'unanswered' && a !== undefined) return false;
  if (ui.filter === 'wrong' && (a === undefined || a === q.c)) return false;
  if (ui.filter === 'right' && a !== q.c) return false;
  const s = ui.search.trim().toLowerCase();
  if (s && !(q.q + ' ' + q.o.join(' ') + ' ' + q.e).toLowerCase().includes(s)) return false;
  return true;
}
function toolbar(showFilter = true) {
  const f = [['all', 'Todas'], ['unanswered', 'Não respondidas'], ['wrong', 'Erradas'], ['right', 'Acertadas']];
  return `<div class="toolbar">
    ${showFilter ? `<div class="seg" role="group" aria-label="Filtro">${f.map(([k, l]) => `<button data-act="filter" data-f="${k}" class="${ui.filter === k ? 'on' : ''}">${l}</button>`).join('')}</div>` : '<span></span>'}
    <input class="search" id="search" type="search" placeholder="Buscar palavra nas questões…" value="${esc(ui.search)}">
  </div>`;
}
function renderQuestionList(list, emptyMsg) {
  const cards = list.filter(([mi, qi]) => passes(mi, qi)).map(([mi, qi]) => qCard(mi, qi, `${MODS[mi].id} · Questão ${qi + 1}`));
  return cards.length ? cards.join('') : `<div class="empty">${emptyMsg || 'Nenhuma questão para este filtro.'}</div>`;
}
function onAnswer(mi, qi, o) {
  const key = mi + '-' + qi; if (answers[key] !== undefined) return;
  answers[key] = o; saveAnswers();
  const el = $('#q-' + key);
  if (el) el.outerHTML = qCard(mi, qi, el.querySelector('.q-tag').textContent);
  renderSide();
}
function onRetry(mi, qi) {
  const key = mi + '-' + qi; delete answers[key]; saveAnswers();
  const el = $('#q-' + key);
  if (el) el.outerHTML = qCard(mi, qi, el.querySelector('.q-tag').textContent);
  renderSide();
}

/* =====================================================================
   LABORATÓRIOS
   ===================================================================== */
const LAB = {};

/* ---------- Aula 1: calculadora de PIB + jogo "entra no PIB?" ---------- */
const PIB_PRESETS = {
  slides: { nome: 'Slides (pizza e leite)', bens: ['Pizza', 'Leite'], rows: [['2018', 10, 400, 2, 1000], ['2019', 11, 500, 2.5, 1100], ['2020', 12, 600, 3, 1200]] },
  q9: { nome: 'Questões 9 e 10', bens: ['Café', 'Livros'], rows: [['Ano 1', 5, 100, 20, 20], ['Ano 2', 6, 120, 25, 24]] },
  q14: { nome: 'Questão 14', bens: ['Bem A', 'Bem B'], rows: [['2025', 10, 100, 5, 200], ['2026', 12, 110, 6, 180]] }
};
const PIB_GAME = [
  ['Família compra um carro novo fabricado no Brasil', 'C', 'Bem final novo comprado por família: consumo (mesmo sendo durável).'],
  ['Empresa compra uma máquina nova para a fábrica', 'I', 'Bem de capital: investimento.'],
  ['Construção de uma casa nova', 'I', 'Casas novas são estruturas: investimento.'],
  ['Fábrica produz 10 equipamentos e não os vende', 'I', 'Produzido e não vendido: investimento em estoques.'],
  ['Prefeitura paga salários de professores da rede municipal', 'G', 'Compra de serviços por governo municipal: G.'],
  ['Governo federal compra caças para a Aeronáutica', 'G', 'Compra de bens pelo governo federal: G.'],
  ['INSS paga a aposentadoria de um senhor', 'N', 'Transferência: não é compra de bem ou serviço. Fica fora de G.'],
  ['Investidor compra ações da Petrobras', 'N', 'Ativo financeiro: é poupança, não investimento.'],
  ['Embraer vende um avião a uma companhia americana', 'EL', 'Exportação: entra em EL.'],
  ['Família compra vinho chileno', 'N', 'Entra em C e sai em M: efeito líquido zero no PIB.'],
  ['Pessoa compra um carro usado de 2022', 'N', 'Bem produzido em ano anterior: não é produção corrente.'],
  ['Padaria compra farinha para fazer pão', 'N', 'Bem intermediário: já está no preço do pão.'],
  ['Você corta o cabelo no salão', 'C', 'Serviço intangível comprado por família: consumo.'],
  ['Toyota fabrica em Sorocaba carros vendidos a brasileiros', 'C', 'Critério geográfico: produzido no Brasil. Vendido a famílias: consumo.'],
  ['Você cozinha o próprio jantar em casa', 'N', 'Atividade sem valor de mercado: fica fora do PIB.']
];
LAB.pib = el => {
  let preset = 'slides', rows = PIB_PRESETS.slides.rows.map(r => r.slice()), bens = PIB_PRESETS.slides.bens;
  const game = {};
  el.innerHTML = `
  <div class="lab"><h3>🧮 Calculadora de PIB nominal, real e deflator</h3>
    <p class="muted">Edite preços e quantidades. O primeiro ano é o ano-base.</p>
    <div class="btns" id="pibPre">${Object.entries(PIB_PRESETS).map(([k, v]) => `<button class="btn sm ${k === preset ? 'on' : ''}" data-p="${k}">${v.nome}</button>`).join('')}</div>
    <div id="pibIn"></div><div id="pibOut"></div>
  </div>
  <div class="lab"><h3>🎯 Entra no PIB? Em qual componente?</h3>
    <p class="muted">Classifique cada transação. <b>EL</b> = exportação. <b>Fora</b> = não entra no PIB (ou o efeito líquido é zero).</p>
    <div id="pibScore" class="note"></div><div id="pibGame"></div>
    <div class="btns"><button class="btn sm" id="pibReset">Recomeçar</button></div>
  </div>`;
  const drawIn = () => {
    $('#pibIn', el).innerHTML = `<table class="t calc-t"><thead><tr><th>Ano</th><th>P ${bens[0]}</th><th>Q ${bens[0]}</th><th>P ${bens[1]}</th><th>Q ${bens[1]}</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr><td><b>${esc(r[0])}</b>${i === 0 ? ' <span class="tag">base</span>' : ''}</td>${[1, 2, 3, 4].map(k => `<td><input type="number" step="any" min="0" data-r="${i}" data-k="${k}" value="${r[k]}" aria-label="${k % 2 ? 'preço' : 'quantidade'} ${esc(r[0])}"></td>`).join('')}</tr>`).join('')}
    </tbody></table>`;
  };
  const drawOut = () => {
    const b = rows[0]; let prev = null;
    const out = rows.map(r => {
      const nom = r[1] * r[2] + r[3] * r[4], real = b[1] * r[2] + b[3] * r[4], def = real ? 100 * nom / real : 0;
      const o = { y: r[0], nom, real, def, inf: prev ? def / prev.def - 1 : null, gr: prev ? real / prev.real - 1 : null, gn: prev ? nom / prev.nom - 1 : null };
      prev = o; return o;
    });
    const p = v => v === null || !isFinite(v) ? '—' : fmt(100 * v, 1) + '%';
    const last = out[out.length - 1], first = out[0];
    $('#pibOut', el).innerHTML = `<table class="t"><thead><tr><th>Ano</th><th>PIB nominal</th><th>PIB real</th><th>Deflator</th><th>Cresc. nominal</th><th>Inflação</th><th>Cresc. real</th></tr></thead><tbody>
      ${out.map(o => `<tr><td><b>${esc(o.y)}</b></td><td>${fmt(o.nom, 0)}</td><td>${fmt(o.real, 0)}</td><td>${fmt(o.def, 1)}</td><td>${p(o.gn)}</td><td>${p(o.inf)}</td><td>${p(o.gr)}</td></tr>`).join('')}
    </tbody></table>
    <div class="explain"><p>De ${esc(first.y)} para ${esc(last.y)}, o PIB nominal ${last.nom >= first.nom ? 'subiu' : 'caiu'} ${p(Math.abs(last.nom / first.nom - 1))}, mas o PIB real (só quantidades) ${last.real >= first.real ? 'subiu' : 'caiu'} ${p(Math.abs(last.real / first.real - 1))}. A diferença é a variação de preços, capturada pelo deflator (${fmt(first.def, 1)} → ${fmt(last.def, 1)}).</p></div>`;
  };
  const drawGame = () => {
    const n = Object.keys(game).length, ok = Object.entries(game).filter(([i, v]) => v === PIB_GAME[i][1]).length;
    $('#pibScore', el).textContent = n ? `${ok} de ${n} certas · faltam ${PIB_GAME.length - n}` : `${PIB_GAME.length} transações`;
    $('#pibGame', el).innerHTML = PIB_GAME.map(([t, ans, exp], i) => {
      const g = game[i];
      return `<div class="game-item"><span>${t}</span><div class="gbtns">${[['C', 'C'], ['I', 'I'], ['G', 'G'], ['EL', 'EL'], ['N', 'Fora']].map(([k, l]) => {
        let c = ''; if (g !== undefined) { if (k === ans) c = 'right'; else if (k === g) c = 'wrong'; }
        return `<button data-g="${i}" data-k="${k}" class="${c}" ${g !== undefined ? 'disabled' : ''}>${l}</button>`;
      }).join('')}</div>${g !== undefined ? `<div class="gexp">${g === ans ? '✅' : '❌'} ${exp}</div>` : ''}</div>`;
    }).join('');
  };
  drawIn(); drawOut(); drawGame();
  el.addEventListener('input', e => { const t = e.target; if (t.dataset.r === undefined) return; rows[+t.dataset.r][+t.dataset.k] = parseFloat(t.value) || 0; drawOut(); });
  el.addEventListener('click', e => {
    const p = e.target.closest('[data-p]');
    if (p) { preset = p.dataset.p; rows = PIB_PRESETS[preset].rows.map(r => r.slice()); bens = PIB_PRESETS[preset].bens; $$('#pibPre .btn', el).forEach(b => b.classList.toggle('on', b === p)); drawIn(); drawOut(); return; }
    const g = e.target.closest('[data-g]');
    if (g) { game[g.dataset.g] = g.dataset.k; drawGame(); return; }
    if (e.target.id === 'pibReset') { for (const k in game) delete game[k]; drawGame(); }
  });
};

/* ---------- Aula 2: fundos emprestáveis ---------- */
LAB.fe = el => {
  const base = { s: 0, i: 0 }; let cur = Object.assign({}, base);
  const SC = {
    reset: { p: base, t: 'Equilíbrio inicial', x: '<p>A taxa de juros real equilibra poupança (oferta) e investimento (demanda): <b>S = I</b>.</p>' },
    poup: { p: { s: 1.5, i: 0 }, t: 'Política 1 — Incentivo fiscal à poupança', x: '<p>As famílias poupam mais a cada taxa de juros → <b>oferta (S) vai para a direita</b>. Sobra dinheiro, os juros <b>caem</b> e a quantidade de fundos (= investimento) <b>sobe</b>.</p>' },
    inv: { p: { s: 0, i: 1.5 }, t: 'Política 2 — Crédito fiscal ao investimento', x: '<p>Investir fica mais vantajoso a cada taxa → <b>demanda (I) vai para a direita</b>. Os juros <b>sobem</b> e a quantidade de equilíbrio <b>sobe</b>.</p>' },
    def: { p: { s: -1.5, i: 0 }, t: 'Política 3 — Déficit orçamentário', x: '<p>G &gt; T: a poupança pública fica negativa e a poupança nacional cai → <b>oferta (S) vai para a esquerda</b>. Os juros <b>sobem</b> e o investimento privado <b>cai</b>: é o <b>crowding-out</b>. Menos capital hoje = menos crescimento amanhã.</p>' }
  };
  el.innerHTML = `
  <div class="lab"><h3>📈 Mercado de fundos emprestáveis</h3><p class="muted">Clique numa política e veja as curvas se deslocarem.</p>
    <div class="btns" id="feBtns">${Object.entries(SC).map(([k, v]) => `<button class="btn sm ${k === 'reset' ? 'on' : ''}" data-sc="${k}">${k === 'reset' ? '↺ Início' : v.t.replace(/^Política \d — /, '')}</button>`).join('')}</div>
    <div class="lab-grid"><div id="feChart"></div><div><div class="readout" id="feRo"></div><div class="explain" id="feTxt"></div></div></div>
  </div>
  <div class="lab"><h3>🧮 Calculadora de poupança</h3><p class="muted">Economia fechada. Os valores iniciais são os da Questão 1 (com G = 250).</p>
    <div class="fields">${[['Y', 'Renda (Y)', 1000], ['T', 'Impostos (T)', 200], ['C', 'Consumo (C)', 650], ['G', 'Gov. (G)', 250]].map(([k, l, v]) => `<label class="field">${l}<input type="number" id="sv${k}" value="${v}"></label>`).join('')}</div>
    <div class="readout" id="svOut"></div><div class="explain" id="svTxt"></div>
  </div>`;
  let sel = 'reset';
  const draw = p => {
    $('#feChart', el).innerHTML = feChart(p, base);
    const e = FE(p), e0 = FE(base);
    $('#feRo', el).innerHTML = `<div><small>Juros r</small><b>${fmt(e.r)}%</b>${arrow(e.r, e0.r)}</div><div><small>Fundos = I</small><b>R$ ${fmt(e.q * 10, 0)} bi</b>${arrow(e.q, e0.q)}</div>`;
  };
  const pick = k => {
    sel = k; const to = SC[k].p;
    $$('#feBtns .btn', el).forEach(b => b.classList.toggle('on', b.dataset.sc === k));
    $('#feTxt', el).innerHTML = `<p><b>${SC[k].t}</b></p>${SC[k].x}`;
    tween('fe', cur, to, p => { cur = p; draw(p); });
  };
  const sv = () => {
    const g = k => parseFloat($('#sv' + k, el).value) || 0;
    const Y = g('Y'), T = g('T'), C = g('C'), G = g('G');
    const sp = Y - T - C, sg = T - G, s = sp + sg;
    $('#svOut', el).innerHTML = `<div><small>S privada</small><b>${fmt(sp, 0)}</b></div><div><small>S pública</small><b class="${sg < 0 ? 'no' : 'ok'}">${fmt(sg, 0)}</b></div><div><small>S nacional</small><b>${fmt(s, 0)}</b></div><div><small>I (= S)</small><b>${fmt(s, 0)}</b></div>`;
    $('#svTxt', el).innerHTML = `<p>S<sub>priv</sub> = ${fmt(Y, 0)} − ${fmt(T, 0)} − ${fmt(C, 0)} = <b>${fmt(sp, 0)}</b> · S<sub>pub</sub> = ${fmt(T, 0)} − ${fmt(G, 0)} = <b>${fmt(sg, 0)}</b> → ${sg > 0 ? '<span class="ok">superávit</span>' : sg < 0 ? '<span class="no">déficit</span>' : 'orçamento equilibrado'} · S = Y − C − G = <b>${fmt(s, 0)}</b>. Na economia fechada, S = I.</p>`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-sc]'); if (b) pick(b.dataset.sc); });
  el.addEventListener('input', e => { if (e.target.id && e.target.id.startsWith('sv')) sv(); });
  draw(cur); pick('reset'); sv();
};

/* ---------- Aula 3: multiplicador monetário ---------- */
LAB.mult = el => {
  let R = 10, D = 100, msg = 'Mexa na razão de reserva ou use as ferramentas do BACEN.';
  el.innerHTML = `
  <div class="lab"><h3>🏦 Criação de moeda pelos bancos</h3><p class="muted">Um depósito inicial vira reservas; cada banco guarda R% e empresta o resto, que é depositado no próximo banco.</p>
    <div class="fields">
      <label class="field">Razão de reserva R: <b id="mR"></b><input type="range" id="mRin" min="5" max="100" step="5" value="${R}"></label>
      <label class="field">Reservas iniciais (R$)<input type="number" id="mDin" value="${D}" min="0" step="10"></label>
    </div>
    <div class="btns" id="mBtns">
      <button class="btn sm" data-b="buy">BACEN compra R$ 50 em títulos</button>
      <button class="btn sm" data-b="sell">BACEN vende R$ 50 em títulos</button>
      <button class="btn sm" data-b="up">Compulsório +5 p.p.</button>
      <button class="btn sm" data-b="down">Compulsório −5 p.p.</button>
      <button class="btn sm" data-b="run">Corrida bancária</button>
    </div>
    <div class="readout" id="mRo"></div>
    <div class="explain" id="mMsg"></div>
    <div class="lab-grid" style="margin-top:14px"><div id="mBars"></div><div id="mTab"></div></div>
  </div>`;
  const draw = () => {
    const r = R / 100, m = 1 / r, tot = D * m;
    $('#mR', el).textContent = R + '%'; $('#mRin', el).value = R; $('#mDin', el).value = D;
    $('#mRo', el).innerHTML = `<div><small>Multiplicador 1/R</small><b>${fmt(m, m % 1 ? 2 : 0)}</b></div><div><small>Oferta de moeda</small><b>R$ ${fmt(tot, 0)}</b></div><div><small>Criada pelos bancos</small><b>R$ ${fmt(tot - D, 0)}</b></div>`;
    $('#mMsg', el).innerHTML = `<p>${msg}</p>`;
    const n = 12, dep = Array.from({ length: n }, (_, k) => D * Math.pow(1 - r, k));
    const W = 380, H = 200, bw = (W - 40) / n, mx = Math.max(D, 1);
    $('#mBars', el).innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Depósitos em cada rodada">
      <text class="ptitle" x="${W / 2}" y="14" text-anchor="middle">Depósito em cada banco (rodada)</text>
      <line class="ax" x1="30" y1="${H - 24}" x2="${W - 6}" y2="${H - 24}"/>
      ${dep.map((v, k) => { const h = (H - 54) * v / mx, x = 34 + k * bw; return `<rect class="bar" x="${x}" y="${H - 24 - h}" width="${bw - 5}" height="${h}" fill="var(--c4)" opacity="${1 - k * 0.05}"/><text class="tick" x="${x + bw / 2 - 2}" y="${H - 10}" text-anchor="middle">${k + 1}</text>`; }).join('')}
    </svg>`;
    $('#mTab', el).innerHTML = `<table class="t sm"><thead><tr><th>Banco</th><th>Depósito</th><th>Reserva (${R}%)</th><th>Empresta</th></tr></thead><tbody>
      ${dep.slice(0, 5).map((v, k) => `<tr><td>${'XYZWV'[k]}</td><td>${fmt(v, 2)}</td><td>${fmt(v * r, 2)}</td><td>${fmt(v * (1 - r), 2)}</td></tr>`).join('')}
      <tr><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td></tr>
      <tr><td><b>Total</b></td><td><b>${fmt(D / r, 2)}</b></td><td><b>${fmt(D, 2)}</b></td><td><b>${fmt(D / r - D, 2)}</b></td></tr></tbody></table>`;
  };
  const act = b => {
    const before = D / (R / 100);
    if (b === 'buy') { D += 50; msg = 'O BACEN pagou R$ 50 pelos títulos. O dinheiro vira <b>reservas</b> nos bancos, que emprestam e multiplicam.'; }
    if (b === 'sell') { D = Math.max(0, D - 50); msg = 'O BACEN recebeu R$ 50 pelos títulos: o dinheiro <b>sai de circulação</b>, as reservas caem e o processo se inverte.'; }
    if (b === 'up') { R = Math.min(100, R + 5); msg = 'Compulsório maior → R maior → multiplicador menor → <b>menos moeda</b>. (Ferramenta pouco usada: gera incerteza.)'; }
    if (b === 'down') { R = Math.max(5, R - 5); msg = 'Compulsório menor → R menor → multiplicador maior → <b>mais moeda</b>.'; }
    if (b === 'run') { R = Math.min(100, R + 15); msg = '<b>Corrida bancária</b>: o público saca, os bancos passam a guardar mais reservas. R sobe e a oferta de moeda cai.'; }
    const after = D / (R / 100), d = after - before;
    msg += ` <br>Variação da oferta de moeda: <b class="${d >= 0 ? 'ok' : 'no'}">${d >= 0 ? '+' : '−'}R$ ${fmt(Math.abs(d), 0)}</b>.`;
    draw();
  };
  el.addEventListener('input', e => {
    if (e.target.id === 'mRin') { R = +e.target.value; msg = R === 100 ? 'Com 100% de reservas o banco não empresta: <b>multiplicador = 1</b>, os bancos não criam moeda.' : `Com R = ${R}%, cada R$ 1 de reserva sustenta R$ ${fmt(100 / R, 2)} de moeda.`; draw(); }
    if (e.target.id === 'mDin') { D = Math.max(0, parseFloat(e.target.value) || 0); draw(); }
  });
  el.addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (b) act(b.dataset.b); });
  draw();
};

/* ---------- Aula 4: câmbio real, PPC, EL e IEL ---------- */
LAB.cambio = el => {
  el.innerHTML = `
  <div class="lab"><h3>🍔 Câmbio real e PPC (exemplo do Big Mac)</h3><p class="muted">Valores iniciais: os do slide (e a Questão 11).</p>
    <div class="fields">
      <label class="field">Câmbio nominal e (R$ por US$)<input type="number" id="cxE" value="5" step="0.1" min="0"></label>
      <label class="field">Preço nos EUA P* (US$)<input type="number" id="cxPs" value="3" step="0.1" min="0"></label>
      <label class="field">Preço no Brasil P (R$)<input type="number" id="cxP" value="30" step="0.5" min="0"></label>
    </div>
    <div class="readout" id="cxRo"></div><div class="explain" id="cxTxt"></div>
  </div>
  <div class="lab"><h3>🌎 Exportações líquidas e investimento externo líquido</h3>
    <div class="fields">
      <label class="field">Exportações X<input type="number" id="ex" value="400"></label>
      <label class="field">Importações M<input type="number" id="im" value="250"></label>
      <label class="field">Ativos externos comprados por brasileiros<input type="number" id="aa" value="300"></label>
      <label class="field">Ativos brasileiros comprados por estrangeiros<input type="number" id="ab" value="220"></label>
    </div>
    <div class="readout" id="elRo"></div><div class="explain" id="elTxt"></div>
  </div>`;
  const draw = () => {
    const g = id => parseFloat($('#' + id, el).value) || 0;
    const e = g('cxE'), ps = g('cxPs'), p = g('cxP');
    const eps = e * ps, E = p ? eps / p : 0, ppc = ps ? p / ps : 0;
    $('#cxRo', el).innerHTML = `<div><small>Big Mac EUA em R$</small><b>R$ ${fmt(eps, 2)}</b></div><div><small>Câmbio real E</small><b>${fmt(E, 2)}</b></div><div><small>e pela PPC</small><b>${fmt(ppc, 2)} R$/US$</b></div>`;
    const cmp = near(E, 1) ? 'Os dois lanches custam o mesmo — exatamente o que a PPC prevê.' : E < 1 ? `O lanche americano custa <b>${fmt(E, 2)}</b> lanche brasileiro: comprar lá fora está <b>barato</b> para nós. Os bens brasileiros estão relativamente <b>caros</b> (real “forte” em termos reais).` : `O lanche americano custa <b>${fmt(E, 2)}</b> lanches brasileiros: comprar lá fora está <b>caro</b>. Os bens brasileiros estão relativamente <b>baratos</b>.`;
    const tx = (n, d) => fmt(n, d).replace(',', '{,}');
    $('#cxTxt', el).innerHTML = `<p>\\(E = \\dfrac{e \\times P^{*}}{P} = \\dfrac{${tx(e, 2)} \\times ${tx(ps, 2)}}{${tx(p, 2)}} = ${tx(E, 2)}\\) Big Mac brasileiro por Big Mac americano. ${cmp}</p>
      <p>Pela PPC, o câmbio que igualaria os preços seria <b>${fmt(ppc, 2)} R$/US$</b> (\\(= \\dfrac{P}{P^{*}}\\)). ${near(e, ppc) ? 'O câmbio atual já é esse.' : e < ppc ? `Como o câmbio atual (${fmt(e, 2)}) é menor, o real está <b>mais valorizado</b> do que a PPC prevê.` : `Como o câmbio atual (${fmt(e, 2)}) é maior, o real está <b>mais desvalorizado</b> do que a PPC prevê.`}</p>
      <p class="muted">Na convenção do Mankiw (slide da PPC), o mesmo resultado aparece como \\(e = \\dfrac{P^{*}}{P} = ${ps && p ? tx(ps / p, 3) : '—'}\\) US$ por real — o inverso.</p>`;
    const X = g('ex'), M = g('im'), A = g('aa'), B = g('ab'), EL = X - M, IEL = A - B;
    $('#elRo', el).innerHTML = `<div><small>EL = X − M</small><b class="${EL < 0 ? 'no' : 'ok'}">${fmt(EL, 0)}</b></div><div><small>IEL</small><b>${fmt(IEL, 0)}</b></div>`;
    $('#elTxt', el).innerHTML = `<p>${EL > 0 ? '<b>Superávit</b> comercial' : EL < 0 ? '<b>Déficit</b> comercial' : 'Equilíbrio comercial'} · ${IEL > 0 ? '<b>Saída</b> líquida de capitais (IEL > 0)' : IEL < 0 ? '<b>Entrada</b> líquida de capitais (IEL < 0)' : 'IEL = 0'}.</p>
      <p class="${near(EL, IEL) ? 'ok' : 'muted'}">${near(EL, IEL) ? '✓ EL = IEL, como manda a identidade.' : `Na economia real, EL = IEL sempre. Aqui os números são independentes para você treinar as definições (pela identidade, IEL deveria ser ${fmt(EL, 0)}).`}</p>`;
  };
  el.addEventListener('input', draw); draw();
};

/* ---------- Aula 5: os três mercados da economia aberta ---------- */
LAB.aberta = el => {
  const base = { s: 0, i: 0, f: 0, t: 0 }; let cur = Object.assign({}, base);
  const SC = {
    reset: { p: base, b: '↺ Início', t: 'Equilíbrio inicial', x: 'Os juros equilibram S e I + IEL; no câmbio, a oferta vertical (= IEL) encontra a demanda por reais (= EL). Sempre EL = IEL.' },
    def: { p: { s: -1.2, i: 0, f: 0, t: 0 }, b: 'Déficit público', t: 'Déficit público (S ↓)', x: 'Menos poupança nacional → oferta de fundos vai à esquerda → <b>r sobe</b>. Com r maior, <b>I cai</b> (crowding-out) e <b>IEL cai</b> (anda ao longo da curva). Menos IEL = menos reais ofertados → <b>E sobe (real aprecia)</b> → <b>EL cai</b>: déficit comercial maior. São os “déficits gêmeos”.' },
    inv: { p: { s: 0, i: 1.2, f: 0, t: 0 }, b: 'Incentivo ao investimento', t: 'Incentivo fiscal ao investimento (I ↑)', x: 'A demanda por fundos vai à direita → <b>r sobe</b>. <b>I sobe</b> (o incentivo mais que compensa os juros), mas <b>IEL cai</b> → <b>E aprecia</b> → <b>EL cai</b>. Igual ao déficit em r, IEL, E e EL; a diferença é que aqui o investimento <b>aumenta</b>.' },
    fuga: { p: { s: 0, i: 0, f: 1.2, t: 0 }, b: 'Fuga de capitais', t: 'Fuga de capitais (México, 1994)', x: 'A curva de IEL <b>se desloca</b> à direita (para cada r, sai mais capital). Como a demanda por fundos é I + IEL, ela também vai à direita → <b>r sobe</b> e, mesmo assim, <b>IEL sobe</b>. Mais moeda local ofertada no câmbio → <b>E cai (deprecia)</b> → EL sobe. I cai por causa dos juros mais altos.' },
    tar: { p: { s: 0, i: 0, f: 0, t: 0.6 }, b: 'Tarifa (complemento)', t: 'Tarifa ou quota de importação — complemento do Mankiw', x: 'Importamos menos a cada câmbio → EL sobe → <b>demanda por reais vai à direita</b>. Mas a oferta (= IEL) é vertical e não mudou, porque S, I e r não mudaram. Resultado: o real <b>aprecia</b> e <b>EL volta ao mesmo valor</b>. No modelo, a tarifa não reduz o déficit comercial.' }
  };
  el.innerHTML = `
  <div class="lab"><h3>🌐 Fundos emprestáveis + IEL + câmbio</h3><p class="muted">Os três gráficos estão ligados: r (gráfico 1) define IEL (gráfico 2), que é a oferta de reais no câmbio (gráfico 3).</p>
    <div class="btns" id="opBtns">${Object.entries(SC).map(([k, v]) => `<button class="btn sm ${k === 'reset' ? 'on' : ''}" data-sc="${k}">${v.b}</button>`).join('')}</div>
    <div class="lab-grid three" id="opCharts"></div>
    <div class="readout" id="opRo"></div><div class="explain" id="opTxt"></div>
  </div>`;
  const draw = p => {
    $('#opCharts', el).innerHTML = openCharts(p, base).map(s => `<div>${s}</div>`).join('');
    const e = OPEN(p), b = OPEN(base);
    $('#opRo', el).innerHTML = [['Juros r', e.r, b.r, '%', 1], ['Investimento I', e.I * 10, b.I * 10, '', 0], ['IEL', e.IEL * 10, b.IEL * 10, '', 0], ['Câmbio real E', e.E * 20, b.E * 20, '', 0], ['EL (= IEL)', e.EL * 10, b.EL * 10, '', 0]]
      .map(([l, v, v0, u, d]) => `<div><small>${l}</small><b>${fmt(v, d)}${u}</b>${arrow(v, v0)}</div>`).join('');
  };
  const pick = k => {
    $$('#opBtns .btn', el).forEach(b => b.classList.toggle('on', b.dataset.sc === k));
    $('#opTxt', el).innerHTML = `<p><b>${SC[k].t}</b></p><p>${SC[k].x}</p><p class="muted">E em índice (início = 100); I, IEL e EL em R$ bi ilustrativos. E ↑ = real aprecia (convenção da Aula 5).</p>`;
    tween('op', cur, SC[k].p, p => { cur = p; draw(p); });
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-sc]'); if (b) pick(b.dataset.sc); });
  draw(cur); pick('reset');
};

/* ---------- Aulas 6.1 e 6.2: OA–DA ---------- */
LAB.oada1 = el => {
  const A = Object.assign({}, A0); let cur = Object.assign({}, A);
  const SC = {
    reset: { p: A, b: '↺ Início', t: 'Equilíbrio de longo prazo', x: 'DA, OAcp e OAlp se cruzam no mesmo ponto: Y = Y<sub>N</sub> e P = P<sub>E</sub>.' },
    bolsa: { p: Object.assign({}, A, { d: 2 }), b: 'Boom da bolsa (C ↑)', t: 'Boom do mercado de ações', x: 'As famílias ficam mais ricas e consomem mais <b>a cada nível de preços</b> → <b>DA vai para a direita</b>. No curto prazo, Y e P sobem (o desemprego cai).' },
    pess: { p: Object.assign({}, A, { d: -2 }), b: 'Pessimismo (I ↓)', t: 'Pessimismo das empresas', x: 'As empresas investem menos a cada P → <b>DA vai para a esquerda</b>. No curto prazo, Y e P caem (o desemprego sobe).' },
    gov: { p: Object.assign({}, A, { d: 2 }), b: 'Mais gastos do governo (G ↑)', t: 'Aumento de G (federal, estadual ou municipal)', x: 'Escolas, estradas, defesa: tudo é G → <b>DA para a direita</b>.' },
    ext: { p: Object.assign({}, A, { d: -1.5 }), b: 'Recessão no exterior (EL ↓)', t: 'Recessão em outros países', x: 'Estrangeiros compram menos nossas exportações → EL cai → <b>DA para a esquerda</b>.' },
    tec: { p: Object.assign({}, A, { YN: 6.5 }), b: 'Tecnologia / imigração (OAlp →)', t: 'Progresso tecnológico ou imigração', x: 'Aumenta a capacidade de produzir → <b>Y<sub>N</sub> sobe</b>: OAlp (e a OAcp junto) vão para a direita. Mais produto, preços menores.' },
    trag: { p: Object.assign({}, A, { YN: 3.5 }), b: 'Tragédia destrói fábricas (OAlp ←)', t: 'Destruição de capital', x: 'Menos capital → <b>Y<sub>N</sub> cai</b>: OAlp e OAcp para a esquerda. Menos produto e preços maiores.' },
    cresc: { p: { d: 3, YN: 7, PE: 6, c: 0 }, b: 'Crescimento + inflação (décadas)', t: 'Crescimento e inflação ao longo do tempo', x: 'A tecnologia empurra a <b>OAlp para a direita</b> e a demanda cresce ainda mais (<b>DA para a direita</b>). No longo prazo: Y maior e P maior. Se a DA andasse menos que a OAlp, os preços poderiam até cair — depende da intensidade (Q20).' }
  };
  el.innerHTML = `
  <div class="lab"><h3>📊 Deslocando a DA e a OAlp</h3><p class="muted">Identifique qual curva cada evento desloca. O ponto B é o novo equilíbrio de curto prazo (no crescimento, de longo prazo).</p>
    <div class="btns" id="o1Btns">${Object.entries(SC).map(([k, v]) => `<button class="btn sm ${k === 'reset' ? 'on' : ''}" data-sc="${k}">${v.b}</button>`).join('')}</div>
    <div class="lab-grid"><div id="o1Chart"></div><div><div class="readout" id="o1Ro"></div><div class="explain" id="o1Txt"></div></div></div>
  </div>`;
  const draw = p => {
    const e = ADAS(p), e0 = ADAS(A), moved = !near(e.Y, e0.Y) || !near(e.P, e0.P);
    const pts = moved ? [{ x: e0.Y, y: e0.P, lab: 'A', cls: 'old' }, { x: e.Y, y: e.P, lab: 'B' }] : [{ x: e.Y, y: e.P, lab: 'A' }];
    $('#o1Chart', el).innerHTML = adasChart(p, A, pts);
    $('#o1Ro', el).innerHTML = `<div><small>PIB real Y</small><b>${fmt(e.Y * 20, 0)}</b>${arrow(e.Y, e0.Y)}</div><div><small>Preços P</small><b>${fmt(e.P * 20, 0)}</b>${arrow(e.P, e0.P)}</div><div><small>Y<sub>N</sub></small><b>${fmt(p.YN * 20, 0)}</b>${arrow(p.YN, A.YN)}</div>`;
  };
  const pick = k => {
    $$('#o1Btns .btn', el).forEach(b => b.classList.toggle('on', b.dataset.sc === k));
    $('#o1Txt', el).innerHTML = `<p><b>${SC[k].t}</b></p><p>${SC[k].x}</p>`;
    tween('o1', cur, SC[k].p, p => { cur = p; draw(p); });
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-sc]'); if (b) pick(b.dataset.sc); });
  draw(cur); pick('reset');
};
LAB.oada2 = el => {
  const A = Object.assign({}, A0);
  const SCN = {
    queda: { b: 'Queda da demanda (crash)', steps: [
      { p: A, t: 'A · Ponto de partida', x: 'Economia no longo prazo: Y = Y<sub>N</sub>, P = P<sub>E</sub>.' },
      { p: Object.assign({}, A, { d: -2 }), t: 'B · Curto prazo', x: 'Passos 1–3: o crash reduz C → <b>DA ←</b>. Novo equilíbrio de curto prazo em B: <b>P ↓, Y ↓</b>, desemprego ↑.' },
      { p: Object.assign({}, A, { d: -2, PE: 3 }), t: 'C · Longo prazo', x: 'Passo 4: com o tempo as pessoas esperam preços menores (<b>P<sub>E</sub> ↓</b>) → <b>OAcp →</b>. Em C: Y volta a Y<sub>N</sub> e o desemprego ao natural, com <b>P mais baixo</b>.' }] },
    alta: { b: 'Aumento da demanda (2ª Guerra)', steps: [
      { p: A, t: 'A · Ponto de partida', x: 'Economia no longo prazo.' },
      { p: Object.assign({}, A, { d: 2 }), t: 'B · Curto prazo', x: 'G dispara → <b>DA →</b>. Em B: <b>Y ↑ e P ↑</b>, desemprego despenca.' },
      { p: Object.assign({}, A, { d: 2, PE: 7 }), t: 'C · Longo prazo', x: 'As expectativas sobem (<b>P<sub>E</sub> ↑</b>) → <b>OAcp ←</b>. Em C: Y volta a Y<sub>N</sub>, com <b>P mais alto</b>.' }] },
    oferta: { b: 'Choque do petróleo — sem intervenção', steps: [
      { p: A, t: 'A · Ponto de partida', x: 'Economia no longo prazo.' },
      { p: Object.assign({}, A, { c: 2 }), t: 'B · Curto prazo: estagflação', x: 'Custos sobem → <b>OAcp ←</b>. Em B: <b>P ↑ e Y ↓</b> ao mesmo tempo = <b>estagflação</b>.' },
      { p: A, t: 'A · Longo prazo sem intervenção', x: 'O desemprego alto derruba os salários → custos caem → <b>OAcp volta para a direita</b>. A economia retorna a A (mesmo P e mesmo Y), mas depois de uma recessão.' }] },
    acomoda: { b: 'Choque do petróleo — com acomodação', steps: [
      { p: A, t: 'A · Ponto de partida', x: 'Economia no longo prazo.' },
      { p: Object.assign({}, A, { c: 2 }), t: 'B · Curto prazo: estagflação', x: '<b>OAcp ←</b>: P ↑ e Y ↓.' },
      { p: Object.assign({}, A, { c: 2, d: 2 }), t: 'C · Política acomoda o choque', x: 'O governo aumenta a demanda (<b>DA →</b>) para recuperar o emprego. Em C: <b>Y volta a Y<sub>N</sub></b>, mas <b>P fica permanentemente mais alto</b>. Esse é o custo da acomodação.' }] }
  };
  let sc = 'queda', step = 0, cur = Object.assign({}, A);
  el.innerHTML = `
  <div class="lab"><h3>🎬 Os 4 passos, animados</h3><p class="muted">Escolha o choque e avance pelos passos: choque → curto prazo → longo prazo.</p>
    <div class="btns" id="o2Sc">${Object.entries(SCN).map(([k, v]) => `<button class="btn sm ${k === sc ? 'on' : ''}" data-sc="${k}">${v.b}</button>`).join('')}</div>
    <div class="steps" id="o2St"></div>
    <div class="lab-grid"><div id="o2Chart"></div><div><div class="readout" id="o2Ro"></div><div class="explain" id="o2Txt"></div>
      <div class="btns"><button class="btn sm" id="o2Prev">← Voltar</button><button class="btn sm pri" id="o2Next">Próximo passo →</button></div></div></div>
  </div>
  <div class="lab"><h3>🧮 Equação da oferta agregada</h3><p class="muted">Y = Y<sub>N</sub> + a (P − P<sub>E</sub>). Valores iniciais: Questão 4.</p>
    <div class="fields">
      <label class="field">Y<sub>N</sub> = <b id="eqYNv"></b><input type="range" id="eqYN" min="500" max="1500" step="50" value="1000"></label>
      <label class="field">a = <b id="eqav"></b><input type="range" id="eqa" min="0" max="10" step="0.5" value="4"></label>
      <label class="field">P = <b id="eqPv"></b><input type="range" id="eqP" min="50" max="150" step="1" value="110"></label>
      <label class="field">P<sub>E</sub> = <b id="eqPEv"></b><input type="range" id="eqPE" min="50" max="150" step="1" value="100"></label>
    </div>
    <div class="explain" id="eqOut"></div>
  </div>`;
  const draw = p => {
    const steps = SCN[sc].steps;
    const pts = [];
    for (let k = 0; k <= step; k++) {
      const q = k === step ? p : steps[k].p, e = ADAS(q);
      const dup = pts.find(x => near(x.x, e.Y) && near(x.y, e.P));
      const label = k === 0 ? 'A' : (step === k && sc === 'oferta' && k === 2 ? 'A' : 'ABC'[k]);
      if (dup) { if (!dup.lab.includes(label)) dup.lab += ' = ' + label; continue; }
      pts.push({ x: e.Y, y: e.P, lab: label, cls: k < step ? 'old' : '' });
    }
    $('#o2Chart', el).innerHTML = adasChart(p, step > 0 ? steps[step - 1].p : null, pts);
    const e = ADAS(p), e0 = ADAS(A);
    $('#o2Ro', el).innerHTML = `<div><small>PIB real Y</small><b>${fmt(e.Y * 20, 0)}</b>${arrow(e.Y, e0.Y)}</div><div><small>Preços P</small><b>${fmt(e.P * 20, 0)}</b>${arrow(e.P, e0.P)}</div><div><small>P esperado</small><b>${fmt(p.PE * 20, 0)}</b>${arrow(p.PE, A.PE)}</div>`;
  };
  const go = (k, animate = true) => {
    const steps = SCN[sc].steps; step = Math.max(0, Math.min(steps.length - 1, k));
    $('#o2St', el).innerHTML = steps.map((s, i) => `<button data-st="${i}" class="${i === step ? 'on' : ''}">${s.t.split(' · ')[0] === 'A' && i > 0 ? 'A' : 'ABC'[i]} · ${s.t.split(' · ')[1]}</button>`).join('');
    $('#o2Txt', el).innerHTML = `<p><b>${steps[step].t}</b></p><p>${steps[step].x}</p>`;
    $('#o2Prev', el).disabled = step === 0; $('#o2Next', el).disabled = step === steps.length - 1;
    if (animate) tween('o2', cur, steps[step].p, p => { cur = p; draw(p); }); else { cur = Object.assign({}, steps[step].p); draw(cur); }
  };
  const eq = () => {
    const g = id => +$('#' + id, el).value;
    const YN = g('eqYN'), a = g('eqa'), P = g('eqP'), PE = g('eqPE'), Y = YN + a * (P - PE);
    $('#eqYNv', el).textContent = YN; $('#eqav', el).textContent = fmt(a, 1); $('#eqPv', el).textContent = P; $('#eqPEv', el).textContent = PE;
    $('#eqOut', el).innerHTML = `<p class="result">Y = ${YN} + ${fmt(a, 1)} × (${P} − ${PE}) = <b>${fmt(Y, 0)}</b></p><p>${P > PE ? 'Preços <b>acima</b> do esperado → Y <b>acima</b> de Y<sub>N</sub> (rigidez salarial, preços rígidos, percepções equivocadas).' : P < PE ? 'Preços <b>abaixo</b> do esperado → Y <b>abaixo</b> de Y<sub>N</sub>.' : 'P = P<sub>E</sub> → <b>Y = Y<sub>N</sub></b>: equilíbrio de longo prazo.'}</p>`;
  };
  el.addEventListener('click', e => {
    const s = e.target.closest('[data-sc]'); if (s) { sc = s.dataset.sc; $$('#o2Sc .btn', el).forEach(b => b.classList.toggle('on', b === s)); go(0); return; }
    const st = e.target.closest('[data-st]'); if (st) { go(+st.dataset.st); return; }
    if (e.target.id === 'o2Next') go(step + 1);
    if (e.target.id === 'o2Prev') go(step - 1);
  });
  el.addEventListener('input', e => { if (e.target.id && e.target.id.startsWith('eq')) eq(); });
  go(0, false); eq();
};

/* ---------- Aula 7.2: debates e estudo empírico ---------- */
const DEB = [
  ['Estabilizar a economia?', 'Sim', 'Não'], ['Combater recessão com…', 'Mais gastos (G)', 'Corte de impostos'], ['Política monetária por…', 'Regra', 'Discrição'],
  ['Meta de inflação zero?', 'Sim', 'Não'], ['Equilibrar o orçamento?', 'Sim', 'Não'], ['Reformar impostos para estimular a poupança?', 'Sim', 'Não']
];
const DEB_GAME = [
  [0, 'a', 'Deixadas por conta própria, as economias flutuam; uma economia mais estável beneficia todos.'],
  [0, 'b', 'Os choques são imprevisíveis e as previsões imprecisas: a política pode fazer efeito tarde demais.'],
  [1, 'a', 'Parte de um corte de impostos é poupada, mas o gasto público entra inteiro na demanda.'],
  [1, 'b', 'Aumentos rápidos de gasto podem financiar “pontes para lugar nenhum” e exigir impostos futuros.'],
  [1, 'b', 'Pode aumentar a oferta agregada, elevando o incentivo a trabalhar e produzir.'],
  [2, 'a', 'Evita o ciclo de negócios políticos e a inconsistência temporal.'],
  [2, 'b', 'Dá flexibilidade para reagir a acontecimentos imprevistos.'],
  [2, 'b', 'É difícil especificar regras precisas e saber qual seria a melhor.'],
  [3, 'a', 'Os custos da transição são temporários; os benefícios da estabilidade, permanentes.'],
  [3, 'b', 'Estima-se sacrificar 5% do PIB de um ano por ponto de inflação reduzido.'],
  [3, 'b', 'Uma indexação mais difundida reduziria parte dos custos da inflação.'],
  [4, 'a', 'A dívida é um fardo para as gerações futuras e expulsa investimento privado.'],
  [4, 'b', 'Cortar gastos com educação para reduzir o déficit prejudica o capital humano.'],
  [4, 'b', 'O que importa é a relação dívida/renda, não o tamanho da dívida em si.'],
  [5, 'a', 'Pessoas respondem a incentivos; alíquotas altas reduzem o retorno da poupança.'],
  [5, 'b', 'Impostos sobre consumo são regressivos e a reforma beneficiaria principalmente os ricos.']
];
function regimesSVG() {
  const W = 680, H = 300, n = REGIMES.length, bw = (W - 60) / n, Y = r => 118 - r * 82;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" style="max-width:720px" role="img" aria-label="Correlação móvel entre hiato e despesa por período">
    <text class="tick" x="8" y="${Y(0.9)}">+</text><text class="tick" x="8" y="${Y(-0.9)}">−</text>
    <text class="tick" x="40" y="${Y(0.95) - 4}" fill="var(--c4)">pró-cíclica (amplifica o ciclo)</text>
    <text class="tick" x="40" y="${Y(-0.95) + 30}">contracíclica (amortece o ciclo)</text>
    <line class="ax" x1="30" y1="${Y(0)}" x2="${W - 10}" y2="${Y(0)}"/>
    ${REGIMES.map((g, k) => {
      const x = 40 + k * bw, y = Math.min(Y(0), Y(g.r)), h = Math.abs(Y(g.r) - Y(0));
      const col = g.r >= 0 ? 'var(--c4)' : 'var(--c1)';
      return `<g><title>${g.p} · ${g.gov}: ${g.txt}</title>
        <rect class="bar" x="${x}" y="${y}" width="${bw - 14}" height="${Math.max(h, 2)}" fill="${col}" opacity="${g.aprox ? 0.45 : 0.95}"/>
        <text class="ptl" x="${x + (bw - 14) / 2}" y="${g.r >= 0 ? y - 6 : y + h + 15}" text-anchor="middle">${g.aprox ? '≈ 0' : (g.r > 0 ? '+' : '−') + fmt(Math.abs(g.r), 2)}</text>
        <text class="tick" x="${x + (bw - 14) / 2}" y="${H - 26}" text-anchor="middle">${g.p}</text>
        <text class="tick" x="${x + (bw - 14) / 2}" y="${H - 11}" text-anchor="middle" font-size="9">${g.gov}</text></g>`;
    }).join('')}
  </svg><p class="note">Barras claras = períodos “quase acíclicos” (o estudo não informa o valor). Nos períodos com faixa (ex.: +0,65 a +0,71) a barra mostra o meio da faixa.</p>`;
}
LAB.debates = el => {
  let order = shuffle(DEB_GAME.map((_, i) => i)); const game = {};
  el.innerHTML = `
  <div class="lab"><h3>⚖️ A favor ou contra?</h3><p class="muted">A prova cobra de que lado está cada argumento. Classifique.</p>
    <div id="dbScore" class="note"></div><div id="dbGame"></div><div class="btns"><button class="btn sm" id="dbReset">Embaralhar e recomeçar</button></div>
  </div>
  <div class="lab"><h3>💸 Gasto público × corte de impostos (efeito direto)</h3>
    <label class="field">Fração do corte de impostos que as famílias gastam (PMgC): <b id="pmV"></b><input type="range" id="pm" min="0" max="100" step="5" value="60"></label>
    <div class="lab-grid"><div id="pmChart"></div><div class="explain" id="pmTxt"></div></div>
  </div>
  <div class="lab"><h3>📉 Custo de levar a inflação à meta (taxa de sacrifício)</h3>
    <div class="fields">
      <label class="field">Inflação atual (%)<input type="number" id="sa1" value="4" step="0.5"></label>
      <label class="field">Meta (%)<input type="number" id="sa2" value="2" step="0.5"></label>
      <label class="field">Custo por ponto (% do PIB)<input type="number" id="sa3" value="5" step="0.5"></label>
    </div>
    <div class="explain" id="saOut"></div>
  </div>
  <div class="lab"><h3>⏳ Por que defasagens preocupam</h3><div style="max-width:520px;margin:0 auto">${defasagemSVG()}</div>
    <div class="explain"><p>A recessão já acabou quando o estímulo faz efeito: a atividade passa da tendência e a oscilação aumenta. Isso <b>ilustra um risco</b>; não prova que toda política ativa fracassa (Q3).</p></div>
  </div>
  <div class="lab"><h3>📊 Estudo empírico: correlação móvel hiato × despesa</h3>${regimesSVG()}</div>`;
  const drawGame = () => {
    const n = Object.keys(game).length, ok = Object.entries(game).filter(([i, v]) => v === DEB_GAME[i][1]).length;
    $('#dbScore', el).textContent = n ? `${ok} de ${n} certas · faltam ${DEB_GAME.length - n}` : `${DEB_GAME.length} argumentos`;
    $('#dbGame', el).innerHTML = order.map(i => {
      const [d, side, txt] = DEB_GAME[i], g = game[i], D = DEB[d];
      const b = (k, l) => { let c = ''; if (g !== undefined) { if (k === side) c = 'right'; else if (k === g) c = 'wrong'; } return `<button data-db="${i}" data-k="${k}" class="${c}" ${g !== undefined ? 'disabled' : ''}>${l}</button>`; };
      return `<div class="game-item"><span><small class="q-tag" style="--a:#2dd4bf">${d + 1}. ${D[0]}</small><br>${txt}</span><div class="gbtns">${b('a', D[1])}${b('b', D[2])}</div>${g !== undefined ? `<div class="gexp">${g === side ? '✅ Certo' : '❌ É argumento de “' + (side === 'a' ? D[1] : D[2]) + '”'}</div>` : ''}</div>`;
    }).join('');
  };
  const drawPm = () => {
    const v = +$('#pm', el).value / 100; $('#pmV', el).textContent = fmt(v * 100, 0) + '%';
    $('#pmChart', el).innerHTML = gVsTSVG(v);
    $('#pmTxt', el).innerHTML = `<p><b>R$ 100 de G</b> entram inteiros na demanda. <b>R$ 100 de corte de impostos</b> viram R$ ${fmt(v * 100, 0)} de consumo; R$ ${fmt(100 - v * 100, 0)} são poupados.</p><p class="muted">Esse é o efeito <b>direto</b>, antes do multiplicador (Q5). O argumento a favor dos cortes é outro: incentivos a trabalhar, investir e produzir (oferta).</p>`;
  };
  const drawSa = () => {
    const a = parseFloat($('#sa1', el).value) || 0, b = parseFloat($('#sa2', el).value) || 0, c = parseFloat($('#sa3', el).value) || 0;
    const pts = Math.max(0, a - b), cost = pts * c;
    $('#saOut', el).innerHTML = `<p class="result">${fmt(pts, 1)} ponto(s) × ${fmt(c, 1)}% = <b>${fmt(cost, 1)}% do PIB de um ano</b></p><p class="muted">No PIB brasileiro de 2023 (≈ R$ 10,86 tri), isso seria ≈ <b>R$ ${fmt(10.86 * cost / 100, 2)} tri</b>. É uma estimativa citada no debate, não uma previsão universal.</p>`;
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-db]'); if (b) { game[b.dataset.db] = b.dataset.k; drawGame(); return; }
    if (e.target.id === 'dbReset') { for (const k in game) delete game[k]; order = shuffle(order); drawGame(); }
  });
  el.addEventListener('input', e => { if (e.target.id === 'pm') drawPm(); if (e.target.id && e.target.id.startsWith('sa')) drawSa(); });
  drawGame(); drawPm(); drawSa();
};

/* =====================================================================
   FLASHCARDS
   ===================================================================== */
const fc = { key: null, deck: [], i: 0, flip: false, only: false };
function buildDeck(mi) {
  const out = [];
  MODS.forEach((m, i) => { if (mi !== undefined && i !== mi) return; m.cards.forEach((c, j) => out.push({ mi: i, ci: j })); });
  return out;
}
function renderCards(el, mi) {
  const key = 'd' + (mi === undefined ? 'all' : mi);
  if (fc.key !== key) { fc.key = key; fc.deck = buildDeck(mi); fc.i = 0; fc.flip = false; }
  const list = fc.only ? fc.deck.filter(c => !known[c.mi + '-' + c.ci]) : fc.deck;
  const kn = fc.deck.filter(c => known[c.mi + '-' + c.ci]).length;
  if (fc.i >= list.length) fc.i = 0;
  const c = list[fc.i];
  const m = c ? MODS[c.mi] : null, card = c ? m.cards[c.ci] : null;
  el.innerHTML = `<div class="fc-wrap">
    <div class="toolbar"><span class="note">${kn} de ${fc.deck.length} marcados como “sei” · <span class="kbd">espaço</span> vira · <span class="kbd">←</span><span class="kbd">→</span> navega</span>
      <div class="seg"><button data-act="fc-only" data-v="0" class="${!fc.only ? 'on' : ''}">Todos</button><button data-act="fc-only" data-v="1" class="${fc.only ? 'on' : ''}">Só os que não sei</button></div></div>
    <div class="pbar"><i style="width:${pct(kn, fc.deck.length)}%"></i></div>
    ${c ? `<div class="fc ${fc.flip ? 'flip' : ''}" data-act="fc-flip" style="--a:${m.cor}" role="button" tabindex="0" aria-label="Virar cartão">
      <div class="fc-in"><div class="fc-f"><small>${m.id} · ${fc.i + 1}/${list.length}</small>${esc(card[0])}<span class="hint">clique para ver a resposta</span></div>
      <div class="fc-b"><small>${m.id}</small>${esc(card[1])}</div></div></div>
    <div class="fc-ctl"><button class="btn" data-act="fc-prev">← Anterior</button>
      <div class="btns" style="margin:0"><button class="btn" data-act="fc-mark" data-v="0">🔁 Ainda não sei</button><button class="btn pri" data-act="fc-mark" data-v="1">✓ Já sei</button></div>
      <button class="btn" data-act="fc-next">Próximo →</button></div>
    <div class="btns" style="justify-content:center"><button class="btn sm" data-act="fc-shuffle">Embaralhar</button><button class="btn sm" data-act="fc-clear">Zerar marcações deste baralho</button></div>`
    : `<div class="empty">🎉 Você marcou todos os cartões como “sei”.<br><br><button class="btn" data-act="fc-only" data-v="0">Ver todos</button></div>`}
  </div>`;
}
function fcAct(act, v, el, mi) {
  const list = fc.only ? fc.deck.filter(c => !known[c.mi + '-' + c.ci]) : fc.deck;
  if (act === 'fc-flip') fc.flip = !fc.flip;
  if (act === 'fc-next') { fc.i = (fc.i + 1) % Math.max(1, list.length); fc.flip = false; }
  if (act === 'fc-prev') { fc.i = (fc.i - 1 + list.length) % Math.max(1, list.length); fc.flip = false; }
  if (act === 'fc-only') { fc.only = v === '1'; fc.i = 0; fc.flip = false; }
  if (act === 'fc-shuffle') { fc.deck = shuffle(fc.deck); fc.i = 0; fc.flip = false; }
  if (act === 'fc-clear') { fc.deck.forEach(c => delete known[c.mi + '-' + c.ci]); LS.set('macro_ita_cards', known); }
  if (act === 'fc-mark') {
    const c = list[fc.i]; if (!c) return;
    if (v === '1') known[c.mi + '-' + c.ci] = 1; else delete known[c.mi + '-' + c.ci];
    LS.set('macro_ita_cards', known); fc.flip = false;
    if (!(fc.only && v === '1')) fc.i = (fc.i + 1) % Math.max(1, list.length);
  }
  renderCards(el, mi);
}

/* =====================================================================
   SIMULADO
   ===================================================================== */
let sim = LS.get('macro_ita_sim', null);
const simCfg = { mods: MODS.map((_, i) => i), n: 20, timer: true };
let simTick = null, simConfirm = false;
function saveSim() { LS.set('macro_ita_sim', sim); }
function startSim(pool) {
  let qs = pool;
  if (!qs) {
    const all = []; simCfg.mods.forEach(mi => MODS[mi].qs.forEach((_, qi) => all.push([mi, qi])));
    qs = shuffle(all).slice(0, simCfg.n === 'all' ? all.length : simCfg.n);
  }
  if (!qs.length) return;
  sim = { qs, ans: {}, cur: 0, t0: Date.now(), done: false, timer: simCfg.timer };
  simConfirm = false; saveSim(); render();
}
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function renderSim(el) {
  clearInterval(simTick);
  if (!sim) {
    const hist = LS.get('macro_ita_sim_hist', []);
    el.innerHTML = `<div class="lab"><h3>📝 Monte seu simulado</h3><p class="muted">Questões sorteadas, sem gabarito durante a prova. No fim você vê a nota, o desempenho por aula e a correção comentada. Não altera o progresso das listas.</p>
      <h4 class="h2" style="margin-top:8px">Aulas</h4>
      <div class="chips">${MODS.map((m, i) => `<button class="chip ${simCfg.mods.includes(i) ? 'on' : ''}" style="--a:${m.cor}" data-act="sim-mod" data-v="${i}">${m.id}</button>`).join('')}
        <button class="chip" data-act="sim-all">Todas</button></div>
      <h4 class="h2">Quantidade</h4>
      <div class="seg">${[10, 20, 30, 'all'].map(n => `<button data-act="sim-n" data-v="${n}" class="${simCfg.n == n ? 'on' : ''}">${n === 'all' ? 'Todas' : n}</button>`).join('')}</div>
      <h4 class="h2">Cronômetro</h4>
      <div class="seg"><button data-act="sim-timer" data-v="1" class="${simCfg.timer ? 'on' : ''}">Ligado</button><button data-act="sim-timer" data-v="0" class="${!simCfg.timer ? 'on' : ''}">Desligado</button></div>
      <div class="btns" style="margin-top:18px"><button class="btn pri" data-act="sim-start" ${simCfg.mods.length ? '' : 'disabled'}>Começar simulado →</button></div>
      <p class="note">Atalhos: <span class="kbd">A</span>–<span class="kbd">E</span> responde · <span class="kbd">←</span><span class="kbd">→</span> navega.</p>
    </div>
    ${hist.length ? `<div class="lab"><h3>Histórico</h3><table class="t sm"><thead><tr><th>Data</th><th>Nota</th><th>Acertos</th><th>Tempo</th></tr></thead><tbody>${hist.slice(-8).reverse().map(h => `<tr><td>${new Date(h.d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td><td><b>${pct(h.ok, h.n)}%</b></td><td>${h.ok}/${h.n}</td><td>${mmss(h.s)}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
    return;
  }
  if (sim.done) return renderSimResult(el);
  const n = sim.qs.length, [mi, qi] = sim.qs[sim.cur], m = MODS[mi], q = m.qs[qi], sel = sim.ans[sim.cur];
  const answered = Object.keys(sim.ans).length;
  const fig = FIGS[m.id + '|' + qi];
  el.innerHTML = `<div class="simbar"><b>Questão ${sim.cur + 1} de ${n}</b><span class="note">${answered} respondidas</span>${sim.timer ? `<b id="simClock">⏱ ${mmss((Date.now() - sim.t0) / 1000)}</b>` : ''}
      <span><button class="btn sm" data-act="sim-quit">Abandonar</button> <button class="btn sm pri" data-act="sim-finish">${simConfirm ? `Confirmar (faltam ${n - answered})` : 'Finalizar'}</button></span></div>
    <div class="palette">${sim.qs.map((_, k) => `<button data-act="sim-go" data-v="${k}" class="${sim.ans[k] !== undefined ? 'ans' : ''} ${k === sim.cur ? 'cur' : ''}">${k + 1}</button>`).join('')}</div>
    <article class="q" style="--a:${m.cor}"><div class="q-h"><span class="q-tag">${m.id} · Questão ${qi + 1} da lista</span></div>
      <p class="q-txt">${esc(q.q)}</p>${fig && fig.when === 'before' ? `<figure class="qfig"><figcaption>${fig.cap}</figcaption>${fig.svg()}</figure>` : ''}
      <div class="opts">${q.o.map((o, k) => `<button class="opt ${sel === k ? 'sel' : ''}" data-act="sim-ans" data-v="${k}">${esc(o)}</button>`).join('')}</div></article>
    <div class="pager"><button class="btn" data-act="sim-go" data-v="${sim.cur - 1}" ${sim.cur === 0 ? 'disabled' : ''}>← Anterior</button><button class="btn" data-act="sim-go" data-v="${sim.cur + 1}" ${sim.cur === n - 1 ? 'disabled' : ''}>Próxima →</button></div>`;
  if (sim.timer) simTick = setInterval(() => { const c = $('#simClock'); if (c) c.textContent = '⏱ ' + mmss((Date.now() - sim.t0) / 1000); else clearInterval(simTick); }, 1000);
}
function finishSim() {
  sim.done = true; sim.t1 = Date.now();
  const ok = sim.qs.filter(([mi, qi], k) => sim.ans[k] === MODS[mi].qs[qi].c).length;
  const hist = LS.get('macro_ita_sim_hist', []); hist.push({ d: Date.now(), ok, n: sim.qs.length, s: Math.round((sim.t1 - sim.t0) / 1000) }); LS.set('macro_ita_sim_hist', hist.slice(-30));
  saveSim(); render();
}
function renderSimResult(el) {
  const n = sim.qs.length, res = sim.qs.map(([mi, qi], k) => ({ mi, qi, k, a: sim.ans[k], ok: sim.ans[k] === MODS[mi].qs[qi].c }));
  const ok = res.filter(r => r.ok).length, sec = Math.round(((sim.t1 || Date.now()) - sim.t0) / 1000);
  const by = {}; res.forEach(r => { by[r.mi] = by[r.mi] || { n: 0, ok: 0 }; by[r.mi].n++; if (r.ok) by[r.mi].ok++; });
  const wrong = res.filter(r => !r.ok);
  el.innerHTML = `<div class="lab"><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <div><div class="big-score" style="color:${pct(ok, n) >= 70 ? 'var(--ok)' : pct(ok, n) >= 50 ? 'var(--warn)' : 'var(--no)'}">${pct(ok, n)}%</div><div class="note">${ok} de ${n} certas · ${mmss(sec)} (${mmss(sec / n)} por questão)</div></div>
      <div style="flex:1;min-width:240px" class="hbars">${Object.entries(by).map(([mi, v]) => `<div class="hbar" style="--a:${MODS[mi].cor}"><span>${MODS[mi].id}</span><span class="tr"><i style="width:${pct(v.ok, v.n)}%;background:var(--a)"></i></span><span class="v">${v.ok}/${v.n}</span></div>`).join('')}</div>
    </div>
    <div class="btns" style="margin-top:14px"><button class="btn pri" data-act="sim-new">Novo simulado</button>${wrong.length ? `<button class="btn" data-act="sim-redo">Refazer só as ${wrong.length} erradas</button>` : ''}</div></div>
    <h4 class="h2">Correção</h4>
    ${res.map(r => { const m = MODS[r.mi], q = m.qs[r.qi]; return `<details class="rev" ${r.ok ? '' : 'open'} style="--a:${m.cor}"><summary>${r.ok ? '✅' : r.a === undefined ? '⬜' : '❌'} ${r.k + 1}. <span class="q-tag">${m.id} · Q${r.qi + 1}</span> ${q.q.length > 90 && !q.q.includes('\\(') ? esc(q.q.slice(0, 90)) + '…' : esc(q.q)}</summary>
      ${q.q.length > 90 && !q.q.includes('\\(') ? `<p>${esc(q.q)}</p>` : ''}<p>Sua resposta: <b class="${r.ok ? 'ok' : 'no'}">${r.a === undefined ? 'em branco' : esc(q.o[r.a])}</b></p>${r.ok ? '' : `<p>Correta: <b class="ok">${esc(q.o[q.c])}</b></p>`}<p class="muted">${esc(q.e)}</p></details>`; }).join('')}`;
}
function simAct(act, v) {
  if (act === 'sim-mod') { const i = +v; simCfg.mods = simCfg.mods.includes(i) ? simCfg.mods.filter(x => x !== i) : simCfg.mods.concat(i).sort(); }
  if (act === 'sim-all') simCfg.mods = simCfg.mods.length === MODS.length ? [] : MODS.map((_, i) => i);
  if (act === 'sim-n') simCfg.n = v === 'all' ? 'all' : +v;
  if (act === 'sim-timer') simCfg.timer = v === '1';
  if (act === 'sim-start') return startSim();
  if (act === 'sim-ans') { sim.ans[sim.cur] = +v; simConfirm = false; saveSim(); }
  if (act === 'sim-go') { const k = +v; if (k >= 0 && k < sim.qs.length) sim.cur = k; saveSim(); }
  if (act === 'sim-finish') { const left = sim.qs.length - Object.keys(sim.ans).length; if (left && !simConfirm) { simConfirm = true; } else return finishSim(); }
  if (act === 'sim-quit') { sim = null; saveSim(); }
  if (act === 'sim-new') { sim = null; saveSim(); }
  if (act === 'sim-redo') { const pool = sim.qs.filter(([mi, qi], k) => sim.ans[k] !== MODS[mi].qs[qi].c); return startSim(shuffle(pool)); }
  render();
}

/* =====================================================================
   VIEWS
   ===================================================================== */
function viewHome(el) {
  const s = stats();
  const weak = MODS.map((m, i) => ({ m, i, st: stats(i) })).filter(x => x.st.ans >= 5).sort((a, b) => a.st.ok / a.st.ans - b.st.ok / b.st.ans)[0];
  const next = MODS.map((m, i) => ({ m, i, st: stats(i) })).find(x => x.st.ans < x.st.tot);
  el.innerHTML = `<div class="hero"><h2>Estudo de Macroeconomia</h2><p>Aulas 1 a 7.2 (Mankiw, caps. 23–36) + estudo empírico da ciclicidade fiscal. Resumos, laboratórios interativos, flashcards e as ${TOTAL} questões das listas com gabarito comentado.</p>
    <div class="stats"><div class="stat"><small>Respondidas</small><b>${s.ans}/${s.tot}</b></div><div class="stat"><small>Acerto</small><b>${pct(s.ok, s.ans)}%</b></div><div class="stat"><small>Erros para revisar</small><b>${s.bad}</b></div><div class="stat"><small>Flashcards “sei”</small><b>${Object.keys(known).length}/${MODS.reduce((a, m) => a + m.cards.length, 0)}</b></div></div>
    <div class="btns" style="margin-top:16px">${next ? `<a class="btn pri" href="#/aula/${next.i}/${next.st.ans ? 'questoes' : 'resumo'}">${next.st.ans ? 'Continuar' : 'Começar'}: ${next.m.id} →</a>` : '<a class="btn pri" href="#/simulado">Fazer um simulado →</a>'}${s.bad ? `<a class="btn" href="#/erros">Revisar ${s.bad} erro(s)</a>` : ''}${weak ? `<a class="btn" href="#/aula/${weak.i}/resumo">Ponto fraco: ${weak.m.id} (${pct(weak.st.ok, weak.st.ans)}%)</a>` : ''}</div></div>
  <h3 class="h2">Roteiro sugerido para cada aula</h3>
  <ol class="how"><li><b>Resumo</b>: leia o “Em uma frase” e as pegadinhas.</li><li><b>Laboratório</b>: mexa nos gráficos até prever o resultado antes de clicar.</li><li><b>Flashcards</b>: definições e fórmulas na ponta da língua.</li><li><b>Lista</b>: resolva e leia o comentário de cada erro.</li><li><b>Simulado</b>: misture aulas, com cronômetro.</li></ol>
  <h3 class="h2">Aulas</h3>
  <div class="acards">${MODS.map((m, i) => { const st = stats(i); return `<div class="acard" style="--a:${m.cor}"><b class="id">${m.id} · ${m.cap}</b><h4>${m.titulo}</h4><p>${m.tema}</p>
    <div class="pbar"><i style="width:${pct(st.ok, st.tot)}%"></i><i class="bad" style="width:${pct(st.bad, st.tot)}%"></i></div><span class="note">${st.ok} certas · ${st.bad} erradas · ${st.tot - st.ans} por fazer</span>
    <div class="links"><a class="btn sm" href="#/aula/${i}/resumo">📖 Resumo</a><a class="btn sm" href="#/aula/${i}/lab">🧪 Lab</a><a class="btn sm" href="#/aula/${i}/questoes">🎯 ${st.tot}</a></div></div>`; }).join('')}</div>`;
}
function viewFormulas(el) {
  el.innerHTML = `<p class="muted">Todas as fórmulas das aulas. Clique numa aula para ver o resumo completo.</p><div class="fgrid">${FORMULAS.map(([a, n, f, nt]) => { const m = MODS.find(x => x.id === a); return `<div class="fitem" style="--a:${m.cor}"><small><a href="#/aula/${m.idx}/resumo" style="color:inherit">${a}</a></small><b>${n}</b><span class="f">${esc(f)}</span>${nt ? `<span>${esc(nt)}</span>` : ''}</div>`; }).join('')}</div>`;
}
function viewTraps(el) {
  el.innerHTML = MODS.map(m => `<section class="sec" style="--a:${m.cor}"><h3><span class="n">${m.id.replace('Aula ', '')}</span> ${m.titulo}</h3><ul class="traps">${m.pegadinhas.map(p => `<li>${esc(p)}</li>`).join('')}</ul></section>`).join('');
}
function viewAula(el, mi, tab) {
  const m = MODS[mi];
  if (tab === 'resumo') {
    el.innerHTML = m.resumo + `<section class="sec"><h3>⚠️ Pegadinhas desta aula</h3><ul class="traps">${m.pegadinhas.map(p => `<li>${esc(p)}</li>`).join('')}</ul></section>
      <div class="pager"><a class="btn" href="#/aula/${mi}/lab">🧪 Ir para o laboratório</a><a class="btn pri" href="#/aula/${mi}/questoes">🎯 Resolver as ${m.qs.length} questões →</a></div>`;
    $$('.bars', el).forEach(b => {
      const data = JSON.parse(b.dataset.bars), mx = Math.max(...data.map(d => Math.abs(d[1])));
      b.className = 'hbars';
      b.innerHTML = data.map(([l, v, c]) => `<div class="hbar"><span>${l}</span><span class="tr"><i style="width:${100 * Math.abs(v) / mx}%;background:${c === 'neg' ? 'var(--no)' : 'var(--' + c + ')'}"></i></span><span class="v">${v < 0 ? '−' : ''}${fmt(Math.abs(v), 1)}%</span></div>`).join('') + '<p class="note">C + G + I + X − M = 63,3 + 18,2 + 16,1 + 18,1 − 15,7 = 100%</p>';
    });
    const rc = $('#regimes-chart', el); if (rc) rc.innerHTML = regimesSVG();
  } else if (tab === 'lab') {
    el.innerHTML = '<div id="labRoot"></div>' + `<div class="pager"><a class="btn" href="#/aula/${mi}/resumo">← Resumo</a><a class="btn pri" href="#/aula/${mi}/questoes">🎯 Questões →</a></div>`;
    LAB[m.lab]($('#labRoot', el));
  } else if (tab === 'cards') {
    renderCards(el, mi);
  } else {
    const list = m.qs.map((_, qi) => [mi, qi]);
    const nxt = MODS[mi + 1];
    el.innerHTML = toolbar() + `<div id="qlist">${renderQuestionList(list)}</div>
      <div class="pager"><a class="btn" href="#/aula/${mi}/resumo">← Resumo</a>${nxt ? `<a class="btn pri" href="#/aula/${mi + 1}/resumo">Próxima: ${nxt.id} →</a>` : '<a class="btn pri" href="#/simulado">Fazer um simulado →</a>'}</div>`;
  }
}
function allList() { const l = []; MODS.forEach((m, mi) => m.qs.forEach((_, qi) => l.push([mi, qi]))); return l; }

/* ---------- barra lateral ---------- */
function renderSide() {
  const s = stats();
  $('#score').innerHTML = `<div class="row"><span>Acertos</span><b>${s.ok} / ${s.tot}</b></div>
    <div class="pbar"><i style="width:${pct(s.ok, s.tot)}%"></i><i class="bad" style="width:${pct(s.bad, s.tot)}%"></i></div>
    <div class="row"><span>${s.ans} respondidas · ${pct(s.ok, s.ans)}% de acerto</span></div>`;
  const r = parse();
  const on = (cond) => cond ? 'on' : '';
  $('#nav').innerHTML = `<a href="#/inicio" class="${on(r.v === 'inicio')}"><span class="ic">🏠</span><span class="lbl"><span>Início</span></span></a>
    <h6>Aulas</h6>
    ${MODS.map((m, i) => { const st = stats(i); return `<a href="#/aula/${i}/${r.v === 'aula' ? r.tab : 'resumo'}" class="${on(r.v === 'aula' && r.m === i)}" style="--a:${m.cor}"><span class="dot"></span><span class="lbl"><b>${m.id}</b><span>${m.titulo}</span></span><span class="cnt ${st.ans === st.tot ? 'full' : ''}">${st.ok}/${st.tot}</span></a>`; }).join('')}
    <h6>Praticar</h6>
    <a href="#/simulado" class="${on(r.v === 'simulado')}"><span class="ic">📝</span><span class="lbl"><span>Simulado</span></span>${sim && !sim.done ? '<span class="cnt">em andamento</span>' : ''}</a>
    <a href="#/todas" class="${on(r.v === 'todas')}"><span class="ic">🔥</span><span class="lbl"><span>Todas as ${TOTAL} questões</span></span></a>
    <a href="#/erros" class="${on(r.v === 'erros')}"><span class="ic">🔁</span><span class="lbl"><span>Revisar erros</span></span>${s.bad ? `<span class="badge">${s.bad}</span>` : ''}</a>
    <a href="#/cards" class="${on(r.v === 'cards')}"><span class="ic">🃏</span><span class="lbl"><span>Flashcards (todos)</span></span></a>
    <h6>Consulta</h6>
    <a href="#/formulas" class="${on(r.v === 'formulas')}"><span class="ic">📐</span><span class="lbl"><span>Formulário</span></span></a>
    <a href="#/pegadinhas" class="${on(r.v === 'pegadinhas')}"><span class="ic">⚠️</span><span class="lbl"><span>Pegadinhas</span></span></a>
    <h6>Dados</h6>
    <a href="#" data-act="reset-all"><span class="ic">🗑️</span><span class="lbl"><span id="resetLbl">Zerar respostas das listas</span></span></a>`;
}

/* ---------- roteamento ---------- */
function parse() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if (h[0] === 'aula') {
    const m = Math.min(MODS.length - 1, Math.max(0, parseInt(h[1], 10) || 0));
    const tab = ['resumo', 'lab', 'questoes', 'cards'].includes(h[2]) ? h[2] : 'resumo';
    return { v: 'aula', m, tab };
  }
  return { v: ['inicio', 'todas', 'erros', 'simulado', 'cards', 'formulas', 'pegadinhas'].includes(h[0]) ? h[0] : 'inicio' };
}
let lastHash = null, resetArmed = false;
function render() {
  const r = parse(), view = $('#view'), tabs = $('#tabs');
  closeMenu();
  if (location.hash !== lastHash) { ui.filter = r.v === 'erros' ? 'wrong' : 'all'; ui.search = ''; }
  renderSide();
  const set = (t, s) => { $('#title').textContent = t; $('#subtitle').innerHTML = s || ''; document.title = t + ' · Macroeconomia ITA'; };
  document.documentElement.style.setProperty('--a', r.v === 'aula' ? MODS[r.m].cor : '#60a5fa');
  tabs.hidden = r.v !== 'aula';
  if (r.v === 'aula') {
    const m = MODS[r.m];
    set(`${m.id}: ${m.titulo}`, `${m.cap} · ${m.tema}`);
    tabs.innerHTML = [['resumo', '📖 Resumo'], ['lab', '🧪 Laboratório'], ['cards', '🃏 Flashcards'], ['questoes', `🎯 Questões (${m.qs.length})`]]
      .map(([k, l]) => `<a href="#/aula/${r.m}/${k}" class="${r.tab === k ? 'on' : ''}">${l}</a>`).join('');
    viewAula(view, r.m, r.tab);
  } else if (r.v === 'todas' || r.v === 'erros') {
    set(r.v === 'erros' ? '🔁 Revisar erros' : `🔥 Todas as ${TOTAL} questões`, r.v === 'erros' ? 'Refaça as questões que você errou. Ao acertar, ela sai desta lista na próxima visita.' : 'Listas oficiais das Aulas 1 a 7.2 + questões do estudo empírico');
    view.innerHTML = toolbar(r.v !== 'erros') + `<div id="qlist">${renderQuestionList(allList(), r.v === 'erros' ? '🎉 Nenhum erro para revisar.' : undefined)}</div>`;
  } else if (r.v === 'simulado') {
    set('📝 Simulado', 'Questões sorteadas, correção no final'); renderSim(view);
  } else if (r.v === 'cards') {
    set('🃏 Flashcards', 'Todos os cartões de todas as aulas'); renderCards(view);
  } else if (r.v === 'formulas') {
    set('📐 Formulário', 'Todas as fórmulas em um lugar'); viewFormulas(view);
  } else if (r.v === 'pegadinhas') {
    set('⚠️ Pegadinhas', 'Os erros mais comuns, aula por aula'); viewTraps(view);
  } else {
    set('Início', 'Macroeconomia · ITA · Prof. Thiago Caliari'); viewHome(view);
  }
  if (location.hash !== lastHash) { window.scrollTo(0, 0); lastHash = location.hash; }
}

/* ---------- eventos globais ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-goto]'); if (!t) return;
  if (t.dataset.goto) { e.preventDefault(); const r = parse(); location.hash = `#/aula/${r.m || 0}/${t.dataset.goto}`; return; }
  const a = t.dataset.act, r = parse();
  if (a === 'ans') return onAnswer(+t.dataset.m, +t.dataset.q, +t.dataset.o);
  if (a === 'retry') return onRetry(+t.dataset.m, +t.dataset.q);
  if (a === 'filter') { ui.filter = t.dataset.f; return render(); }
  if (a.startsWith('fc-')) return fcAct(a, t.dataset.v, $('#view'), r.v === 'aula' ? r.m : undefined);
  if (a.startsWith('sim-')) return simAct(a, t.dataset.v);
  if (a === 'reset-all') {
    e.preventDefault();
    if (!resetArmed) { resetArmed = true; $('#resetLbl').textContent = 'Clique de novo para confirmar'; setTimeout(() => { resetArmed = false; const l = $('#resetLbl'); if (l) l.textContent = 'Zerar respostas das listas'; }, 3500); return; }
    resetArmed = false; answers = {}; saveAnswers(); render();
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'search') {
    ui.search = e.target.value;
    const r = parse(), list = r.v === 'aula' ? MODS[r.m].qs.map((_, qi) => [r.m, qi]) : allList();
    $('#qlist').innerHTML = renderQuestionList(list);
  }
});
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select')) return;
  const r = parse();
  const inCards = r.v === 'cards' || (r.v === 'aula' && r.tab === 'cards');
  if (inCards && $('.fc')) {
    const mi = r.v === 'aula' ? r.m : undefined;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fcAct('fc-flip', null, $('#view'), mi); }
    if (e.key === 'ArrowRight') fcAct('fc-next', null, $('#view'), mi);
    if (e.key === 'ArrowLeft') fcAct('fc-prev', null, $('#view'), mi);
  }
  if (r.v === 'simulado' && sim && !sim.done) {
    const k = 'abcde'.indexOf(e.key.toLowerCase());
    if (k >= 0 && k < MODS[sim.qs[sim.cur][0]].qs[sim.qs[sim.cur][1]].o.length) simAct('sim-ans', k);
    if (e.key === 'ArrowRight') simAct('sim-go', sim.cur + 1);
    if (e.key === 'ArrowLeft') simAct('sim-go', sim.cur - 1);
  }
  if (e.key === 'Escape') closeMenu();
});
function closeMenu() { $('#side').classList.remove('open'); $('#scrim').classList.remove('open'); }
$('#menuBtn').addEventListener('click', () => { $('#side').classList.add('open'); $('#scrim').classList.add('open'); });
$('#scrim').addEventListener('click', closeMenu);
$('#themeBtn').addEventListener('click', () => {
  const t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t); LS.set('macro_ita_theme', t);
});
window.addEventListener('hashchange', render);

/* ---------- fórmulas matemáticas (KaTeX) ----------
   Qualquer trecho entre \( e \) vira fórmula. Um observador renderiza o que
   for inserido na tela; se o KaTeX não carregar, o texto aparece como está. */
const MATH_OPTS = { delimiters: [{ left: '\\(', right: '\\)', display: false }, { left: '\\[', right: '\\]', display: true }], throwOnError: false, strict: false };
function typeset(el) { if (window.renderMathInElement && el) renderMathInElement(el, MATH_OPTS); }
const mathQueue = new Set(); let mathPending = false;
new MutationObserver(recs => {
  for (const r of recs) for (const n of r.addedNodes) {
    const el = n.nodeType === 1 ? n : n.parentElement;
    if (el && !el.closest('.katex')) mathQueue.add(el);
  }
  if (mathQueue.size && !mathPending) {
    mathPending = true;
    requestAnimationFrame(() => { mathPending = false; const els = [...mathQueue]; mathQueue.clear(); els.forEach(e => e.isConnected && typeset(e)); });
  }
}).observe(document.getElementById('view'), { childList: true, subtree: true });

render();
typeset($('#view'));
