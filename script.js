let S;
function newState() {
  return {
    screen: "start",      // start | theory | question | recap | final | over
    phase: 0, page: 0, q: 0,
    lives: MAX_LIVES, score: 0, answered: 0,
    tries: 0, order: [], wrong: [], solved: false,
    say: "", mood: "happy", bounce: false,
    log: PHASES.map(() => ({ pts: 0, errs: 0 }))
  };
}
function say(text, mood, bounce) { S.say = text; S.mood = mood || "normal"; S.bounce = !!bounce; }

/* =========================================================
   4. UTILITÁRIOS
   ========================================================= */
const $ = (s) => document.querySelector(s);
const stage = $("#stage"), modalRoot = $("#modalRoot");
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const heartSVG = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path fill="var(--pink)" d="M12 21s-7.5-4.6-9.5-9.2C1.1 8.4 3 5 6.3 5c2 0 3.6 1.1 5.700 3.400C14.100 6.100 15.700 5 17.700 5 21 5 22.900 8.400 21.500 11.800 19.500 16.400 12 21 12 21z"/><path d="M7 8.500q1.200-1.300 2.600-.7" stroke="#fff" stroke-opacity=".8" stroke-width="1.500" fill="none" stroke-linecap="round"/></svg>`;

/* Bolhas de fundo: clique para estourar */
function makeBubble(still) {
  const b = document.createElement("div");
  const size = 26 + Math.random() * 110;
  const tints = ["rgba(255,150,200,.38)", "rgba(140,180,255,.38)", "rgba(170,235,215,.36)", "rgba(200,170,255,.36)"];
  b.className = "bubble";
  b.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;--tint:${pick(tints)};--sway:${(Math.random() * 60 - 30).toFixed(0)}px;--dur:${(16 + Math.random() * 18).toFixed(1)}s;--delay:${(-Math.random() * 30).toFixed(1)}s;--still:${(Math.random() * 90).toFixed(0)}%`;
  b.addEventListener("click", () => {
    b.classList.add("pop");
    setTimeout(() => { b.remove(); $("#bubbles").appendChild(makeBubble()); }, 330);
  });
  return b;
}
const bubbleRoot = $("#bubbles");
for (let i = 0; i < 16; i++) bubbleRoot.appendChild(makeBubble());

/* =========================================================
   5. PLACAR E PROGRESSO
   ========================================================= */
function renderHud(justLost) {
  $("#score").textContent = S.score;
  let h = "";
  for (let i = 0; i < MAX_LIVES; i++) h += heartSVG((i >= S.lives ? "lost" : "") + (justLost && i === S.lives ? " pop" : ""));
  $("#hearts").innerHTML = h;
  $("#hearts").setAttribute("aria-label", S.lives + " vidas restantes");
  const pct = Math.round((S.answered / TOTAL_Q) * 100);
  $("#barFill").style.width = pct + "%";
  $("#bar").setAttribute("aria-valuenow", pct);
  $("#steps").innerHTML = PHASES.map((p, i) => {
    const cls = S.screen === "final" || i < S.phase ? "done" : (i === S.phase && S.screen !== "start" ? "now" : "");
    return `<div class="step ${cls}">Fase ${i + 1}<br>${p.short}</div>`;
  }).join("");
}

/* =========================================================
   6. TELAS
   ========================================================= */
