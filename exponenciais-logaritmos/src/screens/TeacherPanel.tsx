import React, { useState } from "react";
import { useStore } from "../state";
import { LESSONS } from "../lessons";
import { Btn, Kbd } from "../components/ui";

/** Painel lateral do professor: notas da etapa, cronograma, controles de gabarito e reinício. */
export function TeacherPanel({ onClose }: { onClose: () => void }) {
  const { state, go, setInstant, resetAct, resetAll } = useStore();
  const [confirm, setConfirm] = useState<null | "lesson" | "all">(null);
  const v = state.view;
  const lesson = v.kind === "lesson" ? LESSONS[v.lesson - 1] : null;
  const step = lesson && v.kind === "lesson" ? lesson.steps[v.step] : null;
  const released = Object.keys(state.released).length;

  return (
    <aside className="tpanel" aria-label="Painel do professor">
      <div className="tp-head">
        <div>
          <p className="eyebrow">Painel do professor</p>
          <b>{lesson ? `Aula ${lesson.n} · ${lesson.title}` : v.kind === "plan" ? "Planejamento" : "Início"}</b>
        </div>
        <button type="button" className="x" onClick={onClose} aria-label="Fechar painel">
          ×
        </button>
      </div>

      {step && lesson && v.kind === "lesson" && (
        <section className="tp-sec">
          <h3>
            Etapa {v.step + 1}: {step.title}
          </h3>
          <p className="tp-meta">
            {step.phase} · <b>{step.min} min</b> recomendados
          </p>
          <ul className="tp-notes">
            {step.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="tp-sec">
        <h3>Gabaritos</h3>
        <label className="switch">
          <input type="checkbox" checked={state.instantFeedback} onChange={(e) => setInstant(e.target.checked)} />
          <span className="switch-ui" aria-hidden="true" />
          <span>
            <b>Feedback imediato</b>
            <small>Mostra certo/errado assim que uma alternativa é escolhida. Resoluções continuam fechadas até você liberar.</small>
          </span>
        </label>
        <p className="muted small">
          {released} gabarito(s) liberado(s) nesta sessão. Em cada atividade, use “Liberar gabarito” para abrir resposta, análise dos distratores e resolução em etapas.
        </p>
      </section>

      {lesson && v.kind === "lesson" && (
        <section className="tp-sec">
          <h3>Cronograma da aula</h3>
          <ol className="tp-sched">
            {lesson.steps.map((s, i) => (
              <li key={i} className={i === v.step ? "on" : ""}>
                <button type="button" onClick={() => go({ kind: "lesson", lesson: lesson.n, step: i })}>
                  <span>{i + 1}. {s.title}</span>
                  <span>{s.min}′</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="tp-total">Total: {lesson.steps.reduce((a, s) => a + s.min, 0)} min</p>
        </section>
      )}

      <section className="tp-sec">
        <h3>Reiniciar</h3>
        <p className="muted small">Cada atividade tem seu próprio botão “Reiniciar atividade”. Aqui você limpa blocos maiores; a navegação e as telas visitadas são mantidas.</p>
        {confirm ? (
          <div className="confirm">
            <p>{confirm === "all" ? "Apagar respostas, votos e gabaritos liberados de todas as aulas?" : `Apagar respostas e gabaritos da Aula ${lesson?.n}?`}</p>
            <div className="row">
              <Btn
                variant="teacher"
                small
                onClick={() => {
                  if (confirm === "all") resetAll();
                  else if (lesson) resetAct(`a${lesson.n}.`);
                  setConfirm(null);
                }}
              >
                Sim, apagar
              </Btn>
              <Btn variant="quiet" small onClick={() => setConfirm(null)}>
                Cancelar
              </Btn>
            </div>
          </div>
        ) : (
          <div className="row">
            {lesson && (
              <Btn variant="quiet" small onClick={() => setConfirm("lesson")}>
                ↺ Atividades da Aula {lesson.n}
              </Btn>
            )}
            <Btn variant="quiet" small onClick={() => setConfirm("all")}>
              ↺ Tudo (nova turma)
            </Btn>
          </div>
        )}
      </section>

      <section className="tp-sec">
        <h3>Atalhos</h3>
        <ul className="tp-keys">
          <li><Kbd>←</Kbd><Kbd>→</Kbd> etapa anterior/próxima (passadores de slide também funcionam)</li>
          <li><Kbd>1</Kbd>–<Kbd>4</Kbd> abrir aula</li>
          <li><Kbd>H</Kbd> início · <Kbd>P</Kbd> este painel · <Kbd>T</Kbd> cronômetro · <Kbd>Esc</Kbd> fechar</li>
          <li><Kbd>Tab</Kbd> percorre as alternativas; <Kbd>Enter</Kbd> ou <Kbd>Espaço</Kbd> seleciona</li>
        </ul>
      </section>
    </aside>
  );
}
