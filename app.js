// ── STATE ──────────────────────────────────────────────────
let bpm = 86;
let beats = [[]];
let activeTab = 'visual';
let activePreset = null;
let activeMainTab = 'builder';

// ── SONGS DB (in-memory) ───────────────────────────────────
// Cada música: { id, title, artist, bpm, tom, script }
let songs = [
  {
    id: 'grande-e-o-senhor',
    title: 'Grande É o Senhor',
    artist: 'Fernandinho',
    bpm: 86,
    tom: 'G',
    script: `# Refrão
Bm. Pois só
v|v^
Bm. Tú és o reino eterno
v|v^
C. Sobre
v
C. toda
v
D. Terra e
v
G. Céus.....
v
C.
v|^|v|^
D.
v|v^
G. Grande é o Senhor e muito digno...
v

# Verso 1
G. Grande é o Senhor
v|v^|^v
C. e muito digno de louvor
v|v^|^v
D. na cidade do nosso Deus
v|v^
G. o seu santo monte
v|v^

# Pré-Refrão
Em. Belo em sua altitude
v^|v^
C. alegria de toda a terra
v^|v^
D. Monte Sião no extremo norte
v|v^
G. cidade do grande Rei
v`
  },
  {
    id: 'oceans',
    title: 'Oceans (Where Feet May Fail)',
    artist: 'Hillsong United',
    bpm: 72,
    tom: 'D',
    script: `# Verso 1
Bm. You call me out upon the waters
v|v^|^v|v
G. the great unknown where feet may fail
v|v^|^v|v
D. and there I find You in the mystery
v|v^|^v|v
A. in oceans deep my faith will stand
v|v^

# Pré-Refrão
Bm. And I will call upon Your name
v^|v^
G. and keep my eyes above the waves
v^|v^
D. when oceans rise my soul will rest
v|v^
A. in Your embrace for I am Yours
v|v^

# Refrão
D. Spirit lead me where my trust is without borders
v|v^|^v|v
G. let me walk upon the waters
v|v^|^v|v
Bm. wherever You would call me
v^|v^
A. take me deeper than my feet could ever wander
v|v^|^v|v`
  },
  {
    id: 'hosana',
    title: 'Hosana',
    artist: 'Hillsong',
    bpm: 76,
    tom: 'E',
    script: `# Intro
E. 
v|v^|^v^
A. 
v|v^|^v^

# Verso 1
E. I see the King of Glory
v|v^|^v
A. coming on the clouds with fire
v|v^|^v
E. the whole earth shakes the whole earth shakes
v|v^
A. 
v|v^

# Refrão
A. Hosanna hosanna
v^|v^
E. hosanna in the highest
v^|v^
A. hosanna hosanna
v^|v^
B. hosanna in the highest
v|v^

# Ponte
E. Heal my heart and make it clean
v|v^|^v|v
A. open up my eyes to the things unseen
v|v^|^v|v
E. show me how to love like You have loved me
v|v^
B. break my heart for what breaks Yours
v|v^
A. everything I am for Your Kingdom's cause
v|v^
B. as I walk from earth into eternity
v|v^`
  }
];

let currentSongId = null;
let editingSongId = null;

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

