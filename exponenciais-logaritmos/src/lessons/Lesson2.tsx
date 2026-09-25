import React from "react";
import { M, Pow, Log, Frac, V, Sqrt, eq, iff, fmt } from "../components/Math";
import { Screen, Cols, Panel, Callout, Btn, Quiz, RevealCard, Slider, Tabs, StepReveal, ActivityBar, Opt } from "../components/ui";
import { useAct, useReleased, useStore } from "../state";
import type { Lesson } from "./types";

/* ─────────── 1. Retomada ─────────── */
function S1() {
  const [n, setN] = useAct<number>("a2.s1.n", 3);
  const { state } = useStore();
  const votes = (state.act["a1.s9.v"] as number[] | undefined) ?? null;
  const labels = ["x negativo", "x = 0", "x fração", "não existe"];
  const rows = [];
  for (let k = 3; k >= n; k--) rows.push(k);
  const val = (k: number) => (k >= 0 ? <>{Math.pow(2, k)}</> : <Frac n="1" d={Math.pow(2, -k)} />);
  return (
    <Screen eyebrow="Retomada" title="Voltando ao desafio: 2ˣ = ⅛" lead="Descendo a escada: cada passo para baixo divide o resultado por 2 e diminui o expoente em 1.">
      <Cols ratio="1-1">
        <Panel title="Escada descendente" tone="blue">
          <div className="ladder">
            {rows.map((k) => (
              <div key={k} className={`ladder-row ${k === -3 ? "hit" : ""} ${k === 0 ? "zero" : ""}`}>
                <M><Pow b="2" e={k < 0 ? `−${-k}` : k} /></M>
                <span className="ladder-v"><M>{val(k)}</M></span>
                {k === -3 && <span className="ladder-flag">é o ⅛!</span>}
              </div>
            ))}
          </div>
          <div className="row">
            <Btn onClick={() => setN(Math.max(n - 1, -3))} disabled={n <= -3}>
              Dividir por 2
            </Btn>
            <Btn variant="quiet" small onClick={() => setN(3)}>
              ↺ Recomeçar
            </Btn>
          </div>
        </Panel>
        <div className="stack">
          {votes && votes.some((v) => v > 0) && (
            <Callout tone="amber" label="Hipóteses da Aula 1">
              {labels.map((l, i) => `${l}: ${votes[i]}`).join(" · ")}
            </Callout>
          )}
          <div className="grid-1">
            <RevealCard
              id="a2.s1.c1"
              front={<M big><Pow b="2" e={<V>x</V>} /> = <Frac n="1" d="8" /></M>}
              back={<span className="rc-ans"><M><Frac n="1" d="8" /> = <Frac n="1" d={<Pow b="2" e="3" />} /> = <Pow b="2" e="−3" /></M><small>logo x = −3</small></span>}
            />
            <RevealCard
              id="a2.s1.c2"
              front={<M big><Pow b="2" e={<V>x</V>} /> = 1</M>}
              back={<span className="rc-ans"><M><Pow b="2" e="0" /> = 1</M><small>toda base não nula elevada a 0 dá 1: x = 0</small></span>}
            />
            <RevealCard
              id="a2.s1.c3"
              front={<M big><Pow b="2" e={<V>x</V>} /> = <Sqrt>2</Sqrt></M>}
              back={<span className="rc-ans"><M><Sqrt>2</Sqrt> = <Pow b="2" e="½" /></M><small>raiz quadrada é expoente ½: x = ½</small></span>}
            />
          </div>
        </div>
      </Cols>
    </Screen>
  );
}

/* ─────────── 2. Definição ─────────── */
function S2() {
  return (
    <Screen eyebrow="Retomada conceitual" title="A definição de logaritmo" lead="Tudo o que calculamos nesta aula sai de uma única equivalência.">
      <div className="def-box">
        <M big="xl">
          <Log b={<span className="hl-blue"><V>a</V></span>}><span className="hl-white"><V>b</V></span></Log> = <span className="hl-green"><V>x</V></span> {iff} <Pow b={<span className="hl-blue"><V>a</V></span>} e={<span className="hl-green"><V>x</V></span>} /> = <span className="hl-white"><V>b</V></span>
        </M>
        <p className="def-cond">
          com <M><V>a</V> &gt; 0</M>, <M><V>a</V> ≠ 1</M> e <M><V>b</V> &gt; 0</M>
        </p>
        <div className="anat-tags center">
          <span className="tag-blue">a: base</span>
          <span className="tag-white">b: logaritmando</span>
          <span className="tag-green">x: logaritmo</span>
        </div>
      </div>
      <h2 className="section-h">Consequências imediatas: clique para ver por quê</h2>
      <div className="grid-4">
        <RevealCard id="a2.s2.c1" front={<M big><Log b={<V>a</V>}>1</Log> = 0</M>} back={<small>porque <M><Pow b={<V>a</V>} e="0" /> = 1</M></small>} />
        <RevealCard id="a2.s2.c2" front={<M big><Log b={<V>a</V>}><V>a</V></Log> = 1</M>} back={<small>porque <M><Pow b={<V>a</V>} e="1" /> = <V>a</V></M></small>} />
        <RevealCard id="a2.s2.c3" front={<M big><Log b={<V>a</V>}><Pow b={<V>a</V>} e={<V>n</V>} /></Log> = <V>n</V></M>} back={<small>a base elevada a <V>n</V> dá <M><Pow b={<V>a</V>} e={<V>n</V>} /></M>: o expoente procurado é <V>n</V></small>} />
        <RevealCard id="a2.s2.c4" front={<M big><Pow b={<V>a</V>} e={<Log b={<V>a</V>}><V>b</V></Log>} /> = <V>b</V></M>} back={<small><M><Log b={<V>a</V>}><V>b</V></Log></M> é justamente o expoente que leva <V>a</V> até <V>b</V></small>} />
      </div>
    </Screen>
  );
}

