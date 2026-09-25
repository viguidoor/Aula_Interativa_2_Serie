import React from "react";
import { M, Pow, Log, Frac, V, Sqrt, fmt } from "../components/Math";
import { Screen, Cols, Panel, Callout, Btn, Quiz, RevealCard, Slider, Tabs, StepReveal, QuickCheck, Seg } from "../components/ui";
import { useAct } from "../state";
import type { Lesson } from "./types";

const P2 = [1, 2, 4, 8, 16, 32, 64];
const p2 = (k: number) => (k >= 0 ? <>{Math.pow(2, k)}</> : <Frac n="1" d={Math.pow(2, -k)} />);

/* ─────────── 1. Mobilização: produto e soma ─────────── */
function S1() {
  const [x, setX] = useAct<number>("a3.s1.x", 8);
  const [y, setY] = useAct<number>("a3.s1.y", 4);
  const [mode, setMode] = useAct<"prod" | "quoc">("a3.s1.m", "prod");
  const lx = Math.log2(x), ly = Math.log2(y);
  const k = mode === "prod" ? lx + ly : lx - ly;
  const sym = mode === "prod" ? "·" : "÷";
  const op = mode === "prod" ? "+" : "−";
  return (
    <Screen eyebrow="Abertura investigativa" title="Coincidência ou regra?" lead="Escolha dois números e compare: o logaritmo do produto e a soma dos logaritmos.">
      <Cols ratio="2-3">
        <div className="stack">
          <Seg label="Operação" value={mode} onChange={setMode} options={[{ v: "prod", label: "produto x · y" }, { v: "quoc", label: "quociente x ÷ y" }]} />
          <Seg label="x" value={x} onChange={setX} options={P2.map((v) => ({ v, label: String(v) }))} />
          <Seg label="y" value={y} onChange={setY} options={P2.map((v) => ({ v, label: String(v) }))} />
        </div>
        <div className="compare">
          <div className="cmp-card">
            <p className="cmp-h">Logaritmo do {mode === "prod" ? "produto" : "quociente"}</p>
            <M big>
              <Log b="2">{x} {sym} {y}</Log>
            </M>
            <M big>
              = <Log b="2">{p2(k)}</Log> = <span className="hl-green">{fmt(k)}</span>
            </M>
          </div>
          <div className="cmp-eq" aria-hidden="true">=</div>
          <div className="cmp-card">
            <p className="cmp-h">{mode === "prod" ? "Soma" : "Diferença"} dos logaritmos</p>
            <M big>
              <Log b="2">{x}</Log> {op} <Log b="2">{y}</Log>
            </M>
            <M big>
              = {fmt(lx)} {op} {fmt(ly)} = <span className="hl-green">{fmt(k)}</span>
            </M>
          </div>
          <Callout tone="amber" label="Pergunta para a turma">
            Os resultados sempre coincidem? Tentem encontrar um par em que não coincidam. Por que isso acontece?
          </Callout>
        </div>
      </Cols>
    </Screen>
  );
}

