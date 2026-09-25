import React, { useEffect, useRef, useState } from "react";

/** Cronômetro regressivo opcional para desafios. Tecla T abre/fecha. */
export function Timer({ onClose }: { onClose: () => void }) {
  const [total, setTotal] = useState(180);
  const [left, setLeft] = useState(180);
  const [run, setRun] = useState(false);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    last.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - (last.current ?? now)) / 1000;
      last.current = now;
      setLeft((l) => {
        const n = Math.max(0, l - dt);
        if (n === 0) setRun(false);
        return n;
      });
    }, 200);
    return () => window.clearInterval(id);
  }, [run]);

  const set = (s: number) => {
    setTotal(s);
    setLeft(s);
    setRun(false);
  };
  const secs = Math.ceil(left);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const done = left <= 0;
  const pct = total ? left / total : 0;

  return (
    <aside className={`timer ${done ? "done" : ""} ${run ? "running" : ""}`} aria-label="Cronômetro">
      <div className="timer-top">
        <span className="timer-h">Cronômetro</span>
        <button type="button" className="x" onClick={onClose} aria-label="Fechar cronômetro">
          ×
        </button>
      </div>
      <div className="timer-face" role="timer" aria-live="off">
        {done ? "Tempo!" : `${mm}:${ss}`}
      </div>
      <div className="timer-bar">
        <span style={{ width: `${pct * 100}%` }} />
      </div>
      <div className="timer-presets">
        {[60, 120, 180, 300, 360, 600].map((s) => (
          <button key={s} type="button" className={`seg-btn ${total === s ? "on" : ""}`} onClick={() => set(s)}>
            {s / 60} min
          </button>
        ))}
      </div>
      <div className="timer-ctrl">
        <button type="button" className="btn btn-primary btn-small" onClick={() => (done ? set(total) : setRun(!run))}>
          {done ? "Recomeçar" : run ? "Pausar" : "Iniciar"}
        </button>
        <button type="button" className="btn btn-quiet btn-small" onClick={() => setLeft((l) => l + 30)}>
          +30 s
        </button>
        <button type="button" className="btn btn-quiet btn-small" onClick={() => set(total)}>
          ↺ Zerar
        </button>
      </div>
    </aside>
  );
}