/* ─────────── 3. Exemplos resolvidos ─────────── */
function S3() {
  const ex = [
    {
      label: <M><Log b="2">64</Log></M>,
      steps: [
        <>Chame o logaritmo de <V>x</V>: <M><Log b="2">64</Log> = <V>x</V></M>.</>,
        <>Pela definição: <M><Pow b="2" e={<V>x</V>} /> = 64</M>.</>,
        <>Decomponha 64: <M>64 = <Pow b="2" e="6" /></M>, então <M><Pow b="2" e={<V>x</V>} /> = <Pow b="2" e="6" /></M>.</>,
        <>Bases iguais, expoentes iguais: <M><V>x</V> = 6</M>.</>,
      ],
    },
    {
      label: <M><Log b="3">81</Log></M>,
      steps: [
        <><M><Pow b="3" e={<V>x</V>} /> = 81</M></>,
        <><M>81 = 3 · 3 · 3 · 3 = <Pow b="3" e="4" /></M></>,
        <><M><V>x</V> = 4</M></>,
      ],
    },
    {
      label: <M><Log b="10">1 000</Log></M>,
      steps: [
        <><M><Pow b="10" e={<V>x</V>} /> = 1 000</M></>,
        <>1 000 é 1 seguido de 3 zeros: <M><Pow b="10" e="3" /></M>.</>,
        <><M><V>x</V> = 3</M>. Em base 10, o logaritmo de uma potência de 10 conta os zeros.</>,
      ],
    },
    {
      label: <M><Log b="5">1</Log></M>,
      steps: [
        <><M><Pow b="5" e={<V>x</V>} /> = 1</M></>,
        <>O único expoente que leva uma base positiva diferente de 1 até 1 é zero: <M><Pow b="5" e="0" /> = 1</M>.</>,
        <><M><V>x</V> = 0</M>. Vale para qualquer base: <M><Log b={<V>a</V>}>1</Log> = 0</M>.</>,
      ],
    },
    {
      label: <M><Log b="2"><Frac n="1" d="8" /></Log></M>,
      steps: [
        <><M><Pow b="2" e={<V>x</V>} /> = <Frac n="1" d="8" /></M></>,
        <><M><Frac n="1" d="8" /> = <Frac n="1" d={<Pow b="2" e="3" />} /> = <Pow b="2" e="−3" /></M></>,
        <><M><V>x</V> = −3</M>. Logaritmando entre 0 e 1 (com base maior que 1) gera logaritmo negativo.</>,
      ],
    },
    {
      label: <M><Log b="4">2</Log></M>,
      steps: [
        <><M><Pow b="4" e={<V>x</V>} /> = 2</M></>,
        <>Escreva tudo na base 2: <M><Pow b="(2²)" e={<V>x</V>} /> = <Pow b="2" e="1" /></M>, ou seja, <M><Pow b="2" e={<>2<V>x</V></>} /> = <Pow b="2" e="1" /></M>.</>,
        <><M>2<V>x</V> = 1</M>, então <M><V>x</V> = <Frac n="1" d="2" /></M>. Confira: <M><Pow b="4" e="½" /> = <Sqrt>4</Sqrt> = 2</M>.</>,
      ],
    },
  ];
  return (
    <Screen eyebrow="Explicação orientada" title="Calculando logaritmos: sempre o mesmo roteiro" lead="Iguale o logaritmo a x, passe para a forma exponencial, escreva os dois lados na mesma base e compare os expoentes.">
      <Tabs
        id="a2.s3.tab"
        tabs={ex.map((e, i) => ({
          label: e.label,
          content: <StepReveal key={i} id={`a2.s3.e${i}`} steps={e.steps} title={<>Calcular {e.label}</>} />,
        }))}
      />
    </Screen>
  );
}

