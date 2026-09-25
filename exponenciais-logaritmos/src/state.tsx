import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Estado global da experiência.
 * - Navegação (aula / etapa) e telas visitadas
 * - Estado de cada atividade (respostas escolhidas, passos revelados...)
 * - Gabaritos liberados pelo professor
 * Tudo é salvo em sessionStorage: sobrevive a recarregar a página durante a aula,
 * e some ao fechar o navegador. Nada de login ou servidor.
 */

export type View = { kind: "home" } | { kind: "lesson"; lesson: number; step: number } | { kind: "plan" };

export type AppState = {
  view: View;
  visited: Record<string, true>;
  act: Record<string, unknown>;
  released: Record<string, true>;
  instantFeedback: boolean;
};

const KEY = "explog-2B-v1";

const initial: AppState = {
  view: { kind: "home" },
  visited: {},
  act: {},
  released: {},
  instantFeedback: false,
};

function load(): AppState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

type Ctx = {
  state: AppState;
  go: (v: View) => void;
  setAct: (id: string, value: unknown) => void;
  resetAct: (prefix: string) => void;
  release: (id: string, on?: boolean) => void;
  setInstant: (on: boolean) => void;
  resetAll: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível: a aula segue funcionando em memória */
    }
  }, [state]);

  const go = useCallback((v: View) => {
    setState((s) => {
      const visited = { ...s.visited };
      if (v.kind === "lesson") visited[`${v.lesson}-${v.step}`] = true;
      return { ...s, view: v, visited };
    });
  }, []);

  const setAct = useCallback((id: string, value: unknown) => {
    setState((s) => ({ ...s, act: { ...s.act, [id]: value } }));
  }, []);

  const resetAct = useCallback((prefix: string) => {
    setState((s) => {
      const act: Record<string, unknown> = {};
      const released: Record<string, true> = {};
      const hit = (k: string) => k === prefix || k.startsWith(prefix.endsWith(".") ? prefix : prefix + ".");
      for (const k of Object.keys(s.act)) if (!hit(k)) act[k] = s.act[k];
      for (const k of Object.keys(s.released)) if (!hit(k)) released[k] = true;
      return { ...s, act, released };
    });
  }, []);

  const release = useCallback((id: string, on = true) => {
    setState((s) => {
      const released = { ...s.released };
      if (on) released[id] = true;
      else delete released[id];
      return { ...s, released };
    });
  }, []);

  const setInstant = useCallback((on: boolean) => setState((s) => ({ ...s, instantFeedback: on })), []);

  const resetAll = useCallback(() => setState({ ...initial }), []);

  const value = useMemo(
    () => ({ state, go, setAct, resetAct, release, setInstant, resetAll }),
    [state, go, setAct, resetAct, release, setInstant, resetAll]
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider ausente");
  return c;
}

/** Estado de uma atividade, identificado por id único (ex.: "a1.quiz.3"). */
export function useAct<T>(id: string, init: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const { state, setAct, resetAct } = useStore();
  const current = (state.act[id] as T | undefined) ?? init;
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(current) : v;
      setAct(id, next);
    },
    [current, id, setAct]
  );
  const reset = useCallback(() => resetAct(id), [id, resetAct]);
  return [current, set, reset];
}

/**
 * Controle de gabarito de uma atividade.
 * - feedback: mostrar certo/errado ao escolher (gabarito liberado OU feedback imediato ligado no painel)
 * - released: o professor liberou explicitamente o gabarito desta atividade (abre resolução)
 */
export function useReleased(id: string) {
  const { state, release } = useStore();
  const released = !!state.released[id];
  return {
    released,
    feedback: released || state.instantFeedback,
    setReleased: (v = true) => release(id, v),
  };
}
