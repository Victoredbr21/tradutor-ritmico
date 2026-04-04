// ── STATE ──────────────────────────────────────────────────
let bpm = 86;
let beats = [[]]; // array de beats, cada beat = array de strums ('down','up','mute')
let activeTab = 'visual';
let activePreset = null;

const PADROES = [
  { key:'1',     ritmo:'v|v|^^|vv',           nome:'Pop Básico',      estilo:'4/4' },
  { key:'2',     ritmo:'v|v^|^v|v',           nome:'Pop Intermediário',estilo:'4/4' },
  { key:'3',     ritmo:'v|^v',                 nome:'Folk Simples',    estilo:'2/4' },
  { key:'4',     ritmo:'v|v|v|v',              nome:'Marcado',         estilo:'4/4' },
  { key:'5',     ritmo:'v^|v^|v^|v^',          nome:'Alternado',       estilo:'4/4' },
  { key:'samba', ritmo:'v^|^v^|^v|v^',         nome:'Samba',           estilo:'2/4' },
  { key:'bossa', ritmo:'v|-^|v^|-^',            nome:'Bossa Nova',      estilo:'4/4' },
  { key:'baiao', ritmo:'v^|v|-|v^',             nome:'Baião',           estilo:'4/4' },
  { key:'forro', ritmo:'v|v^|v|v^',             nome:'Forró',           estilo:'4/4' },
  { key:'valsa', ritmo:'v|^^|v|^^|v|^^',        nome:'Valsa',           estilo:'3/4' },
  { key:'reg',   ritmo:'-^|-^|-^|-^',           nome:'Reggae',          estilo:'4/4' },
  { key:'met',   ritmo:'vv|vv|vv|vv',           nome:'Metal Picking',   estilo:'4/4' },
  { key:'blu',   ritmo:'v^^|v^^|v^^|v^^',       nome:'Blues Shuffle',   estilo:'12/8'},
  { key:'fla',   ritmo:'v|v^|^v^|v',            nome:'Flamenco',        estilo:'4/4' },
  { key:'6/8',   ritmo:'v^^|v^^',               nome:'Balada 6/8',      estilo:'6/8' },
];

// ── BPM ────────────────────────────────────────────────────
function setBpm(val) {
  bpm = Math.max(40, Math.min(220, val));
  document.getElementById('bpmDisplay').textContent = bpm;
  document.getElementById('bpmInfo').textContent = Math.round(60000 / bpm) + 'ms / beat';
  document.getElementById('bpmSlider').value = bpm;
}

document.getElementById('bpmSlider').addEventListener('input', e => setBpm(+e.target.value));

// ── ACORDE ──────────────────────────────────────────────────
function appendAcorde(v) {
  const el = document.getElementById('acordeInput');
  el.value += v;
  el.focus();
}
function clearAcorde() {
  document.getElementById('acordeInput').value = '';
}

// ── TABS ────────────────────────────────────────────────────
function setTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach((t, i) => {
    const tabs = ['visual','presets','manual'];
    t.classList.toggle('active', tabs[i] === tab);
    t.setAttribute('aria-selected', tabs[i] === tab);
  });
  ['visual','presets','manual'].forEach(id => {
    document.getElementById('tab-' + id).classList.toggle('hidden', id !== tab);
  });
}

// ── BEAT BUILDER ────────────────────────────────────────────
function addStrum(type) {
  const lastBeat = beats[beats.length - 1];
  lastBeat.push(type);
  renderBeats();
}

function cycleSlot(beatIdx, slotIdx) {
  const order = ['down','up','mute',''];
  const cur = beats[beatIdx][slotIdx];
  const next = order[(order.indexOf(cur) + 1) % order.length];
  if (next === '') {
    beats[beatIdx].splice(slotIdx, 1);
    if (beats[beatIdx].length === 0 && beats.length > 1) {
      beats.splice(beatIdx, 1);
    }
  } else {
    beats[beatIdx][slotIdx] = next;
  }
  renderBeats();
}

function addBeat() {
  beats.push([]);
  renderBeats();
}

function deleteBeat(idx) {
  if (beats.length > 1) beats.splice(idx, 1);
  renderBeats();
}

