# Estatística em Jogo

Site interativo para aprender Estatística e Probabilidade, dividido em duas abas principais:

- Teoria: 8 capítulos explicados passo a passo, detalhando a lógica por trás de cada fórmula.
- Questões: 46 questões organizadas em 8 blocos, além de um treino interativo de fórmulas. O utilizador monta o cálculo utilizando blocos de arrastar/selecionar (no estilo Duolingo) e visualiza a resolução detalhada ao final.

O jogo conta com sistema de 5 vidas por bloco, pontuação e conta com a ajuda dos personagens guias (a fada Lumi e o gato Bigode).

---

## Como Executar

- Localmente: Basta abrir o ficheiro index.html em qualquer navegador de internet.
- Versão Online: Acesse Estatística em Jogo no GitHub Pages (https://raissa-s-C.github.io/NOME-DO-REPO/).

---

## Como Publicar no GitHub Pages

1. Envie todos os ficheiros para o repositório, mantendo o index.html na raiz.
2. No GitHub, aceda a Settings -> Pages.
3. Em Branch, selecione main (ou master) e a pasta / (root).
4. Guarde, aguarde cerca de um minuto e aceda ao link gerado.

---

## Estrutura do Projeto

```text
├── index.html           # Página principal (Single Page Application)
├── css/
│   └── style.css        # Estilos globais e componentes da interface
└── js/
    ├── ui.js            # Funções utilitárias de interface
    ├── app.js           # Lógica de navegação entre abas
    ├── theory-view.js   # Renderização da aba Teoria
    ├── quiz.js          # Lógica do quiz (vidas, pontos e progresso)
    ├── builder.js       # Montador interativo de fórmulas
    ├── characters.js    # Personagens guias em formato SVG
    └── data/
        ├── theory.js    # Conteúdo textual dos capítulos
        └── q1.js ...    # Banco de dados de questões e treinos
