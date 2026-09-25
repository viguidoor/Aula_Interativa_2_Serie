import React, { useCallback, useEffect, useState } from "react";
import { StoreProvider, useStore } from "./state";
import { LESSONS } from "./lessons";
import { Home } from "./screens/Home";
import { Plan } from "./screens/Plan";
import { TeacherPanel } from "./screens/TeacherPanel";
import { Timer } from "./components/Timer";
import { PHASES } from "./lessons/types";
import "./styles.css";

/**
 * Exponenciais e Logaritmos — do zero ao ENEM
 * Aplicação de sala de aula para projetor (16:9). Sem login, sem servidor.
 *
 * Teclado: ← → (ou PageUp/PageDown) navegam entre etapas · 1–4 abrem aulas · H início
 *          P painel do professor · T cronômetro · Esc fecha painéis
 */
export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { state, go } = useStore();
  const [panel, setPanel] = useState(false);
  const [timer, setTimer] = useState(false);
  const v = state.view;

  const lesson = v.kind === "lesson" ? LESSONS[v.lesson - 1] : null;
  const step = v.kind === "lesson" ? v.step : 0;

  const move = useCallback(
    (d: number) => {
      if (v.kind !== "lesson" || !lesson) return;
      const n = v.step + d;
      if (n >= 0 && n < lesson.steps.length) go({ kind: "lesson", lesson: v.lesson, step: n });
      else if (n >= lesson.steps.length && v.lesson < LESSONS.length) go({ kind: "lesson", lesson: v.lesson + 1, step: 0 });
      else if (n < 0 && v.lesson > 1) go({ kind: "lesson", lesson: v.lesson - 1, step: LESSONS[v.lesson - 2].steps.length - 1 });
    },
    [v, lesson, go]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const tag = t?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") {
        setPanel(false);
        return;
      }
      if (typing) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        move(-1);
      } else if (/^[1-4]$/.test(e.key)) {
        go({ kind: "lesson", lesson: Number(e.key), step: 0 });
      } else if (e.key === "h" || e.key === "H") {
        go({ kind: "home" });
      } else if (e.key === "p" || e.key === "P") {
        setPanel((x) => !x);
      } else if (e.key === "t" || e.key === "T") {
        setTimer((x) => !x);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, go]);

  // garante que a primeira abertura de uma aula conte como visitada
  useEffect(() => {
    if (v.kind === "lesson" && !state.visited[`${v.lesson}-${v.step}`]) go(v);
  }, [v, state.visited, go]);

  const StepC = lesson ? lesson.steps[step].C : null;

  return (
    <div className={`app ${panel ? "with-panel" : ""}`}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => go({ kind: "home" })} title="Início (H)">
          <span className="brand-mark" aria-hidden="true">
            log<sub>a</sub>
          </span>
          <span className="brand-txt">
            <b>Exponenciais e Logaritmos</b>
            <small>2ª série B</small>
          </span>
        </button>
        <nav className="lesson-tabs" aria-label="Aulas">
          {LESSONS.map((l) => {
            const seen = l.steps.filter((_, i) => state.visited[`${l.n}-${i}`]).length;
            const pct = seen / l.steps.length;
            const on = v.kind === "lesson" && v.lesson === l.n;
            return (
              <button key={l.n} type="button" className={`ltab ${on ? "on" : ""}`} onClick={() => go({ kind: "lesson", lesson: l.n, step: on ? step : 0 })} title={`${l.title} (tecla ${l.n})`}>
                <Ring pct={pct} />
                <span className="ltab-txt">
                  <b>Aula {l.n}</b>
                  <small>{l.short}</small>
                </span>
              </button>
            );
          })}
          <button type="button" className={`ltab plan ${v.kind === "plan" ? "on" : ""}`} onClick={() => go({ kind: "plan" })}>
            <span className="ltab-txt">
              <b>Planejamento</b>
              <small>visão geral</small>
            </span>
          </button>
        </nav>
        <div className="top-actions">
          <button type="button" className={`tool ${timer ? "on" : ""}`} onClick={() => setTimer(!timer)} aria-pressed={timer} title="Cronômetro (T)">
            <span aria-hidden="true">⏱</span> Cronômetro
          </button>
          <button type="button" className={`tool teacher ${panel ? "on" : ""}`} onClick={() => setPanel(!panel)} aria-pressed={panel} title="Painel do professor (P)">
            Professor
          </button>
        </div>
      </header>

      <main className="stage" id="stage">
        {v.kind === "home" && <Home />}
        {v.kind === "plan" && <Plan />}
        {lesson && StepC && (
          <div className="step-wrap" key={`${lesson.n}-${step}`}>
            <StepC />
          </div>
        )}
      </main>

      {lesson && (
        <footer className="footbar">
          <button type="button" className="nav-btn" onClick={() => move(-1)} disabled={lesson.n === 1 && step === 0} aria-label="Etapa anterior">
            ←
          </button>
          <div className="steps-strip" role="tablist" aria-label={`Etapas da aula ${lesson.n}`}>
            {lesson.steps.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === step}
                className={`sdot ph-${PHASES.indexOf(s.phase)} ${i === step ? "on" : ""} ${state.visited[`${lesson.n}-${i}`] ? "seen" : ""}`}
                onClick={() => go({ kind: "lesson", lesson: lesson.n, step: i })}
                title={`${i + 1}. ${s.title} · ${s.phase} · ${s.min} min`}
              >
                <span className="sdot-n">{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="step-info">
            <b>
              Aula {lesson.n} · etapa {step + 1}/{lesson.steps.length}
            </b>
            <span>
              {lesson.steps[step].title} · <em>{lesson.steps[step].phase}</em> · {lesson.steps[step].min} min
            </span>
          </div>
          <button type="button" className="nav-btn primary" onClick={() => move(1)} disabled={lesson.n === LESSONS.length && step === lesson.steps.length - 1} aria-label="Próxima etapa">
            →
          </button>
        </footer>
      )}

      {timer && <Timer onClose={() => setTimer(false)} />}
      {panel && <TeacherPanel onClose={() => setPanel(false)} />}
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 40 40" aria-label={`${Math.round(pct * 100)}% visitado`}>
      <circle cx="20" cy="20" r={r} className="ring-bg" />
      <circle cx="20" cy="20" r={r} className="ring-fg" strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 20 20)" />
      <text x="20" y="25" textAnchor="middle" className="ring-t">
        {Math.round(pct * 100)}
      </text>
    </svg>
  );
}