/* ─────────── 4. Ferramenta: qual é o logaritmo? ─────────── */
type Item = { pow: React.ReactNode; ask: React.ReactNode; opts: Opt[]; ans: number };
const BANK: Item[] = [
  {
    pow: <><Pow b="2" e="6" /> = 64</>,
    ask: <Log b="2">64</Log>,
    opts: [{ t: "6", why: "O expoente da potência é o logaritmo." }, { t: "32", why: "32 é 64 ÷ 2: o logaritmo não é uma divisão.", tag: "conceitual" }, { t: "3", why: "3 seria o logaritmo na base 4 (4³ = 64).", tag: "cálculo" }, { t: <Frac n="1" d="6" />, why: "Inverteu o expoente.", tag: "cálculo" }],
    ans: 0,
  },
  {
    pow: <><Pow b="3" e="4" /> = 81</>,
    ask: <Log b="3">81</Log>,
    opts: [{ t: "27", why: "27 é 81 ÷ 3.", tag: "conceitual" }, { t: "4", why: "O expoente da potência é o logaritmo." }, { t: "3", why: "3 é a base.", tag: "conceitual" }, { t: <Frac n="1" d="4" />, why: "Inverteu o expoente.", tag: "cálculo" }],
    ans: 1,
  },
  {
    pow: <><Pow b="5" e="0" /> = 1</>,
    ask: <Log b="5">1</Log>,
    opts: [{ t: "1", why: "logₐ 1 = 0, não 1. Quem vale 1 é logₐ a.", tag: "conceitual" }, { t: "5", why: "5 é a base.", tag: "conceitual" }, { t: "0", why: "5⁰ = 1, então o logaritmo é 0." }, { t: "não existe", why: "O logaritmando 1 é positivo: o logaritmo existe.", tag: "conceitual" }],
    ans: 2,
  },
  {
    pow: <><Pow b="2" e="−3" /> = <Frac n="1" d="8" /></>,
    ask: <Log b="2"><Frac n="1" d="8" /></Log>,
    opts: [{ t: "3", why: "Faltou o sinal: 2³ = 8, não ⅛.", tag: "cálculo" }, { t: <Frac n="1" d="3" />, why: "2^(1/3) é a raiz cúbica de 2, não ⅛.", tag: "cálculo" }, { t: "não existe", why: "⅛ é positivo; o logaritmo existe e é negativo.", tag: "conceitual" }, { t: "−3", why: "O expoente da potência é −3." }],
    ans: 3,
  },
  {
    pow: <><Pow b="4" e="½" /> = 2</>,
    ask: <Log b="4">2</Log>,
    opts: [{ t: <Frac n="1" d="2" />, why: "O expoente da potência é ½." }, { t: "2", why: "4² = 16, não 2.", tag: "cálculo" }, { t: <>−<Frac n="1" d="2" /></>, why: "4^(−½) = ½, não 2.", tag: "cálculo" }, { t: "4", why: "4 é a base.", tag: "conceitual" }],
    ans: 0,
  },
  {
    pow: <><Pow b="10" e="−2" /> = 0,01</>,
    ask: <Log b="10">0,01</Log>,
    opts: [{ t: "2", why: "Faltou o sinal: 10² = 100.", tag: "cálculo" }, { t: "−2", why: "O expoente da potência é −2." }, { t: <>−<Frac n="1" d="2" /></>, why: "10^(−½) ≈ 0,316.", tag: "cálculo" }, { t: "−100", why: "Confundiu o expoente com o inverso de 0,01.", tag: "conceitual" }],
    ans: 1,
  },
  {
    pow: <><Pow b="8" e="⅓" /> = 2</>,
    ask: <Log b="8">2</Log>,
    opts: [{ t: "3", why: "8³ = 512.", tag: "cálculo" }, { t: "−3", why: "8⁻³ = 1/512.", tag: "cálculo" }, { t: <Frac n="1" d="3" />, why: "A raiz cúbica de 8 é 2: o expoente é ⅓." }, { t: "4", why: "Dividiu 8 por 2.", tag: "conceitual" }],
    ans: 2,
  },
  {
    pow: <><Pow b="27" e="⅔" /> = 9</>,
    ask: <Log b="27">9</Log>,
    opts: [{ t: <Frac n="3" d="2" />, why: "Inverteu a fração: 27^(3/2) ≈ 140,3.", tag: "cálculo" }, { t: "3", why: "27 ÷ 9 = 3: o logaritmo não é uma divisão.", tag: "conceitual" }, { t: <Frac n="1" d="3" />, why: "27^(1/3) = 3, não 9.", tag: "cálculo" }, { t: <Frac n="2" d="3" />, why: "O expoente da potência é ⅔." }],
    ans: 3,
  },
  {
    pow: <><Pow b="(½)" e="−2" /> = 4</>,
    ask: <Log b="½">4</Log>,
    opts: [{ t: "−2", why: "O expoente da potência é −2." }, { t: "2", why: "(½)² = ¼, não 4.", tag: "cálculo" }, { t: <Frac n="1" d="2" />, why: "½ é a base.", tag: "conceitual" }, { t: "não existe", why: "A base ½ é positiva e diferente de 1: o logaritmo existe.", tag: "conceitual" }],
    ans: 0,
  },
  {
    pow: <><Pow b="10" e="3" /> = 1 000</>,
    ask: <Log b="10">1 000</Log>,
    opts: [{ t: "100", why: "Dividiu 1 000 por 10.", tag: "conceitual" }, { t: "3", why: "O expoente da potência é 3." }, { t: "10", why: "10 é a base.", tag: "conceitual" }, { t: <Frac n="1" d="3" />, why: "Inverteu o expoente.", tag: "cálculo" }],
    ans: 1,
  },
];

