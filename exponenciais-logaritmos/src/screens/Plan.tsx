import React from "react";
import { LESSONS } from "../lessons";
import { PHASES } from "../lessons/types";
import { useStore } from "../state";

export function Plan() {
  const { go } = useStore();
  return (
    <section className="plan">
      <header className="screen-head">
        <p className="eyebrow">Visão geral do planejamento</p>
        <h1 className="screen-title">Exponenciais e Logaritmos · 4 aulas · 200 minutos</h1>
        <p className="lead">
          Progressão: da potência ao logaritmo (Aula 1), definição e cálculo (Aula 2), propriedades e equações (Aula 3), aplicações e simulado (Aula 4).
        </p>
      </header>

      <div className="plan-time">
        <h2 className="section-h">Distribuição do tempo por fase</h2>
        <div className="legend">
          {PHASES.map((p, i) => (
            <span key={p} className="legend-i">
              <i className={`sw ph-${i}`} />
              {p}
            </span>
          ))}
        </div>
        {LESSONS.map((l) => (
          <div key={l.n} className="pt-row">
            <span className="pt-l">Aula {l.n}</span>
            <div className="pt-bar" role="img" aria-label={PHASES.map((p) => `${p}: ${l.steps.filter((s) => s.phase === p).reduce((a, s) => a + s.min, 0)} min`).join("; ")}>
              {PHASES.map((p, i) => {
                const m = l.steps.filter((s) => s.phase === p).reduce((a, s) => a + s.min, 0);
                return m ? (
                  <span key={p} className={`pt-seg ph-${i}`} style={{ flexGrow: m }}>
                    {m}′
                  </span>
                ) : null;
              })}
            </div>
            <span className="pt-t">{l.steps.reduce((a, s) => a + s.min, 0)} min</span>
          </div>
        ))}
        <p className="muted small">
          Base sugerida: 5′ mobilização, 10′ exploração, 15′ prática, 15′ aplicação, 5′ avaliação. A Aula 1 amplia a prática (conversões). A Aula 4 amplia a aplicação (simulado de cinco questões) e reduz a prática orientada.
        </p>
      </div>

      <div className="plan-grid">
        {LESSONS.map((l) => (
          <article key={l.n} className="plan-card">
            <p className="map-n">Aula {l.n}</p>
            <h2>{l.title}</h2>
            <p className="plan-goal">
              <b>Objetivo.</b> {l.goal}
            </p>
            <h3>Atividades</h3>
            <ol className="plan-steps">
              {l.steps.map((s, i) => (
                <li key={i}>
                  <button type="button" onClick={() => go({ kind: "lesson", lesson: l.n, step: i })}>
                    {s.title}
                  </button>
                  <span>{s.min}′</span>
                </li>
              ))}
            </ol>
            <h3>Habilidades desenvolvidas</h3>
            <ul className="bul">
              {l.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3>Avaliação</h3>
            <ul className="bul">
              {l.assessment.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="plan-refs">
        <div>
          <h3>BNCC · Ensino Médio</h3>
          <ul className="bul">
            <li>
              <b>EM13MAT304</b> Resolver e elaborar problemas com funções exponenciais, interpretando a variação das grandezas (ex.: Matemática Financeira).
            </li>
            <li>
              <b>EM13MAT305</b> Resolver e elaborar problemas com funções logarítmicas em contextos como abalos sísmicos, pH, radioatividade e Matemática Financeira.
            </li>
            <li>
              <b>EM13MAT303</b> Interpretar e comparar juros simples e compostos, destacando o crescimento linear ou exponencial.
            </li>
            <li>
              <b>EM13MAT403</b> Relacionar representações de funções exponencial e logarítmica em tabelas e no plano cartesiano.
            </li>
          </ul>
        </div>
        <div>
          <h3>Matriz de Referência do ENEM · Matemática</h3>
          <ul className="bul">
            <li>
              <b>Competência de área 5</b>: modelar e resolver problemas que envolvem variáveis socioeconômicas ou técnico-científicas, usando representações algébricas.
            </li>
            <li>
              <b>H19–H21</b>: identificar representações algébricas, interpretar gráficos cartesianos e resolver situações-problema modeladas algebricamente.
            </li>
          </ul>
          <h3>Instrumentos de avaliação</h3>
          <ul className="bul">
            <li>Diagnóstica: votações de abertura e mapa de erros da Aula 2.</li>
            <li>Formativa: práticas com feedback, correspondência e desafio coletivo.</li>
            <li>Somativa: avaliação rápida (Aula 1), checagem (Aula 3) e simulado (Aula 4).</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
