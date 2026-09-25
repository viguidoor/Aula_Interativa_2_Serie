import React from "react";
import { useStore } from "../state";
import { LESSONS } from "../lessons";
import { M, Pow, Log } from "../components/Math";
import { Kbd } from "../components/ui";

export function Home() {
  const { state, go } = useStore();
  return (
    <section className="home">
      <div className="home-hero">
        <div className="home-title">
          <p className="eyebrow">Colégio Estadual Júlia Wanderley · 2ª série B · Ensino Médio</p>
          <h1>
            Exponenciais e Logaritmos
            <span>do zero ao ENEM</span>
          </h1>
          <p className="lead">Quatro aulas de 50 minutos. Uma pergunta atravessa todas: qual é o expoente?</p>
        </div>
        <div className="home-eq" aria-hidden="true">
          <M big="xl">
            <Pow b={<span className="hl-blue">2</span>} e={<span className="hl-green">5</span>} /> = 32
          </M>
          <span className="home-arrow">⟺</span>
          <M big="xl">
            <Log b={<span className="hl-blue">2</span>}>32</Log> = <span className="hl-green">5</span>
          </M>
        </div>
      </div>

      <ol className="map">
        {LESSONS.map((l) => {
          const seen = l.steps.filter((_, i) => state.visited[`${l.n}-${i}`]).length;
          const pct = Math.round((seen / l.steps.length) * 100);
          return (
            <li key={l.n} className="map-card">
              <div className="map-head">
                <span className="map-n">Aula {l.n}</span>
                <span className="map-pct">{pct}% visitado</span>
              </div>
              <h2>{l.title}</h2>
              <p className="map-goal">{l.goal}</p>
              <div className="map-bar" aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>
              <ol className="map-steps">
                {l.steps.map((s, i) => (
                  <li key={i}>
                    <button type="button" className={state.visited[`${l.n}-${i}`] ? "seen" : ""} onClick={() => go({ kind: "lesson", lesson: l.n, step: i })}>
                      <span className="ms-n">{i + 1}</span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ol>
              <button type="button" className="btn btn-primary" onClick={() => go({ kind: "lesson", lesson: l.n, step: 0 })}>
                Abrir aula {l.n}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="home-foot">
        <span>
          <Kbd>←</Kbd> <Kbd>→</Kbd> etapas
        </span>
        <span>
          <Kbd>1</Kbd>–<Kbd>4</Kbd> aulas
        </span>
        <span>
          <Kbd>H</Kbd> início
        </span>
        <span>
          <Kbd>P</Kbd> painel do professor
        </span>
        <span>
          <Kbd>T</Kbd> cronômetro
        </span>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => go({ kind: "plan" })}>
          Ver planejamento da unidade
        </button>
      </div>
    </section>
  );
}