function S4() {
  const [i, setI] = useAct<number>("a2.s4.i", 0);
  const it = BANK[i];
  return (
    <Screen eyebrow="Prática orientada" title="Qual é o logaritmo?" lead="Cada rodada mostra uma potência. A turma identifica o logaritmo correspondente.">
      <Cols ratio="2-3" align="start">
        <Panel tone="blue">
          <p className="muted">Rodada {i + 1} de {BANK.length}. Sabendo que</p>
          <p className="hero-math tight">
            <M big="xl">{it.pow}</M>
          </p>
          <p className="muted">quanto vale</p>
          <p className="hero-math tight">
            <M big="xl">{it.ask} = <span className="box-q">?</span></M>
          </p>
          <div className="row">
            <Btn variant="ghost" onClick={() => setI((i + BANK.length - 1) % BANK.length)}>
              ← Anterior
            </Btn>
            <Btn onClick={() => setI((i + 1) % BANK.length)}>Nova potência →</Btn>
            <Btn variant="quiet" small onClick={() => setI(Math.floor(Math.random() * BANK.length))}>
              Sortear
            </Btn>
          </div>
        </Panel>
        <Quiz key={i} id={`a2.s4.q${i}`} options={it.opts.map((o) => ({ ...o, t: <M>{o.t}</M> }))} answer={it.ans} cols={2} size="large" />
      </Cols>
    </Screen>
  );
}

/* ─────────── 5. Correspondência ─────────── */
const PAIRS = [
  { p: <><Pow b="2" e="−3" /> = <Frac n="1" d="8" /></>, l: <><Log b="2"><Frac n="1" d="8" /></Log> = −3</> },
  { p: <><Pow b="8" e="⅓" /> = 2</>, l: <><Log b="8">2</Log> = <Frac n="1" d="3" /></> },
  { p: <><Pow b="10" e="−2" /> = 0,01</>, l: <><Log b="10">0,01</Log> = −2</> },
  { p: <><Pow b="7" e="0" /> = 1</>, l: <><Log b="7">1</Log> = 0</> },
  { p: <><Pow b="3" e="5" /> = 243</>, l: <><Log b="3">243</Log> = 5</> },
  { p: <><Pow b="25" e="½" /> = 5</>, l: <><Log b="25">5</Log> = <Frac n="1" d="2" /></> },
];
const RIGHT_ORDER = [3, 5, 0, 4, 2, 1];

function S5() {
  const id = "a2.s5";
  const [links, setLinks] = useAct<Record<string, number>>(id + ".links", {});
  const [sel, setSel] = useAct<number | null>(id + ".sel", null);
  const r = useReleased(id);
  const { resetAct } = useStore();
  const usedRight = new Set(Object.values(links));
  const [last, setLast] = useAct<number | null>(id + ".last", null);
  const lastLeft = last !== null && links[last] !== undefined ? last : null;
  const correct = Object.entries(links).filter(([a, b]) => Number(a) === b).length;

  const pickLeft = (i: number) => {
    if (links[i] !== undefined) {
      const n = { ...links };
      delete n[i];
      setLinks(n);
      return;
    }
    setSel(sel === i ? null : i);
  };
  const pickRight = (j: number) => {
    if (sel === null || usedRight.has(j)) return;
    setLinks({ ...links, [sel]: j });
    setLast(sel);
    setSel(null);
  };

  const lastMsg = (() => {
    if (lastLeft === null || !r.feedback) return null;
    const j = links[lastLeft];
    if (j === lastLeft) return <div className="feedback ok"><strong>Correto.</strong> <M>{PAIRS[j].l}</M> é a mesma informação que <M>{PAIRS[lastLeft].p}</M>.</div>;
    return (
      <div className="feedback bad">
        <strong>Ainda não.</strong> <M>{PAIRS[j].l}</M> significa <M>{PAIRS[j].p}</M>, e não <M>{PAIRS[lastLeft].p}</M>. Procure o logaritmo com a mesma base e com o expoente como resultado.
      </div>
    );
  })();

  return (
    <Screen eyebrow="Prática orientada" title="Ligue cada potência ao seu logaritmo" lead="Clique em uma potência e depois no logaritmo equivalente. Clique numa potência já ligada para desfazer.">
      <div className="match">
        <div className="match-col">
          {PAIRS.map((pp, i) => {
            const j = links[i];
            const st = j === undefined ? "" : r.feedback ? (j === i ? "ok" : "bad") : "linked";
            return (
              <button key={i} type="button" className={`match-item ${sel === i ? "sel" : ""} ${st}`} onClick={() => pickLeft(i)} aria-pressed={sel === i}>
                <M big>{pp.p}</M>
                {j !== undefined && <span className="match-link">→ {RIGHT_ORDER.indexOf(j) + 1}</span>}
              </button>
            );
          })}
        </div>
        <div className="match-col">
          {RIGHT_ORDER.map((k, pos) => (
            <button key={k} type="button" className={`match-item right ${usedRight.has(k) ? "used" : ""}`} onClick={() => pickRight(k)} disabled={sel === null && !usedRight.has(k)}>
              <span className="match-num">{pos + 1}</span>
              <M big>{PAIRS[k].l}</M>
            </button>
          ))}
        </div>
      </div>
      {lastMsg}
      {r.released && (
        <Callout tone="green" label="Resultado">
          {correct} de {PAIRS.length} ligações corretas. {Object.keys(links).length < PAIRS.length ? "Ainda há potências sem ligação." : ""}
        </Callout>
      )}
      <ActivityBar id={id} onReset={() => resetAct(id)} hint={`${Object.keys(links).length}/${PAIRS.length} ligações feitas`} />
    </Screen>
  );
}

