import React from "react";
import { useAct, useReleased, useStore } from "../state";

type N = React.ReactNode;

/* ───────────── Layout de tela ───────────── */

export function Screen({
  eyebrow,
  title,
  lead,
  children,
  wide,
}: {
  eyebrow: string;
  title: N;
  lead?: N;
  children?: N;
  wide?: boolean;
}) {
  return (
    <section className={`screen ${wide ? "screen-wide" : ""}`}>
      <header className="screen-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="screen-title">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </header>
      <div className="screen-body">{children}</div>
    </section>
  );
}

export function Cols({ children, ratio = "1-1", align }: { children: N; ratio?: "1-1" | "2-1" | "1-2" | "3-2" | "2-3"; align?: "center" | "start" }) {
  return <div className={`cols cols-${ratio} ${align === "center" ? "cols-center" : ""}`}>{children}</div>;
}

export function Panel({ children, className = "", title, tone }: { children: N; className?: string; title?: N; tone?: "blue" | "green" | "amber" | "red" }) {
  return (
    <div className={`panel ${tone ? "tone-" + tone : ""} ${className}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </div>
  );
}

export function Callout({ children, tone = "blue", label }: { children: N; tone?: "blue" | "green" | "amber" | "red"; label?: string }) {
  return (
    <div className={`callout tone-${tone}`}>
      {label && <span className="callout-label">{label}</span>}
      <div>{children}</div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  small,
  title,
  pressed,
}: {
  children: N;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "teacher" | "quiet";
  disabled?: boolean;
  small?: boolean;
  title?: string;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${small ? "btn-small" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={pressed}
    >
      {children}
    </button>
  );
}

/* ───────────── Controle do professor em cada atividade ───────────── */

export function ActivityBar({
  id,
  onReset,
  hint,
  noRelease,
}: {
  id: string;
  onReset: () => void;
  hint?: string;
  noRelease?: boolean;
}) {
  const r = useReleased(id);
  return (
    <div className="actbar">
      <span className={`actbar-status ${r.feedback ? "on" : ""}`}>
        {noRelease ? hint ?? "Atividade aberta" : r.released ? "Gabarito liberado" : r.feedback ? "Feedback imediato ligado" : hint ?? "Gabarito oculto"}
      </span>
      <div className="actbar-btns">
        {!noRelease && (
          <Btn variant="teacher" small onClick={() => r.setReleased(!r.released)} pressed={r.released}>
            {r.released ? "Ocultar gabarito" : "Liberar gabarito"}
          </Btn>
        )}
        <Btn variant="quiet" small onClick={onReset} title="Limpa apenas esta atividade">
          ↺ Reiniciar atividade
        </Btn>
      </div>
    </div>
  );
}

/* ───────────── Questão de múltipla escolha ───────────── */

export type Opt = { t: N; why?: N; tag?: "conceitual" | "cálculo" };

export function Quiz({
  id,
  prompt,
  options,
  answer,
  solution,
  strategy,
  letters = true,
  cols = 1,
  label,
  size = "normal",
}: {
  id: string;
  prompt?: N;
  options: Opt[];
  answer: number;
  solution?: N[];
  strategy?: N;
  letters?: boolean;
  cols?: 1 | 2 | 3 | 5;
  label?: string;
  size?: "normal" | "large";
}) {
  const [chosen, setChosen] = useAct<number | null>(id + ".c", null);
  const r = useReleased(id);
  const { resetAct } = useStore();
  const L = "ABCDE";
  const resetAll = () => resetAct(id);

  return (
    <div className={`quiz quiz-${size}`}>
      {label && <p className="quiz-label">{label}</p>}
      {prompt && <div className="quiz-prompt">{prompt}</div>}
      <div className={`opts opts-cols-${cols}`} role="radiogroup" aria-label="Alternativas">
        {options.map((o, i) => {
          const isChosen = chosen === i;
          const state = r.feedback && isChosen ? (i === answer ? "ok" : "bad") : r.released && i === answer ? "ok" : isChosen ? "chosen" : "";
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isChosen}
              className={`opt ${state}`}
              onClick={() => setChosen(isChosen ? null : i)}
            >
              {letters && <span className="opt-letter">{L[i]}</span>}
              <span className="opt-text">{o.t}</span>
              {state === "ok" && <span className="opt-mark" aria-label="correta">✓</span>}
              {state === "bad" && <span className="opt-mark" aria-label="incorreta">✗</span>}
            </button>
          );
        })}
      </div>

      {r.feedback && chosen !== null && (
        <div className={`feedback ${chosen === answer ? "ok" : "bad"}`} role="status">
          <strong>{chosen === answer ? "Correto." : "Ainda não."}</strong>{" "}
          {options[chosen].why ?? (chosen === answer ? "" : "Revise a relação entre base, expoente e resultado.")}
          {options[chosen].tag && chosen !== answer && <span className={`tag tag-${options[chosen].tag === "conceitual" ? "c" : "k"}`}>erro {options[chosen].tag}</span>}
        </div>
      )}

      {r.released && (solution || strategy || options.some((o) => o.why)) && (
        <div className="resolution">
          {solution && <StepReveal id={id + ".sol"} steps={solution} title="Resolução comentada" />}
          {options.some((o, i) => o.why && i !== answer) && (
            <details className="distr">
              <summary>Análise das alternativas</summary>
              <ul>
                {options.map((o, i) => (
                  <li key={i} className={i === answer ? "ok" : ""}>
                    <b>{letters ? L[i] : ""}</b> {o.why ?? (i === answer ? "Correta." : "")}
                    {o.tag && i !== answer && <span className={`tag tag-${o.tag === "conceitual" ? "c" : "k"}`}>erro {o.tag}</span>}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {strategy && <Callout tone="green" label="Estratégia eficiente">{strategy}</Callout>}
        </div>
      )}
      <ActivityBar id={id} onReset={resetAll} hint={chosen === null ? "Aguardando a turma" : "Resposta registrada · gabarito oculto"} />
    </div>
  );
}

/* ───────────── Revelação passo a passo ───────────── */

export function StepReveal({ id, steps, title, startWith = 0 }: { id: string; steps: N[]; title?: N; startWith?: number }) {
  const [n, setN] = useAct<number>(id, startWith);
  return (
    <div className="steps">
      {title && <h3 className="steps-title">{title}</h3>}
      <ol className="steps-list">
        {steps.slice(0, n).map((s, i) => (
          <li key={i} className="step-item">
            <span className="step-num">{i + 1}</span>
            <div className="step-body">{s}</div>
          </li>
        ))}
      </ol>
      <div className="steps-ctrl">
        <Btn onClick={() => setN(Math.min(n + 1, steps.length))} disabled={n >= steps.length}>
          {n === 0 ? "Mostrar 1º passo" : n >= steps.length ? "Resolução completa" : `Próximo passo (${n + 1}/${steps.length})`}
        </Btn>
        {n > 0 && (
          <Btn variant="quiet" small onClick={() => setN(n - 1)}>
            ← Voltar um passo
          </Btn>
        )}
        {n > 0 && (
          <Btn variant="quiet" small onClick={() => setN(startWith)}>
            ↺ Recomeçar
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ───────────── Cartão que revela conteúdo ───────────── */

export function RevealCard({ id, front, back, hint = "Revelar" }: { id: string; front: N; back: N; hint?: string }) {
  const [open, setOpen] = useAct<boolean>(id, false);
  return (
    <button type="button" className={`rcard ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-expanded={open}>
      <span className="rcard-front">{front}</span>
      <span className="rcard-back">{open ? back : <span className="rcard-hint">{hint}</span>}</span>
    </button>
  );
}

/* ───────────── Abas ───────────── */

export function Tabs({ id, tabs }: { id: string; tabs: { label: N; content: N }[] }) {
  const [i, setI] = useAct<number>(id, 0);
  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((t, k) => (
          <button key={k} type="button" role="tab" aria-selected={i === k} className={`tab ${i === k ? "on" : ""}`} onClick={() => setI(k)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panel" role="tabpanel">
        {tabs[i]?.content}
      </div>
    </div>
  );
}

/* ───────────── Controle deslizante ───────────── */

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  id: string;
  label: N;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: N;
}) {
  return (
    <div className="slider">
      <label htmlFor={id} className="slider-label">
        <span>{label}</span>
        <output className="slider-val">{display}</output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Seg<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { v: T; label: N }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      <span className="seg-label">{label}</span>
      <div className="seg-btns">
        {options.map((o) => (
          <button key={String(o.v)} type="button" className={`seg-btn ${o.v === value ? "on" : ""}`} aria-pressed={o.v === value} onClick={() => onChange(o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Lista de questões rápidas com placar ───────────── */

export function QuickCheck({ id, items }: { id: string; items: { prompt: N; options: Opt[]; answer: number }[] }) {
  const [pos, setPos] = useAct<number>(id + ".pos", 0);
  const { state, release, resetAct } = useStore();
  const allReleased = items.every((_, i) => state.released[`${id}.i${i}`]);
  return (
    <div className="qc">
      <div className="qc-nav" role="tablist" aria-label="Itens">
        {items.map((_, i) => (
          <QcDot key={i} id={`${id}.i${i}`} i={i} active={pos === i} onClick={() => setPos(i)} answer={items[i].answer} />
        ))}
        <QcScore id={id} items={items} />
      </div>
      <Quiz key={pos} id={`${id}.i${pos}`} label={`Item ${pos + 1} de ${items.length}`} prompt={items[pos].prompt} options={items[pos].options} answer={items[pos].answer} cols={2} />
      <div className="qc-move">
        <Btn variant="ghost" small onClick={() => setPos(Math.max(0, pos - 1))} disabled={pos === 0}>
          ← Item anterior
        </Btn>
        <Btn variant="ghost" small onClick={() => setPos(Math.min(items.length - 1, pos + 1))} disabled={pos === items.length - 1}>
          Próximo item →
        </Btn>
        <span className="spacer" />
        <Btn variant="teacher" small onClick={() => items.forEach((_, i) => release(`${id}.i${i}`, !allReleased))} pressed={allReleased}>
          {allReleased ? "Ocultar todos os gabaritos" : "Liberar gabarito de todos os itens"}
        </Btn>
        <Btn variant="quiet" small onClick={() => resetAct(id)}>
          ↺ Reiniciar avaliação
        </Btn>
      </div>
    </div>
  );
}

function QcDot({ id, i, active, onClick, answer }: { id: string; i: number; active: boolean; onClick: () => void; answer: number }) {
  const [c] = useAct<number | null>(id + ".c", null);
  const r = useReleased(id);
  const st = c === null ? "" : r.feedback ? (c === answer ? "ok" : "bad") : "done";
  return (
    <button type="button" role="tab" aria-selected={active} className={`qc-dot ${active ? "on" : ""} ${st}`} onClick={onClick}>
      {i + 1}
    </button>
  );
}

function QcScore({ id, items }: { id: string; items: { answer: number }[] }) {
  // placar só aparece quando todos os gabaritos dos itens estiverem liberados
  const results = items.map((it, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [c] = useAct<number | null>(`${id}.i${i}.c`, null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const r = useReleased(`${id}.i${i}`);
    return { answered: c !== null, ok: c === it.answer, fb: r.feedback };
  });
  const answered = results.filter((r) => r.answered).length;
  const allFb = results.every((r) => r.fb);
  const ok = results.filter((r) => r.ok).length;
  return (
    <span className="qc-score">
      {answered}/{items.length} respondidos{allFb ? ` · ${ok} acertos` : ""}
    </span>
  );
}

export function Kbd({ children }: { children: N }) {
  return <kbd className="kbd">{children}</kbd>;
}