/* ─────────── 2. Retomada: regras de potências ─────────── */
function S2() {
  const rows = [
    { pot: <><Pow b={<V>a</V>} e={<V>m</V>} /> · <Pow b={<V>a</V>} e={<V>n</V>} /> = <Pow b={<V>a</V>} e={<><V>m</V> + <V>n</V></>} /></>, ex: <>2³ · 2² = 2⁵</>, log: "multiplicar potências → somar expoentes" },
    { pot: <><Pow b={<V>a</V>} e={<V>m</V>} /> ÷ <Pow b={<V>a</V>} e={<V>n</V>} /> = <Pow b={<V>a</V>} e={<><V>m</V> − <V>n</V></>} /></>, ex: <>2⁵ ÷ 2² = 2³</>, log: "dividir potências → subtrair expoentes" },
    { pot: <><Pow b={<>(<Pow b={<V>a</V>} e={<V>m</V>} />)</>} e={<V>n</V>} /> = <Pow b={<V>a</V>} e={<><V>m</V> · <V>n</V></>} /></>, ex: <>(2³)² = 2⁶</>, log: "elevar uma potência → multiplicar expoentes" },
  ];
  return (
    <Screen eyebrow="Retomada conceitual" title="As propriedades já estavam nas potências" lead="Logaritmos são expoentes. Então as regras dos expoentes viram regras dos logaritmos.">
      <div className="rules">
        {rows.map((r, i) => (
          <div key={i} className="rule">
            <M big>{r.pot}</M>
            <span className="rule-ex"><M>{r.ex}</M></span>
            <span className="rule-log">{r.log}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ─────────── 3. Demonstrações ─────────── */
function S3() {
  const a = <V>a</V>, x = <V>x</V>, y = <V>y</V>, m = <V>m</V>, n = <V>n</V>;
  const demos = [
    {
      label: "Produto",
      formula: <><Log b={a}>{x}{y}</Log> = <Log b={a}>{x}</Log> + <Log b={a}>{y}</Log></>,
      steps: [
        <>Dê nomes aos logaritmos: <M><Log b={a}>{x}</Log> = {m}</M> e <M><Log b={a}>{y}</Log> = {n}</M>.</>,
        <>Pela definição: <M>{x} = <Pow b={a} e={m} /></M> e <M>{y} = <Pow b={a} e={n} /></M>.</>,
        <>Multiplique: <M>{x}{y} = <Pow b={a} e={m} /> · <Pow b={a} e={n} /> = <Pow b={a} e={<>{m} + {n}</>} /></M>.</>,
        <>Volte para a forma logarítmica: <M><Log b={a}>{x}{y}</Log> = {m} + {n}</M>.</>,
        <>Substitua m e n: <M><Log b={a}>{x}{y}</Log> = <Log b={a}>{x}</Log> + <Log b={a}>{y}</Log></M>. ∎</>,
      ],
    },
    {
      label: "Quociente",
      formula: <><Log b={a}><Frac n={x} d={y} /></Log> = <Log b={a}>{x}</Log> − <Log b={a}>{y}</Log></>,
      steps: [
        <>Novamente: <M>{x} = <Pow b={a} e={m} /></M> e <M>{y} = <Pow b={a} e={n} /></M>.</>,
        <>Divida: <M><Frac n={x} d={y} /> = <Frac n={<Pow b={a} e={m} />} d={<Pow b={a} e={n} />} /> = <Pow b={a} e={<>{m} − {n}</>} /></M>.</>,
        <>Forma logarítmica: <M><Log b={a}><Frac n={x} d={y} /></Log> = {m} − {n} = <Log b={a}>{x}</Log> − <Log b={a}>{y}</Log></M>. ∎</>,
      ],
    },
    {
      label: "Potência",
      formula: <><Log b={a}><Pow b={x} e={n} /></Log> = {n} · <Log b={a}>{x}</Log></>,
      steps: [
        <>Seja <M><Log b={a}>{x}</Log> = {m}</M>, ou seja, <M>{x} = <Pow b={a} e={m} /></M>.</>,
        <>Eleve a n: <M><Pow b={x} e={n} /> = <Pow b={<>(<Pow b={a} e={m} />)</>} e={n} /> = <Pow b={a} e={<>{m}{n}</>} /></M>.</>,
        <>Forma logarítmica: <M><Log b={a}><Pow b={x} e={n} /></Log> = {n} · {m} = {n} · <Log b={a}>{x}</Log></M>. ∎</>,
        <>Caso especial com raízes: <M><Log b={a}><Sqrt>{x}</Sqrt></Log> = <Frac n="1" d="2" /> · <Log b={a}>{x}</Log></M>, pois <M><Sqrt>{x}</Sqrt> = <Pow b={x} e="½" /></M>.</>,
      ],
    },
  ];
  return (
    <Screen eyebrow="Explicação orientada" title="Três propriedades, três demonstrações" lead={<>Válidas para <M>{a} &gt; 0</M>, <M>{a} ≠ 1</M>, <M>{x} &gt; 0</M> e <M>{y} &gt; 0</M>. Revele cada passo depois que a turma tentar prevê-lo.</>}>
      <Tabs
        id="a3.s3.tab"
        tabs={demos.map((d, i) => ({
          label: d.label,
          content: (
            <div className="demo">
              <p className="demo-formula">
                <M big>{d.formula}</M>
              </p>
              <StepReveal id={`a3.s3.d${i}`} steps={d.steps} title="Demonstração" />
            </div>
          ),
        }))}
      />
    </Screen>
  );
}

/* ─────────── 4. Qual propriedade? ─────────── */
function S4() {
  const O = (why: [string, string, string, string]) => [
    { t: "Produto", why: why[0] },
    { t: "Quociente", why: why[1] },
    { t: "Potência", why: why[2] },
    { t: "Nenhuma: a igualdade é falsa", why: why[3] },
  ];
  const items = [
    {
      prompt: <>Qual propriedade justifica <M big>log 20 = log 2 + log 10</M>?</>,
      options: O(["20 = 2 · 10: o log do produto é a soma dos logs.", "Não há divisão entre os logaritmandos.", "Não há expoente no logaritmando.", "A igualdade é verdadeira: 20 = 2 · 10."]),
      answer: 0,
    },
    {
      prompt: <>Qual propriedade justifica <M big><Log b="3"><Frac n="81" d="3" /></Log> = <Log b="3">81</Log> − <Log b="3">3</Log></M>?</>,
      options: O(["Há uma divisão, não um produto.", "Log do quociente é a diferença dos logs: 4 − 1 = 3 = log₃ 27.", "Não há expoente no logaritmando.", "A igualdade é verdadeira."]),
      answer: 1,
    },
    {
      prompt: <>Qual propriedade justifica <M big>log <Pow b="2" e="10" /> = 10 · log 2</M>?</>,
      options: O(["Não há produto de fatores diferentes.", "Não há divisão.", "O expoente sai multiplicando o logaritmo.", "A igualdade é verdadeira."]),
      answer: 2,
    },
    {
      prompt: <>Qual propriedade justifica <M big>log <Sqrt>5</Sqrt> = <Frac n="1" d="2" /> · log 5</M>?</>,
      options: O(["Não há produto.", "Não há divisão.", "√5 = 5^½: o expoente ½ sai multiplicando.", "A igualdade é verdadeira."]),
      answer: 2,
    },
    {
      prompt: <>Qual propriedade justifica <M big>log(3 + 7) = log 3 + log 7</M>?</>,
      options: O(["A propriedade do produto vale para log(3 · 7), não para log(3 + 7).", "Não há divisão.", "Não há expoente.", "Falsa: log(3 + 7) = log 10 = 1, mas log 3 + log 7 = log 21 ≈ 1,322."]),
      answer: 3,
    },
    {
      prompt: <>Qual propriedade justifica <M big><Log b="2">40</Log> − <Log b="2">5</Log> = <Log b="2">8</Log></M>?</>,
      options: O(["Há uma subtração de logs, que vem de uma divisão.", "40 ÷ 5 = 8: diferença de logs é o log do quociente (e vale 3).", "Não há expoente.", "A igualdade é verdadeira."]),
      answer: 1,
    },
  ];
  return (
    <Screen eyebrow="Prática orientada" title="Qual propriedade foi usada?" lead="Identifique a propriedade que transforma o lado esquerdo no direito. Atenção: uma das igualdades é falsa.">
      <QuickCheck id="a3.s4" items={items} />
    </Screen>
  );
}

/* ─────────── 5. Erros comuns ─────────── */
function S5() {
  const [x, setX] = useAct<number>("a3.s5.x", 10);
  const [y, setY] = useAct<number>("a3.s5.y", 10);
  const l = Math.log10(x + y), r = Math.log10(x) + Math.log10(y);
  const same = Math.abs(l - r) < 1e-9;
  return (
    <Screen eyebrow="Explicação orientada" title="Cuidado com as regras falsas" lead="Um único contraexemplo basta para derrubar uma regra.">
      <Cols ratio="1-1" align="start">
        <Panel title={<>Teste: <M>log(<V>x</V> + <V>y</V>) = log <V>x</V> + log <V>y</V></M>?</>} tone="red">
          <Slider id="a3-s5-x" label={<M><V>x</V></M>} value={x} min={1} max={100} step={1} onChange={setX} display={x} />
          <Slider id="a3-s5-y" label={<M><V>y</V></M>} value={y} min={1} max={100} step={1} onChange={setY} display={y} />
          <div className="compare compact">
            <div className="cmp-card">
              <p className="cmp-h">log({x} + {y}) = log {x + y}</p>
              <M big>≈ {fmt(l)}</M>
            </div>
            <div className="cmp-eq">{same ? "=" : "≠"}</div>
            <div className="cmp-card">
              <p className="cmp-h">log {x} + log {y} = log {x * y}</p>
              <M big>≈ {fmt(r)}</M>
            </div>
          </div>
          <Callout tone={same ? "amber" : "red"}>
            {same
              ? "Os valores coincidem só porque, neste caso, x + y = x · y. Isso só acontece em casos raros, como x = y = 2. Uma regra precisa valer sempre."
              : "Contraexemplo encontrado. A soma dos logaritmos é o logaritmo do produto, não da soma."}
          </Callout>
        </Panel>
        <div className="stack">
          <h3 className="panel-title">Verdadeiro ou falso? Clique para ver o contraexemplo.</h3>
          <RevealCard id="a3.s5.c1" front={<M>log(<V>x</V> · <V>y</V>) = log <V>x</V> · log <V>y</V></M>} back={<small><b>Falso.</b> x = y = 10: log 100 = 2, mas 1 · 1 = 1. O correto é log x + log y.</small>} />
          <RevealCard id="a3.s5.c2" front={<M>log <Frac n={<V>x</V>} d={<V>y</V>} /> = <Frac n={<>log <V>x</V></>} d={<>log <V>y</V></>} /></M>} back={<small><b>Falso.</b> x = 100, y = 10: log 10 = 1, mas 2 ÷ 1 = 2. O correto é log x − log y.</small>} />
          <RevealCard id="a3.s5.c3" front={<M>(log <V>x</V>)² = 2 · log <V>x</V></M>} back={<small><b>Falso.</b> x = 1 000: (log 1 000)² = 9, mas 2 · 3 = 6. O correto é log(x²) = 2 · log x: o expoente precisa estar no logaritmando.</small>} />
          <RevealCard id="a3.s5.c4" front={<M><Log b="2">8</Log> + <Log b="2">8</Log> = <Log b="2">16</Log></M>} back={<small><b>Falso.</b> 3 + 3 = 6 = log₂ 64. Somar logs corresponde a multiplicar os logaritmandos (8 · 8), não somá-los.</small>} />
        </div>
      </Cols>
    </Screen>
  );
}

/* ─────────── 6. Aplicando com valores tabelados ─────────── */
function S6() {
  const cards = [
    { q: "log 6", a: <>log(2 · 3) = log 2 + log 3 ≈ 0,301 + 0,477 = <b>0,778</b></> },
    { q: "log 5", a: <>log(10 ÷ 2) = log 10 − log 2 ≈ 1 − 0,301 = <b>0,699</b></> },
    { q: "log 12", a: <>log(2² · 3) = 2 · log 2 + log 3 ≈ 0,602 + 0,477 = <b>1,079</b></> },
    { q: "log 18", a: <>log(2 · 3²) = log 2 + 2 · log 3 ≈ 0,301 + 0,954 = <b>1,255</b></> },
    { q: "log 1,5", a: <>log(3 ÷ 2) = log 3 − log 2 ≈ 0,477 − 0,301 = <b>0,176</b></> },
    { q: "log 8", a: <>log 2³ = 3 · log 2 ≈ 3 · 0,301 = <b>0,903</b></> },
  ];
  return (
    <Screen eyebrow="Prática orientada" title="Calculando sem calculadora" lead="Com log 2 ≈ 0,301 e log 3 ≈ 0,477, decomponha o número e aplique as propriedades.">
      <div className="grid-3">
        {cards.map((c, i) => (
          <RevealCard key={i} id={`a3.s6.c${i}`} front={<M big>{c.q} ≈ ?</M>} back={<span className="rc-ans small"><M>{c.a}</M></span>} hint="Revelar a decomposição" />
        ))}
      </div>
      <Callout tone="green" label="Por que isso importa">
        No ENEM, os valores de log 2 e log 3 costumam ser dados no enunciado. As propriedades permitem obter os demais.
      </Callout>
    </Screen>
  );
}

/* ─────────── 7. Equações logarítmicas ─────────── */
function S7() {
  const x = <V>x</V>;
  return (
    <Screen eyebrow="Explicação orientada" title="Equações logarítmicas: primeiro a condição" lead="Antes de resolver, anote para quais valores de x os logaritmos existem. No final, confira as soluções contra essa condição.">
      <Cols ratio="1-1" align="start">
        <Panel title={<M big><Log b="2">{x} − 1</Log> = 3</M>} tone="blue">
          <StepReveal
            id="a3.s7.e1"
            steps={[
              <><b>Condição:</b> <M>{x} − 1 &gt; 0</M>, ou seja, <M>{x} &gt; 1</M>.</>,
              <>Pela definição: <M>{x} − 1 = <Pow b="2" e="3" /> = 8</M>.</>,
              <><M>{x} = 9</M>.</>,
              <><b>Verificação:</b> 9 &gt; 1 ✓ e <M><Log b="2">8</Log> = 3</M> ✓. Solução: <M>S = {"{"}9{"}"}</M>.</>,
            ]}
          />
        </Panel>
        <Panel title={<M big><Log b="3">{x}</Log> + <Log b="3">{x} − 8</Log> = 2</M>} tone="green">
          <StepReveal
            id="a3.s7.e2"
            steps={[
              <><b>Condição:</b> <M>{x} &gt; 0</M> e <M>{x} − 8 &gt; 0</M>. As duas juntas: <M>{x} &gt; 8</M>.</>,
              <>Propriedade do produto: <M><Log b="3">{x}({x} − 8)</Log> = 2</M>.</>,
              <>Definição: <M>{x}({x} − 8) = <Pow b="3" e="2" /> = 9</M>, ou seja, <M><Pow b={x} e="2" /> − 8{x} − 9 = 0</M>.</>,
              <>Fatorando: <M>({x} − 9)({x} + 1) = 0</M>, então <M>{x} = 9</M> ou <M>{x} = −1</M>.</>,
              <><b>Verificação:</b> <M>{x} = −1</M> não satisfaz <M>{x} &gt; 8</M> (log₃(−1) nem existe). <M>{x} = 9</M> satisfaz: <M><Log b="3">9</Log> + <Log b="3">1</Log> = 2 + 0 = 2</M> ✓. Solução: <M>S = {"{"}9{"}"}</M>.</>,
            ]}
          />
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 8. Mudança de base ─────────── */
function S8() {
  const [a, setA] = useAct<number>("a3.s8.a", 2);
  const [b, setB] = useAct<number>("a3.s8.b", 10);
  const la = Math.log10(a), lb = Math.log10(b);
  const r = lb / la;
  return (
    <Screen eyebrow="Exploração e explicação" title="Mudança de base" lead="Calculadoras e tabelas trazem logaritmos na base 10. Para outra base, basta uma divisão.">
      <Cols ratio="1-1" align="start">
        <div className="stack">
          <div className="def-box">
            <M big>
              <Log b={<V>a</V>}><V>b</V></Log> = <Frac n={<>log <V>b</V></>} d={<>log <V>a</V></>} />
            </M>
          </div>
          <StepReveal
            id="a3.s8.d"
            title="De onde vem?"
            steps={[
              <>Seja <M><V>x</V> = <Log b={<V>a</V>}><V>b</V></Log></M>. Então <M><Pow b={<V>a</V>} e={<V>x</V>} /> = <V>b</V></M>.</>,
              <>Aplique log (base 10) nos dois lados: <M>log <Pow b={<V>a</V>} e={<V>x</V>} /> = log <V>b</V></M>.</>,
              <>Propriedade da potência: <M><V>x</V> · log <V>a</V> = log <V>b</V></M>, logo <M><V>x</V> = <Frac n={<>log <V>b</V></>} d={<>log <V>a</V></>} /></M>.</>,
            ]}
          />
        </div>
        <Panel title="Calculadora de mudança de base" tone="blue">
          <Seg label="Base a" value={a} onChange={setA} options={[2, 3, 5, 7].map((v) => ({ v, label: String(v) }))} />
          <Seg label="Logaritmando b" value={b} onChange={setB} options={[3, 5, 10, 20, 100].map((v) => ({ v, label: String(v) }))} />
          <p className="readout">
            <M big>
              <Log b={a}>{b}</Log> = <Frac n={<>log {b}</>} d={<>log {a}</>} /> ≈ <Frac n={fmt(lb)} d={fmt(la)} /> ≈ <span className="hl-green">{fmt(r, 3)}</span>
            </M>
          </p>
          <p className="muted">
            Conferindo: <M><Pow b={a} e={fmt(r, 3)} /> ≈ {fmt(Math.pow(a, Number(r.toFixed(3))), 2)}</M>
          </p>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 9. Desafio coletivo ─────────── */
function S9() {
  const x = <V>x</V>;
  return (
    <Screen eyebrow="Desafio coletivo" title="Resolução comentada">
      <Quiz
        id="a3.s9.q"
        prompt={
          <>
            <p>Em grupos, resolvam a equação e escolham o conjunto solução. Usem o cronômetro: 6 minutos.</p>
            <p className="center">
              <M big="xl"><Log b="2">{x} + 2</Log> + <Log b="2">{x} − 2</Log> = 5</M>
            </p>
          </>
        }
        options={[
          { t: <M>S = {"{"}−6, 6{"}"}</M>, why: "Resolveu a equação do 2º grau, mas não descartou −6, que torna x + 2 e x − 2 negativos." },
          { t: <M>S = {"{"}6{"}"}</M>, why: "Correta: é a única raiz que satisfaz x > 2." },
          { t: <M>S = {"{"}16{"}"}</M>, why: "Somou os logaritmandos: (x + 2) + (x − 2) = 2x. A soma de logs corresponde ao produto." },
          { t: <M>S = {"{"}<Sqrt>14</Sqrt>{"}"}</M>, why: "Trocou 2⁵ por 2 · 5 = 10 e obteve x² − 4 = 10." },
          { t: <M>S = ∅</M>, why: "A equação tem solução: x = 6 verifica a igualdade." },
        ]}
        answer={1}
        cols={5}
        solution={[
          <><b>Condição de existência:</b> <M>{x} + 2 &gt; 0</M> e <M>{x} − 2 &gt; 0</M>, ou seja, <M>{x} &gt; 2</M>. Comentário: fazer isso antes evita aceitar raízes falsas no final.</>,
          <><b>Propriedade do produto:</b> <M><Log b="2">({x} + 2)({x} − 2)</Log> = 5</M>.</>,
          <><b>Definição:</b> <M>({x} + 2)({x} − 2) = <Pow b="2" e="5" /> = 32</M>.</>,
          <><b>Produto notável:</b> <M><Pow b={x} e="2" /> − 4 = 32</M>, então <M><Pow b={x} e="2" /> = 36</M> e <M>{x} = 6</M> ou <M>{x} = −6</M>.</>,
          <><b>Verificação:</b> −6 não satisfaz x &gt; 2. Para 6: <M><Log b="2">8</Log> + <Log b="2">4</Log> = 3 + 2 = 5</M> ✓. <M>S = {"{"}6{"}"}</M>.</>,
        ]}
        strategy="Condição primeiro, propriedade para juntar os logs, definição para eliminar o log, verificação no final."
      />
    </Screen>
  );
}

/* ─────────── 10. Verificação final ─────────── */
function S10() {
  const items = [
    {
      prompt: <>Quanto vale <M big><Log b="2">12</Log> − <Log b="2">3</Log></M>?</>,
      options: [
        { t: "2", why: "log₂(12 ÷ 3) = log₂ 4 = 2." },
        { t: "4", why: "4 é o quociente 12 ÷ 3; ainda falta calcular log₂ 4." },
        { t: <M><Log b="2">9</Log></M>, why: "Subtraiu os logaritmandos (12 − 3). Diferença de logs corresponde a divisão." },
        { t: "3", why: "Não há justificativa: log₂ 4 = 2." },
      ],
      answer: 0,
    },
    {
      prompt: <>Sabendo que log 2 ≈ 0,301, quanto vale aproximadamente log 8?</>,
      options: [
        { t: "0,602", why: "Esse é log 4 = 2 · log 2." },
        { t: "0,903", why: "log 8 = log 2³ = 3 · 0,301." },
        { t: "2,408", why: "Multiplicou por 8 em vez de por 3: o expoente de 2 em 8 é 3." },
        { t: "0,027", why: "Elevou 0,301 ao cubo. O expoente multiplica o logaritmo." },
      ],
      answer: 1,
    },
    {
      prompt: "Qual das igualdades é FALSA para a e b positivos?",
      options: [
        { t: <M>log(<V>a</V><V>b</V>) = log <V>a</V> + log <V>b</V></M>, why: "Verdadeira: propriedade do produto." },
        { t: <M>log <Pow b={<V>a</V>} e="3" /> = 3 log <V>a</V></M>, why: "Verdadeira: propriedade da potência." },
        { t: <M>log(<V>a</V> + <V>b</V>) = log <V>a</V> + log <V>b</V></M>, why: "Falsa: a = b = 10 dá log 20 ≈ 1,301 contra 2." },
        { t: <M>log <Frac n={<V>a</V>} d={<V>b</V>} /> = log <V>a</V> − log <V>b</V></M>, why: "Verdadeira: propriedade do quociente." },
      ],
      answer: 2,
    },
    {
      prompt: <>Se <M big><Log b="3"><V>x</V></Log> = 2 + <Log b="3">5</Log></M>, então <M><V>x</V></M> vale:</>,
      options: [
        { t: "7", why: "Somou 2 + 5 sem transformar 2 em logaritmo." },
        { t: "10", why: "Multiplicou 2 · 5: 2 não é log₃ 2." },
        { t: "25", why: "Usou 5² em vez de 3²." },
        { t: "45", why: "2 = log₃ 9, então log₃ x = log₃ 9 + log₃ 5 = log₃ 45." },
      ],
      answer: 3,
    },
  ];
  return (
    <Screen eyebrow="Verificação final" title="Checagem rápida" lead="Quatro itens para fechar a aula. Na próxima: quanto tempo leva para um investimento dobrar?">
      <QuickCheck id="a3.s10" items={items} />
    </Screen>
  );
}

export const lesson3: Lesson = {
  n: 3,
  title: "Propriedades e equações logarítmicas",
  short: "Propriedades e equações",
  goal: "Compreender as propriedades fundamentais dos logaritmos e empregá-las na resolução de problemas.",
  skills: [
    "Demonstrar as propriedades a partir das regras de potenciação",
    "Identificar a propriedade adequada em cada transformação",
    "Refutar regras falsas com contraexemplos",
    "Resolver equações logarítmicas verificando as condições de existência",
    "Usar mudança de base com valores tabelados",
  ],
  assessment: ["Identificação de propriedades (6 itens)", "Desafio coletivo com resolução comentada", "Checagem final de 4 itens"],
  steps: [
    {
      title: "Produto e soma",
      phase: "Mobilização",
      min: 5,
      C: S1,
      notes: [
        "Peça que a turma sugira pares. Depois de três ou quatro, troque para quociente.",
        "Pergunte: por que os resultados coincidem? Recolha hipóteses sem corrigir; a resposta vem nas próximas telas.",
      ],
    },
    {
      title: "Regras de potências",
      phase: "Exploração e explicação",
      min: 2,
      C: S2,
      notes: ["Retomada rápida. Ligue cada regra à coluna da direita: é a mesma ideia escrita para logaritmos."],
    },
    {
      title: "Demonstrações",
      phase: "Exploração e explicação",
      min: 8,
      C: S3,
      notes: [
        "Faça a do produto inteira. Na do quociente, peça que a turma proponha cada passo antes do clique.",
        "Destaque as condições (x, y > 0): sem elas o logaritmo nem existe.",
      ],
    },
    {
      title: "Qual propriedade?",
      phase: "Prática orientada",
      min: 6,
      C: S4,
      notes: ["O item 5 é a armadilha log(x + y). Deixe a turma defender a resposta antes de liberar."],
    },
    {
      title: "Erros comuns",
      phase: "Prática orientada",
      min: 6,
      C: S5,
      notes: [
        "Comece com x = y = 10. Depois peça à turma um caso em que a “regra” pareça funcionar (x = y = 2) e discuta por que isso não a torna válida.",
        "Os quatro cartões cobrem os erros mais frequentes em provas.",
      ],
    },
    {
      title: "Calculando sem calculadora",
      phase: "Prática orientada",
      min: 5,
      C: S6,
      notes: ["Peça que registrem as decomposições no caderno: são usadas no simulado da Aula 4 (log 1,5 e log 0,8)."],
    },
    {
      title: "Equações logarítmicas",
      phase: "Exercícios e aplicação",
      min: 8,
      C: S7,
      notes: ["Insista na condição como primeiro passo.", "Na segunda equação, a raiz −1 é o momento de mostrar por que a verificação é obrigatória."],
    },
    {
      title: "Mudança de base",
      phase: "Exercícios e aplicação",
      min: 3,
      C: S8,
      notes: ["Apresentação breve, sem exercícios de fixação. Ela será usada na Aula 4 para calcular tempos."],
    },
    {
      title: "Desafio coletivo",
      phase: "Exercícios e aplicação",
      min: 5,
      C: S9,
      notes: [
        "Grupos de 4, com o cronômetro de 5 ou 6 minutos. Cada grupo registra o conjunto solução.",
        "Libere o gabarito e revele a resolução passo a passo, pedindo a um grupo que comente cada etapa.",
      ],
    },
    {
      title: "Checagem final",
      phase: "Avaliação e fechamento",
      min: 2,
      C: S10,
      notes: ["Se o tempo apertar, faça os itens 1 e 3 e deixe os demais como tarefa."],
    },
  ],
};
