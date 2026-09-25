# Exponenciais e Logaritmos: do zero ao ENEM
Aplicação de sala de aula · 2ª série B · 4 aulas de 50 min

## O que vem no pacote

```
src/
  App.tsx                 ← componente raiz (export default)
  main.tsx                ← só para rodar fora do Figma Make (Vite/Bun)
  state.tsx               ← estado global: navegação, respostas, gabaritos (sessionStorage)
  styles.css              ← identidade visual completa (tokens, layout 16:9, responsivo)
  components/
    Math.tsx              ← notação matemática (potência, log, fração, raiz) sem dependências
    Graph.tsx             ← gráficos SVG (linear/log, curvas, pontos, barras)
    ui.tsx                ← Screen, Quiz, StepReveal, RevealCard, Tabs, Slider, QuickCheck…
    Timer.tsx             ← cronômetro regressivo
  lessons/
    types.ts              ← tipos Lesson/Step e fases do planejamento
    Lesson1.tsx … Lesson4.tsx  ← telas, conteúdos, gabaritos e notas do professor
    index.ts
  screens/
    Home.tsx              ← tela inicial com mapa das 4 aulas
    Plan.tsx              ← visão geral do planejamento
    TeacherPanel.tsx      ← painel do professor
```

Dependências: apenas `react` e `react-dom` (18 ou 19). Nenhum login, serviço pago ou banco de dados.

## Como levar para o Figma Make

1. No Figma, crie um arquivo **Figma Make** novo.
2. Abra a visualização de código do Make.
3. Recrie a pasta `src/` do pacote: um arquivo por vez, com os mesmos nomes e caminhos.
   - O `App.tsx` do pacote **substitui** o `App.tsx` que o Make gera.
   - Mantenha `import "./styles.css";` no `App.tsx` e coloque `styles.css` ao lado dele.
     Se o seu projeto guarda o CSS em `styles/globals.css`, cole o conteúdo lá e ajuste o import.
   - `main.tsx` não é necessário no Make, que já tem o próprio ponto de entrada.
4. Se preferir, anexe os arquivos no chat do Make e peça:
   *"Use exatamente estes arquivos, sem reescrever o conteúdo. App.tsx é o componente raiz."*
5. Publique pelo botão de publicação do Make para abrir no projetor.

> A interface do Figma Make muda com frequência. Se algum nome de menu estiver diferente, o princípio é o mesmo: os arquivos entram como código do projeto.

## Rodar fora do Figma (opcional)

- **Arquivo offline:** abra `exponenciais-logaritmos-offline.html` direto no navegador. Não precisa de internet; sem conexão, as fontes do Google caem para fontes do sistema.
- **Projeto:** `npm create vite@latest` (React + TS), copie a pasta `src/` e rode `npm run dev`.

## Uso em sala

| Tecla | Ação |
|---|---|
| ← → (ou passador de slides) | etapa anterior / próxima |
| 1 – 4 | abrir aula |
| H | início |
| P | painel do professor (notas, tempos, gabaritos, reinício) |
| T | cronômetro |
| Esc | fechar painel |

- **Gabaritos ficam ocultos** até você clicar em "Liberar gabarito" na atividade. No painel, "Feedback imediato" mostra certo/errado na hora, mas as resoluções continuam fechadas.
- **Reiniciar:** cada atividade tem o próprio botão. O painel limpa uma aula inteira ou tudo (para uma nova turma) sem perder a navegação.
- O progresso e as respostas ficam guardados enquanto a aba estiver aberta (sessionStorage).

## Onde editar o conteúdo

Cada tela é uma função `S1`, `S2`… em `lessons/LessonN.tsx`. No fim de cada arquivo, o objeto `lessonN` define título, objetivo, habilidades, avaliação e, para cada etapa: `title`, `phase`, `min` (duração) e `notes` (orientações do painel do professor).