function guideRow(withCat) {
  return `<div class="guide">
    <div class="chars"><div class="fairy-wrap">${fairySVG(S.mood).replace('class="fairy"', 'class="fairy' + (S.bounce ? " bounce" : "") + '"')}</div>${withCat ? `<div class="cat-wrap">${catSVG(S.mood)}</div>` : ""}</div>
    <div class="speech glass" role="status"><span class="who">Lumi</span>${S.say}</div>
  </div>`;
}
function show(html, noScroll) {
  stage.style.animation = "none"; void stage.offsetWidth; stage.style.animation = "";
  stage.innerHTML = html;
  const f = stage.querySelector("[data-focus]"); if (f) f.focus({ preventScroll: true });
  if (!noScroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function screenStart() {
  show(`${guideRow(true)}
  <div class="card glass">
    <span class="eyebrow">Curso rápido em 4 fases</span>
    <h2>Aprenda Estatística e Probabilidade jogando</h2>
    <p class="lead">Cada fase tem três ou quatro lições curtas para ler, dois desafios e um resumo no final. Você só avança quando acerta. Cada erro custa uma vida, mas traz uma explicação para tentar de novo.</p>
    <div class="concepts">${PHASES.map((p, i) => `<div class="concept"><b>Fase ${i + 1}: ${p.title}</b><span>${p.topic}.</span></div>`).join("")}</div>
    <p class="lead">Dica: toque nas bolhas do fundo para estourá-las.</p>
    <button class="btn" data-focus id="go" type="button">Começar com a Lumi</button>
  </div>`, true);
  $("#go").onclick = () => { goTheory(0, 0); };
}

function screenTheory() {
  const p = PHASES[S.phase], les = p.lessons[S.page], last = S.page === p.lessons.length - 1;
  show(`${guideRow(false)}
  <div class="card glass">
    <span class="eyebrow">Fase ${S.phase + 1} · ${p.title} · Lição ${S.page + 1} de ${p.lessons.length}</span>
    <h2>${les.title}</h2>
    ${les.html}
    <div class="pager">
      <div class="row">
        ${S.page > 0 ? `<button class="btn alt" id="prev" type="button">Voltar</button>` : ""}
        <button class="btn" data-focus id="nextL" type="button">${last ? "Ir para os desafios" : "Próxima lição"}</button>
      </div>
      <div class="dots" aria-hidden="true">${p.lessons.map((_, i) => `<i class="${i === S.page ? "on" : ""}"></i>`).join("")}</div>
    </div>
  </div>`);
  if (S.page > 0) $("#prev").onclick = () => goTheory(S.phase, S.page - 1);
  $("#nextL").onclick = () => { if (last) goQuestion(0); else goTheory(S.phase, S.page + 1); };
}
function screenQuestion() {
  const p = PHASES[S.phase], q = p.questions[S.q];
  const opts = S.order.map((idx, pos) => {
    const o = q.options[idx];
    let cls = "";
    if (S.wrong.includes(idx)) cls = "wrong";
    if (S.solved) cls = o.ok ? "right" : (cls || "locked");
    const dis = S.solved || S.wrong.includes(idx) ? "disabled" : "";
    return `<button type="button" class="opt ${cls}" data-i="${idx}" ${dis}><span class="key">${LETTERS[pos]}</span><span class="txt">${o.t}</span></button>`;
  }).join("");
  const endOfPhase = S.q === p.questions.length - 1;
  const fb = S.solved ? `<div class="feedback" role="status">
      <h3>Resposta certa! +${pointsFor(S.tries)} pontos</h3>
      ${q.explain}
      <button class="btn" data-focus id="next" type="button">${endOfPhase ? "Ver resumo da fase" : "Próximo desafio"}</button>
    </div>` : "";
  show(`${guideRow(false)}
  <div class="card glass">
    <div class="row" style="justify-content:space-between">
      <span class="eyebrow">Fase ${S.phase + 1} · Desafio ${S.q + 1} de ${p.questions.length}</span>
      <button class="btn-ghost" id="theoryBtn" type="button">Rever teoria</button>
    </div>
    <p class="prompt">${q.prompt}</p>
    <div class="options">${opts}</div>
    ${fb}
  </div>`, !S.solved && S.tries > 0 ? true : false);
  stage.querySelectorAll(".opt").forEach((b) => b.onclick = () => answer(+b.dataset.i));
  $("#theoryBtn").onclick = openTheory;
  if (S.solved) $("#next").onclick = nextStep;
}

function screenRecap() {
  const p = PHASES[S.phase], last = S.phase === PHASES.length - 1, lg = S.log[S.phase];
  show(`${guideRow(true)}
  <div class="card glass final">
    <span class="eyebrow">Fase ${S.phase + 1} concluída</span>
    <h2>Resumo: ${p.title}</h2>
    <p class="lead">Você fez ${lg.pts} pontos nesta fase, com ${lg.errs} ${lg.errs === 1 ? "erro" : "erros"}. Leve estas ideias para a próxima:</p>
    <ul class="recap-list">${p.recap.map((r) => `<li>${r}</li>`).join("")}</ul>
    <button class="btn" data-focus id="go" type="button">${last ? "Ver resultado final" : "Ir para a Fase " + (S.phase + 2)}</button>
  </div>`);
  $("#go").onclick = () => { if (last) goFinal(); else goTheory(S.phase + 1, 0); };
}

function screenFinal() {
  const max = TOTAL_Q * 100, pct = S.score / max;
  const rank = pct >= .85 ? "Mestre da Estatística" : pct >= .6 ? "Analista de Dados" : "Aprendiz em evolução";
  const msg = pct >= .85 ? "Quase sem erros. Você domina os conceitos das quatro fases."
            : pct >= .6 ? "Bom resultado. Reveja as fases com mais erros para fixar os conceitos."
            : "Você concluiu o curso. Jogue de novo para melhorar a pontuação.";
  show(`${guideRow(true)}
  <div class="card glass final">
    <span class="eyebrow">Parabéns! Curso concluído</span>
    <div class="big">${S.score}<small> / ${max} pontos</small></div>
    <span class="rank">${rank}</span>
    <p class="lead">${msg}</p>
    <div class="summary">${PHASES.map((p, i) => `<div class="sum"><b>Fase ${i + 1}: ${p.short}</b><span>${S.log[i].pts} pontos · ${S.log[i].errs} ${S.log[i].errs === 1 ? "erro" : "erros"}</span></div>`).join("")}
      <div class="sum"><b>Vidas restantes</b><span>${S.lives} de ${MAX_LIVES}</span></div></div>
    <button class="btn" data-focus id="again" type="button">Jogar novamente</button>
  </div>`);
  $("#again").onclick = restart;
}

function screenOver() {
  show(`${guideRow(true)}
  <div class="card glass final">
    <span class="eyebrow">Fim das vidas</span>
    <h2>Estatística se aprende errando</h2>
    <p class="lead">Você chegou à fase ${S.phase + 1} com ${S.score} pontos. Releia as lições com calma e tente de novo. A Lumi e o Bigode torcem por você.</p>
    <button class="btn" data-focus id="again" type="button">Recomeçar o jogo</button>
  </div>`);
  $("#again").onclick = restart;
}

function render(justLost) {
  renderHud(justLost);
  ({ start: screenStart, theory: screenTheory, question: screenQuestion, recap: screenRecap, final: screenFinal, over: screenOver })[S.screen]();
}

/* =========================================================
   7. TRANSIÇÕES E LÓGICA
   ========================================================= */
const pointsFor = (tries) => tries === 0 ? 30 : tries === 1 ? 10 : 5;

function goTheory(phase, page) {
  S.screen = "theory"; S.phase = phase; S.page = page;
  const les = PHASES[phase].lessons[page];
  say(page === 0 && phase > 0 ? `Fase ${phase + 1}: ${PHASES[phase].title}! ${les.say}` : les.say, "normal", true);
  render();
}
function goQuestion(qi) {
  S.screen = "question"; S.q = qi;
  const q = PHASES[S.phase].questions[qi];
  S.order = shuffle(q.options.map((_, i) => i));
  S.wrong = []; S.tries = 0; S.solved = false;
  say(q.say, "normal", true);
  render();
}
function goFinal() { S.screen = "final"; say("Você chegou ao fim! Que jornada incrível pelos dados.", "happy", true); render(); }

function answer(idx) {
  const q = PHASES[S.phase].questions[S.q], o = q.options[idx];
  if (o.ok) {
    const pts = pointsFor(S.tries);
    S.score += pts; S.log[S.phase].pts += pts;
    S.solved = true; S.answered++;
    say(pick(PRAISE), "happy", true);
    render();
  } else {
    S.tries++; S.wrong.push(idx); S.lives--; S.log[S.phase].errs++;

    if (S.lives <= 0) {                  // última vida: corta o fluxo agora
      S.lives = 0;
      S.screen = "over";
      S.lastWhy = o.why; S.lastHint = q.hint;   // guarda a explicação do último erro
      say("Ah, as vidas acabaram. Mas dá para recomeçar!", "sad", true);
      modalRoot.innerHTML = "";          // garante que nenhum modal fique aberto
      render(true);                      // renderiza direto o ecrã "over"
      return;
    }

    say("Quase lá! Leia a dica e tente de novo. Você consegue.", "sad", true);
    render(true);
    openErrorModal(o.why, q.hint);
  }
}

function nextStep() {
  const p = PHASES[S.phase];
  if (S.q < p.questions.length - 1) goQuestion(S.q + 1);
  else { S.screen = "recap"; say(`Fase ${S.phase + 1} concluída! Vamos relembrar o que você aprendeu?`, "happy", true); render(); }
}
function restart() { modalRoot.innerHTML = ""; S = newState(); say("Oi! Eu sou a Lumi, a fadinha dos dados. Este é o Bigode, meu gatinho. Vamos aprender Estatística juntos?", "happy", true); render(); }

/* =========================================================
   8. MODAIS
   ========================================================= */
function openModal(html, info) {
  modalRoot.innerHTML = `<div class="overlay" id="ov"><div class="modal ${info ? "info" : ""}" role="dialog" aria-modal="true" aria-labelledby="mt">${html}</div></div>`;
  const b = modalRoot.querySelector("[data-close]"); if (b) b.focus();
  modalRoot.querySelectorAll("[data-close]").forEach((x) => x.onclick = closeModal);
  $("#ov").addEventListener("click", (e) => { if (e.target.id === "ov") closeModal(); });
}
function closeModal() {
  const wasOver = S.lives <= 0;
  modalRoot.innerHTML = "";
  if (wasOver) { S.screen = "over"; say("Não desista! Vamos tentar de novo?", "sad", true); render(); }
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modalRoot.innerHTML) closeModal(); });

