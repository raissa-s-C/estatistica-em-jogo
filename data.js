/* Conteúdo do jogo: lições, desafios e resumos de cada fase.
   Os ajudantes abaixo montam o HTML para manter os dados enxutos. */

/* ---------- Ajudantes de HTML ---------- */
const p = (t) => `<p>${t}</p>`;
const F = (...l) => `<div class="formula">${l.join("<br>")}</div>`;                       // caixa de fórmulas
const C = (...c) => `<div class="concepts" data-n="${c.length}">${c.map(([b, s]) => `<div class="concept"><b>${b}</b><span>${s}</span></div>`).join("")}</div>`;
const B = (cls, label, t) => `<div class="${cls}"><b>${label}</b> ${t}</div>`;           // cls: tip | fun | example
const TB = (cap, head, ...rows) => `<div class="tablewrap"><table class="t" aria-label="${cap}"><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
const LS = (title, say, ...h) => ({ title, say, html: h.join("") });                     // uma lição

/* ---------- Ajudantes de questões ----------
   Alternativas: "*" marca a correta; "texto::motivo do erro" explica por que está errada. */
const opt = (s) => { const ok = s[0] === "*", [t, why] = (ok ? s.slice(1) : s).split("::"); return { t, ok, why }; };
const steps = (a) => `<p>Passo a passo:</p><ol>${a.map((s) => `<li>${s}</li>`).join("")}</ol>`;
const Q = (n, say, prompt, o, hint, st) => ({ n, say, prompt, options: o.map(opt), hint, explain: steps(st) });
const TF = (n, say, prompt, truth, hint, st) => ({ ...Q(n, say, prompt, [(truth ? "*" : "") + "Verdadeiro", (truth ? "" : "*") + "Falso"], hint, st), fixed: true });
const M = (n, say, prompt, items, choices, hint, st) => ({ n, say, prompt, match: items, choices, hint, explain: steps(st) });   // items: [texto, índice da resposta]

/* ---------- Curva normal em SVG ----------
   shade "right"/"left" colore a cauda a partir de z; marks = linhas verticais extras. */
function bellSVG({ shade, z, marks = [], caption }) {
  const L = 20, W = 280, B0 = 112, H = 88;
  const px = (x) => L + ((x + 3.5) / 7) * W, py = (x) => B0 - (Math.exp(-x * x / 2) / 0.3989) * H;
  const pts = (a, b) => { const d = []; for (let x = a; x <= b + 1e-9; x += 0.1) d.push(`${px(x).toFixed(1)} ${py(x).toFixed(1)}`); return d; };
  let tail = "";
  if (shade) { const a = shade === "right" ? z : -3.5, b = shade === "right" ? 3.5 : z; tail = `<path d="M${px(a)} ${B0} L${pts(a, b).join(" L")} L${px(b)} ${B0}Z" fill="var(--pink)" fill-opacity=".45"/>`; }
  const mk = marks.map((m) => `<line x1="${px(m.z)}" x2="${px(m.z)}" y1="${py(m.z)}" y2="${B0}" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="4 3"/><text x="${px(m.z)}" y="${py(m.z) - 5}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--blue)">${m.label}</text>`).join("");
  const tk = [-3, -2, -1, 0, 1, 2, 3].map((t) => `<text x="${px(t)}" y="${B0 + 14}" text-anchor="middle" font-size="9.5" fill="var(--ink-soft)">${t ? t : "μ"}</text>`).join("");
  return `<svg class="bell" viewBox="0 0 320 132" role="img" aria-label="${caption}">${tail}<path d="M${pts(-3.5, 3.5).join(" L")}" fill="none" stroke="var(--blue)" stroke-width="2.4" stroke-linejoin="round"/><line x1="${L}" x2="${L + W}" y1="${B0}" y2="${B0}" stroke="var(--ink-soft)"/>${mk}${tk}</svg><p class="cap">${caption}</p>`;
}

const MAX_LIVES = 5, LETTERS = "ABCDE";
const PRAISE = ["Isso aí! Você brilhou mais que um vaga-lume.", "Acertou! Eu fiz a dancinha das asas.", "Perfeito! A estatística está ficando fácil para você.", "Muito bem! Mais um passo na trilha dos dados."];

const PHASES = [
/* ============================================================ FASE 1 */
{
  title: "Conceitos iniciais", short: "Conceitos", topic: "Tipos de dados e estatística descritiva x inferencial",
  lessons: [
    LS("Para que serve a Estatística?", "Oi! Eu sou a Lumi, a fadinha dos dados. Vou te guiar por oito fases. Primeiro, vamos entender para que serve tudo isso.",
      p("A <b>Estatística</b> é a ciência de coletar, organizar, analisar e interpretar dados para tomar decisões melhores. Ela está por trás do aplicativo que sugere músicas, da prefeitura que decide quantos ônibus colocar em cada horário e da universidade que mede a satisfação dos alunos."),
      C(["Estatística descritiva", "Resume e organiza os dados que você já tem: média das notas, tabela de frequências, gráfico de barras. Só descreve o que foi observado."],
        ["Estatística inferencial", "Usa uma parte dos dados para concluir algo sobre o todo, sempre com margem de incerteza. Ex.: “com 95% de confiança, entre 60% e 70% dos alunos aprovam o restaurante”."]),
      B("fun", "Você sabia?", "O Censo do IBGE tenta contar toda a população do país. Já as pesquisas eleitorais ouvem cerca de duas mil pessoas para representar milhões de eleitores. A segunda estratégia é inferência.")),
    LS("População e amostra", "Esta é a ideia mais importante da fase: quem é o “todo” e quem é só uma “fatia” dele?",
      p("<b>População</b> é o conjunto de todos os elementos que você quer estudar. <b>Amostra</b> é um subconjunto da população, escolhido para estudá-la. Amostrar costuma ser a única saída: perguntar a todos custa caro e, em testes destrutivos (como medir a vida útil de lâmpadas), é impossível."),
      C(["Parâmetro", "Número que descreve a <em>população</em>: média μ, desvio padrão σ, proporção p. Costuma ser desconhecido."],
        ["Estatística amostral", "Número calculado na <em>amostra</em>: média x̄, desvio padrão s, proporção p̂. Serve para estimar o parâmetro."]),
      B("example", "Exemplo", p("Para saber se o Wi-Fi do campus é bom, perguntar só a quem está no laboratório de informática gera uma amostra <em>enviesada</em>. Uma boa amostra é <b>aleatória</b> e <b>representativa</b>: todo aluno tem a mesma chance de ser escolhido."))),
    LS("Tipos de variáveis", "Última lição desta fase: cada dado tem um “tipo”, e o tipo decide quais contas e gráficos fazem sentido.",
      C(["Qualitativa nominal", "Categorias sem ordem. Ex.: curso, linguagem favorita."], ["Qualitativa ordinal", "Categorias com ordem. Ex.: júnior, pleno, sênior."],
        ["Quantitativa discreta", "Resultado de uma <em>contagem</em> (valores inteiros). Ex.: nº de bugs."], ["Quantitativa contínua", "Resultado de uma <em>medição</em>. Ex.: altura, tempo de resposta."]),
      B("tip", "Macete:", "pergunte “eu contei ou eu medi?”. Contou: discreta. Mediu: contínua. Cuidado com números que são só rótulos, como CEP e matrícula: são qualitativos nominais."))
  ],
  recap: ["<b>População</b> é o todo e <b>amostra</b> é uma parte dele.", "<b>Descritiva</b> resume os dados. <b>Inferencial</b> conclui sobre a população a partir da amostra.", "Variáveis são <b>qualitativas</b> (nominal ou ordinal) ou <b>quantitativas</b> (discreta ou contínua).", "Contou: discreta. Mediu: contínua."],
  questions: [
    Q("", "Primeiro desafio! A UFMS quer saber como está o Wi-Fi do campus e entrevista 30 alunos de uma turma de TI.",
      "Um grupo de 30 alunos de uma turma de TI é analisado para descobrir a opinião dos estudantes da UFMS sobre a qualidade do Wi-Fi do campus. Em relação ao total de alunos da UFMS, esse grupo representa:",
      ["Uma população::A população seria o conjunto de todos os alunos da UFMS. Os 30 alunos são só uma parte dele.", "*Uma amostra", "Um censo::Censo é o levantamento de toda a população. Aqui só uma parte foi consultada.", "Um parâmetro::Parâmetro é uma medida numérica da população, não um grupo de pessoas."],
      "Pergunte-se: o grupo inclui todos os alunos da UFMS ou só uma parte deles?",
      ["O “todo” de interesse são os alunos da UFMS: essa é a <b>população</b>.", "Os 30 alunos da turma de TI são apenas uma parte desse todo.", "Uma parte usada para estudar o todo é uma <b>amostra</b>. Conclusões tiradas dela são uma <b>inferência</b>.", "Como a turma de TI pode ser diferente dos outros cursos, a amostra pode ser enviesada."]),
    Q("", "Agora um dado de computação: o tempo que um servidor leva para responder a uma requisição.",
      "Classifique a variável “Tempo de resposta de um servidor, em segundos” (por exemplo: 0,42 s; 1,07 s; 2,315 s).",
      ["Qualitativa nominal::Variáveis qualitativas expressam categorias, não números medidos.", "Qualitativa ordinal::Ordinal também é categoria, só que com ordem. Tempo é numérico.", "Quantitativa discreta::Discreta vem de contagem e assume valores inteiros separados. Tempo pode assumir qualquer valor num intervalo.", "*Quantitativa contínua"],
      "Tempo é contado (1, 2, 3) ou medido (pode ter casas decimais)?",
      ["O resultado é um número, então a variável é <b>quantitativa</b>.", "Tempo é <em>medido</em>, não contado, e pode assumir qualquer valor real em um intervalo (0,42 s; 0,421 s; 0,4213 s...).", "Logo é <b>quantitativa contínua</b>."])
  ]
},

/* ============================================================ FASE 2 */
{
  title: "Probabilidade e combinatória", short: "Probabilidade", topic: "Espaço amostral, contagem, independência, condicional e Bayes",
  lessons: [
    LS("Espaço amostral, eventos e contagem", "Probabilidade é a matemática do acaso. Vamos ao vocabulário e às ferramentas de contagem.",
      p("Um <b>experimento aleatório</b> tem resultado imprevisível, mesmo repetido nas mesmas condições. O <b>espaço amostral</b> Ω é o conjunto de todos os resultados possíveis (dado: Ω = &#123;1, 2, 3, 4, 5, 6&#125;). Um <b>evento</b> é qualquer subconjunto de Ω. Se os resultados são equiprováveis:"),
      F("P(A) = casos favoráveis / casos possíveis = n(A) / n(Ω)", "0 ≤ P(A) ≤ 1 &nbsp;·&nbsp; P(Ω) = 1 &nbsp;·&nbsp; P(não A) = 1 − P(A)", "<b>União:</b> P(A ∪ B) = P(A) + P(B) − P(A ∩ B)"),
      p("Para contar casos favoráveis e possíveis, use as ferramentas da análise combinatória:"),
      F("Fatorial: n! = n · (n−1) · … · 2 · 1", "Combinação (ordem não importa): C(n, k) = n! / [k! · (n−k)!]", "Permutação com repetição: n! / (n₁! · n₂! · …)"),
      B("example", "Exemplo", p("Quantas comissões de 3 pessoas saem de um grupo de 10? C(10, 3) = 10·9·8 / (3·2·1) = <b>120</b>. E quantos anagramas tem a palavra ANA? 3! / 2! = <b>3</b>, pois o A se repete."))),
    LS("Independência, condicional e Bayes", "Agora o que acontece quando um evento influencia o outro. Esta lição serve para as cinco questões da fase.",
      C(["Independentes", "Um evento não altera a chance do outro (sorteios <em>com</em> reposição). P(A ∩ B) = P(A) · P(B)."], ["Condicional", "Chance de A sabendo que B ocorreu. Típica de sorteios <em>sem</em> reposição."]),
      F("P(A | B) = P(A ∩ B) / P(B) &nbsp;⇒&nbsp; P(A ∩ B) = P(B) · P(A | B)", "<b>Probabilidade total:</b> P(B) = Σ P(B | Aᵢ) · P(Aᵢ)", "<b>Bayes:</b> P(A | B) = P(B | A) · P(A) / P(B)"),
      B("example", "Exemplo (sem reposição)", p("Urna com 3 bolas azuis e 2 amarelas, duas retiradas sem reposição, ambas azuis: 3/5 · 2/4 = 6/20 = <b>30%</b>. Na 2ª retirada sobram só 4 bolas, e 2 são azuis.")),
      B("example", "Exemplo (Bayes)", p("A máquina A produz 60% das peças, com 2% de defeito. A máquina B produz 40%, com 5% de defeito. P(defeito) = 0,6·0,02 + 0,4·0,05 = 0,032. Se a peça é defeituosa, P(veio de A) = 0,012 / 0,032 = <b>37,5%</b>.")),
      B("tip", "Macete:", "“<b>e</b>” multiplica as etapas; “<b>ou</b>” soma os caminhos (subtraindo a interseção se os eventos podem ocorrer juntos). “Pelo menos um” = 1 − “nenhum”."))
  ],
  recap: ["P(A) = favoráveis ÷ possíveis. P(A ∪ B) = P(A) + P(B) − P(A ∩ B).", "Com reposição os sorteios são <b>independentes</b>: multiplique. Sem reposição, o total diminui a cada retirada.", "C(n, k) = n! / [k!(n−k)!] conta grupos sem ordem. Permutação com repetição divide pelos fatoriais dos repetidos.", "<b>Bayes</b> inverte a condição: P(A | B) = P(B | A) · P(A) / P(B)."],
  questions: [
    TF("Q37", "Atenção ao “ou”: os dois eventos podem acontecer ao mesmo tempo?",
      "Com reposição, em um baralho de 52 cartas, a probabilidade de a 1ª carta ser de ouros ou a 2ª ser de copas é 5/16.", false,
      "Use P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Com reposição, A e B são independentes.",
      ["Seja A = “1ª carta de ouros” e B = “2ª carta de copas”. Cada naipe tem 13 das 52 cartas: <code>P(A) = 13/52 = 1/4</code> e <code>P(B) = 1/4</code>.", "Com reposição os sorteios são independentes: <code>P(A ∩ B) = 1/4 · 1/4 = 1/16</code>.", "O “ou” pede a união, e os eventos podem ocorrer juntos: <code>P(A ∪ B) = 1/4 + 1/4 − 1/16 = 7/16</code>.", "Conferência pelo complemento: <code>1 − (3/4)(3/4) = 7/16</code>. Como 7/16 ≠ 5/16, a afirmação é <b>falsa</b>."]),
    TF("Q35", "Hora de contar grupos com combinação!",
      "Entre 10 meninas, 4 têm olhos azuis. Escolhendo 3 ao acaso (sem reposição), a probabilidade de pelo menos duas terem olhos azuis é 1/3.", true,
      "“Pelo menos duas” = exatamente 2 azuis ou 3 azuis. Conte grupos com C(n, k).",
      ["Total de grupos de 3 meninas: <code>C(10, 3) = 120</code>.", "Exatamente 2 de olhos azuis (e 1 das 6 que não têm): <code>C(4,2) · C(6,1) = 6 · 6 = 36</code>.", "As 3 de olhos azuis: <code>C(4,3) · C(6,0) = 4</code>.", "<code>P = (36 + 4) / 120 = 40/120 = 1/3</code>. A afirmação é <b>verdadeira</b>."]),
    Q("Q38", "Sorteio sem reposição. Dica da Lumi: some dois caminhos.",
      "Sorteando duas bolas sem reposição de uma urna com 2 vermelhas e 6 brancas, a probabilidade de ambas serem da mesma cor é:",
      ["15/28::Isto é 30/56, o caminho só das duas brancas. Falta somar o das duas vermelhas.", "12/56::Esse valor não corresponde a nenhum dos dois caminhos (VV ou BB).", "24/56::É a chance de cores <em>diferentes</em>, o complementar do pedido.", "1/28::Isto é 2/56, o caminho só das duas vermelhas.", "*32/56"],
      "“Mesma cor” = duas vermelhas OU duas brancas. Calcule cada caminho com a probabilidade condicional e some.",
      ["Mesma cor significa VV ou BB: caminhos que não ocorrem juntos, então somamos.", "<code>P(VV) = 2/8 · 1/7 = 2/56</code> (na 2ª retirada sobra 1 vermelha em 7 bolas).", "<code>P(BB) = 6/8 · 5/7 = 30/56</code> (sobram 5 brancas em 7 bolas).", "<code>P = 2/56 + 30/56 = 32/56 = 4/7 ≈ 0,5714</code>.", "Conferência: cores diferentes dão 24/56, e 32/56 + 24/56 = 1."]),
    Q("Q39", "Aqui a ordem importa: a palavra precisa sair letra por letra.",
      "Uma urna contém 7 bolas gravadas com A, A, A, C, G, R, R. Extraindo uma a uma, a probabilidade de obter a palavra CARCARA é:",
      ["17/48::Não corresponde ao produto das probabilidades condicionais das 7 retiradas.", "1/3::Valor alto demais: a sequência exata de 7 letras é muito improvável.", "15/38::Não corresponde ao produto das probabilidades condicionais das 7 retiradas.", "*1/210", "2/5::Valor alto demais para uma sequência exata de 7 letras."],
      "Multiplique as probabilidades condicionais de cada retirada, na ordem C, A, R, C, A, R, A. Cada letra usada sai da urna.",
      ["<b>Nota:</b> para formar CARCARA (C-A-R-C-A-R-A) são necessárias 3 letras A, 2 C e 2 R. O PDF traz “G” na urna, que tratei como erro de digitação de “C”. Com um único C a palavra seria impossível.", "Urna: 3A, 2C, 2R (7 bolas), sem reposição. Probabilidade de cada retirada na ordem: <code>C: 2/7 · A: 3/6 · R: 2/5 · C: 1/4 · A: 2/3 · R: 1/2 · A: 1/1</code>.", "Produto: <code>(2·3·2·1·2·1·1) / (7·6·5·4·3·2·1) = 24/5040 = 1/210</code>.", "Conferência: o número de sequências distintas é <code>7! / (3!·2!·2!) = 210</code>, e só uma é CARCARA."]),
    Q("Q36", "Esta pede Bayes: sabendo o resultado, qual moeda foi usada?",
      "Lançou-se uma de duas moedas (uma honesta e outra viciada com duas caras) e obteve-se cara. A probabilidade de ter vindo da moeda viciada é:",
      ["1/2::Seria a chance antes de ver o resultado. Ver “cara” aumenta a suspeita sobre a moeda viciada.", "3/4::Esse valor é P(cara), a probabilidade total, e não a condicional pedida.", "3/5::Não confere com a aplicação do teorema de Bayes.", "1/3::É menor que 1/2, mas ver “cara” deveria <em>aumentar</em> a chance da moeda viciada.", "*2/3"],
      "Bayes: P(V | cara) = P(cara | V) · P(V) / P(cara). Calcule P(cara) pela probabilidade total.",
      ["Eventos: V = moeda viciada, H = honesta. Escolha ao acaso: <code>P(V) = P(H) = 1/2</code>.", "Chance de cara em cada moeda: <code>P(cara | V) = 1</code> e <code>P(cara | H) = 1/2</code>.", "Probabilidade total: <code>P(cara) = 1·1/2 + 1/2·1/2 = 3/4</code>.", "Bayes: <code>P(V | cara) = (1 · 1/2) / (3/4) = 2/3</code>."])
  ]
},

/* ============================================================ FASE 3 */
{
  title: "Variáveis aleatórias e modelos discretos", short: "Discretos", topic: "Função de probabilidade, Binomial, Geométrica e Hipergeométrica",
  lessons: [
    LS("Variável aleatória e função de probabilidade", "Uma variável aleatória transforma o acaso em número. Vamos aprender a reconhecer uma distribuição válida.",
      p("Uma <b>variável aleatória</b> X associa um número a cada resultado do experimento (nº de caras, nº de chamadas, tempo de espera). Quando X assume valores contáveis, ela é <b>discreta</b>, e sua <b>função de probabilidade</b> g(x) = P(X = x) precisa obedecer a duas condições:"),
      F("1) g(x) ≥ 0 para todo x", "2) Σ g(x) = 1 (a soma de todas as probabilidades é 1)"),
      p("Dela saem a média (esperança) e a variância, que resumem o centro e a dispersão da variável:"),
      F("E(X) = Σ x · g(x) &nbsp;·&nbsp; Var(X) = E(X²) − [E(X)]² &nbsp;·&nbsp; DP = √Var(X)"),
      B("example", "Exemplo", p("Dado honesto: g(x) = 1/6 para x = 1…6. E(X) = (1+2+3+4+5+6)/6 = <b>3,5</b>. E(X²) = 91/6, então Var(X) = 91/6 − 3,5² ≈ <b>2,92</b>."))),
    LS("Binomial, Geométrica e Hipergeométrica", "Três modelos, três perguntas diferentes. Leia as palavras-chave e use o laboratório de dados no final.",
      C(["Binomial", "Nº de sucessos em <em>n</em> tentativas independentes, cada uma com chance <em>p</em> (com reposição)."], ["Geométrica", "Nº da tentativa em que sai o <em>primeiro</em> sucesso. Sem limite de tentativas."], ["Hipergeométrica", "Nº de sucessos em <em>n</em> retiradas <em>sem reposição</em> de uma população finita de tamanho N, com K sucessos."]),
      F("<b>Binomial:</b> P(X=k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ &nbsp;·&nbsp; E = np &nbsp;·&nbsp; Var = np(1−p)", "<b>Geométrica:</b> P(X=k) = (1−p)ᵏ⁻¹ · p &nbsp;·&nbsp; E = 1/p", "<b>Hipergeométrica:</b> P(X=k) = C(K,k) · C(N−K, n−k) / C(N,n) &nbsp;·&nbsp; E = nK/N"),
      B("example", "Exemplo (geométrica)", p("Chance de o primeiro 6 sair só no 4º lançamento: (5/6)³ · (1/6) = 125/1296 ≈ <b>9,65%</b>.")),
      B("tip", "Macete:", "se a população é grande e a amostra é pequena (n/N &lt; 5%), a hipergeométrica fica muito próxima da binomial, porque retirar sem reposição quase não muda as proporções."),
      `<div class="lab" data-lab="dice"><b>Laboratório de dados</b>${p("Lance 3 dados e veja com que frequência sai exatamente um 6. Com muitas rodadas, o resultado se aproxima da probabilidade teórica (binomial com n = 3 e p = 1/6).")}<div class="dice-row" data-dice><span class="die">?</span><span class="die">?</span><span class="die">?</span></div><div class="row"><button class="btn alt" type="button" data-action="roll1">Lançar 3 dados</button><button class="btn alt" type="button" data-action="roll100">Lançar 100 vezes</button></div><p class="labout" data-out>Ainda sem lançamentos.</p></div>`),
    LS("Como escolher o modelo", "Esta tabela resolve a maioria das questões. Volte aqui quando bater a dúvida.",
      TB("Guia de escolha do modelo discreto", ["O que o problema pede", "Modelo", "Exemplo"],
        ["Sucessos em n tentativas fixas, com reposição", "<b>Binomial</b>", "Faces 1 em 3 lançamentos"], ["Em que tentativa vem o 1º sucesso", "<b>Geométrica</b>", "Lançar até sair 6"],
        ["Sucessos em retiradas <em>sem</em> reposição", "<b>Hipergeométrica</b>", "Lote de 120 peças, analisa 5"], ["Eventos em um intervalo, dada uma taxa", "<b>Poisson</b> (próxima fase)", "Chamadas por hora"]),
      B("tip", "Atenção:", "“pelo menos k” = 1 − P(X ≤ k−1). “Ganhar a série” de n jogos = ganhar mais da metade deles. Escreva o evento com símbolos antes de calcular."))
  ],
  recap: ["g(x) é função de probabilidade se g(x) ≥ 0 e Σ g(x) = 1. Isso permite achar parâmetros desconhecidos.", "<b>Binomial</b>: sucessos em n tentativas. <b>Geométrica</b>: tentativa do 1º sucesso. <b>Hipergeométrica</b>: sem reposição.", "Binomial: C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ. Geométrica: (1−p)ᵏ⁻¹ · p.", "“Pelo menos” se resolve pelo complementar."],
  questions: [
    Q("", "Hora de usar a binomial! Lembre das três posições possíveis para o 6.",
      "Um dado de 6 faces é lançado 3 vezes. Qual é a probabilidade de sair a face 6 exatamente uma vez?",
      ["*≈ 34,72%", "≈ 16,67%::1/6 é a chance de um único lançamento dar 6. Aqui há 3 lançamentos e o 6 pode aparecer em qualquer um.", "≈ 42,13%::Esse valor é 1 − (5/6)³, a chance de <em>pelo menos um</em> 6.", "≈ 57,87%::Esse valor é (5/6)³, a chance de <em>nenhum</em> 6."],
      "Binomial: n = 3, k = 1, p = 1/6. Multiplique por C(3,1) = 3 posições possíveis para o 6.",
      ["Cada lançamento é independente: <code>p = 1/6</code> de dar 6 e <code>q = 5/6</code> de não dar.", "O único 6 pode estar na 1ª, 2ª ou 3ª posição: <code>C(3,1) = 3</code> arranjos (6xx, x6x, xx6).", "Cada arranjo tem probabilidade <code>(1/6)·(5/6)·(5/6) = 25/216</code>.", "Total: <code>3 · 25/216 = 75/216 ≈ 0,3472</code>."]),
    Q("Q1", "Funções de probabilidade precisam somar 1 e nunca ser negativas. Use as duas regras.",
      "Seja a distribuição de probabilidades da variável aleatória X: g(−2) = −(a − b), g(−1) = b, g(0) = a, g(1) = a + b e g(2) = b − a. Assinale a alternativa que representa as condições sobre a e b para que g(x) seja uma função de probabilidade.",
      ["*0 &lt; a &lt; 1/4 e b = 1/4", "0 &lt; a &lt; 1/2 e b = 1/3::Com b = 1/3 a soma é 4b = 4/3, diferente de 1.", "0 &lt; a &lt; 1/3 e b = 1/4::Com a = 0,3 teríamos g(2) = b − a &lt; 0, probabilidade negativa.", "0 &lt; a &lt; 1/3 e b = 1::Com b = 1 a soma é 4, diferente de 1.", "0 &lt; a &lt; 3/7 e a = 1/2::É contraditória (a = 1/2 está fora de 0 &lt; a &lt; 3/7) e a soma exige b = 1/4."],
      "Some as cinco probabilidades para achar b. Depois imponha g(x) ≥ 0 em cada ponto para limitar a.",
      ["Soma: <code>(b−a) + b + a + (a+b) + (b−a) = 4b</code> (note que g(−2) = −(a−b) = b−a).", "Condição Σ g(x) = 1: <code>4b = 1 ⇒ b = 1/4</code>.", "Condição g(x) ≥ 0: <code>g(±2) = b − a ≥ 0 ⇒ a ≤ 1/4</code>, e <code>g(0) = a &gt; 0</code>.", "Logo <code>0 &lt; a &lt; 1/4</code> e <code>b = 1/4</code>.", "<b>Nota:</b> no PDF as alternativas (a) e (c) aparecem como “a = b = 1/4”, que parece erro de digitação de “b = 1/4”. Com essa leitura a única coerente é a (a)."]),
    TF("Q2", "Confira o resultado com a binomial. Você já calculou algo parecido!",
      "Um dado de seis faces é jogado três vezes. A probabilidade de sair exatamente um 6 é 25/72.", true,
      "Calcule C(3,1) · (1/6) · (5/6)² e simplifique a fração.",
      ["Binomial com <code>n = 3</code>, <code>k = 1</code>, <code>p = 1/6</code>.", "<code>P = C(3,1) · (1/6) · (5/6)² = 3 · 25/216 = 75/216</code>.", "Simplificando por 3: <code>75/216 = 25/72 ≈ 0,3472</code>. A afirmação é <b>verdadeira</b>."]),
    M("Q3", "Leia o enunciado e identifique o processo: com ou sem reposição? Conta sucessos ou espera o primeiro?",
      "Associe corretamente cada situação ao modelo de probabilidade:",
      [["Dado honesto lançado 3 vezes, de forma independente. Interesse: número de vezes que ocorreu a face 1.", 0], ["Dado honesto lançado sucessivamente, de forma independente, até ocorrer a face 6. Interesse: quantos lançamentos foram necessários.", 1], ["Dado honesto lançado 3 vezes, mas a face ocorrida num lançamento é retirada para o próximo lançamento. Interesse: número de faces ímpares obtidas.", 2]],
      ["Distribuição Binomial", "Distribuição Geométrica", "Distribuição Hipergeométrica", "Distribuição de Poisson"],
      "Pergunte: há número fixo de tentativas? A probabilidade se mantém? O que está sendo contado?",
      ["Situação 1: 3 tentativas independentes com p = 1/6 constante, contando sucessos: <b>Binomial</b>.", "Situação 2: repete-se até o <em>primeiro</em> 6, sem limite de tentativas: <b>Geométrica</b>.", "Situação 3: a face sai do dado, então não há reposição e as probabilidades mudam a cada lançamento. Contar ímpares em retiradas sem reposição de população finita: <b>Hipergeométrica</b>.", "Poisson não se aplica: não há taxa média por intervalo de tempo ou espaço."]),
    Q("Q7", "Qual modelo conta tentativas até o primeiro sucesso?",
      "Uma urna tem cinco bolas verdes e quatro brancas. Se eu estiver interessado em encontrar a probabilidade de ter que tirar cinco bolas, com reposição, até sair uma branca, estou diante de um modelo de distribuição:",
      ["discreto binomial::A binomial conta sucessos em um número <em>fixo</em> de tentativas. Aqui o número de retiradas é a incógnita.", "discreto hipergeométrico::A hipergeométrica exige retiradas <em>sem</em> reposição. Aqui há reposição.", "contínuo normal::Número de retiradas é uma contagem (discreta), não uma medida contínua.", "*discreto geométrico", "contínuo exponencial::Modela tempo de espera contínuo. Aqui a espera é medida em retiradas inteiras."],
      "O que é a incógnita: quantos sucessos em n tentativas, ou quantas tentativas até o primeiro sucesso?",
      ["As retiradas são com reposição e independentes, com <code>p(branca) = 4/9</code> em cada uma.", "O interesse é <em>quantas retiradas</em> serão necessárias até a 1ª bola branca: é a definição da <b>geométrica</b>.", "Exemplo de uso: <code>P(X = 5) = (5/9)⁴ · (4/9) ≈ 0,0423</code>."]),
    Q("Q10", "Ganhar a série significa vencer mais partidas que o adversário. Quantas B precisa vencer?",
      "Duas atléticas A e B disputam uma série de 8 partidas de vôlei (sem empate). Sabendo que a probabilidade de a atlética A ganhar uma partida é 0,58, a probabilidade de a atlética B ganhar a série fica entre:",
      ["10% e 15%::O cálculo da cauda binomial dá cerca de 20,6%, acima dessa faixa.", "0% e 5%::A chance de B vencer ao menos 5 de 8 é bem maior que 5%.", "40% e 45%::Esse valor está acima do resultado (≈ 20,6%).", "*20% e 25%", "30% e 35%::Esse valor está acima do resultado (≈ 20,6%)."],
      "B ganha a série se vencer pelo menos 5 das 8 partidas, com p(B) = 1 − 0,58 = 0,42.",
      ["Chance de B em cada partida: <code>p = 1 − 0,58 = 0,42</code>. Número de vitórias de B: <code>X ~ Binomial(8; 0,42)</code>.", "B ganha a série com mais vitórias que A: <code>X ≥ 5</code> (com 4 a 4 há empate).", "<code>P(X=5) = C(8,5)·0,42⁵·0,58³ ≈ 0,1428</code>; <code>P(X=6) ≈ 0,0517</code>; <code>P(X=7) ≈ 0,0107</code>; <code>P(X=8) ≈ 0,0010</code>.", "Soma: <code>P(X ≥ 5) ≈ 0,2062</code>, ou seja, entre 20% e 25%."]),
    Q("Q14", "Sorteio sem reposição de um lote finito: hipergeométrica (ou binomial como aproximação).",
      "Um lote tem 120 peças e analisam-se 5 peças. O lote é aceito se houver no máximo 1 peça defeituosa. Sabendo que a taxa de defeito é de 15%, a probabilidade de aceitação do lote fica entre:",
      ["*80% e 90%", "60% e 70%::Esse valor está abaixo do resultado (≈ 83,8%).", "50% e 60%::Esse valor está bem abaixo do resultado (≈ 83,8%).", "90% e 100%::Esse valor está acima do resultado (≈ 83,8%).", "70% e 80%::Esse valor está abaixo do resultado (≈ 83,8%)."],
      "15% de 120 peças = 18 defeituosas. Some P(0 defeituosas) + P(1 defeituosa) na hipergeométrica.",
      ["Peças defeituosas no lote: <code>K = 0,15 · 120 = 18</code>; boas: <code>102</code>. Amostra sem reposição: <code>n = 5</code>.", "<code>P(X=k) = C(18,k) · C(102, 5−k) / C(120, 5)</code> com <code>C(120,5) = 190.578.024</code>.", "<code>P(X≤1) = [C(102,5) + 18·C(102,4)] / C(120,5) = (83.291.670 + 76.492.350) / 190.578.024 ≈ 0,8384</code>.", "Verificação pela binomial (n/N = 4% &lt; 5%): <code>0,85⁵ + 5·0,15·0,85⁴ ≈ 0,8352</code>. Ambas ficam entre 80% e 90%."]),
    Q("Q16", "Cada alternativa é uma distribuição. Qual delas soma 1 e vem de uma retirada sem reposição?",
      "Retirando-se dois bombons aleatoriamente de uma caixa de 8 bombons (tipos amargo A e branco B), qual a distribuição de probabilidades para o número de bombons de chocolate branco X = 0, 1 ou 2?",
      ["*p(0) = 10/28, p(1) = 15/28, p(2) = 3/28", "p(0) = 15/28, p(1) = 10/28, p(2) = 3/28::Não é consistente com nenhuma composição da caixa: com 3 brancos, p(1) seria 15/28 e p(0) seria 10/28.", "p(0) = 9/25, p(1) = 15/25, p(2) = 1/25::O denominador 25 não aparece em retiradas sem reposição de 8 bombons (o total é C(8,2) = 28).", "p(0) = 10/24, p(1) = 8/24, p(2) = 6/24::O denominador 24 não aparece em retiradas sem reposição de 8 bombons (o total é C(8,2) = 28)."],
      "O total de pares é C(8,2) = 28. Teste qual composição (nº de bombons brancos) reproduz os numeradores.",
      ["Total de pares possíveis: <code>C(8,2) = 28</code>. Os denominadores 25 e 24 já eliminam as alternativas (c) e (d).", "<b>Nota:</b> o PDF não informa quantos bombons de cada tipo há. Testando 3 brancos e 5 amargos: <code>p(0) = C(5,2)/28 = 10/28</code>.", "<code>p(1) = C(3,1)·C(5,1)/28 = 15/28</code> e <code>p(2) = C(3,2)/28 = 3/28</code>.", "Soma: <code>10 + 15 + 3 = 28</code>, logo vale 1. Só a alternativa (a) é uma hipergeométrica válida. A (b) não corresponde a nenhuma composição."]),
    TF("Q19", "Atenção ao “pelo menos 4”: use o complementar com a binomial.",
      "Acredita-se que 20% dos moradores têm alergia a poluentes. A probabilidade de que pelo menos 4 moradores tenham alergia entre 13 selecionados ao acaso é de 0,2526.", true,
      "P(X ≥ 4) = 1 − P(X ≤ 3), com X ~ Binomial(13; 0,2).",
      ["<code>X ~ Binomial(n = 13, p = 0,2)</code>. “Pelo menos 4” é <code>P(X ≥ 4) = 1 − P(X ≤ 3)</code>.", "<code>P(0) ≈ 0,0550</code>; <code>P(1) ≈ 0,1787</code>; <code>P(2) ≈ 0,2680</code>; <code>P(3) ≈ 0,2457</code>.", "<code>P(X ≤ 3) ≈ 0,7473</code>, logo <code>P(X ≥ 4) ≈ 0,2527</code>.", "O valor do enunciado (0,2526) coincide até a diferença de arredondamento (a tabela trunca 0,25267). A afirmação é <b>verdadeira</b>."])
  ]
},

/* ============================================================ FASE 4 */
{
  title: "Poisson e Exponencial", short: "Poisson", topic: "Contagem de eventos por intervalo e tempo entre eventos",
  lessons: [
    LS("Distribuição de Poisson", "Chamadas por hora, falhas por página, acidentes por dia: a Poisson conta eventos em um intervalo.",
      p("Use a <b>Poisson</b> quando os eventos ocorrem de forma independente, a uma <b>taxa média</b> conhecida, em um intervalo de tempo ou espaço. Ela não tem um número máximo de tentativas, e seu único parâmetro é λ."),
      F("P(X = k) = e<sup>−λ</sup> · λᵏ / k! , &nbsp; k = 0, 1, 2, …", "E(X) = Var(X) = λ", "<b>Ajuste do intervalo:</b> λ = taxa × tamanho do intervalo"),
      B("example", "Exemplo (ajuste de intervalo)", p("48 chamadas por hora equivalem a 0,8 por minuto. Em 5 minutos, λ = 0,8 · 5 = <b>4</b>. Então P(X = 3) = e<sup>−4</sup> · 4³ / 3! ≈ <b>0,1954</b>.")),
      B("tip", "Macete:", "“no máximo k” é P(X ≤ k), a soma de P(0) até P(k). “Mais de k” ou “pelo menos k+1” é 1 − P(X ≤ k). Se o enunciado diz “enviar para outro porto”, descubra qual é o limite de atendimento.")),
    LS("Distribuição exponencial", "A exponencial é a Poisson vista pelo relógio: em vez de contar eventos, cronometra a espera.",
      p("A <b>exponencial</b> é uma distribuição <em>contínua</em> do tempo de espera entre eventos de um processo de Poisson com taxa λ."),
      F("f(t) = λ · e<sup>−λt</sup>, t ≥ 0 &nbsp;·&nbsp; E(T) = 1/λ &nbsp;·&nbsp; Var(T) = 1/λ²", "P(T ≤ t) = 1 − e<sup>−λt</sup> &nbsp;·&nbsp; P(T &gt; t) = e<sup>−λt</sup>"),
      B("example", "Exemplo", p("Se chegam 48 chamadas por hora (λ = 0,8 por minuto), o tempo médio entre chamadas é 1/0,8 = 1,25 min. A chance de esperar mais de 2 minutos é e<sup>−0,8·2</sup> = e<sup>−1,6</sup> ≈ <b>20,2%</b>.")),
      B("fun", "Você sabia?", "A exponencial é “sem memória”: se você já esperou 10 minutos, a chance de esperar mais 5 é a mesma de quem acabou de chegar. Por isso, a probabilidade de a espera ser menor que a própria média é sempre 1 − e<sup>−1</sup> ≈ 63,2%."))
  ],
  recap: ["<b>Poisson</b>: P(X=k) = e<sup>−λ</sup>λᵏ/k!, com média e variância iguais a λ. Ajuste λ ao tamanho do intervalo.", "<b>Exponencial</b>: tempo entre eventos, P(T &gt; t) = e<sup>−λt</sup>, média 1/λ.", "“No máximo k” soma de 0 a k. “Mais de k” é o complementar.", "Poisson conta, exponencial cronometra."],
  questions: [
    Q("", "Escolha o modelo certo. Procure a palavra-chave no enunciado.",
      "Uma central telefônica recebe, em média, 48 chamadas por hora. Qual modelo é o mais adequado para calcular a probabilidade de chegarem exatamente 3 chamadas em um intervalo de 5 minutos?",
      ["Binomial::A binomial exige número fixo de tentativas e probabilidade p. Aqui só há uma taxa média por unidade de tempo.", "Geométrica::A geométrica conta tentativas até o primeiro sucesso, não chamadas num intervalo.", "*Poisson", "Normal::A normal descreve variáveis contínuas. Número de chamadas é uma contagem.", "Exponencial::A exponencial modela o tempo <em>entre</em> chamadas, não quantas chegam no intervalo."],
      "O problema dá uma taxa média de eventos por tempo e pede uma contagem num intervalo.",
      ["Há uma <em>contagem</em> de eventos em um intervalo de tempo, com taxa média conhecida: <b>Poisson</b>.", "Ajuste a taxa ao intervalo: <code>λ = 48/60 · 5 = 4</code> chamadas em 5 minutos.", "<code>P(X = 3) = e⁻⁴ · 4³ / 3! = 0,0183 · 64 / 6 ≈ 0,1954</code>."]),
    TF("Q5", "Agora calcule o valor e compare com a faixa do enunciado.",
      "Chamadas telefônicas chegam à razão de 48 por hora no balcão de reservas da Catar Airlines. A probabilidade de chegarem 3 chamadas em um intervalo de tempo de 5 minutos é um valor entre 10% e 15%.", false,
      "Ajuste λ para 5 minutos e use P(X=3) = e^(−λ) · λ³ / 3!.",
      ["Taxa por minuto: <code>48/60 = 0,8</code>. Em 5 minutos: <code>λ = 0,8 · 5 = 4</code>.", "<code>P(X = 3) = e⁻⁴ · 4³ / 3! = 0,018316 · 64 / 6 ≈ 0,1954</code>.", "O valor é cerca de <b>19,5%</b>, fora da faixa de 10% a 15%. A afirmação é <b>falsa</b>."]),
    TF("Q13", "“No máximo 3” significa somar de 0 até 3.",
      "Um telefone recebe em média 5 chamadas por minuto. O valor 0,2650 é a probabilidade de o telefone receber, no máximo, 3 chamadas durante 1 minuto.", true,
      "P(X ≤ 3) = P(0) + P(1) + P(2) + P(3), com λ = 5.",
      ["<code>X ~ Poisson(λ = 5)</code> para 1 minuto. “No máximo 3”: <code>P(X ≤ 3)</code>.", "<code>P(0) = e⁻⁵ ≈ 0,0067</code>; <code>P(1) ≈ 0,0337</code>; <code>P(2) ≈ 0,0842</code>; <code>P(3) ≈ 0,1404</code>.", "Soma: <code>0,0067 + 0,0337 + 0,0842 + 0,1404 ≈ 0,2650</code>. A afirmação é <b>verdadeira</b>."]),
    Q("Q12", "Descubra quando o petroleiro precisa ser desviado: quando chegam mais de 3.",
      "O número de petroleiros que chegam a uma refinaria por dia tem média igual a 2 (Poisson). As instalações atendem no máximo 3 petroleiros por dia. A probabilidade de em um dia ter que enviar petroleiros para outro porto fica entre:",
      ["20% e 25%::Esse valor está acima do resultado (≈ 14,3%).", "30% e 35%::Esse valor está bem acima do resultado (≈ 14,3%).", "40% e 45%::Esse valor está bem acima do resultado (≈ 14,3%).", "0% e 5%::Esse valor está abaixo do resultado (≈ 14,3%).", "*10% e 15%"],
      "Há desvio quando chegam mais de 3: P(X ≥ 4) = 1 − P(X ≤ 3), com λ = 2.",
      ["<code>X ~ Poisson(λ = 2)</code>. Há desvio se <code>X ≥ 4</code>.", "<code>P(0) ≈ 0,1353</code>; <code>P(1) ≈ 0,2707</code>; <code>P(2) ≈ 0,2707</code>; <code>P(3) ≈ 0,1804</code>.", "<code>P(X ≤ 3) ≈ 0,8571</code>.", "<code>P(X ≥ 4) = 1 − 0,8571 ≈ 0,1429</code>, entre 10% e 15%."]),
    TF("Q17", "Converta a taxa anual para diária e cuidado com o “superior a 0,35”.",
      "A cada ano ocorrem 450 mortes acidentais por arma de fogo na faixa de 15 a 24 anos (considerando 365 dias por ano). A probabilidade de haver duas ou mais mortes em um dia típico é superior a 0,35.", false,
      "λ = 450/365 por dia. P(X ≥ 2) = 1 − P(0) − P(1).",
      ["Taxa diária: <code>λ = 450/365 ≈ 1,2329</code>.", "<code>P(0) = e^(−1,2329) ≈ 0,2915</code> e <code>P(1) = λ · P(0) ≈ 0,3593</code>.", "<code>P(X ≥ 2) = 1 − 0,2915 − 0,3593 ≈ 0,3492</code>.", "Como <code>0,3492 &lt; 0,35</code>, a probabilidade <em>não</em> é superior a 0,35. A afirmação é <b>falsa</b> (por pouco)."]),
    Q("Q15", "A probabilidade de esperar menos que a média na exponencial é sempre a mesma.",
      "Uma consulta médica dura em média 10 minutos (distribuição exponencial). A probabilidade de uma consulta durar menos que o tempo médio é:",
      ["1/12::Não corresponde à função de distribuição da exponencial.", "*1 − e^(−1)", "1/600::Não corresponde à função de distribuição da exponencial.", "e^(−1)::Esse é P(T &gt; média), o complementar do pedido.", "e^(−1/12)::Não corresponde à função de distribuição com média 10."],
      "λ = 1/média. P(T &lt; t) = 1 − e^(−λt). Aqui t é igual à média.",
      ["Média 10 min: <code>λ = 1/10</code> por minuto.", "<code>P(T &lt; 10) = 1 − e^(−λ·10) = 1 − e^(−10/10) = 1 − e⁻¹</code>.", "Valor numérico: <code>1 − 0,3679 ≈ 0,6321</code> (63,2%)."])
  ]
},

/* ============================================================ FASE 5 */
{
  title: "Densidade e uniforme", short: "Contínuas", topic: "Função densidade de probabilidade e distribuição uniforme",
  lessons: [
    LS("Variáveis contínuas e função densidade", "Em variáveis contínuas, probabilidade vira área. Vamos aprender a usar a integral.",
      p("Uma variável <b>contínua</b> é descrita por uma <b>função densidade</b> f(x). A probabilidade de um intervalo é a <em>área</em> sob a curva, e a de um valor exato é zero."),
      F("f(x) ≥ 0 &nbsp;·&nbsp; ∫ f(x) dx = 1 (área total)", "P(a &lt; X &lt; b) = ∫ f(x) dx de a até b", "P(X = x) = 0 &nbsp;·&nbsp; E(X) = ∫ x · f(x) dx"),
      B("example", "Exemplo", p("Seja f(x) = 2x para 0 ≤ x ≤ 1. Área total: ∫ 2x dx = x² de 0 a 1 = 1 ✓. P(X &lt; 0,5) = 0,5² = <b>0,25</b>.")),
      B("tip", "Macete:", "para achar uma constante desconhecida (como o k de um limite), iguale a área total a 1 e resolva a equação.")),
    LS("Distribuição uniforme", "A uniforme é a mais democrática: todos os pontos do intervalo são igualmente prováveis.",
      p("Em uma <b>uniforme</b> em [a, b], a densidade é constante, e a probabilidade de um subintervalo é seu comprimento dividido pelo comprimento total."),
      F("f(x) = 1 / (b − a), a ≤ x ≤ b", "P(c &lt; X &lt; d) = (d − c) / (b − a)", "E(X) = (a + b) / 2 &nbsp;·&nbsp; Var(X) = (b − a)² / 12"),
      B("example", "Exemplo", p("Um ônibus passa a cada 10 minutos e você chega ao acaso: X ~ U(0, 10). P(esperar mais de 7 min) = (10 − 7)/10 = <b>0,3</b>. Espera média = 5 min.")),
      B("tip", "Atenção:", "problemas de “chegada aleatória em um intervalo de horário” viram uniforme. Converta os horários em minutos antes de calcular."))
  ],
  recap: ["Densidade: f(x) ≥ 0 e área total = 1. P(a &lt; X &lt; b) é a área entre a e b.", "Para achar um parâmetro desconhecido, iguale ∫ f(x) dx a 1.", "Uniforme: f = 1/(b−a), P = comprimento do intervalo ÷ (b−a).", "Média da uniforme: (a+b)/2."],
  questions: [
    Q("Q11", "Integre a densidade e iguale a 1 para achar k.",
      "Seja X uma variável aleatória com função de densidade f(x) = 3x para x entre 2 e k. Calcule o valor de k.",
      ["3,1::Com k = 3,1 a área seria 1,5 · (9,61 − 4) ≈ 8,4, muito maior que 1.", "3::Com k = 3 a área seria 1,5 · (9 − 4) = 7,5, maior que 1.", "148/59::Não satisfaz a equação 1,5 · (k² − 4) = 1.", "√(15/17)::Esse valor é menor que 2, fora do domínio (k deve ser maior que 2).", "*√(14/3)"],
      "A área total sob f(x) = 3x entre 2 e k precisa ser 1. Integre e isole k.",
      ["Condição: <code>∫ 3x dx de 2 até k = 1</code>.", "Primitiva: <code>(3/2)·x²</code>. Então <code>(3/2)·(k² − 4) = 1</code>.", "Isolando: <code>k² − 4 = 2/3 ⇒ k² = 14/3</code>.", "Como k &gt; 2: <code>k = √(14/3) ≈ 2,16</code>."]),
    Q("Q18", "Chegada ao acaso em um intervalo de horário: pense em uniforme, e converta para minutos.",
      "O professor X chega para a aula entre 20h15 e 20h40. Se uma pessoa vai até a sala entre 20h25 e 20h39, qual a probabilidade de encontrar o professor já na sala?",
      ["15/40::Usa um denominador (40) que não corresponde ao intervalo de 25 minutos.", "25/39::Usa 39 como denominador, sem relação com o intervalo.", "*14/25", "24/40::Usa um denominador (40) que não corresponde ao intervalo de 25 minutos.", "15/25::Corresponderia a um intervalo de 15 minutos, mas o intervalo dado é de 14."],
      "Chegada do professor T ~ Uniforme(20h15; 20h40), isto é, 25 minutos. Qual é o comprimento do intervalo de interesse?",
      ["Chegada do professor: <code>T ~ U(15, 40)</code> em minutos após 20h, intervalo de <code>40 − 15 = 25</code> min.", "Intervalo de interesse: de 20h25 a 20h39, de comprimento <code>39 − 25 = 14</code> min.", "<code>P = comprimento / 25 = 14/25 = 0,56</code>.", "<b>Nota:</b> o enunciado do PDF é ambíguo. Entre as alternativas, 14/25 é a que corresponde a P(25 &lt; T &lt; 39) com T uniforme. Se a pessoa também chegasse ao acaso em [25, 39], o resultado seria 17/25, que não consta nas opções."]),
    M("Q20", "Calcule cada probabilidade como comprimento ÷ 5. O intervalo total é de 5 a 10.",
      "Seja X uma variável aleatória uniforme no intervalo de 5 a 10. Relacione cada probabilidade ao seu valor:",
      [["P(X &gt; 8,5)", 0], ["P(8 &lt; X &lt; 9)", 1], ["P(|X − 7,5| &gt; 2)", 2], ["P(X &lt; 7)", 3]],
      ["0,3", "1/5", "0,2", "2/5", "1/2"],
      "X ~ U(5, 10): f = 1/5. P = comprimento do intervalo ÷ 5.",
      ["<code>P(X &gt; 8,5) = (10 − 8,5)/5 = 1,5/5 = 0,3</code>.", "<code>P(8 &lt; X &lt; 9) = (9 − 8)/5 = 1/5</code>.", "<code>|X − 7,5| &gt; 2</code> significa X &lt; 5,5 ou X &gt; 9,5: <code>(0,5 + 0,5)/5 = 0,2</code>.", "<code>P(X &lt; 7) = (7 − 5)/5 = 2/5</code>."])
  ]
},
/* ============================================================ FASE 6 */
{
  title: "Normal e Teorema Central do Limite", short: "Normal", topic: "Escore z, percentis e distribuição de somas e médias",
  lessons: [
    LS("A distribuição normal e o escore z", "Chegou o famoso sino! Com o escore z você resolve qualquer normal usando uma tabela só.",
      p("A <b>normal</b> é simétrica, em forma de sino, definida pela média μ e pelo desvio padrão σ. Para calcular probabilidades, <b>padronizamos</b> o valor: o escore <b>z</b> diz quantos desvios padrão x está acima (+) ou abaixo (−) da média."),
      F("z = (x − μ) / σ &nbsp;⇔&nbsp; x = μ + z · σ", "Regra empírica: 68% em μ ± 1σ · 95% em μ ± 2σ · 99,7% em μ ± 3σ"),
      bellSVG({ shade: "right", z: 1.28, marks: [{ z: 1.28, label: "z ≈ 1,28" }], caption: "Os 10% maiores valores de uma normal ficam à direita de z ≈ 1,28 (área rosa)." }),
      B("example", "Exemplo", p("Notas ~ N(70; 10). A chance de tirar mais de 85: z = (85 − 70)/10 = 1,5, e P(Z &gt; 1,5) = 1 − 0,9332 = <b>6,68%</b>."))),
    LS("Percentis e problemas inversos", "Quando o problema já dá a probabilidade e pede o valor (VIP, nota de corte), o caminho é inverso.",
      p("No problema inverso, você parte da probabilidade, busca o z na tabela e volta para a escala original com <code>x = μ + z·σ</code>. Valores de z que mais aparecem:"),
      TB("Valores de z usuais", ["Percentil (área à esquerda)", "z", "Uso comum"], ["80%", "0,84", "20% maiores"], ["90%", "1,28", "10% maiores"], ["95%", "1,64 (ou 1,645)", "5% maiores / IC 90%"], ["97,5%", "1,96", "IC de 95%"], ["99%", "2,33", "1% maiores"]),
      B("example", "Exemplo", p("Os 5% menores valores têm z = −1,64. Com μ = 100 e σ = 20: x = 100 − 1,64·20 = <b>67,2</b>.")),
      B("tip", "Macete:", "“10% maiores” = percentil 90 (z positivo). “5% menores” = percentil 5 (z negativo). Desenhe o sino e sombreie a região antes de olhar a tabela.")),
    LS("Somas, médias e o Teorema Central do Limite", "Quando você soma ou tira a média de muitas variáveis, o resultado fica normal, mesmo que as variáveis originais não sejam.",
      p("Para <b>n</b> variáveis independentes com média μ e desvio padrão σ:"),
      F("<b>Soma</b> T = X₁ + … + Xₙ : &nbsp; μ<sub>T</sub> = n·μ &nbsp;,&nbsp; σ<sub>T</sub> = σ·√n", "<b>Média</b> x̄ : &nbsp; μ<sub>x̄</sub> = μ &nbsp;,&nbsp; σ<sub>x̄</sub> = σ / √n"),
      p("O <b>Teorema Central do Limite</b> garante que, para n grande (em geral n ≥ 30), tanto a soma quanto a média são aproximadamente normais, qualquer que seja a distribuição original."),
      B("example", "Exemplo", p("Caixas com peso médio 10 kg e desvio 2 kg. Uma carga de 25 caixas tem média 250 kg e desvio 2·√25 = 10 kg. P(carga &gt; 270 kg) = P(Z &gt; 2) ≈ <b>2,3%</b>.")))
  ],
  recap: ["<b>z = (x − μ)/σ</b>. Para achar x a partir de um percentil: x = μ + zσ.", "z usuais: 1,28 (90%), 1,64 (95%), 1,96 (97,5%), 2,33 (99%).", "<b>Soma</b> de n variáveis: média nμ e desvio σ√n. <b>Média</b>: μ e σ/√n.", "Pelo <b>TCL</b>, para n grande a soma e a média são aproximadamente normais."],
  questions: [
    Q("Q9 (A)", "Os 10% maiores começam no percentil 90. Qual é o z?",
      "Considere que o saldo médio dos clientes de um banco é uma variável aleatória normal com média de R$ 2.000,00 e desvio padrão de R$ 250,00. Quanto você precisa de saldo médio para se tornar um cliente VIP (10% maiores saldos)?",
      ["2410::Corresponde a z ≈ 1,64, que deixa só 5% acima. Seria o corte para os 5% maiores.", "2310::Corresponde a z ≈ 1,24, abaixo do necessário para os 10% maiores.", "2318::Corresponde a z ≈ 1,27. O valor pedido usa z = 1,28.", "*2320", "2420::Corresponde a z ≈ 1,68, que deixa menos de 5% acima."],
      "Os 10% maiores começam no percentil 90, onde z ≈ 1,28. Depois use x = μ + z · σ.",
      ["Estar entre os 10% maiores é estar acima do percentil 90. Na normal padrão, <code>z₉₀ ≈ 1,28</code>.", "Volte para a escala do saldo: <code>x = μ + z·σ = 2000 + 1,28 · 250</code>.", "<code>x = 2000 + 320 = 2320</code> (com z = 1,2816, 2320,40)."]),
    Q("Q9 (B)", "Agora é a cauda inferior: o z será negativo.",
      "Com os mesmos dados (média R$ 2.000,00; desvio padrão R$ 250,00): abaixo de qual saldo médio o cliente receberá propaganda extra (5% menores saldos)?",
      ["1580::Corresponde a z = −1,68, que deixa menos de 5% abaixo.", "*1590", "1595::Corresponde a z = −1,62, que deixa mais de 5% abaixo.", "1592::Corresponde a z = −1,63, um pouco acima do corte de 5%.", "1610::Corresponde a z = −1,56, que deixa mais de 5% abaixo."],
      "Os 5% menores estão no percentil 5: z ≈ −1,64. Use x = μ + z · σ.",
      ["Estar entre os 5% menores é estar abaixo do percentil 5. Pela simetria, <code>z = −1,64</code>.", "<code>x = 2000 + (−1,64) · 250 = 2000 − 410</code>.", "<code>x = 1590</code> (com z = −1,645, 1588,75). A alternativa mais próxima é 1590."]),
    TF("Q6", "Calcule o z de 10 ppm e veja qual área fica acima dele.",
      "A concentração de um poluente em água liberada por uma fábrica tem distribuição normal com média 8 e desvio padrão 1,5 ppm. Portanto, espera-se uma chance de 27,0% de que num dia a concentração do poluente exceda o limite regulatório de 10 ppm.", false,
      "z = (10 − 8) / 1,5. Procure P(Z &gt; z) na tabela.",
      ["Padronização: <code>z = (10 − 8)/1,5 = 1,33</code>.", "Cauda superior: <code>P(X &gt; 10) = P(Z &gt; 1,33) = 1 − 0,9082 ≈ 0,0918</code>.", "O resultado é cerca de <b>9,2%</b>, bem diferente de 27,0%. A afirmação é <b>falsa</b>."]),
    TF("Q8", "Duas caudas: some a chance de ficar abaixo de 0,608 com a de ficar acima de 0,620.",
      "O diâmetro X de rolamentos de esfera fabricados por certa indústria tem distribuição normal (média = 0,614; desvio padrão = 0,002522). As esferas são boas se o diâmetro estiver dentro do intervalo (0,61 a 0,618); recuperáveis se estiver em (0,608 a 0,61) ou (0,618 a 0,62); e defeituosas se estiver em valores menores que 0,608 ou maiores que 0,620. Escolhendo-se uma esfera ao acaso, a probabilidade de ela ser considerada defeituosa é menor que 2%.", true,
      "Padronize 0,608 e 0,620. Eles são simétricos em relação à média 0,614.",
      ["Defeituosa: <code>X &lt; 0,608</code> ou <code>X &gt; 0,620</code>.", "<code>z₁ = (0,608 − 0,614)/0,002522 = −2,38</code> e <code>z₂ = (0,620 − 0,614)/0,002522 = +2,38</code>.", "Cada cauda: <code>P(Z &lt; −2,38) = 0,0087</code>. Pela simetria, a segunda cauda é igual.", "<code>P(defeituosa) = 2 · 0,0087 ≈ 0,0173 = 1,73%</code>, que é menor que 2%. A afirmação é <b>verdadeira</b>."]),
    Q("Q21", "Se 120 de 600 passam, os aprovados são os 20% melhores. Qual percentil isso é?",
      "Em um concurso com 600 candidatos e 120 vagas, a nota média foi 75 com desvio padrão de 8 (distribuição normal). A nota mínima para classificação fica entre:",
      ["75 e 80::O corte de 20% maiores está acima de 80: z = 0,84 dá 81,7.", "*80 e 85", "85 e 90::Com corte em 85 (z = 1,25), só cerca de 10% seriam classificados, menos que os 20% das vagas.", "70 e 75::Estas notas estão abaixo da média, e passariam mais de 50% dos candidatos.", "65 e 70::Estas notas estão abaixo da média, e passariam mais de 50% dos candidatos."],
      "120/600 = 20% dos candidatos são aprovados. A nota de corte é o percentil 80 (z ≈ 0,84).",
      ["Fração classificada: <code>120/600 = 20%</code>. A nota mínima é o <b>percentil 80</b>.", "Na normal padrão, <code>z₈₀ ≈ 0,84</code>.", "<code>x = 75 + 0,84 · 8 = 75 + 6,72 = 81,72</code>, entre 80 e 85."]),
    Q("Q4", "Pense na carga total: média e desvio da soma dos 36 fardos.",
      "Os pesos dos fardos recebidos por um depósito têm média de 200 kg e desvio padrão de 30 kg. Qual a probabilidade de 36 fardos recebidos ao acaso e carregados em um elevador não excederem o limite de segurança de 7668 kg?",
      ["*Entre 90% e 100%", "Entre 70% e 80%::O z da carga total é 2,6, o que dá cerca de 99,5%, bem acima dessa faixa.", "Entre 80% e 90%::O z da carga total é 2,6, o que dá cerca de 99,5%, acima dessa faixa.", "Entre 60% e 70%::O z da carga total é 2,6, o que dá cerca de 99,5%, bem acima dessa faixa.", "Entre 50% e 60%::O z da carga total é 2,6, o que dá cerca de 99,5%, bem acima dessa faixa."],
      "Soma de 36 fardos: média 36·200, desvio 30·√36. Calcule z para 7668.",
      ["Carga total T de n = 36 fardos: <code>μ<sub>T</sub> = 36 · 200 = 7200</code> kg.", "Desvio da soma: <code>σ<sub>T</sub> = 30 · √36 = 180</code> kg.", "<code>z = (7668 − 7200)/180 = 468/180 = 2,6</code>.", "<code>P(T ≤ 7668) = P(Z ≤ 2,6) ≈ 0,9953</code> (aprox. normal pelo TCL), entre 90% e 100%."])
  ]
},

/* ============================================================ FASE 7 */
{
  title: "Distribuições amostrais e intervalos de confiança", short: "Confiança", topic: "Erro padrão, correção de população finita e intervalos de confiança",
  lessons: [
    LS("Distribuição amostral da média", "Se você repetisse a amostragem muitas vezes, as médias formariam uma distribuição. É dela que sai a inferência.",
      p("A <b>média amostral</b> x̄ varia de amostra para amostra. Sua distribuição tem centro na média populacional e dispersão menor que a dos dados individuais:"),
      F("E(x̄) = μ &nbsp;·&nbsp; Var(x̄) = σ² / n &nbsp;·&nbsp; <b>erro padrão</b> = σ / √n", "<b>Sem reposição, população finita N:</b> σ<sub>x̄</sub> = (σ/√n) · √[(N − n)/(N − 1)]"),
      p("O fator √[(N−n)/(N−1)] é a <b>correção de população finita</b>. Ele só importa quando a amostra é uma fração relevante da população (em geral n/N &gt; 5%)."),
      B("example", "Exemplo", p("σ = 10 e n = 25: erro padrão = 10/√25 = <b>2</b>. Quadruplicar a amostra (n = 100) reduz o erro padrão à metade: 10/√100 = 1."))),
    LS("Intervalos de confiança", "Um intervalo de confiança dá um conjunto de valores plausíveis para o parâmetro, em vez de um número só.",
      F("<b>Média (σ conhecido):</b> x̄ ± z · σ/√n", "<b>Média (σ desconhecido):</b> x̄ ± t<sub>n−1</sub> · s/√n", "<b>Proporção:</b> p̂ ± z · √[p̂(1 − p̂)/n]", "<b>Amplitude</b> = 2 · (margem de erro) &nbsp;·&nbsp; <b>Tamanho da amostra:</b> n = (z·σ/E)²"),
      TB("Valores de z para confiança", ["Confiança", "z"], ["90%", "1,645"], ["95%", "1,96"], ["99%", "2,576"]),
      B("tip", "Interpretação:", "“95% de confiança” significa que, se repetíssemos o procedimento muitas vezes, cerca de 95% dos intervalos construídos conteriam o parâmetro. Não é a probabilidade de μ estar neste intervalo específico."),
      B("tip", "Macete:", "mais confiança alarga o intervalo; amostra maior estreita o intervalo (a margem cai com √n). Use t em vez de z quando σ é desconhecido e substituído por s, principalmente com n pequeno."))
  ],
  recap: ["Média amostral: E(x̄) = μ e erro padrão σ/√n. Sem reposição, multiplique pelo fator de correção finita.", "IC da média: x̄ ± z·σ/√n (ou t·s/√n). IC da proporção: p̂ ± z·√(p̂q̂/n).", "z: 1,645 (90%), 1,96 (95%), 2,576 (99%). Amplitude = 2 × margem.", "n = (z·σ/E)² dá o tamanho da amostra para um erro máximo E."],
  questions: [
    Q("Q23", "Liste as 16 amostras mentalmente: com reposição, o erro padrão é σ/√n.",
      "População X = {2, 3, 4, 5} (média = 3,5; variância = 1,25). Extraindo todas as amostras de 2 elementos com reposição (16 amostras), a média e a variância da distribuição amostral das médias valem, respectivamente:",
      ["*3,5 e 0,625", "3,5 e 1,25::1,25 é a variância da população. A variância das médias é σ²/n.", "3,5 e 0,3125::Esse valor seria σ²/4, mas o tamanho da amostra é n = 2.", "1,75 e 0,625::A média das médias é igual à média da população (3,5), não à metade dela.", "7 e 2,5::Esses valores são o dobro dos corretos; as médias não são somadas."],
      "Use E(x̄) = μ e Var(x̄) = σ²/n com n = 2.",
      ["Média das médias: <code>E(x̄) = μ = 3,5</code> (a média amostral é um estimador não viesado).", "Variância da média amostral: <code>Var(x̄) = σ²/n = 1,25/2 = 0,625</code>.", "Conferência pelas 16 médias possíveis (2; 2,5; 3; …; 5): a média delas é 3,5 e a variância é 0,625."]),
    Q("Q27", "Amostra sem reposição de população finita: use o fator de correção.",
      "Peças produzidas (N = 3000) têm média de 172,72 mm e desvio padrão de 7,62 mm. Para 80 amostras de 25 peças cada SEM REPOSIÇÃO, a média e o desvio esperados da distribuição amostral das médias são:",
      ["158,94 e 1,234::A média esperada das médias é a média da população, não 158,94.", "172,22 e 7,62::7,62 é o desvio da população. O desvio das médias é bem menor.", "2,159 e 172,22::Os valores estão trocados: a média vem primeiro, e o desvio é cerca de 1,5.", "201,48 e 7,62::A média e o desvio não conferem com a população.", "*172,22 e 1,518"],
      "Média das médias = μ. Desvio = (σ/√n) · √[(N−n)/(N−1)].",
      ["Média das médias: <code>μ<sub>x̄</sub> = μ</code>. <b>Nota:</b> o enunciado traz 172,72 mas a alternativa correta mostra 172,22 (provável erro de digitação no PDF); é a única com desvio 1,518.", "Erro padrão sem correção: <code>σ/√n = 7,62/√25 = 7,62/5 = 1,524</code>.", "Fator de correção: <code>√[(3000 − 25)/(3000 − 1)] = √(2975/2999) ≈ 0,9960</code>.", "<code>σ<sub>x̄</sub> = 1,524 · 0,9960 ≈ 1,518</code>."]),
    Q("Q26", "σ populacional é conhecido: use z de 95%.",
      "Um ensaio de corrosão em 64 peças teve tempo médio de 200 horas (desvio padrão populacional = 16 horas). O intervalo de 95% de confiança para a média é:",
      ["[198,00 a 202,00]::É a margem de ±2, que corresponde a z = 1, dando só 68% de confiança.", "*[196,08 a 203,92]", "[199,86 a 200,15]::Margem pequena demais, a de um intervalo muito mais estreito que o IC de 95%.", "[198,23 a 201,49]::Intervalo assimétrico, mas o IC da média é simétrico em torno de x̄.", "[195,99 a 205,12]::Intervalo assimétrico, mas o IC da média é simétrico em torno de x̄."],
      "Erro padrão = 16/√64. Margem = 1,96 · erro padrão. IC = x̄ ± margem.",
      ["Erro padrão: <code>σ/√n = 16/√64 = 16/8 = 2</code>.", "Margem de erro (95%): <code>1,96 · 2 = 3,92</code>.", "<code>IC = 200 ± 3,92 = [196,08 ; 203,92]</code>."]),
    Q("Q31", "A amplitude é a largura total do intervalo, ou seja, duas vezes a margem.",
      "Para amostra de tamanho 400 de população infinita com variância igual a 64, a amplitude do intervalo de confiança de 95% para a média é:",
      ["0,8::Esse valor é a margem com z = 1 (0,4 · 2 = 0,8). Falta o z de 95%.", "*1,6", "12,8::Esse valor desconsidera o √n: é 2·σ·0,8.", "3,2::Corresponde a 2 margens de 1,6 (o dobro do que se pede).", "6,4::Esse valor desconsidera o √n."],
      "σ = √64 = 8. Erro padrão = σ/√n. Amplitude = 2 · 1,96 · erro padrão.",
      ["Desvio padrão: <code>σ = √64 = 8</code>. Erro padrão: <code>8/√400 = 8/20 = 0,4</code>.", "Margem de erro (95%): <code>1,96 · 0,4 = 0,784</code>.", "Amplitude: <code>2 · 0,784 = 1,568 ≈ 1,6</code>."]),
    TF("Q28", "σ desconhecido, amostra pequena (n = 20): use a distribuição t de Student.",
      "Uma amostra de n = 20 crianças teve idade média ao falar de 10 meses (desvio padrão amostral = 1,5 meses). O intervalo de 90% de confiança é [9,4 a 10,6] meses.", true,
      "Use t com 19 graus de liberdade (t ≈ 1,729 para 90%): x̄ ± t · s/√n.",
      ["Erro padrão: <code>s/√n = 1,5/√20 ≈ 0,3354</code>.", "Valor crítico (90%, 19 gl): <code>t ≈ 1,729</code>.", "Margem: <code>1,729 · 0,3354 ≈ 0,58</code>. <code>IC = 10 ± 0,58 = [9,42 ; 10,58]</code>.", "Arredondando, <b>[9,4 ; 10,6]</b>. A afirmação é <b>verdadeira</b>."]),
    TF("Q32", "Intervalo para proporção: use p̂ ± z·√(p̂q̂/n).",
      "Em n = 400 ensaios obtiveram-se 80 sucessos. O intervalo de confiança para a proporção populacional com confiança de 0,90 é [0,167 a 0,233].", true,
      "p̂ = 80/400. Erro padrão = √(p̂ · q̂ / n). Use z = 1,645.",
      ["Proporção amostral: <code>p̂ = 80/400 = 0,20</code>.", "Erro padrão: <code>√(0,20 · 0,80 / 400) = √0,0004 = 0,02</code>.", "Margem (90%): <code>1,645 · 0,02 = 0,0329</code>.", "<code>IC = 0,20 ± 0,0329 = [0,167 ; 0,233]</code>. A afirmação é <b>verdadeira</b>."]),
    Q("Q30", "O PDF traz o gabarito “n = 17”. Refaça a conta para entender de onde vem.",
      "A média amostral tem desvio padrão dado por 5 dividido pela raiz quadrada de n e média 20. Qual deve ser o tamanho da amostra n para que a probabilidade de a média amostral estar entre 18 e 22 seja de 0,90 (utilizar z = 1,64)?",
      ["n = 9::Com n = 9 o erro padrão é 5/3 e z = 2/(5/3) = 1,2, que dá menos de 90%.", "*n = 17", "n = 25::Com n = 25 o erro padrão é 1 e z = 2, que dá cerca de 95%, mais que o pedido (n maior que o necessário).", "n = 41::Esse valor é bem maior que o necessário.", "n = 4::Com n = 4 o erro padrão é 2,5 e z = 0,8, que dá pouco mais de 57%."],
      "O intervalo 18 a 22 é a média ± 2. Iguale 2 = z · 5/√n e isole n.",
      ["Média 20 e intervalo 18 a 22: margem de <code>2</code> para cada lado. Para 90%, <code>z = 1,64</code>.", "Condição: <code>1,64 · 5/√n = 2</code> ⇒ <code>√n = 1,64 · 5 / 2 = 4,1</code>.", "<code>n = 4,1² = 16,81</code>. Como n deve ser inteiro, arredonda-se <b>para cima</b>: <code>n = 17</code>."])
  ]
},
/* ============================================================ FASE 8 */
{
  title: "Testes de hipóteses", short: "Hipóteses", topic: "H₀, H₁, estatística de teste, p-valor, α e tipos de erro",
  lessons: [
    LS("A lógica do teste de hipóteses", "Última fase! Agora usamos a amostra para decidir se uma alegação é crível. É como um pequeno julgamento.",
      p("Um <b>teste de hipóteses</b> decide, com base em uma amostra, se uma alegação sobre a população é sustentada pelos dados. Os passos:"),
      `<ol><li>Formule <b>H₀</b> (nula, sempre com igualdade: =, ≤ ou ≥) e <b>H₁</b> (alternativa, o que se quer demonstrar).</li><li>Escolha o nível de significância <b>α</b> (comumente 0,05).</li><li>Calcule a estatística de teste e o <b>p-valor</b>.</li><li>Decida: rejeite H₀ ou não rejeite H₀.</li></ol>`,
      F("<b>Média, σ conhecido:</b> z = (x̄ − μ₀) / (σ/√n)", "<b>Média, σ desconhecido:</b> t = (x̄ − μ₀) / (s/√n), com n−1 graus de liberdade"),
      B("example", "Exemplo", p("A pizzaria alega entregar em menos de 30 min. H₀: μ ≥ 30 e <b>H₁: μ &lt; 30</b> (teste unilateral à esquerda). Quem tem o “ônus da prova” é H₁. Se a alegação fosse “diferente de 30”, o teste seria bilateral.")),
      B("tip", "Atenção:", "olhe a direção da amostra. Se H₁ é μ &gt; 216 e a média amostral é menor que 216, nenhuma estatística vai apoiar H₁. Compare sempre x̄ com μ₀ antes de calcular.")),
    LS("p-valor, α e a decisão", "Dois números decidem tudo: o p-valor e o α. Vamos entender quem é quem.",
      C(["Nível de significância (α)", "O risco máximo aceito de rejeitar H₀ quando ela é verdadeira. Escolhido <em>antes</em> de ver os dados."], ["p-valor", "Probabilidade de obter um resultado tão extremo quanto o observado, <em>supondo H₀ verdadeira</em>. Calculado <em>depois</em> dos dados."]),
      F("Se p-valor &lt; α → <b>rejeita H₀</b> (há evidência a favor de H₁)", "Se p-valor ≥ α → <b>não rejeita H₀</b> (evidência insuficiente)", "<b>Equivalente:</b> rejeita H₀ se z (ou t) cai na região crítica"),
      TB("Valores críticos de z (teste unilateral)", ["α", "z crítico"], ["10%", "1,28"], ["5%", "1,645"], ["1%", "2,33"]),
      bellSVG({ shade: "left", z: -1.88, marks: [{ z: -1.645, label: "limite de α = 5%" }], caption: "Teste unilateral à esquerda: a área rosa é o p-valor (3%). Como ela cabe dentro dos 5% de α, rejeita-se H₀." }),
      B("tip", "Cuidado com dois erros clássicos:", "(1) o p-valor <em>não</em> é a probabilidade de H₀ ser verdadeira. (2) Não rejeitar H₀ não prova que ela é verdadeira: significa apenas que os dados não convenceram. Rejeitar a um α pequeno implica rejeitar a qualquer α maior; não rejeitar a um α implica não rejeitar a qualquer α menor.")),
    LS("Erros do tipo I e II", "Todo teste pode errar de dois jeitos. A analogia do tribunal vai facilitar a memorização.",
      p("Na analogia do tribunal, H₀ é “o réu é inocente” e H₁ é “o réu é culpado”:"),
      TB("Tipos de erro na analogia do julgamento", ["", "H₀ verdadeira (réu inocente)", "H₀ falsa (réu culpado)"],
        ["<b>Rejeita H₀</b> (condena)", "<b>Erro Tipo I</b>: condenar um inocente. Probabilidade = α", "Decisão correta"], ["<b>Não rejeita H₀</b> (absolve)", "Decisão correta", "<b>Erro Tipo II</b>: absolver um culpado. Probabilidade = β"]),
      C(["Alarme de incêndio", "Tipo I: toca sem fogo (falso alarme). Tipo II: há fogo e o alarme não toca."], ["Exame médico", "Tipo I: falso positivo. Tipo II: falso negativo."]),
      p("Há um equilíbrio: diminuir α deixa o teste mais exigente e aumenta β. A saída é <b>aumentar a amostra</b>, que reduz os dois erros. O <b>poder do teste</b> (1 − β) é a chance de detectar um efeito real."))
  ],
  recap: ["<b>H₀</b> é o status quo (com igualdade). <b>H₁</b> é o que você quer demonstrar.", "<b>p &lt; α</b>: rejeita H₀. <b>p ≥ α</b>: não rejeita H₀ (e isso não prova H₀).", "Estatística: z = (x̄ − μ₀)/(σ/√n), ou t com s quando σ é desconhecido.", "<b>Erro Tipo I</b>: rejeitar H₀ verdadeira (α). <b>Erro Tipo II</b>: não rejeitar H₀ falsa (β)."],
  questions: [
    Q("", "Compare o p-valor com o α e decida. A pizzaria está torcendo por você!",
      "Uma pizzaria alega que o tempo de entrega é inferior a 30 minutos. Em um teste de hipóteses (H₀: μ ≥ 30; H₁: μ &lt; 30), obteve-se p-valor = 0,03 com α = 0,05. Qual é a decisão sobre H₀?",
      ["*Rejeitar H₀ e aceitar a alegação da pizzaria", "Não rejeitar H₀, porque 0,03 é menor que 0,05::A regra é o contrário: p-valor menor que α leva à <em>rejeição</em> de H₀.", "Aceitar H₀ como verdade absoluta::Testes nunca provam H₀. No máximo, deixam de rejeitá-la. E aqui nem é o caso.", "Não dá para decidir sem a média da amostra::A decisão se toma comparando o p-valor com α, e os dois já foram dados."],
      "Compare 0,03 com 0,05. Se p &lt; α, o resultado é raro demais sob H₀.",
      ["Compare: <code>p-valor = 0,03</code> e <code>α = 0,05</code>, logo <code>p &lt; α</code>.", "Se H₀ (tempo ≥ 30 min) fosse verdadeira, um resultado tão favorável à pizzaria só ocorreria em 3% das amostras: raro demais.", "Decisão: <b>rejeita-se H₀</b> e aceita-se H₁. Há evidência de que o tempo médio de entrega é menor que 30 minutos."]),
    Q("Q34", "Compare o mesmo p-valor com dois níveis de significância diferentes.",
      "Um teste de hipóteses apresentou p-valor = 0,03. Nos níveis de significância de 1% e 5%, respectivamente, a hipótese nula deve ser:",
      ["*Aceita e rejeitada", "Rejeitada e rejeitada::A 1%, p = 0,03 é maior que α = 0,01, logo H₀ não é rejeitada.", "Pode ou não ser rejeitada::O p-valor já está calculado, então a decisão é determinada em cada nível.", "Aceita e aceita::A 5%, p = 0,03 é menor que α = 0,05, logo H₀ é rejeitada.", "Rejeitada e aceita::Está invertido: rejeita-se no nível maior (5%), não no menor (1%)."],
      "Em cada nível, compare p com α: p &lt; α rejeita; p ≥ α não rejeita.",
      ["Nível 1%: <code>p = 0,03 &gt; α = 0,01</code> ⇒ <b>não se rejeita</b> H₀ (“aceita”).", "Nível 5%: <code>p = 0,03 &lt; α = 0,05</code> ⇒ <b>rejeita-se</b> H₀.", "Resposta: aceita a 1% e rejeitada a 5%."]),
    Q("Q33", "Se H₀ não foi rejeitada a 3%, o que se pode concluir para outros níveis?",
      "Em um teste de hipóteses, a hipótese nula não foi rejeitada ao nível de 3%. Portanto, a hipótese nula:",
      ["Será rejeitada a 5%::A 5% pode ser rejeitada ou não, dependendo do p-valor (por exemplo, 0,04 rejeita e 0,20 não).", "*Será aceita a 1%", "Será aceita a 5%::Não é certo: um p-valor de 0,04 não rejeita a 3% mas rejeita a 5%.", "Será rejeitada a 1%::Se não foi rejeitada a 3%, com mais razão não será a 1% (nível mais rigoroso).", "Pode ser aceita ou rejeitada a 5%::É uma afirmação verdadeira, mas a conclusão que <em>sempre</em> vale é a de 1% (a questão pede o “portanto”)."],
      "Não rejeitar a 3% quer dizer p ≥ 0,03. O que isso implica para α = 1%?",
      ["Não rejeitar a 3% significa <code>p ≥ 0,03</code>.", "A 1%: <code>p ≥ 0,03 &gt; 0,01</code> ⇒ <b>também não se rejeita</b> (“aceita”). Isso vale sempre.", "A 5%: o p-valor pode estar entre 0,03 e 0,05 (rejeita) ou acima de 0,05 (não rejeita), então não há conclusão definitiva.", "<b>Nota:</b> a alternativa (e) também é verdadeira como afirmação de incerteza, mas o “portanto” pede a conclusão garantida, que é a (b)."]),
    TF("Q22", "Antes de calcular, compare a média da amostra com 216: dá para “aumentar”?",
      "A resistência média de lajotas é 216 kg (desvio padrão = 12 kg). Em uma amostra de 30 lajotas com nova composição, obteve-se média de 210 kg. Ao nível de significância de 10%, conclui-se que a resistência média aumentou.", false,
      "Se H₁ é μ &gt; 216 (aumentou), calcule z = (x̄ − 216) / (12/√30) e compare com 1,28.",
      ["Hipóteses: <code>H₀: μ ≤ 216</code> e <code>H₁: μ &gt; 216</code> (aumentou). Teste unilateral à direita, α = 0,10.", "Estatística: <code>z = (210 − 216)/(12/√30) = −6/2,191 ≈ −2,74</code>.", "Região crítica: <code>z &gt; 1,28</code>. Como −2,74 não está nela (a média até diminuiu), <b>não se rejeita H₀</b>.", "Não há evidência de aumento. A afirmação é <b>falsa</b>."]),
    TF("Q24", "σ populacional conhecido: use o teste z unilateral à direita.",
      "Um gerente alega que hóspedes gastam em média mais de R$ 500,00. Em uma amostra de 30 hóspedes, a média foi R$ 530,00 (desvio padrão populacional = 45,00). Para α = 0,05, há evidências de que o gasto médio é maior que R$ 500,00.", true,
      "H₁: μ &gt; 500. z = (530 − 500) / (45/√30). Compare com 1,645.",
      ["<code>H₀: μ ≤ 500</code> e <code>H₁: μ &gt; 500</code>. Teste z unilateral à direita, α = 0,05.", "Erro padrão: <code>45/√30 ≈ 8,216</code>. Estatística: <code>z = 30/8,216 ≈ 3,65</code>.", "Região crítica: <code>z &gt; 1,645</code>. Como 3,65 &gt; 1,645 (p ≈ 0,0001), <b>rejeita-se H₀</b>.", "Há evidência de que o gasto médio supera R$ 500,00. A afirmação é <b>verdadeira</b>."]),
    TF("Q29", "O enunciado diz “não há evidências”. Calcule z e veja se H₀ cai.",
      "Uma amostra de 100 veículos teve velocidade média de 36 km/h (desvio padrão amostral = 4 km/h). Não há evidências para confirmar a alegação de que a velocidade média é maior que 35 km/h com α = 0,05.", false,
      "H₁: μ &gt; 35. Calcule z = (36 − 35) / (4/√100) e compare com 1,645.",
      ["<code>H₀: μ ≤ 35</code> e <code>H₁: μ &gt; 35</code>, α = 0,05 (unilateral à direita).", "Erro padrão: <code>4/√100 = 0,4</code>. Estatística: <code>z = (36 − 35)/0,4 = 2,5</code>.", "Como <code>2,5 &gt; 1,645</code> (p ≈ 0,0062 &lt; 0,05), <b>rejeita-se H₀</b>: há evidência de que a velocidade média é maior que 35 km/h.", "Logo “não há evidências” é <b>falso</b>."]),
    TF("Q25", "σ desconhecido (usa-se s) e n = 36: t de Student, teste unilateral à esquerda.",
      "Uma pizzaria alega entrega em tempo inferior a 30 min. Uma amostra de 36 entregas teve média de 28,5 min e desvio padrão amostral de 3,5 min. Há evidências suficientes para concluir entrega menor que 30 min com α = 0,01.", true,
      "H₁: μ &lt; 30. t = (28,5 − 30) / (3,5/√36), com 35 graus de liberdade.",
      ["<code>H₀: μ ≥ 30</code> e <code>H₁: μ &lt; 30</code>, α = 0,01 (unilateral à esquerda).", "Erro padrão: <code>3,5/√36 = 0,5833</code>. Estatística: <code>t = (28,5 − 30)/0,5833 ≈ −2,57</code>.", "Valor crítico (35 gl, 1% unilateral): <code>t = −2,44</code>. Como <code>−2,57 &lt; −2,44</code> (p ≈ 0,0073 &lt; 0,01), <b>rejeita-se H₀</b>.", "Há evidência de entrega abaixo de 30 min. A afirmação é <b>verdadeira</b>."]),
    Q("", "Desafio final! Use a analogia do tribunal: condenar é rejeitar H₀.",
      "Na analogia com um julgamento, H₀ é “o réu é inocente”. O júri condena uma pessoa que, na verdade, é inocente. Que erro foi cometido?",
      ["Erro Tipo II::O Tipo II é não rejeitar uma H₀ falsa, ou seja, absolver um culpado.", "*Erro Tipo I", "Nenhum erro, a decisão foi correta::Condenar um inocente é rejeitar uma H₀ verdadeira, o que é um erro.", "Erro amostral::Erro amostral vem da variação natural entre amostras. Não é um dos dois erros de decisão do teste."],
      "Condenar = rejeitar H₀. Mas H₀ (inocente) era verdadeira. Qual erro é “rejeitar H₀ verdadeira”?",
      ["Condenar é <b>rejeitar H₀</b> (“o réu é inocente”).", "Como o réu era inocente, H₀ era <em>verdadeira</em>.", "Rejeitar uma H₀ verdadeira é o <b>Erro Tipo I</b>, cuja probabilidade é o nível de significância α.", "Para lembrar: Tipo I = falso alarme. Tipo II = o alarme não tocou."])
  ]
}
];
const TOTAL_Q = PHASES.reduce((n, ph) => n + ph.questions.length, 0);