/* ─────────── 6. Logaritmo decimal ─────────── */
function S6() {
  const [k, setK] = useAct<number>("a2.s6.k", 2.3);
  const v = Math.pow(10, k);
  const lo = Math.floor(k);
  const pct = ((k + 3) / 9) * 100;
  const valueStr = v >= 1 ? fmt(v, v < 10 ? 3 : v < 1000 ? 1 : 0) : fmt(v, 5);
  return (
    <Screen eyebrow="Exploração visual" title="Logaritmo decimal: a base 10" lead="Quando a base não aparece, ela é 10: log x = log₁₀ x. É a base das escalas de pH, de decibéis e de magnitude de terremotos.">
      <Cols ratio="3-2">
        <div className="stack">
          <Slider id="a2-s6-k" label="Arraste para escolher o número" value={k} min={-3} max={6} step={0.01} onChange={setK} display={valueStr} />
          <div className="logruler" aria-hidden="true">
            <div className="lr-track">
              {Array.from({ length: 10 }, (_, i) => i - 3).map((e) => (
                <span key={e} className="lr-tick" style={{ left: `${((e + 3) / 9) * 100}%` }}>
                  <span className="lr-lbl">{e < 0 ? `0,${"0".repeat(-e - 1)}1` : Math.pow(10, e).toLocaleString("pt-BR")}</span>
                  <span className="lr-log">{e}</span>
                </span>
              ))}
              <span className="lr-mark" style={{ left: `${pct}%` }} />
            </div>
            <div className="lr-legend">
              <span>número</span>
              <span>logaritmo</span>
            </div>
          </div>
          <div className="readout">
            <M big="xl">
              log {valueStr} ≈ <span className="hl-green">{fmt(k, 2)}</span>
            </M>
            <p className="muted">
              O número está entre <M><Pow b="10" e={lo < 0 ? `−${-lo}` : lo} /></M> e <M><Pow b="10" e={lo + 1 < 0 ? `−${-(lo + 1)}` : lo + 1} /></M>, então seu logaritmo está entre {lo} e {lo + 1}.
            </p>
          </div>
          <Callout tone="blue" label="Regra de ouro">
            Multiplicar o número por 10 soma 1 ao logaritmo. Dividir por 10 subtrai 1.
          </Callout>
        </div>
        <div className="stack">
          <Panel title="Valores que os enunciados costumam fornecer" tone="green">
            <div className="kv">
              {[
                ["log 2", "0,301"],
                ["log 3", "0,477"],
                ["log 5", "0,699"],
                ["log 7", "0,845"],
              ].map(([a, b]) => (
                <div key={a} className="kv-row">
                  <M>{a}</M>
                  <span>≈ {b}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Onde a base 10 aparece" tone="blue">
            <ul className="bul">
              <li>
                <b>pH</b>: <M>pH = −log[H⁺]</M>. Uma unidade de pH corresponde a um fator 10 na concentração de H⁺.
              </li>
              <li>
                <b>Nível sonoro</b>: <M>β = 10 · log(<V>I</V>/<V>I</V><sub>0</sub>)</M>, em decibéis.
              </li>
              <li>
                <b>Magnitude de terremotos</b>: cada unidade a mais corresponde a uma amplitude de onda registrada 10 vezes maior.
              </li>
            </ul>
          </Panel>
        </div>
      </Cols>
    </Screen>
  );
}

/* ─────────── 7. Equações exponenciais ─────────── */
function S7() {
  return (
    <Screen eyebrow="Explicação orientada" title="Duas equações, duas estratégias" lead="Quando dá para igualar as bases, comparamos os expoentes. Quando não dá, o logaritmo é a própria resposta.">
      <Cols ratio="1-1" align="start">
        <Panel title={<>Estratégia 1 · reconhecer potências</>} tone="blue">
          <p className="center">
            <M big><Pow b="3" e={<><V>x</V> + 1</>} /> = 81</M>
          </p>
          <StepReveal
            id="a2.s7.e1"
            steps={[
              <>Escreva 81 como potência de 3: <M>81 = <Pow b="3" e="4" /></M>.</>,
              <><M><Pow b="3" e={<><V>x</V> + 1</>} /> = <Pow b="3" e="4" /></M>: mesma base.</>,
              <>Iguale os expoentes: <M><V>x</V> + 1 = 4</M>, logo <M><V>x</V> = 3</M>.</>,
              <>Verifique: <M><Pow b="3" e="3 + 1" /> = <Pow b="3" e="4" /> = 81</M>. ✓</>,
            ]}
          />
        </Panel>
        <Panel title={<>Estratégia 2 · usar o logaritmo</>} tone="green">
          <p className="center">
            <M big><Pow b="10" e={<V>x</V>} /> = 5</M>
          </p>
          <StepReveal
            id="a2.s7.e2"
            steps={[
              <>Tente reconhecer: <M><Pow b="10" e="0" /> = 1</M> e <M><Pow b="10" e="1" /> = 10</M>. Como 1 &lt; 5 &lt; 10, temos <M>0 &lt; <V>x</V> &lt; 1</M>. Não há expoente inteiro.</>,
              <>Pela definição de logaritmo, o expoente procurado é <M><V>x</V> = <Log b="10">5</Log> = log 5</M>.</>,
              <>Com o valor fornecido: <M><V>x</V> ≈ 0,699</M>.</>,
              <>Confira na calculadora: <M><Pow b="10" e="0,699" /> ≈ 5,000</M>. ✓ O logaritmo é a ferramenta que resolve equações exponenciais quando as bases não se igualam.</>,
            ]}
          />
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 8. Aplicação: pH ─────────── */
function S8() {
  return (
    <Screen eyebrow="Aplicação no estilo ENEM" title="Limão e água: quantas vezes mais ácido?">
      <Quiz
        id="a2.s8.q"
        prompt={
          <>
            <p>
              O pH de uma solução é calculado por <M>pH = −log[H⁺]</M>, em que [H⁺] é a concentração de íons hidrogênio, em mol/L. Um suco de limão tem [H⁺] = <M><Pow b="10" e="−2" /></M> mol/L. A água pura, a 25 °C, tem [H⁺] = <M><Pow b="10" e="−7" /></M> mol/L.
            </p>
            <p>A concentração de íons H⁺ no suco de limão é quantas vezes a concentração na água pura?</p>
          </>
        }
        options={[
          { t: "3,5", why: "Dividiu os valores de pH (7 ÷ 2). A escala de pH é logarítmica: não se comparam concentrações dividindo os pH." },
          { t: "5", why: "5 é a diferença entre os pH (7 − 2), não a razão entre as concentrações." },
          { t: "10 000", why: <><M><Pow b="10" e="4" /></M>: a diferença de expoentes é 5, não 4.</> },
          { t: "100 000", why: <><M><Pow b="10" e="−2" /> ÷ <Pow b="10" e="−7" /> = <Pow b="10" e="5" /> = 100 000</M>.</> },
          { t: "0,00001", why: "Inverteu a razão: esse número compara a água com o limão." },
        ]}
        answer={3}
        cols={5}
        solution={[
          <>pH do limão: <M>−log <Pow b="10" e="−2" /> = −(−2) = 2</M>. pH da água: <M>−log <Pow b="10" e="−7" /> = 7</M>.</>,
          <>A pergunta compara concentrações, não pH: <M><Frac n={<Pow b="10" e="−2" />} d={<Pow b="10" e="−7" />} /></M>.</>,
          <>Divisão de potências de mesma base: subtraia os expoentes. <M><Pow b="10" e="−2 − (−7)" /> = <Pow b="10" e="5" /></M>.</>,
          <>O suco tem concentração de H⁺ 100 000 vezes maior. Cada unidade a menos no pH significa 10 vezes mais H⁺.</>,
        ]}
        strategy="Em escalas logarítmicas, uma diferença de n unidades corresponde a um fator 10ⁿ. Diferença de pH 5 → fator 10⁵."
      />
    </Screen>
  );
}

/* ─────────── 9. Diagnóstico ─────────── */
type DOpt = { t: React.ReactNode; tag?: "conceitual" | "cálculo"; why: string };
const DIAG: { q: React.ReactNode; opts: DOpt[] }[] = [
  {
    q: <Log b="2">32</Log>,
    opts: [
      { t: "5", why: "Correta: 2⁵ = 32." },
      { t: "16", tag: "conceitual", why: "Tratou o logaritmo como divisão (32 ÷ 2)." },
      { t: "4", tag: "cálculo", why: "Sabe o conceito, mas errou a contagem: 2⁴ = 16." },
      { t: "64", tag: "conceitual", why: "Multiplicou pela base." },
    ],
  },
  {
    q: <Log b="3"><Frac n="1" d="9" /></Log>,
    opts: [
      { t: "2", tag: "cálculo", why: "Esqueceu o sinal: ⅑ = 3⁻², não 3²." },
      { t: "−2", why: "Correta: 3⁻² = ⅑." },
      { t: "−3", tag: "cálculo", why: "3⁻³ = 1/27: erro na potência." },
      { t: "não existe", tag: "conceitual", why: "Acredita que o logaritmando precisa ser maior que 1; ⅑ é positivo." },
    ],
  },
  {
    q: <Log b="5">1</Log>,
    opts: [
      { t: "1", tag: "conceitual", why: "Confundiu logₐ 1 com logₐ a." },
      { t: "5", tag: "conceitual", why: "Repetiu a base." },
      { t: "0", why: "Correta: 5⁰ = 1." },
      { t: "não existe", tag: "conceitual", why: "O logaritmando 1 é positivo: o logaritmo existe." },
    ],
  },
  {
    q: <Log b="10">0,001</Log>,
    opts: [
      { t: "3", tag: "cálculo", why: "Esqueceu o sinal negativo." },
      { t: "−2", tag: "cálculo", why: "Contou as casas decimais errado: 0,001 = 10⁻³." },
      { t: "não existe", tag: "conceitual", why: "Acredita que números entre 0 e 1 não têm logaritmo." },
      { t: "−3", why: "Correta: 10⁻³ = 0,001." },
    ],
  },
  {
    q: <Log b="4">8</Log>,
    opts: [
      { t: <Frac n="3" d="2" />, why: "Correta: 4ˣ = 8 → 2²ˣ = 2³ → x = 3/2." },
      { t: <Frac n="2" d="3" />, tag: "cálculo", why: "Montou 2x = 3 mas inverteu a divisão." },
      { t: "2", tag: "conceitual", why: "Dividiu 8 por 4." },
      { t: "não existe", tag: "conceitual", why: "Acredita que o logaritmo precisa ser inteiro." },
    ],
  },
];

function S9() {
  const id = "a2.s9";
  const [counts, setCounts] = useAct<number[][]>(id + ".n", DIAG.map((d) => d.opts.map(() => 0)));
  const [pos, setPos] = useAct<number>(id + ".pos", 0);
  const r = useReleased(id);
  const { resetAct } = useStore();
  const bump = (i: number, j: number, d: number) => setCounts(counts.map((row, a) => (a === i ? row.map((c, b) => (b === j ? Math.max(0, c + d) : c)) : row)));

  let ok = 0, conc = 0, calc = 0;
  DIAG.forEach((d, i) =>
    d.opts.forEach((o, j) => {
      const c = counts[i][j];
      if (!o.tag) ok += c;
      else if (o.tag === "conceitual") conc += c;
      else calc += c;
    })
  );
  const tot = ok + conc + calc;
  const item = DIAG[pos];
  const L = "ABCD";

  return (
    <Screen eyebrow="Verificação final" title="Diagnóstico: conceito ou cálculo?" lead="Para cada item, conte quantos estudantes escolheram cada alternativa (cartões A–D ou mãos levantadas) e registre com + e −.">
      <Cols ratio="3-2" align="start">
        <div className="stack">
          <div className="qc-nav">
            {DIAG.map((_, i) => (
              <button key={i} type="button" className={`qc-dot ${pos === i ? "on" : ""} ${counts[i].some((c) => c > 0) ? "done" : ""}`} onClick={() => setPos(i)}>
                {i + 1}
              </button>
            ))}
          </div>
          <p className="hero-math tight">
            <M big="xl">{item.q} = <span className="box-q">?</span></M>
          </p>
          <div className="tally">
            {item.opts.map((o, j) => (
              <div key={j} className={`tally-row ${r.released ? (o.tag ? "bad" : "ok") : ""}`}>
                <span className="opt-letter">{L[j]}</span>
                <span className="tally-t"><M>{o.t}</M></span>
                {r.released && <span className="tally-why">{o.tag ? <span className={`tag tag-${o.tag === "conceitual" ? "c" : "k"}`}>{o.tag}</span> : <span className="tag tag-ok">correta</span>} {o.why}</span>}
                <span className="tally-ctrl">
                  <button type="button" className="tbtn" aria-label="menos um" onClick={() => bump(pos, j, -1)}>−</button>
                  <span className="tally-n">{counts[pos][j]}</span>
                  <button type="button" className="tbtn" aria-label="mais um" onClick={() => bump(pos, j, 1)}>+</button>
                </span>
              </div>
            ))}
          </div>
          <ActivityBar id={id} onReset={() => resetAct(id)} hint="Registro das respostas" />
        </div>
        <Panel title="Mapa da turma" tone="blue">
          {!r.released ? (
            <p className="muted">O mapa aparece quando o gabarito for liberado. Registre primeiro as respostas dos cinco itens.</p>
          ) : tot === 0 ? (
            <p className="muted">Nenhuma resposta registrada ainda.</p>
          ) : (
            <>
              <div className="diag-bars">
                {[
                  ["Acertos", ok, "ok"],
                  ["Erros conceituais", conc, "c"],
                  ["Erros de cálculo", calc, "k"],
                ].map(([l, n, c]) => (
                  <div key={l as string} className="diag-row">
                    <span>{l}</span>
                    <span className="diag-track">
                      <span className={`diag-fill f-${c}`} style={{ width: `${((n as number) / tot) * 100}%` }} />
                    </span>
                    <span className="diag-n">{Math.round(((n as number) / tot) * 100)}%</span>
                  </div>
                ))}
              </div>
              <p className="small">
                {conc > calc
                  ? "Predominam erros conceituais: retome a definição (o logaritmo é um expoente) com a escada de potências antes de iniciar as propriedades."
                  : calc > conc
                  ? "Predominam erros de cálculo: a ideia está construída. Reforce potências de expoente negativo e fracionário e a decomposição em fatores primos."
                  : conc === 0
                  ? "Nenhum erro registrado: a turma pode avançar para as propriedades."
                  : "Erros conceituais e de cálculo equilibrados: combine uma retomada rápida da definição com exercícios de potências."}
              </p>
            </>
          )}
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 10. Fechamento ─────────── */
function S10() {
  return (
    <Screen eyebrow="Fechamento" title="Síntese e ponte para a Aula 3">
      <Cols ratio="1-1">
        <Panel title="O que sabemos calcular" tone="green">
          <ul className="bul big-bul">
            <li>
              <M><Log b="2">64</Log> = 6</M>, <M><Log b="5">1</Log> = 0</M>, <M><Log b="2"><Frac n="1" d="8" /></Log> = −3</M>, <M><Log b="4">2</Log> = <Frac n="1" d="2" /></M>
            </li>
            <li>Logaritmos podem ser positivos, nulos, negativos ou fracionários.</li>
            <li>
              <M>log <V>x</V></M> sem base indicada significa base 10.
            </li>
            <li>Quando as bases não se igualam, a resposta de uma equação exponencial é um logaritmo.</li>
          </ul>
        </Panel>
        <Panel title="Para investigar" tone="amber">
          <p className="center">
            <M big>
              <Log b="2">8 · 4</Log> <span className="m-op">?</span> <Log b="2">8</Log> + <Log b="2">4</Log>
            </M>
          </p>
          <RevealCard id="a2.s10.c" front="Calcule os dois lados" back={<M>log₂ 32 = 5 &nbsp;e&nbsp; 3 + 2 = 5</M>} hint="Revelar os valores" />
          <p className="muted">Coincidência ou regra? Essa é a pergunta que abre a Aula 3.</p>
        </Panel>
      </Cols>
    </Screen>
  );
}

export const lesson2: Lesson = {
  n: 2,
  title: "Definição e cálculo dos logaritmos",
  short: "Definição e cálculo",
  goal: "Reconhecer e calcular logaritmos simples, incluindo expoentes nulos, negativos e fracionários.",
  skills: [
    "Aplicar a definição para calcular logaritmos",
    "Reconhecer logaritmos nulos, negativos e fracionários",
    "Usar o logaritmo decimal e valores tabelados",
    "Escolher entre igualar bases e usar logaritmo em equações exponenciais",
  ],
  assessment: ["Rodadas de identificação com feedback", "Correspondência entre potências e logaritmos", "Questão de aplicação (pH)", "Diagnóstico que separa erros conceituais e de cálculo"],
  steps: [
    {
      title: "Retomada: 2ˣ = ⅛",
      phase: "Mobilização",
      min: 5,
      C: S1,
      notes: [
        "Se a turma votou na Aula 1, o resultado aparece no topo. Comece por ele.",
        "Use a escada descendente: a regularidade (dividir por 2, expoente −1) justifica 2⁰ = 1 e expoentes negativos sem decorar regra.",
        "Revele os três cartões na ordem: negativo, zero, fracionário.",
      ],
    },
    {
      title: "Definição sistematizada",
      phase: "Exploração e explicação",
      min: 4,
      C: S2,
      notes: ["Leia a equivalência nos dois sentidos.", "Antes de revelar cada consequência, peça que a turma a justifique pela definição."],
    },
    {
      title: "Exemplos resolvidos",
      phase: "Exploração e explicação",
      min: 6,
      C: S3,
      notes: [
        "Faça o primeiro exemplo inteiro com a turma; nos demais, peça o próximo passo antes de revelá-lo.",
        "log₂(1/8) e log₄ 2 são os exemplos que mais geram dúvida: reserve tempo para eles.",
      ],
    },
    {
      title: "Qual é o logaritmo?",
      phase: "Prática orientada",
      min: 7,
      C: S4,
      notes: [
        "Dez rodadas, da mais simples à mais desafiadora. Faça ao menos seis.",
        "Ligue o “Feedback imediato” no painel para agilizar as rodadas.",
        "Use “Sortear” para revisar ao final.",
      ],
    },
    {
      title: "Correspondência",
      phase: "Prática orientada",
      min: 8,
      C: S5,
      notes: [
        "Convide estudantes diferentes para indicar cada ligação.",
        "Com o gabarito liberado, cada ligação errada mostra o que aquele logaritmo realmente significa.",
      ],
    },
    {
      title: "Logaritmo decimal",
      phase: "Exercícios e aplicação",
      min: 5,
      C: S6,
      notes: [
        "Arraste de 1 para 10, depois para 100: o logaritmo aumenta uma unidade a cada fator 10.",
        "Pergunte: entre quais inteiros está log 350? (entre 2 e 3).",
        "Os valores de log 2, 3, 5 e 7 serão usados nas Aulas 3 e 4.",
      ],
    },
    {
      title: "Equações exponenciais",
      phase: "Exercícios e aplicação",
      min: 5,
      C: S7,
      notes: [
        "Resolva primeiro a equação da esquerda com a turma; depois pergunte se a mesma estratégia funciona para 10ˣ = 5.",
        "Destaque que o logaritmo não é uma “técnica a mais”: é o nome do expoente procurado.",
      ],
    },
    {
      title: "Aplicação: pH",
      phase: "Exercícios e aplicação",
      min: 5,
      C: S8,
      notes: ["Distratores 3,5 e 5 revelam leitura linear da escala. Discuta-os com a turma.", "Contexto real: concentrações aproximadas."],
    },
    {
      title: "Diagnóstico",
      phase: "Avaliação e fechamento",
      min: 4,
      C: S9,
      notes: [
        "Registre quantos estudantes escolheram cada alternativa. Não é preciso ser exato: estimativas por mãos levantadas funcionam.",
        "Ao liberar o gabarito, cada alternativa mostra se o erro é conceitual ou de cálculo, e o mapa sugere a retomada.",
      ],
    },
    {
      title: "Síntese e ponte",
      phase: "Avaliação e fechamento",
      min: 1,
      C: S10,
      notes: ["Deixe a pergunta aberta: a Aula 3 começa por ela."],
    },
  ],
};