function openErrorModal(why, hint) {
  const dead = S.lives <= 0;
  openModal(`
    <div class="head"><div class="fairy-wrap">${fairySVG("sad")}</div><h3 id="mt">Ops, não foi dessa vez</h3></div>
    <div class="box"><b>Por que não:</b> ${why}</div>
    <div class="box"><b>Dica da Lumi:</b> ${hint}</div>
    <p>${dead ? "Suas vidas acabaram." : `Você perdeu uma vida e tem ${S.lives} ${S.lives === 1 ? "restante" : "restantes"}.`}</p>
    <button class="btn" data-close type="button">${dead ? "Continuar" : "Tentar de novo"}</button>`);
}

function openTheory() {
  const p = PHASES[S.phase];
  openModal(`<h3 id="mt">Teoria da Fase ${S.phase + 1}: ${p.title}</h3>` +
    p.lessons.map((l) => `<div class="card-lesson"><h4 class="lesson-title">${l.title}</h4>${l.html}</div>`).join("") +
    `<button class="btn" data-close type="button">Voltar ao desafio</button>`, true);
}

/* =========================================================
   9. LABORATÓRIO DE DADOS (Fase 2)
   ========================================================= */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]"); if (!btn) return;
  const lab = btn.closest(".lab"); if (!lab) return;
  const n = btn.dataset.action === "roll100" ? 100 : 1;
  let rounds = +(lab.dataset.rounds || 0), hits = +(lab.dataset.hits || 0), last = [];
  for (let i = 0; i < n; i++) {
    last = [0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6));
    rounds++; if (last.filter((v) => v === 6).length === 1) hits++;
  }
  lab.dataset.rounds = rounds; lab.dataset.hits = hits;
  lab.querySelector("[data-dice]").innerHTML = last.map((v) => `<span class="die ${v === 6 ? "six" : ""}">${v}</span>`).join("");
  lab.querySelector("[data-out]").textContent = `Rodadas: ${rounds} · exatamente um 6 em ${hits} (${(hits / rounds * 100).toFixed(1).replace(".", ",")}%). Teoria: 34,7%.`;
});

$("#restart").onclick = restart;
S = newState();
say("Oi! Eu sou a Lumi, a fadinha dos dados. Este é o Bigode, meu gatinho. Vamos aprender Estatística juntos?", "happy", true);
render();