// ── SVG ICONS ──────────────────────────────────────────────
const SVG_DOWN = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
const SVG_UP   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
const SVG_MUTE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`;

const STRUM_ICON = { down: SVG_DOWN, up: SVG_UP, mute: SVG_MUTE, '': '<span style="color:var(--muted)">·</span>' };

// ── MAIN TAB ───────────────────────────────────────────────
function setMainTab(tab) {
  activeMainTab = tab;
  document.querySelectorAll('.main-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.maintab === tab);
  });
  document.querySelectorAll('.main-panel').forEach(p => {
    p.classList.toggle('hidden', p.id !== 'panel-' + tab);
  });
  if (tab === 'scripts') buildSongLibrary();
}

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

// ── TABS (construtor) ────────────────────────────────────────
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
  beats[beats.length - 1].push(type);
  renderBeats();
}
function cycleSlot(beatIdx, slotIdx) {
  const order = ['down','up','mute',''];
  const cur = beats[beatIdx][slotIdx];
  const next = order[(order.indexOf(cur) + 1) % order.length];
  if (next === '') {
    beats[beatIdx].splice(slotIdx, 1);
    if (beats[beatIdx].length === 0 && beats.length > 1) beats.splice(beatIdx, 1);
  } else {
    beats[beatIdx][slotIdx] = next;
  }
  renderBeats();
}
function addBeat()   { beats.push([]); renderBeats(); }
function deleteBeat(idx) { if (beats.length > 1) { beats.splice(idx, 1); renderBeats(); } }
function clearBeats() { beats = [[]]; renderBeats(); }

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
    (beat.length > 0 ? beat : ['']).forEach((s, si) => {
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
    del.textContent = '×';
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
    btn.addEventListener('click', () => { activePreset = p.key; buildPresets(); traduzirRitmo(p.ritmo); });
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
  const arrowCount = (ritmoAscii.match(/[v^]/g) || []).length;
  if (arrowCount === 1 && !ritmoAscii.includes('|') && !ritmoAscii.includes('-')) {
    const isDown = ritmoAscii.includes('v');
    const totalMs = Math.round(4 * 60000 / bpm);
    showResultado(acorde, [{ type: isDown ? 'down' : 'up' }], [], '4/4', totalMs, 4, [
      { sym: '∅', nome: 'Semibreve', dur: '4 tempos' }
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
    b.split('').filter(c => 'v^-'.includes(c)).forEach(s => {
      visualStrums.push({ type: s === 'v' ? 'down' : s === '^' ? 'up' : 'mute' });
    });
    notas.push(traduzirBloco(b));
  });
  showResultado(acorde, visualStrums, blocos, compasso, totalMs, blocos.length, notas);
}

function inferirCompasso(nBeats) {
  return { 2:'2/4', 3:'3/4', 4:'4/4', 6:'6/8', 12:'12/8' }[nBeats] || (nBeats + '/4');
}

function traduzirBloco(b) {
  if (b.match(/^-+$/) && b.length >= 4) return { sym: '∅', nome: 'Semibreve', dur: '4 tempos' };
  const count = (b.match(/[v^]/g) || []).length;
  if (count === 0) return { sym: '—', nome: 'Pausa', dur: '1 tempo' };
  if (count === 1) return { sym: '♩', nome: 'Semínima', dur: '1 tempo' };
  if (count === 2) return { sym: '♪♪', nome: 'Colcheias', dur: '½ tempo cada' };
  if (count === 3) return { sym: '♪♪♪(3)', nome: 'Tercina', dur: '⅓ tempo cada' };
  if (count === 4) return { sym: '♫♫', nome: 'Semicolcheias', dur: '¼ tempo cada' };
  return { sym: '♫'.repeat(Math.ceil(count/2)), nome: 'Fusa(s)', dur: '⅛ tempo cada' };
}

function showResultado(acorde, visualStrums, blocos, compasso, totalMs, nBeats, notas) {
  document.getElementById('resAcorde').textContent = acorde;
  const visEl = document.getElementById('resVisual');
  visEl.innerHTML = '';
  visualStrums.forEach(s => {
    const span = document.createElement('span');
    if (s.type === 'div')  { span.className = 'vis-div'; span.textContent = '|'; }
    else if (s.type === 'down') { span.className = 'vis-down'; span.innerHTML = SVG_DOWN; }
    else if (s.type === 'up')   { span.className = 'vis-up';   span.innerHTML = SVG_UP; }
    else                        { span.className = 'vis-mute'; span.innerHTML = SVG_MUTE; }
    visEl.appendChild(span);
  });
  document.getElementById('resMeta').innerHTML = [
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
    chip.textContent = `Beat ${i+1}: ${n.sym} ${n.nome} — ${n.dur}`;
    notasEl.appendChild(chip);
  });
  const card = document.getElementById('resultCard');
  card.classList.add('visible');
  card.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

// ════════════════════════════════════════════════════════════
// ── SCRIPTS ENGINE ──────────────────────────────────────────
// ════════════════════════════════════════════════════════════

function buildSongLibrary() {
  const lib = document.getElementById('songLibrary');
  lib.innerHTML = '';
  if (songs.length === 0) {
    lib.innerHTML = '<p style="color:var(--text-faint);font-size:var(--text-sm);text-align:center;padding:var(--space-4)">Nenhuma música ainda. Clique em "Nova Música" para começar.</p>';
    return;
  }
  songs.forEach(song => {
    const card = document.createElement('div');
    card.className = 'song-card' + (currentSongId === song.id ? ' active' : '');
    card.innerHTML = `
      <div class="song-card-info">
        <div class="song-card-title">${escHtml(song.title)}</div>
        <div class="song-card-meta">${escHtml(song.artist || '—')} · ${song.bpm || '?'} BPM · Tom: ${escHtml(song.tom || '?')}</div>
      </div>
      <div class="song-card-actions">
        <button class="song-action-btn" title="Visualizar" onclick="viewSong('${song.id}')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="song-action-btn" title="Editar" onclick="editSong('${song.id}')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>`;
    lib.appendChild(card);
  });
}

function openNewSong() {
  editingSongId = null;
  currentSongId = null;
  document.getElementById('songTitle').value = '';
  document.getElementById('songArtist').value = '';
  document.getElementById('songBpm').value = '';
  document.getElementById('songTom').value = '';
  document.getElementById('scriptEditor').value = '';
  document.getElementById('scriptEditorCard').style.display = '';
  document.getElementById('scriptView').style.display = 'none';
  document.getElementById('songTitle').focus();
  buildSongLibrary();
}

function editSong(id) {
  const song = songs.find(s => s.id === id);
  if (!song) return;
  editingSongId = id;
  document.getElementById('songTitle').value = song.title;
  document.getElementById('songArtist').value = song.artist || '';
  document.getElementById('songBpm').value = song.bpm || '';
  document.getElementById('songTom').value = song.tom || '';
  document.getElementById('scriptEditor').value = song.script || '';
  document.getElementById('scriptEditorCard').style.display = '';
  document.getElementById('scriptView').style.display = 'none';
}

function closeEditor() {
  document.getElementById('scriptEditorCard').style.display = 'none';
}

function saveSong() {
  const title  = document.getElementById('songTitle').value.trim();
  const artist = document.getElementById('songArtist').value.trim();
  const bpmVal = parseInt(document.getElementById('songBpm').value) || 80;
  const tom    = document.getElementById('songTom').value.trim();
  const script = document.getElementById('scriptEditor').value;
  if (!title) { document.getElementById('songTitle').focus(); return; }
  if (editingSongId) {
    const idx = songs.findIndex(s => s.id === editingSongId);
    if (idx >= 0) {
      songs[idx] = { ...songs[idx], title, artist, bpm: bpmVal, tom, script };
      currentSongId = editingSongId;
    }
  } else {
    const id = 'song-' + Date.now();
    songs.push({ id, title, artist, bpm: bpmVal, tom, script });
    editingSongId = id;
    currentSongId = id;
  }
  buildSongLibrary();
  renderScript();
}

function deleteSong() {
  if (!editingSongId) return;
  songs = songs.filter(s => s.id !== editingSongId);
  if (currentSongId === editingSongId) currentSongId = null;
  editingSongId = null;
  document.getElementById('scriptEditorCard').style.display = 'none';
  document.getElementById('scriptView').style.display = 'none';
  buildSongLibrary();
}

function viewSong(id) {
  const song = songs.find(s => s.id === id);
  if (!song) return;
  currentSongId = id;
  editingSongId = id;
  document.getElementById('scriptEditorCard').style.display = 'none';
  buildSongLibrary();
  // preencher header
  document.getElementById('svTitle').textContent  = song.title;
  document.getElementById('svArtist').textContent = song.artist || '';
  document.getElementById('svBpm').textContent    = (song.bpm || '?') + ' BPM';
  document.getElementById('svTom').textContent    = 'Tom: ' + (song.tom || '?');
  // renderizar
  renderScriptContent(song.script || '', song.bpm || 80);
  document.getElementById('scriptView').style.display = '';
  document.getElementById('scriptView').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openEditorFromView() {
  if (editingSongId) editSong(editingSongId);
}

function renderScript() {
  const id = editingSongId || currentSongId;
  if (id) viewSong(id);
}

// ── PARSER DE SCRIPT ─────────────────────────────────────────
// Formato de cada linha:
//   # Título de seção
//   ---  → separador
//   X.   → acorde sozinho (X = qualquer sequência até o ponto)
//   X. letra  → acorde + letra
//   v|v^  → linha de ritmo (vem logo após uma linha de acorde)
//
function renderScriptContent(script, songBpm) {
  const container = document.getElementById('scriptRendered');
  container.innerHTML = '';
  const lines = script.split('\n');
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i].trim();
    i++;

    if (!raw) continue;

    // Separador
    if (raw === '---') {
      const hr = document.createElement('hr');
      hr.className = 'sr-separator';
      container.appendChild(hr);
      continue;
    }

    // Título de seção: começa com #
    if (raw.startsWith('#')) {
      const span = document.createElement('div');
      span.className = 'sr-section-title';
      span.textContent = raw.replace(/^#+\s*/, '');
      container.appendChild(span);
      continue;
    }

    // Bloco acorde: "X. texto" ou "X."
    const acordeMatch = raw.match(/^([A-G][^\s.]*)\.(\s+(.*))?$/);
    if (acordeMatch) {
      const chord  = acordeMatch[1].trim();
      const lyric  = (acordeMatch[3] || '').trim();

      // próxima linha pode ser ritmo
      let rhythmLine = '';
      if (i < lines.length) {
        const next = lines[i].trim();
        if (next && /^[v^\-|]+$/.test(next)) {
          rhythmLine = next;
          i++;
        }
      }

      const block = document.createElement('div');
      block.className = 'sr-block';

      // Acorde
      const chordEl = document.createElement('div');
      chordEl.className = 'sr-chord';
      chordEl.textContent = chord;
      block.appendChild(chordEl);

      // Letra
      if (lyric) {
        const lyricEl = document.createElement('div');
        lyricEl.className = 'sr-lyric';
        lyricEl.textContent = lyric;
        block.appendChild(lyricEl);
      }

      // Ritmo
      if (rhythmLine) {
        const { strumEls, notaStr } = buildRhythmRow(rhythmLine, songBpm);
        const rDiv = document.createElement('div');
        rDiv.className = 'sr-rhythm';
        strumEls.forEach(el => rDiv.appendChild(el));
        if (notaStr) {
          const nota = document.createElement('span');
          nota.className = 'sr-nota';
          nota.textContent = notaStr;
          rDiv.appendChild(nota);
        }
        block.appendChild(rDiv);
      }

      container.appendChild(block);
      continue;
    }

    // Linha de ritmo solta (sem acorde antes)
    if (/^[v^\-|]+$/.test(raw)) {
      const { strumEls, notaStr } = buildRhythmRow(raw, songBpm);
      const rDiv = document.createElement('div');
      rDiv.className = 'sr-rhythm';
      rDiv.style.paddingLeft = 'var(--space-3)';
      strumEls.forEach(el => rDiv.appendChild(el));
      if (notaStr) {
        const nota = document.createElement('span');
        nota.className = 'sr-nota';
        nota.textContent = notaStr;
        rDiv.appendChild(nota);
      }
      container.appendChild(rDiv);
      continue;
    }

    // Linha de texto genérico
    const textEl = document.createElement('div');
    textEl.className = 'sr-lyric';
    textEl.style.color = 'var(--text-muted)';
    textEl.style.fontSize = 'var(--text-xs)';
    textEl.textContent = raw;
    container.appendChild(textEl);
  }

  if (container.children.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'sr-empty';
    empty.textContent = 'Script vazio. Clique em editar para adicionar a música.';
    container.appendChild(empty);
  }
}

function buildRhythmRow(rhythmLine, songBpm) {
  const blocos = rhythmLine.split('|');
  const strumEls = [];
  const notaParts = [];

  blocos.forEach((b, bi) => {
    if (bi > 0) {
      const div = document.createElement('span');
      div.className = 'sr-div';
      div.textContent = '|';
      strumEls.push(div);
    }
    const chars = b.split('').filter(c => 'v^-'.includes(c));
    chars.forEach(c => {
      const s = document.createElement('span');
      if (c === 'v') { s.className = 'sr-strum-down'; s.innerHTML = SVG_DOWN; }
      else if (c === '^') { s.className = 'sr-strum-up'; s.innerHTML = SVG_UP; }
      else { s.className = 'sr-strum-mute'; s.innerHTML = SVG_MUTE; }
      strumEls.push(s);
    });
    const nota = traduzirBloco(b);
    notaParts.push(nota.sym);
  });

  const totalMs = Math.round(blocos.length * 60000 / (songBpm || 80));
  const notaStr = notaParts.join(' | ') + ' · ' + totalMs + 'ms';
  return { strumEls, notaStr };
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
buildSongLibrary();
