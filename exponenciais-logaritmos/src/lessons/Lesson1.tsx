import React from "react";
import { M, Pow, Log, Frac, V, eq, iff, fmt } from "../components/Math";
import { Screen, Cols, Panel, Callout, Btn, Quiz, RevealCard, Slider, QuickCheck, Seg } from "../components/ui";
import { Graph, niceMax } from "../components/Graph";
import { useAct, useReleased } from "../state";
import type { Lesson } from "./types";

/* ─────────── 1. Abertura investigativa ─────────── */
function S1() {
  const [n, setN] = useAct<number>("a1.s1.ladder", 1);
  return (
    <Screen eyebrow="Abertura investigativa" title="Um número escondido no expoente" lead="Qual número devemos colocar no quadrado para a igualdade ser verdadeira?">
      <Cols ratio="1-1">
        <div className="stack">
          <div className="hero-math">
            <M big="xl">
              <Pow b="2" e={<span className="box-q">?</span>} /> {eq} 32
            </M>
          </div>
          <Quiz
            id="a1.s1.q"
            letters={false}
            cols={2}
            size="large"
            options={[
              { t: "4", why: <>Quase: <M><Pow b="2" e="4" /> = 16</M>. Ainda falta dobrar mais uma vez.</> },
              { t: "5", why: <><M>2 · 2 · 2 · 2 · 2 = 32</M>. São 5 fatores iguais a 2.</> },
              { t: "6", why: <><M><Pow b="2" e="6" /> = 64</M>, que já passou de 32.</> },
              { t: "16", why: <>16 é a metade de 32. A pergunta não é “quanto vezes 2 dá 32”, e sim quantas vezes o 2 aparece como fator.</> },
            ]}
            answer={1}
          />
        </div>
        <Panel title="Escada das dobras" tone="blue">
          <p className="muted">Cada clique multiplica o resultado por 2. Contem juntos quantas multiplicações são necessárias.</p>
          <div className="ladder">
            {Array.from({ length: n }, (_, i) => i + 1).map((k) => {
              const v = Math.pow(2, k);
              return (
                <div key={k} className={`ladder-row ${v === 32 ? "hit" : ""}`}>
                  <M><Pow b="2" e={k} /></M>
                  <span className="ladder-v">{v}</span>
                  {v === 32 && <span className="ladder-flag">chegamos!</span>}
                </div>
              );
            })}
          </div>
          <div className="row">
            <Btn onClick={() => setN(Math.min(n + 1, 7))} disabled={n >= 7}>
              Multiplicar por 2
            </Btn>
            <Btn variant="quiet" small onClick={() => setN(1)}>
              ↺ Recomeçar
            </Btn>
          </div>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 2. Retomada: potências ─────────── */
function S2() {
  const cards: [string, string, string, string][] = [
    ["3", "81", "4", "3 · 3 · 3 · 3 = 81"],
    ["5", "125", "3", "5 · 5 · 5 = 125"],
    ["10", "10 000", "4", "quatro fatores 10: 1 seguido de 4 zeros"],
    ["2", "1 024", "10", "2⁵ = 32 e 32 · 32 = 1 024, então 5 + 5 = 10"],
    ["4", "64", "3", "4 · 4 · 4 = 64"],
    ["7", "7", "1", "um único fator: 7¹ = 7"],
  ];
  return (
    <Screen eyebrow="Retomada conceitual" title="Descubra o expoente" lead="Uma potência é uma multiplicação de fatores iguais. Quantos fatores aparecem em cada caso?">
      <Cols ratio="2-1">
        <div className="grid-3">
          {cards.map(([b, r, e, why], i) => (
            <RevealCard
              key={i}
              id={`a1.s2.c${i}`}
              front={<M big><Pow b={b} e={<span className="box-q">?</span>} /> {eq} {r}</M>}
              back={
                <span className="rc-ans">
                  <M big><Pow b={b} e={<span className="hl-green">{e}</span>} /></M>
                  <small>{why}</small>
                </span>
              }
              hint="Clique para revelar"
            />
          ))}
        </div>
        <Panel title="Lembrete" tone="green">
          <p className="big-formula">
            <M big><Pow b={<V>a</V>} e={<V>n</V>} /> {eq} <V>a</V> · <V>a</V> · … · <V>a</V></M>
          </p>
          <p className="muted center">
            <V>n</V> fatores iguais a <V>a</V>
          </p>
          <ul className="bul">
            <li>
              <b>Base</b>: o fator que se repete.
            </li>
            <li>
              <b>Expoente</b>: quantas vezes ele aparece.
            </li>
            <li>
              <b>Potência</b>: o resultado.
            </li>
          </ul>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 3. Exploração visual: simulador ─────────── */
function S3() {
  const [b, setB] = useAct<number>("a1.s3.b", 2);
  const [x, setX] = useAct<number>("a1.s3.x", 3);
  const y = Math.pow(b, x);
  const isInt = Number.isInteger(x) && x > 0 && x <= 8;
  const yMax = niceMax(Math.max(y * 1.25, b >= 1 ? Math.pow(b, 2) * 1.1 : Math.pow(b, -2) * 1.1, 4));
  const bLabel = b === 0.5 ? "½" : fmt(b, 1);
  const trend = b > 1 ? "crescente: quanto maior o expoente, maior a potência" : b < 1 ? "decrescente: com base entre 0 e 1, a potência diminui quando o expoente aumenta" : "constante: 1 elevado a qualquer expoente é sempre 1";
  const xs = [-2, -1, 0, 1, 2, 3, 4];
  return (
    <Screen eyebrow="Exploração visual" title="Simulador de potências" lead="Escolha a base e o expoente. O resultado e o gráfico de y = bˣ mudam na hora.">
      <Cols ratio="2-3">
        <div className="stack">
          <div className="readout">
            <M big="xl">
              <Pow b={<span className="hl-blue">{bLabel}</span>} e={<span className="hl-green">{fmt(x, 1)}</span>} /> {eq} <span className="hl-white">{fmt(y, 4)}</span>
            </M>
            {isInt && (
              <p className="expand">
                <M>{Array.from({ length: x }, () => bLabel).join(" · ")} = {fmt(y, 4)}</M>
              </p>
            )}
          </div>
          <Seg
            label="Base rápida"
            value={b}
            onChange={setB}
            options={[
              { v: 0.5, label: "½" },
              { v: 1, label: "1" },
              { v: 2, label: "2" },
              { v: 3, label: "3" },
              { v: 10, label: "10" },
            ]}
          />
          <Slider id="a1-s3-b" label="Base (b)" value={b} min={0.2} max={10} step={0.1} onChange={setB} display={bLabel} />
          <Slider id="a1-s3-x" label="Expoente (x)" value={x} min={-3} max={6} step={0.5} onChange={setX} display={fmt(x, 1)} />
          <Callout tone={b === 1 ? "amber" : "blue"} label="Observe">
            A função é {trend}.
          </Callout>
        </div>
        <div className="stack">
          <Graph
            ariaLabel={`Gráfico de y igual a ${bLabel} elevado a x`}
            xMin={-3}
            xMax={6}
            yMin={0}
            yMax={yMax}
            xStep={1}
            curves={[{ f: (t) => Math.pow(b, t), cls: "c-blue", label: `y = ${bLabel}ˣ` }]}
            points={[{ x, y, cls: "c-green", label: `(${fmt(x, 1)}; ${fmt(y, 3)})`, guides: true }]}
            xLabel="x (expoente)"
            yLabel="y (potência)"
            height={470}
          />
          <div className="vtable" role="table" aria-label="Tabela de valores">
            <div role="row" className="vt-row vt-head">
              <span role="cell">x</span>
              {xs.map((k) => (
                <span role="cell" key={k}>{k}</span>
              ))}
            </div>
            <div role="row" className="vt-row">
              <span role="cell"><M><Pow b={bLabel} e="x" /></M></span>
              {xs.map((k) => (
                <span role="cell" key={k}>{fmt(Math.pow(b, k), 3)}</span>
              ))}
            </div>
          </div>
        </div>
      </Cols>
    </Screen>
  );
}

/* ─────────── 4. Explicação orientada: da potência ao logaritmo ─────────── */
function S4() {
  const [k, setK] = useAct<number>("a1.s4.k", 0);
  const stages = [
    {
      math: (
        <M big="xl">
          <Pow b={<span className="hl-blue">2</span>} e={<span className="hl-green">5</span>} /> {eq} <span className="hl-white">32</span>
        </M>
      ),
      text: "Partimos de uma potência que a turma já conhece.",
    },
    {
      math: (
        <div className="anat">
          <M big="xl">
            <Pow b={<span className="hl-blue">2</span>} e={<span className="hl-green">5</span>} /> {eq} <span className="hl-white">32</span>
          </M>
          <div className="anat-tags">
            <span className="tag-blue">base 2</span>
            <span className="tag-green">expoente 5</span>
            <span className="tag-white">potência 32</span>
          </div>
        </div>
      ),
      text: "Três números, três papéis. Até agora, conhecendo base e expoente, calculávamos a potência.",
    },
    {
      math: (
        <M big="xl">
          <Pow b={<span className="hl-blue">2</span>} e={<span className="box-q hl-green">?</span>} /> {eq} <span className="hl-white">32</span>
        </M>
      ),
      text: "Agora a pergunta se inverte: conhecendo a base e a potência, qual é o expoente?",
    },
    {
      math: (
        <div className="anat">
          <M big="xl">
            <Log b={<span className="hl-blue">2</span>}><span className="hl-white">32</span></Log> {eq} <span className="hl-green">5</span>
          </M>
          <div className="anat-tags">
            <span className="tag-blue">base 2</span>
            <span className="tag-white">logaritmando 32</span>
            <span className="tag-green">logaritmo 5</span>
          </div>
        </div>
      ),
      text: "Essa pergunta tem nome: logaritmo. Lemos “logaritmo de 32 na base 2 é igual a 5”. O logaritmo é o expoente.",
    },
    {
      math: (
        <M big>
          <Pow b={<span className="hl-blue"><V>a</V></span>} e={<span className="hl-green"><V>x</V></span>} /> {eq} <span className="hl-white"><V>b</V></span> {iff}{" "}
          <Log b={<span className="hl-blue"><V>a</V></span>}><span className="hl-white"><V>b</V></span></Log> {eq} <span className="hl-green"><V>x</V></span>
        </M>
      ),
      text: "As duas frases dizem a mesma coisa. Mudamos apenas o que estamos perguntando.",
    },
  ];
  const s = stages[k];
  return (
    <Screen eyebrow="Explicação orientada" title="Da potência ao logaritmo" lead="Avance passo a passo e peça à turma que antecipe a próxima transformação.">
      <div className="morph">
        <div className="morph-stage" key={k}>
          {s.math}
        </div>
        <p className="morph-text">{s.text}</p>
        <div className="row center">
          <Btn variant="ghost" onClick={() => setK(Math.max(0, k - 1))} disabled={k === 0}>
            ← Passo anterior
          </Btn>
          <span className="pager">{k + 1} / {stages.length}</span>
          <Btn onClick={() => setK(Math.min(stages.length - 1, k + 1))} disabled={k === stages.length - 1}>
            Próximo passo →
          </Btn>
        </div>
      </div>
    </Screen>
  );
}

/* ─────────── 5. Condições de existência ─────────── */
const A_OPTS = [-2, 0, 0.5, 1, 2, 10];
const B_OPTS = [-4, 0, 0.125, 1, 8, 100];
const lbl = (v: number) => (v === 0.5 ? "½" : v === 0.125 ? "⅛" : v < 0 ? `−${-v}` : String(v));

function verdict(a: number, b: number): { ok: boolean; text: React.ReactNode } {
  if (a < 0) return { ok: false, text: <>Com base negativa, potências como <M><Pow b="(−2)" e="½" /></M> não são números reais, e os resultados alternam de sinal. Por isso exigimos <M>a &gt; 0</M>.</> };
  if (a === 0) return { ok: false, text: <>0 elevado a qualquer expoente positivo dá 0, e expoentes negativos não estão definidos. Nunca obteríamos {lbl(b)}. Exigimos <M>a &gt; 0</M>.</> };
  if (a === 1) return { ok: false, text: b === 1 ? <>1 elevado a qualquer número dá 1. Todo x serviria: não há uma resposta única. Exigimos <M>a ≠ 1</M>.</> : <>1 elevado a qualquer número dá 1, nunca {lbl(b)}. Não há resposta. Exigimos <M>a ≠ 1</M>.</> };
  if (b <= 0) return { ok: false, text: <>Com base positiva, <M><Pow b={lbl(a)} e="x" /></M> é sempre positivo. Nenhum expoente produz {lbl(b)}. Exigimos <M>b &gt; 0</M>.</> };
  const v = Math.log(b) / Math.log(a);
  const r = Math.round(v * 1000) / 1000;
  return { ok: true, text: <>Existe: <M><Pow b={lbl(a)} e={fmt(r, 3)} /> = {lbl(b)}</M>, logo <M><Log b={lbl(a)}>{lbl(b)}</Log> = {fmt(r, 3)}</M>.</> };
}

function S5() {
  const [a, setA] = useAct<number>("a1.s5.a", 2);
  const [b, setB] = useAct<number>("a1.s5.b", 8);
  const v = verdict(a, b);
  return (
    <Screen eyebrow="Explicação orientada" title="Quando o logaritmo existe?" lead="Teste combinações de base e logaritmando. Para cada caso, pergunte: existe um expoente que funcione?">
      <Cols ratio="3-2">
        <div className="stack">
          <Seg label="Base a" value={a} onChange={setA} options={A_OPTS.map((o) => ({ v: o, label: lbl(o) }))} />
          <Seg label="Logaritmando b" value={b} onChange={setB} options={B_OPTS.map((o) => ({ v: o, label: lbl(o) }))} />
          <div className={`verdict ${v.ok ? "ok" : "bad"}`}>
            <div className="verdict-q">
              <M big>
                <Log b={lbl(a)}>{lbl(b)}</Log> = <span className="box-q">?</span>
              </M>
              <span className="verdict-flag">{v.ok ? "existe" : "não existe"}</span>
            </div>
            <p>{v.text}</p>
          </div>
        </div>
        <Panel title="Condições de existência" tone="green">
          <p className="big-formula">
            <M big>
              <Log b={<V>a</V>}><V>b</V></Log> existe quando
            </M>
          </p>
          <ul className="conds">
            <li>
              <M><V>a</V> &gt; 0</M> <span>base positiva</span>
            </li>
            <li>
              <M><V>a</V> ≠ 1</M> <span>base diferente de 1</span>
            </li>
            <li>
              <M><V>b</V> &gt; 0</M> <span>logaritmando positivo</span>
            </li>
          </ul>
          <p className="muted small">
            Ideia central: com base positiva e diferente de 1, a potência <M><Pow b={<V>a</V>} e={<V>x</V>} /></M> assume cada valor positivo exatamente uma vez, e nunca assume zero ou valores negativos.
          </p>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 6. Prática: conversões ─────────── */
function S6() {
  const items = [
    {
      prompt: <>Escreva <M big><Pow b="3" e="4" /> = 81</M> na forma logarítmica.</>,
      options: [
        { t: <M><Log b="3">81</Log> = 4</M>, why: "A base da potência continua sendo a base do logaritmo, e o expoente é o resultado." },
        { t: <M><Log b="4">81</Log> = 3</M>, why: <>Trocou base e expoente. Isso diria <M><Pow b="4" e="3" /> = 81</M>, mas <M><Pow b="4" e="3" /> = 64</M>.</> },
        { t: <M><Log b="81">3</Log> = 4</M>, why: <>Isso significaria <M><Pow b="81" e="4" /> = 3</M>, o que é falso.</> },
        { t: <M><Log b="3">4</Log> = 81</M>, why: <>Isso significaria <M><Pow b="3" e="81" /> = 4</M>. O logaritmando deve ser a potência, 81.</> },
      ],
      answer: 0,
    },
    {
      prompt: <>Escreva <M big><Pow b="10" e="3" /> = 1 000</M> na forma logarítmica.</>,
      options: [
        { t: <M><Log b="3">1 000</Log> = 10</M>, why: <>Isso diria <M><Pow b="3" e="10" /> = 1 000</M>, mas <M><Pow b="3" e="10" /> = 59 049</M>.</> },
        { t: <M><Log b="10">3</Log> = 1 000</M>, why: "O logaritmando é a potência (1 000), não o expoente." },
        { t: <M><Log b="10">1 000</Log> = 3</M>, why: "Base 10, potência 1 000, expoente 3." },
        { t: <M><Log b="1 000">10</Log> = 3</M>, why: <>Isso significaria <M><Pow b="1 000" e="3" /> = 10</M>, o que é falso.</> },
      ],
      answer: 2,
    },
    {
      prompt: <>Escreva <M big><Log b="5">25</Log> = 2</M> na forma exponencial.</>,
      options: [
        { t: <M><Pow b="2" e="5" /> = 25</M>, why: <>Inverteu base e logaritmo. Além disso, <M><Pow b="2" e="5" /> = 32</M>.</> },
        { t: <M><Pow b="5" e="2" /> = 25</M>, why: "A base 5 é elevada ao logaritmo 2 e resulta no logaritmando 25." },
        { t: <M><Pow b="25" e="2" /> = 5</M>, why: <><M><Pow b="25" e="2" /> = 625</M>. O logaritmando é o resultado da potência.</> },
        { t: <M><Pow b="5" e="25" /> = 2</M>, why: "O resultado do logaritmo (2) é o expoente, não a potência." },
      ],
      answer: 1,
    },
    {
      prompt: <>Escreva <M big><Log b="6">216</Log> = 3</M> na forma exponencial.</>,
      options: [
        { t: <M><Pow b="216" e="3" /> = 6</M>, why: "A base do logaritmo (6) é a base da potência." },
        { t: <M><Pow b="3" e="6" /> = 216</M>, why: <>Trocou base e expoente: <M><Pow b="3" e="6" /> = 729</M>.</> },
        { t: <M><Pow b="6" e="216" /> = 3</M>, why: "O logaritmando (216) é a potência, não o expoente." },
        { t: <M><Pow b="6" e="3" /> = 216</M>, why: "6 · 6 · 6 = 216." },
      ],
      answer: 3,
    },
    {
      prompt: <>Escreva <M big><Pow b="11" e="2" /> = 121</M> na forma logarítmica.</>,
      options: [
        { t: <M><Log b="11">121</Log> = 2</M>, why: "Base 11, logaritmando 121, logaritmo 2." },
        { t: <M><Log b="2">121</Log> = 11</M>, why: "Trocou base e expoente." },
        { t: <M><Log b="121">11</Log> = 2</M>, why: <>Isso significaria <M><Pow b="121" e="2" /> = 11</M>, o que é falso.</> },
        { t: <M><Log b="11">2</Log> = 121</M>, why: "O logaritmando deve ser a potência, 121." },
      ],
      answer: 0,
    },
    {
      prompt: <>Escreva <M big><Log b="2">64</Log> = 6</M> na forma exponencial.</>,
      options: [
        { t: <M><Pow b="6" e="2" /> = 64</M>, why: <>Trocou base e expoente: <M><Pow b="6" e="2" /> = 36</M>.</> },
        { t: <M><Pow b="64" e="6" /> = 2</M>, why: "A base do logaritmo é a base da potência." },
        { t: <M><Pow b="2" e="6" /> = 64</M>, why: "Seis fatores 2 resultam em 64." },
        { t: <M><Pow b="2" e="64" /> = 6</M>, why: "O logaritmo (6) é o expoente, e 64 é a potência." },
      ],
      answer: 2,
    },
  ];
  return (
    <Screen eyebrow="Prática orientada" title="Desafios de conversão" lead="Converta entre a forma exponencial e a forma logarítmica. Use a regra: o logaritmo é o expoente.">
      <Cols ratio="3-1">
        <QuickCheck id="a1.s6" items={items} />
        <Panel title="Guia" tone="blue">
          <p className="big-formula">
            <M><Pow b={<span className="hl-blue"><V>a</V></span>} e={<span className="hl-green"><V>x</V></span>} /> = <span className="hl-white"><V>b</V></span></M>
          </p>
          <p className="center muted">⇅</p>
          <p className="big-formula">
            <M><Log b={<span className="hl-blue"><V>a</V></span>}><span className="hl-white"><V>b</V></span></Log> = <span className="hl-green"><V>x</V></span></M>
          </p>
          <p className="muted small">As cores acompanham cada número de uma forma para a outra.</p>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 7. Aplicação no estilo ENEM ─────────── */
function S7() {
  const { released } = useReleased("a1.s7.q");
  return (
    <Screen eyebrow="Aplicação no estilo ENEM" title="Quando a cultura chega a 32 000?">
      <Cols ratio="3-2">
        <Quiz
          id="a1.s7.q"
          prompt={
            <>
              <p>
                Em um experimento, uma cultura começa com 1 000 bactérias e a quantidade dobra a cada hora. O número de bactérias após <V>t</V> horas é dado por
              </p>
              <p className="center">
                <M big><V>N</V>(<V>t</V>) = 1 000 · <Pow b="2" e={<V>t</V>} /></M>
              </p>
              <p>Após quantas horas a cultura terá 32 000 bactérias?</p>
            </>
          }
          options={[
            { t: "5 horas", why: <>Dividindo por 1 000: <M><Pow b="2" e="t" /> = 32</M>, então <M>t = <Log b="2">32</Log> = 5</M>.</> },
            { t: "6 horas", why: <>Contou uma dobra a mais: <M><Pow b="2" e="6" /> = 64</M> daria 64 000 bactérias.</> },
            { t: "16 horas", why: "Dividiu 32 000 por 2 000. A quantidade é multiplicada por 2 a cada hora, não somada." },
            { t: "31 horas", why: "Esse seria o tempo se a cultura crescesse 1 000 bactérias por hora (crescimento linear). Aqui ela dobra." },
            { t: "32 horas", why: "32 é o fator de multiplicação total (32 000 ÷ 1 000), não o número de horas." },
          ]}
          answer={0}
          solution={[
            <>Substitua o valor desejado: <M>1 000 · <Pow b="2" e={<V>t</V>} /> = 32 000</M>.</>,
            <>Isole a potência dividindo por 1 000: <M><Pow b="2" e={<V>t</V>} /> = 32</M>.</>,
            <>Escreva 32 como potência de 2: <M><Pow b="2" e={<V>t</V>} /> = <Pow b="2" e="5" /></M>.</>,
            <>Compare os expoentes: <M><V>t</V> = 5</M>. Em linguagem de logaritmos, <M><V>t</V> = <Log b="2">32</Log> = 5</M>.</>,
          ]}
          strategy="Antes de qualquer conta, divida pelo valor inicial para isolar a potência. Depois pergunte: a base elevada a quanto dá esse fator?"
        />
        <Panel title="Linha do tempo" tone="blue">
          {!released && <p className="muted">A tabela aparece quando o gabarito for liberado, para não antecipar a resposta.</p>}
          <div className="timeline" hidden={!released}>
            {[0, 1, 2, 3, 4, 5].map((h) => (
              <div key={h} className={`tl-row ${h === 5 ? "hit" : ""}`}>
                <span className="tl-h">{h} h</span>
                <span className="tl-bar" style={{ width: `${(Math.pow(2, h) / 32) * 100}%` }} />
                <span className="tl-v">{(1000 * Math.pow(2, h)).toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 8. Avaliação rápida ─────────── */
function S8() {
  const items = [
    {
      prompt: <>Quanto vale <M big><Log b="2">8</Log></M>?</>,
      options: [
        { t: "2", why: <><M><Pow b="2" e="2" /> = 4</M>, não 8.</> },
        { t: "3", why: <><M><Pow b="2" e="3" /> = 8</M>.</> },
        { t: "4", why: <><M><Pow b="2" e="4" /> = 16</M>, não 8.</> },
        { t: "16", why: "16 é 2 · 8. O logaritmo é um expoente, não uma multiplicação." },
      ],
      answer: 1,
    },
    {
      prompt: <>Qual igualdade equivale a <M big><Pow b="5" e="3" /> = 125</M>?</>,
      options: [
        { t: <M><Log b="3">125</Log> = 5</M>, why: "Trocou a base pelo expoente." },
        { t: <M><Log b="125">5</Log> = 3</M>, why: "A base da potência (5) deve ser a base do logaritmo." },
        { t: <M><Log b="5">125</Log> = 3</M>, why: "Base 5, logaritmando 125, logaritmo 3." },
        { t: <M><Log b="5">3</Log> = 125</M>, why: "O logaritmando deve ser a potência, 125." },
      ],
      answer: 2,
    },
    {
      prompt: <>Quanto vale <M big><Log b="10">100</Log></M>?</>,
      options: [
        { t: "2", why: <><M><Pow b="10" e="2" /> = 100</M>.</> },
        { t: "10", why: "10 é a base, e não o expoente." },
        { t: "50", why: "Dividiu 100 por 2. O logaritmo procura um expoente." },
        { t: "1 000", why: "Multiplicou 100 por 10." },
      ],
      answer: 0,
    },
    {
      prompt: "Qual dos logaritmos abaixo NÃO existe nos números reais?",
      options: [
        { t: <M><Log b="2">16</Log></M>, why: <>Existe e vale 4, pois <M><Pow b="2" e="4" /> = 16</M>.</> },
        { t: <M><Log b="10">10</Log></M>, why: <>Existe e vale 1, pois <M><Pow b="10" e="1" /> = 10</M>.</> },
        { t: <M><Log b="7">49</Log></M>, why: <>Existe e vale 2, pois <M><Pow b="7" e="2" /> = 49</M>.</> },
        { t: <M><Log b="5">−25</Log></M>, why: <>Não existe: <M><Pow b="5" e="x" /></M> é sempre positivo, então nunca resulta em −25.</> },
      ],
      answer: 3,
    },
    {
      prompt: <>Se <M big><Log b="3"><V>x</V></Log> = 4</M>, então <M><V>x</V></M> vale:</>,
      options: [
        { t: "7", why: "Somou 3 + 4. A definição diz que x é a potência de base 3 e expoente 4." },
        { t: "12", why: "Multiplicou 3 · 4. A potência não é uma multiplicação da base pelo expoente." },
        { t: "64", why: <>Calculou <M><Pow b="4" e="3" /></M>, trocando base e expoente.</> },
        { t: "81", why: <><M><V>x</V> = <Pow b="3" e="4" /> = 81</M>.</> },
      ],
      answer: 3,
    },
  ];
  return (
    <Screen eyebrow="Verificação final" title="Avaliação rápida" lead="Cinco itens. Registre as respostas da turma antes de liberar o gabarito.">
      <QuickCheck id="a1.s8" items={items} />
    </Screen>
  );
}

/* ─────────── 9. Fechamento com pergunta investigativa ─────────── */
function S9() {
  const opts = ["x é negativo", "x = 0", "x é uma fração", "não existe x"];
  const [votes, setVotes] = useAct<number[]>("a1.s9.v", [0, 0, 0, 0]);
  const total = votes.reduce((a, b) => a + b, 0);
  return (
    <Screen eyebrow="Fechamento" title="O que aprendemos e o que vem a seguir">
      <Cols ratio="1-1">
        <Panel title="Síntese da aula" tone="green">
          <ul className="bul big-bul">
            <li>
              O logaritmo responde: <b>a base elevada a quanto dá esse número?</b>
            </li>
            <li>
              <M><Pow b={<V>a</V>} e={<V>x</V>} /> = <V>b</V> {iff} <Log b={<V>a</V>}><V>b</V></Log> = <V>x</V></M>
            </li>
            <li>
              Existe quando <M><V>a</V> &gt; 0</M>, <M><V>a</V> ≠ 1</M> e <M><V>b</V> &gt; 0</M>.
            </li>
          </ul>
        </Panel>
        <Panel title="Pergunta para a próxima aula" tone="amber">
          <p className="center">
            <M big="xl">
              <Pow b="2" e={<span className="box-q">x</span>} /> = <Frac n="1" d="8" />
            </M>
          </p>
          <p className="muted">Levante hipóteses com a turma. Cada clique registra um voto; a resposta será discutida na Aula 2.</p>
          <div className="votes">
            {opts.map((o, i) => (
              <button key={i} type="button" className="vote" onClick={() => setVotes(votes.map((v, k) => (k === i ? v + 1 : v)))}>
                <span className="vote-label">{o}</span>
                <span className="vote-bar" style={{ width: total ? `${(votes[i] / total) * 100}%` : "0%" }} />
                <span className="vote-n">{votes[i]}</span>
              </button>
            ))}
          </div>
          <div className="row">
            <Btn variant="quiet" small onClick={() => setVotes([0, 0, 0, 0])}>
              ↺ Zerar votos
            </Btn>
          </div>
        </Panel>
      </Cols>
    </Screen>
  );
}

export const lesson1: Lesson = {
  n: 1,
  title: "Da exponencial ao logaritmo",
  short: "Da exponencial ao logaritmo",
  goal: "Compreender a operação logarítmica a partir dos conhecimentos prévios sobre potências e funções exponenciais.",
  skills: [
    "Relacionar potência e logaritmo como formas equivalentes de uma mesma igualdade",
    "Identificar base, expoente, potência, logaritmando e logaritmo",
    "Justificar as condições de existência do logaritmo",
    "Ler o crescimento exponencial em tabela e gráfico",
  ],
  assessment: ["Votação coletiva na abertura", "Seis desafios de conversão com feedback", "Avaliação rápida de cinco itens", "Registro de hipóteses para a Aula 2"],
  steps: [
    {
      title: "2 elevado a quanto dá 32?",
      phase: "Mobilização",
      min: 5,
      C: S1,
      notes: [
        "Projete a pergunta e peça que cada estudante escreva um palpite antes de qualquer discussão.",
        "Registre a votação clicando nas alternativas; libere o gabarito só depois de ouvir duas ou três justificativas.",
        "Use a escada das dobras para quem respondeu 16: a pergunta é quantas vezes o 2 aparece como fator.",
      ],
    },
    {
      title: "Descubra o expoente",
      phase: "Exploração e explicação",
      min: 3,
      C: S2,
      notes: [
        "Revele um cartão por vez, pedindo a resposta oral antes do clique.",
        "O cartão 2^? = 1 024 costuma gerar estratégias diferentes; valorize quem decompõe 1 024 = 32 · 32.",
      ],
    },
    {
      title: "Simulador de potências",
      phase: "Exploração e explicação",
      min: 7,
      C: S3,
      notes: [
        "Comece com base 2 e mova o expoente de 0 a 5; pergunte o que acontece a cada passo (o valor dobra).",
        "Troque para base ½ e compare o gráfico: função decrescente.",
        "Mostre a base 1: o gráfico fica constante. Guarde a pergunta “por que a base 1 é problemática?” para a tela de condições.",
        "Expoentes negativos e fracionários aparecem no simulador, mas serão sistematizados na Aula 2. Apenas comente que o gráfico continua.",
      ],
    },
    {
      title: "De 2⁵ = 32 a log₂ 32 = 5",
      phase: "Exploração e explicação",
      min: 5,
      C: S4,
      notes: [
        "Antes de cada clique, pergunte à turma o que vai mudar.",
        "No passo 4, reforce a leitura em voz alta: “logaritmo de 32 na base 2”.",
        "As cores (azul = base, verde = expoente/logaritmo, branco = potência/logaritmando) se repetem em todas as aulas.",
      ],
    },
    {
      title: "Condições de existência",
      phase: "Exploração e explicação",
      min: 5,
      C: S5,
      notes: [
        "Proponha que a turma escolha as combinações. Comece por casos válidos (base 2, logaritmando 8 ou ⅛).",
        "Depois teste base 1 com logaritmando 1 e com 8: um caso tem infinitas respostas, o outro nenhuma.",
        "Evite a justificativa “porque é regra”: o objetivo é que a turma perceba que não haveria resposta única.",
      ],
    },
    {
      title: "Desafios de conversão",
      phase: "Prática orientada",
      min: 12,
      C: S6,
      notes: [
        "Dê 1 minuto por item para registro no caderno; use o cronômetro.",
        "Para o feedback item a item, ligue “Feedback imediato” no painel ou libere o gabarito de cada item.",
        "Erro mais comum: trocar base e expoente. Use as cores do painel Guia para corrigir.",
      ],
    },
    {
      title: "Aplicação: cultura de bactérias",
      phase: "Exercícios e aplicação",
      min: 8,
      C: S7,
      notes: [
        "Leitura compartilhada do enunciado; peça que identifiquem valor inicial, fator e tempo.",
        "Distratores: 31 h (pensamento linear) e 32 h (confundir fator com tempo). Discuta-os após liberar o gabarito.",
        "A resolução abre passo a passo depois que o gabarito é liberado.",
      ],
    },
    {
      title: "Avaliação rápida",
      phase: "Avaliação e fechamento",
      min: 4,
      C: S8,
      notes: [
        "Aplicação coletiva: mãos levantadas ou cartões A/B/C/D.",
        "O placar de acertos aparece quando os gabaritos de todos os itens estiverem liberados.",
        "Se mais de um terço errar o item 5, retome a definição no início da Aula 2.",
      ],
    },
    {
      title: "Síntese e pergunta investigativa",
      phase: "Avaliação e fechamento",
      min: 1,
      C: S9,
      notes: [
        "Não revele a resposta de 2^x = 1/8: ela abre a Aula 2.",
        "Os votos ficam salvos durante a sessão e podem ser retomados na próxima aula.",
      ],
    },
  ],
};