function clearBeats() {
  beats = [[]];
  renderBeats();
}

// SVG inline para garantir renderização cross-platform dos ícones de strum
const STRUM_ICON = {
  down: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`,
  up:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
  mute: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`,
  '':   `<span style="color:var(--muted)">·</span>`
};

function renderBeats() {
  const c = document.getElementById('beatsContainer');
  c.innerHTML = '';
  beats.forEach((beat, bi) => {
    const row = document.createElement('div');
    row.className = 'beat-row';
    const lbl = document.createElement('span');
    lbl.className = 'beat-label';
    lbl.textContent = bi + 1;
    row.appendChild(lbl);
    const slots = document.createElement('div');
    slots.className = 'beat-slots';
    const displayBeat = beat.length > 0 ? beat : [''];
    displayBeat.forEach((s, si) => {
      const slot = document.createElement('button');
      slot.className = 'beat-slot ' + (s || 'empty');
      slot.setAttribute('aria-label', s ? s + ' strum' : 'slot vazio');
      slot.innerHTML = STRUM_ICON[s] || STRUM_ICON[''];
      if (s) slot.addEventListener('click', () => cycleSlot(bi, si));
      slots.appendChild(slot);
    });
    row.appendChild(slots);
    const del = document.createElement('button');
    del.className = 'beat-del';
    del.textContent = '\u00D7';
    del.setAttribute('aria-label', 'Deletar beat ' + (bi + 1));
    del.addEventListener('click', () => deleteBeat(bi));
    row.appendChild(del);
    c.appendChild(row);
  });
}

// ── PRESETS ──────────────────────────────────────────────────
function buildPresets() {
  const grid = document.getElementById('presetsGrid');
  grid.innerHTML = '';
  PADROES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn' + (activePreset === p.key ? ' active' : '');
    btn.innerHTML = `<span class="preset-nome">${p.nome}</span><span class="preset-estilo">${p.estilo}</span><span class="preset-ritmo">${p.ritmo}</span>`;
    btn.addEventListener('click', () => {
      activePreset = p.key;
      buildPresets();
      traduzirRitmo(p.ritmo);
    });
    grid.appendChild(btn);
  });
}

// ── MANUAL ───────────────────────────────────────────────────
function traduzirManual() {
  const val = document.getElementById('manualInput').value.trim();
  if (val) traduzirRitmo(val);
}

// ── CORE: TRADUZIR ───────────────────────────────────────────
function traduzir() {
  const ritmo = beats.map(beat =>
    beat.length === 0 ? '-' : beat.map(s => s === 'down' ? 'v' : s === 'up' ? '^' : '-').join('')
  ).join('|');
  traduzirRitmo(ritmo);
}

function traduzirRitmo(ritmoAscii) {
  const acorde = document.getElementById('acordeInput').value.trim() || '?';

  // Semibreve automática
  const arrowCount = (ritmoAscii.match(/[v^]/g) || []).length;
  if (arrowCount === 1 && !ritmoAscii.includes('|') && !ritmoAscii.includes('-')) {
    const isDown = ritmoAscii.includes('v');
    const totalMs = Math.round(4 * 60000 / bpm);
    showResultado(acorde, [{ type: isDown ? 'down' : 'up' }], [], '4/4', totalMs, 4, [
      { sym: 'semibreve', nome: 'Semibreve', dur: '4 tempos' }
    ]);
    return;
  }

  const blocos = ritmoAscii.split('|');
  const totalMs = Math.round(blocos.length * 60000 / bpm);
  const compasso = inferirCompasso(blocos.length);

  const visualStrums = [];
  const notas = [];

  blocos.forEach((b, i) => {
    if (i > 0) visualStrums.push({ type: 'div' });
    const strums = b.split('').filter(c => 'v^-'.includes(c));
    strums.forEach(s => {
      visualStrums.push({ type: s === 'v' ? 'down' : s === '^' ? 'up' : 'mute' });
    });
    notas.push(traduzirBloco(b));
  });

  showResultado(acorde, visualStrums, blocos, compasso, totalMs, blocos.length, notas);
}

function inferirCompasso(nBeats) {
  const map = { 2:'2/4', 3:'3/4', 4:'4/4', 6:'6/8', 12:'12/8' };
  return map[nBeats] || (nBeats + '/4');
}

// Símbolos como texto legível — sem depender de Unicode de música
const NOTA_SYMS = {
  semibreve:    { label: '𝅝',    fallback: '[o]'     },
  pausa:        { label: '\u{1D13B}', fallback: '[-]' },
  seminima:     { label: '♩',    fallback: '[♩]'      },
  colcheia2:    { label: '\u{1D158}\u{1D165}\u{1D158}\u{1D165}', fallback: '[\u266A\u266A]' },
  tercina:      { label: '\u{1D158}\u{1D165}\u{1D158}\u{1D165}\u{1D158}\u{1D165}(3)', fallback: '[\u266A\u266A\u266A](3)' },
  semicolcheia: { label: '\u{1D159}\u{1D166}', fallback: '[\u266B]' },
  fusa:         { label: '\u{1D170}', fallback: '[\u266C]' }
};

function traduzirBloco(b) {
  if (b.match(/^-+$/) && b.length >= 4) return { sym: '∅', nome: 'Semibreve', dur: '4 tempos' };
  const count = (b.match(/[v^]/g) || []).length;
  const pauseOnly = count === 0;
  if (pauseOnly) return { sym: '—', nome: 'Pausa', dur: '1 tempo' };
  if (count === 1) return { sym: '♩', nome: 'Semínima', dur: '1 tempo' };
  if (count === 2) return { sym: '\u266A\u266A', nome: 'Colcheias', dur: '\u00BD tempo cada' };
  if (count === 3) return { sym: '\u266A\u266A\u266A(3)', nome: 'Tercina', dur: '\u2153 tempo cada' };
  if (count === 4) return { sym: '\u266B\u266B', nome: 'Semicolcheias', dur: '\u00BC tempo cada' };
  return { sym: '\u266B'.repeat(Math.ceil(count / 2)), nome: 'Fusa(s)', dur: '\u215B tempo cada' };
}

function showResultado(acorde, visualStrums, blocos, compasso, totalMs, nBeats, notas) {
  document.getElementById('resAcorde').textContent = acorde;

  const visEl = document.getElementById('resVisual');
  visEl.innerHTML = '';
  visualStrums.forEach(s => {
    const span = document.createElement('span');
    if (s.type === 'div') {
      span.className = 'vis-div'; span.textContent = '|';
    } else if (s.type === 'down') {
      span.className = 'vis-down';
      span.innerHTML = STRUM_ICON.down;
    } else if (s.type === 'up') {
      span.className = 'vis-up';
      span.innerHTML = STRUM_ICON.up;
    } else {
      span.className = 'vis-mute';
      span.innerHTML = STRUM_ICON.mute;
    }
    visEl.appendChild(span);
  });

  const metaEl = document.getElementById('resMeta');
  metaEl.innerHTML = [
    `<span class="meta-chip">${compasso}</span>`,
    `<span class="meta-chip">${nBeats} beats</span>`,
    `<span class="meta-chip">${totalMs}ms</span>`,
    `<span class="meta-chip">${bpm} BPM</span>`,
  ].join('');

  const notasEl = document.getElementById('resNotas');
  notasEl.innerHTML = '';
  notas.forEach((n, i) => {
    const chip = document.createElement('div');
    chip.className = 'nota-chip' + (i === 0 ? ' destaque' : '');
    chip.textContent = `Beat ${i+1}: ${n.sym} ${n.nome} \u2014 ${n.dur}`;
    notasEl.appendChild(chip);
  });

  const card = document.getElementById('resultCard');
  card.classList.add('visible');
  card.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

// ── THEME TOGGLE ─────────────────────────────────────────────
(function(){
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  const moonSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sunSvg  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  if (t) {
    t.innerHTML = d === 'dark' ? moonSvg : sunSvg;
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      t.innerHTML = d === 'dark' ? moonSvg : sunSvg;
      t.setAttribute('aria-label', 'Alternar para tema ' + (d === 'dark' ? 'claro' : 'escuro'));
    });
  }
})();

// ── INIT ──────────────────────────────────────────────────
renderBeats();
buildPresets();
