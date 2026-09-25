import React from "react";
import { M, Pow, Log, Frac, V, fmt, fmtMoney, Sci } from "../components/Math";
import { Screen, Cols, Panel, Callout, Quiz, RevealCard, Slider, Tabs, QuickCheck, Seg } from "../components/ui";
import { Graph, niceMax } from "../components/Graph";
import { useAct, useReleased } from "../state";
import type { Lesson } from "./types";

const SUP: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const supNum = (n: number) => String(n).split("").map((c) => SUP[c] ?? c).join("");

const SIM_TAG = "Simulado autoral inspirado nas habilidades do ENEM · não é questão oficial";

/* ─────────── 1. Abertura: juros compostos ─────────── */
function S1() {
  return (
    <Screen eyebrow="Abertura investigativa" title="Quando o dinheiro dobra?">
      <Quiz
        id="a4.s1.q"
        prompt={
          <>
            <p>
              Uma pessoa aplica <b>R$ 5 000,00</b> a juros compostos de <b>10% ao ano</b>, creditados ao final de cada ano. O montante após <V>t</V> anos é <M><V>M</V>(<V>t</V>) = 5 000 · <Pow b="1,1" e={<V>t</V>} /></M>.
            </p>
            <p>
              Após quantos anos completos o montante <b>ultrapassa R$ 10 000,00</b> pela primeira vez? Use <M>log 2 ≈ 0,301</M> e <M>log 1,1 ≈ 0,0414</M>.
            </p>
          </>
        }
        options={[
          { t: "5 anos", why: "Em 5 anos o montante é cerca de R$ 8 052,55." },
          { t: "7 anos", why: "Em 7 anos o montante é cerca de R$ 9 743,59: ainda não ultrapassou R$ 10 000." },
          { t: "8 anos", why: "t > 0,301 ÷ 0,0414 ≈ 7,3. O primeiro ano completo depois disso é o 8º: cerca de R$ 10 717,94." },
          { t: "10 anos", why: "Seria o tempo com juros simples (R$ 500 por ano). Nos compostos, os juros também rendem juros." },
          { t: "20 anos", why: "Não há conta que leve a 20: talvez 2 ÷ 0,1. O fator 2 não se divide pela taxa." },
        ]}
        answer={2}
        cols={5}
        solution={[
          <>Queremos <M>5 000 · <Pow b="1,1" e={<V>t</V>} /> &gt; 10 000</M>, ou seja, <M><Pow b="1,1" e={<V>t</V>} /> &gt; 2</M>.</>,
          <>Não dá para igualar bases. Aplicamos log nos dois lados: <M><V>t</V> · log 1,1 &gt; log 2</M>.</>,
          <><M><V>t</V> &gt; <Frac n="0,301" d="0,0414" /> ≈ 7,27</M>.</>,
          <>Como os juros são creditados ao final de cada ano, o primeiro ano completo é o <b>8º</b>. Conferindo: <M>5 000 · <Pow b="1,1" e="7" /> ≈ 9 743,59</M> e <M>5 000 · <Pow b="1,1" e="8" /> ≈ 10 717,94</M>.</>,
        ]}
        strategy="Isole a potência dividindo pelo capital, aplique log dos dois lados e interprete o resultado: o enunciado pede anos completos, então arredonde para cima."
      />
    </Screen>
  );
}

/* ─────────── 2. Simulador de juros compostos ─────────── */
function S2() {
  const [C, setC] = useAct<number>("a4.s2.c", 5000);
  const [i, setI] = useAct<number>("a4.s2.i", 10);
  const [k, setK] = useAct<number>("a4.s2.k", 2);
  const r = i / 100;
  const tStar = Math.log10(k) / Math.log10(1 + r);
  const tInt = Math.ceil(tStar - 1e-9);
  const tSimple = (k - 1) / r;
  const tMax = Math.max(6, Math.ceil(Math.max(tInt, Math.min(tSimple, tInt * 1.6)) * 1.15));
  const yMax = niceMax(C * Math.max(Math.pow(1 + r, tMax), k) * 1.05);
  const pts = Array.from({ length: tMax + 1 }, (_, t) => ({ x: t, y: C * Math.pow(1 + r, t), cls: t === tInt ? "c-green" : "c-blue" }));
  return (
    <Screen eyebrow="Exploração visual" title="Simulador de juros compostos" lead="Ajuste o capital, a taxa anual e a meta. O tempo é calculado com logaritmos e conferido no gráfico.">
      <Cols ratio="2-3">
        <div className="stack">
          <Slider id="a4-s2-c" label="Capital inicial" value={C} min={1000} max={20000} step={500} onChange={setC} display={fmtMoney(C)} />
          <Slider id="a4-s2-i" label="Taxa ao ano" value={i} min={1} max={20} step={0.5} onChange={setI} display={`${fmt(i, 1)}%`} />
          <Slider id="a4-s2-k" label="Meta: multiplicar o capital por" value={k} min={1.5} max={5} step={0.1} onChange={setK} display={`${fmt(k, 1)} ×`} />
          <div className="calc">
            <p>
              <M><Pow b={`(1 + ${fmt(r, 3)})`} e={<V>t</V>} /> = {fmt(k, 1)}</M>
            </p>
            <p>
              <M>
                <V>t</V> = <Frac n={`log ${fmt(k, 1)}`} d={`log ${fmt(1 + r, 3)}`} /> ≈ <Frac n={fmt(Math.log10(k), 4)} d={fmt(Math.log10(1 + r), 4)} /> ≈ <span className="hl-green">{fmt(tStar, 2)}</span>
              </M>
            </p>
            <p className="muted small">
              Meta de {fmtMoney(C * k)} atingida no <b className="hl-green">{tInt}º ano</b> ({fmtMoney(C * Math.pow(1 + r, tInt))}). Com juros simples, seriam {fmt(tSimple, 1)} anos.
            </p>
          </div>
        </div>
        <Graph
          ariaLabel="Montante ao longo dos anos com juros compostos e simples"
          xMin={0}
          xMax={tMax}
          yMin={0}
          yMax={yMax}
          xStep={tMax > 24 ? 5 : tMax > 12 ? 2 : 1}
          curves={[
            { f: (t) => C * Math.pow(1 + r, t), cls: "c-blue", label: "juros compostos" },
            { f: (t) => C * (1 + r * t), cls: "c-muted", dash: true, label: "juros simples" },
          ]}
          points={pts}
          hLines={[{ v: C * k, cls: "c-amber", label: `meta ${fmtMoney(C * k)}` }]}
          vLines={[{ v: tStar, cls: "c-green", label: `t ≈ ${fmt(tStar, 2)}` }]}
          xLabel="anos"
          yLabel="montante (R$)"
          yFmt={(y) => (y >= 1000 ? `${fmt(y / 1000, 1)} mil` : fmt(y, 0))}
          height={520}
        />
      </Cols>
    </Screen>
  );
}

/* ─────────── 3. Modelos ─────────── */
function Populacao() {
  const [r, setR] = useAct<number>("a4.s3.pr", 2);
  const P0 = 200000;
  const g = 1 + r / 100;
  const t15 = Math.log10(1.5) / Math.log10(g);
  const t2 = Math.log10(2) / Math.log10(g);
  return (
    <Cols ratio="2-3">
      <div className="stack">
        <p className="center"><M big><V>P</V>(<V>t</V>) = <V>P</V><sub>0</sub> · <Pow b={`(1 + ${fmt(r / 100, 3)})`} e={<V>t</V>} /></M></p>
        <Slider id="a4-s3-pr" label="Taxa de crescimento anual" value={r} min={0.5} max={5} step={0.1} onChange={setR} display={`${fmt(r, 1)}%`} />
        <p>
          Com <M><V>P</V><sub>0</sub> = 200 000</M>: atinge 300 000 em <b className="hl-green">≈ {fmt(t15, 1)} anos</b> e dobra em <b className="hl-green">≈ {fmt(t2, 1)} anos</b>.
        </p>
        <Callout tone="amber" label="Limite do modelo">
          Supõe taxa constante. Serve para projeções de curto prazo; populações reais mudam de ritmo com natalidade, migração e recursos disponíveis.
        </Callout>
      </div>
      <Graph
        ariaLabel="Crescimento populacional exponencial"
        xMin={0}
        xMax={50}
        yMin={0}
        yMax={niceMax(P0 * Math.pow(g, 50))}
        xStep={10}
        curves={[{ f: (t) => P0 * Math.pow(g, t), cls: "c-blue" }]}
        hLines={[{ v: 300000, cls: "c-amber", label: "300 mil" }, { v: 400000, cls: "c-muted", label: "400 mil" }]}
        points={[{ x: t15, y: 300000, cls: "c-green", guides: true }, { x: t2, y: 400000, cls: "c-green", guides: true }]}
        xLabel="anos"
        yLabel="habitantes"
        yFmt={(y) => `${fmt(y / 1000, 0)} mil`}
        height={440}
      />
    </Cols>
  );
}

function Bacterias() {
  const [T, setT] = useAct<number>("a4.s3.bT", 20);
  const [t, setTt] = useAct<number>("a4.s3.bt", 60);
  const N0 = 500;
  const N = N0 * Math.pow(2, t / T);
  return (
    <Cols ratio="2-3">
      <div className="stack">
        <p className="center"><M big><V>N</V>(<V>t</V>) = 500 · <Pow b="2" e={<Frac n={<V>t</V>} d={T} />} /></M></p>
        <Slider id="a4-s3-bT" label="Tempo de duplicação" value={T} min={10} max={60} step={5} onChange={setT} display={`${T} min`} />
        <Slider id="a4-s3-bt" label="Tempo decorrido" value={t} min={0} max={180} step={5} onChange={setTt} display={`${t} min`} />
        <p>
          Após {t} min: <M><Pow b="2" e={fmt(t / T, 2)} /></M> duplicações → <b className="hl-green">{Math.round(N).toLocaleString("pt-BR")} bactérias</b>.
        </p>
        <p className="muted small">
          Tempo para chegar a 64 000: <M><Pow b="2" e={<Frac n={<V>t</V>} d={T} />} /> = 128 = <Pow b="2" e="7" /></M>, então <M><V>t</V> = 7 · {T} = {7 * T}</M> min.
        </p>
        <Callout tone="amber" label="Limite do modelo">
          Descreve a fase de crescimento em condições ideais de laboratório. Com nutrientes limitados, o crescimento desacelera.
        </Callout>
      </div>
      <Graph
        ariaLabel="Crescimento de bactérias"
        xMin={0}
        xMax={180}
        yMin={0}
        yMax={niceMax(Math.max(N * 1.3, Math.min(N0 * Math.pow(2, 180 / T), 80000)))}
        xStep={30}
        curves={[{ f: (x) => N0 * Math.pow(2, x / T), cls: "c-blue" }]}
        points={[{ x: t, y: N, cls: "c-green", guides: true }]}
        xLabel="minutos"
        yLabel="bactérias"
        yFmt={(y) => (y >= 1000 ? `${fmt(y / 1000, 0)} mil` : fmt(y, 0))}
        height={440}
      />
    </Cols>
  );
}

const SONS = [
  { n: "limiar da audição", e: -12 },
  { n: "sussurro", e: -9 },
  { n: "conversa", e: -6 },
  { n: "trânsito intenso", e: -3.5 },
  { n: "show de rock", e: -1 },
  { n: "limiar da dor", e: 1 },
];

function Decibeis() {
  const [e, setE] = useAct<number>("a4.s3.de", -6);
  const I = Math.pow(10, e);
  const beta = 10 * (e + 12);
  const near = SONS.reduce((a, s) => (Math.abs(s.e - e) < Math.abs(a.e - e) ? s : a), SONS[0]);
  return (
    <Cols ratio="1-1">
      <div className="stack">
        <p className="center"><M big>β = 10 · log <Frac n={<V>I</V>} d={<><V>I</V><sub>0</sub></>} />, &nbsp; <V>I</V><sub>0</sub> = <Pow b="10" e="−12" /> W/m²</M></p>
        <Slider id="a4-s3-de" label="Intensidade sonora I" value={e} min={-12} max={1} step={0.1} onChange={setE} display={<M><Sci x={I} /> W/m²</M>} />
        <div className="readout">
          <M big="xl">β ≈ <span className="hl-green">{fmt(beta, 0)} dB</span></M>
          <p className="muted">Próximo de: {near.n} (valores típicos aproximados)</p>
        </div>
      </div>
      <Panel title="O que a escala comprime" tone="blue">
        <ul className="bul">
          <li>
            <b>+10 dB</b> ⟹ intensidade multiplicada por 10.
          </li>
          <li>
            <b>+20 dB</b> ⟹ intensidade multiplicada por 100.
          </li>
          <li>
            <b>+3 dB</b> ⟹ intensidade aproximadamente dobrada, pois <M>10 · log 2 ≈ 3,01</M>.
          </li>
        </ul>
        <p className="muted small">De 0 a 130 dB, a intensidade varia por um fator de 10 trilhões (<M><Pow b="10" e="13" /></M>). A escala em decibéis transforma essa faixa em números manejáveis.</p>
      </Panel>
    </Cols>
  );
}

function Escala() {
  const [log, setLog] = useAct<boolean>("a4.s3.sl", false);
  return (
    <Cols ratio="2-3">
      <div className="stack">
        <Seg label="Eixo vertical" value={log ? "log" : "lin"} onChange={(v) => setLog(v === "log")} options={[{ v: "lin", label: "linear" }, { v: "log", label: "logarítmico" }]} />
        <p>
          O gráfico mostra a intensidade sonora de seis situações. Na escala <b>linear</b>, quase todas as barras somem ao lado do limiar da dor. Na escala <b>logarítmica</b>, cada linha de grade é 10 vezes a anterior: marcas igualmente espaçadas representam multiplicações iguais.
        </p>
        <Callout tone="blue" label="Leitura de gráficos">
          Em um eixo logarítmico, subir uma linha de grade significa multiplicar por 10, não somar um valor fixo.
        </Callout>
        <ol className="legend-list">
          {SONS.map((s, i) => (
            <li key={i}>
              <b>{i + 1}</b> {s.n}
            </li>
          ))}
        </ol>
      </div>
      <Graph
        ariaLabel="Intensidade sonora em escala linear ou logarítmica"
        xMin={0.3}
        xMax={6.7}
        xStep={1}
        yMin={log ? 1e-13 : 0}
        yMax={log ? 100 : 12}
        yStep={log ? undefined : 2}
        yLog={log}
        bars={SONS.map((s, i) => ({ x: i + 1, y: Math.pow(10, s.e), cls: "c-blue" }))}
        xFmt={(x) => (Number.isInteger(x) ? String(x) : "")}
        yFmt={(y) => (log ? (Math.round(Math.log10(y)) % 3 === 0 ? `10${supNum(Math.round(Math.log10(y)))}` : "") : fmt(y, 0))}
        xLabel="situação"
        yLabel="intensidade (W/m²)"
        height={460}
      />
    </Cols>
  );
}

function S3() {
  return (
    <Screen eyebrow="Exploração visual" title="Quatro situações, modelos diferentes" lead="Em cada aba, altere os parâmetros e observe o que o modelo mede e quais são seus limites.">
      <Tabs
        id="a4.s3.tab"
        tabs={[
          { label: "População", content: <Populacao /> },
          { label: "Bactérias", content: <Bacterias /> },
          { label: "Decibéis", content: <Decibeis /> },
          { label: "Escala logarítmica", content: <Escala /> },
        ]}
      />
    </Screen>
  );
}

/* ─────────── 4. Diferenciar modelos ─────────── */
function S4() {
  const O = (w: [string, string, string]) => [
    { t: "Linear", why: w[0] },
    { t: "Exponencial", why: w[1] },
    { t: "Logarítmico", why: w[2] },
  ];
  const items = [
    { prompt: "Uma cidade ganha 1 200 habitantes por ano.", options: O(["Soma a mesma quantidade a cada ano.", "Não há multiplicação por um fator constante.", "Não há logaritmo da variável."]), answer: 0 },
    { prompt: "Um investimento rende 1% ao mês sobre o saldo acumulado.", options: O(["O acréscimo cresce com o saldo: não é fixo.", "Multiplica o saldo por 1,01 a cada mês.", "O saldo é a potência; o tempo seria o logaritmo."]), answer: 1 },
    { prompt: <>O nível sonoro em função da intensidade: <M>β = 10 · log(<V>I</V>/<V>I</V><sub>0</sub>)</M>.</>, options: O(["Dobrar I não dobra β.", "β não multiplica por um fator constante.", "β é proporcional ao logaritmo de I."]), answer: 2 },
    { prompt: "Uma cultura de bactérias dobra a cada 20 minutos.", options: O(["Não soma um valor fixo.", "Multiplica por 2 a cada período.", "O número de bactérias é a potência."]), answer: 1 },
    { prompt: <>O tempo para um capital ser multiplicado por <V>k</V>: <M><V>t</V> = log <V>k</V> ÷ log(1 + <V>i</V>)</M>.</>, options: O(["t não cresce um valor fixo quando k cresce um valor fixo.", "t não é uma potência de k.", "t é proporcional a log k: dobrar k soma um tempo fixo."]), answer: 2 },
    { prompt: "Um táxi cobra R$ 5,00 fixos mais R$ 3,00 por quilômetro.", options: O(["Soma R$ 3,00 a cada quilômetro.", "Não há multiplicação por um fator.", "Não há logaritmo."]), answer: 0 },
  ];
  return (
    <Screen eyebrow="Prática orientada" title="Linear, exponencial ou logarítmico?">
      <Cols ratio="3-2" align="start">
        <QuickCheck id="a4.s4" items={items} />
        <Panel title="Como reconhecer" tone="green">
          <div className="models">
            <div>
              <b>Linear</b>
              <span>soma um valor fixo a cada passo</span>
              <M><V>y</V> = <V>a</V> + <V>b</V><V>x</V></M>
            </div>
            <div>
              <b>Exponencial</b>
              <span>multiplica por um fator fixo a cada passo</span>
              <M><V>y</V> = <V>a</V> · <Pow b={<V>b</V>} e={<V>x</V>} /></M>
            </div>
            <div>
              <b>Logarítmico</b>
              <span>soma um valor fixo quando x é multiplicado por um fator fixo</span>
              <M><V>y</V> = <V>a</V> + <V>b</V> · log <V>x</V></M>
            </div>
          </div>
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 5. Roteiro de resolução ─────────── */
function S5() {
  const steps = [
    ["Identifique o modelo", "Soma fixa, fator fixo ou escala logarítmica?"],
    ["Isole a potência", "Divida pelo valor inicial: C · qᵗ = M vira qᵗ = M/C."],
    ["Tente igualar bases", "Se M/C for potência de q, compare expoentes."],
    ["Senão, aplique log", "t · log q = log(M/C). Use os valores dados no enunciado."],
    ["Interprete", "Anos completos? Arredonde para cima. Confira a resposta no contexto."],
  ];
  return (
    <Screen eyebrow="Estratégia" title="Roteiro para questões de exponencial e logaritmo" lead="Use este roteiro nas cinco questões do simulado.">
      <ol className="route">
        {steps.map(([h, t], i) => (
          <li key={i}>
            <span className="route-n">{i + 1}</span>
            <b>{h}</b>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </Screen>
  );
}

/* ─────────── 6–10. Simulado ─────────── */
function SimHead({ n }: { n: number }) {
  return (
    <p className="sim-tag">
      <span>Questão {n} de 5</span> {SIM_TAG}
    </p>
  );
}

function Q1() {
  return (
    <Screen eyebrow="Simulado · questão 1" title="Aplicação com meta de resgate">
      <SimHead n={1} />
      <Quiz
        id="a4.q1"
        cols={5}
        prompt={
          <>
            <p>
              Uma estudante aplicou R$ 4 000,00 em um investimento que rende juros compostos de 5% ao mês. Ela pretende resgatar o dinheiro assim que o montante atingir, no mínimo, R$ 6 000,00. O montante após <V>t</V> meses é <M><V>M</V>(<V>t</V>) = 4 000 · <Pow b="1,05" e={<V>t</V>} /></M>.
            </p>
            <p>
              Considere <M>log 1,5 ≈ 0,176</M> e <M>log 1,05 ≈ 0,021</M>. O número mínimo de meses completos para que ela possa fazer o resgate é
            </p>
          </>
        }
        options={[
          { t: "4.", why: "Usou a taxa 0,05 no lugar de log 1,05: 0,176 ÷ 0,05 ≈ 3,5." },
          { t: "8.", why: "Arredondou 8,38 para baixo. Em 8 meses o montante é cerca de R$ 5 909,82, ainda menor que R$ 6 000." },
          { t: "9.", why: "t ≥ 0,176 ÷ 0,021 ≈ 8,38; o primeiro mês completo é o 9º (≈ R$ 6 205,31)." },
          { t: "10.", why: "Esse seria o tempo com juros simples: R$ 200 por mês até somar R$ 2 000." },
          { t: "30.", why: "Dividiu o fator 1,5 pela taxa 0,05, misturando grandezas sem sentido." },
        ]}
        answer={2}
        solution={[
          <>Isole a potência: <M>4 000 · <Pow b="1,05" e={<V>t</V>} /> ≥ 6 000 ⟹ <Pow b="1,05" e={<V>t</V>} /> ≥ 1,5</M>.</>,
          <>Aplique log: <M><V>t</V> · log 1,05 ≥ log 1,5</M>.</>,
          <><M><V>t</V> ≥ <Frac n="0,176" d="0,021" /> ≈ 8,38</M>.</>,
          <>O tempo precisa ser um número inteiro de meses maior ou igual a 8,38: <b>9 meses</b>.</>,
        ]}
        strategy="Divida 6 000 por 4 000 antes de tudo: o problema vira 1,05ᵗ ≥ 1,5, e os dois logaritmos necessários já estão no enunciado."
      />
    </Screen>
  );
}

function Q2() {
  return (
    <Screen eyebrow="Simulado · questão 2" title="Cultura em laboratório">
      <SimHead n={2} />
      <Quiz
        id="a4.q2"
        cols={5}
        prompt={
          <>
            <p>
              Em um laboratório, uma cultura de bactérias em condições controladas dobra de tamanho a cada 3 horas. No início do experimento havia 2 000 bactérias, e a quantidade após <V>t</V> horas é <M><V>N</V>(<V>t</V>) = 2 000 · <Pow b="2" e={<Frac n={<V>t</V>} d="3" />} /></M>.
            </p>
            <p>A cultura atingirá 128 000 bactérias após</p>
          </>
        }
        options={[
          { t: "6 horas.", why: "Encontrou t/3 = 6, mas esqueceu de multiplicar por 3." },
          { t: "18 horas.", why: "2^(t/3) = 64 = 2⁶ ⟹ t/3 = 6 ⟹ t = 18." },
          { t: "21 horas.", why: "Dividiu 128 000 por 1 000 em vez de 2 000 e obteve 2^(t/3) = 128." },
          { t: "64 horas.", why: "64 é o fator de multiplicação, não o tempo." },
          { t: "192 horas.", why: "Multiplicou o fator 64 por 3." },
        ]}
        answer={1}
        solution={[
          <><M>2 000 · <Pow b="2" e={<Frac n={<V>t</V>} d="3" />} /> = 128 000 ⟹ <Pow b="2" e={<Frac n={<V>t</V>} d="3" />} /> = 64</M>.</>,
          <><M>64 = <Pow b="2" e="6" /></M>, então <M><Frac n={<V>t</V>} d="3" /> = 6</M>.</>,
          <><M><V>t</V> = 18</M> horas. Verificação: 18 h correspondem a 6 duplicações, e 2 000 · 64 = 128 000 ✓.</>,
        ]}
        strategy="Conte duplicações: o fator 64 = 2⁶ corresponde a 6 duplicações de 3 horas."
      />
    </Screen>
  );
}

function Q3() {
  return (
    <Screen eyebrow="Simulado · questão 3" title="Barulho no intervalo">
      <SimHead n={3} />
      <Quiz
        id="a4.q3"
        cols={5}
        prompt={
          <>
            <p>
              O nível de intensidade sonora β, em decibéis, é dado por <M>β = 10 · log <Frac n={<V>I</V>} d={<><V>I</V><sub>0</sub></>} /></M>, em que <V>I</V> é a intensidade sonora, em W/m², e <M><V>I</V><sub>0</sub> = <Pow b="10" e="−12" /></M> W/m².
            </p>
            <p>
              Durante uma atividade em sala, um medidor registrou 60 dB. No intervalo, o mesmo medidor registrou 90 dB no pátio. A intensidade sonora no pátio foi quantas vezes a intensidade na sala?
            </p>
          </>
        }
        options={[
          { t: "1,5", why: "Dividiu os níveis em dB (90 ÷ 60). A escala é logarítmica: razões de dB não são razões de intensidade." },
          { t: "3", why: "Dividiu a diferença de 30 dB por 10, mas não elevou 10 a esse resultado." },
          { t: "30", why: "30 é a diferença em decibéis, não a razão entre intensidades." },
          { t: "1 000", why: "30 = 10 · log(I₂/I₁) ⟹ I₂/I₁ = 10³ = 1 000." },
          { t: "10³⁰", why: "Usou a diferença 30 diretamente como expoente, sem dividir por 10." },
        ]}
        answer={3}
        solution={[
          <>Sala: <M>60 = 10 · log(<V>I</V><sub>1</sub>/<V>I</V><sub>0</sub>) ⟹ <V>I</V><sub>1</sub> = <Pow b="10" e="6" /> · <V>I</V><sub>0</sub> = <Pow b="10" e="−6" /></M> W/m².</>,
          <>Pátio: <M>90 = 10 · log(<V>I</V><sub>2</sub>/<V>I</V><sub>0</sub>) ⟹ <V>I</V><sub>2</sub> = <Pow b="10" e="9" /> · <V>I</V><sub>0</sub> = <Pow b="10" e="−3" /></M> W/m².</>,
          <>Razão: <M><Frac n={<Pow b="10" e="−3" />} d={<Pow b="10" e="−6" />} /> = <Pow b="10" e="3" /> = 1 000</M>.</>,
        ]}
        strategy="Diferença de níveis: Δβ = 10 · log(I₂/I₁). Com Δβ = 30, a razão é 10^(30/10) = 10³. Não é preciso calcular cada intensidade."
      />
    </Screen>
  );
}

function Q4() {
  return (
    <Screen eyebrow="Simulado · questão 4" title="Projeção populacional">
      <SimHead n={4} />
      <Quiz
        id="a4.q4"
        cols={5}
        prompt={
          <>
            <p>
              Um município tem 50 000 habitantes. Um estudo de planejamento urbano adota, para os próximos anos, o modelo <M><V>P</V>(<V>t</V>) = 50 000 · <Pow b="1,02" e={<V>t</V>} /></M>, que supõe crescimento de 2% ao ano, com <V>t</V> em anos.
            </p>
            <p>
              Segundo esse modelo, e considerando <M>log 1,5 ≈ 0,176</M> e <M>log 1,02 ≈ 0,0086</M>, a população chegará a 75 000 habitantes em aproximadamente
            </p>
          </>
        }
        options={[
          { t: "20,5 anos.", why: "1,02ᵗ = 1,5 ⟹ t = 0,176 ÷ 0,0086 ≈ 20,5." },
          { t: "8,8 anos.", why: "Usou a taxa 0,02 no lugar de log 1,02." },
          { t: "25 anos.", why: "Tratou o crescimento como linear: 2% de 50 000 = 1 000 habitantes por ano." },
          { t: "50 anos.", why: "Calculou 1 ÷ 0,02, sem relação com a meta de 75 000." },
          { t: "75 anos.", why: "Dividiu o fator 1,5 pela taxa 0,02." },
        ]}
        answer={0}
        solution={[
          <><M>50 000 · <Pow b="1,02" e={<V>t</V>} /> = 75 000 ⟹ <Pow b="1,02" e={<V>t</V>} /> = 1,5</M>.</>,
          <><M><V>t</V> · log 1,02 = log 1,5 ⟹ <V>t</V> = <Frac n="0,176" d="0,0086" /> ≈ 20,5</M>.</>,
          <>A resposta é uma projeção do modelo, que supõe a taxa de 2% constante durante todo o período.</>,
        ]}
        strategy="Mesma estrutura da questão 1: isolar a potência, aplicar log, dividir. A alternativa de 25 anos é a armadilha do pensamento linear."
      />
    </Screen>
  );
}

function Q5() {
  return (
    <Screen eyebrow="Simulado · questão 5" title="Concentração de um medicamento">
      <SimHead n={5} />
      <Quiz
        id="a4.q5"
        cols={5}
        prompt={
          <>
            <p>
              Após uma dose, a concentração de certo medicamento no sangue de um paciente diminui 20% a cada hora, conforme o modelo <M><V>C</V>(<V>t</V>) = <V>C</V><sub>0</sub> · <Pow b="0,8" e={<V>t</V>} /></M>, com <V>t</V> em horas. Um exame só pode ser realizado quando a concentração for <b>menor que 25%</b> da concentração inicial.
            </p>
            <p>
              Considere <M>log 2 ≈ 0,301</M>. O menor número inteiro de horas após a dose para que o exame possa ser feito é
            </p>
          </>
        }
        options={[
          { t: "1.", why: "Usou log 8 ≈ 0,903 no lugar de log 0,8: 0,602 ÷ 0,903 ≈ 0,67." },
          { t: "2.", why: "Usou 0,75 no lugar de 0,25, confundindo “reduzir 75%” com “restar 75%”." },
          { t: "4.", why: "Tratou a queda como linear: 20 pontos percentuais por hora. A queda é de 20% do valor atual." },
          { t: "6.", why: "Arredondou 6,2 para baixo. Em 6 horas ainda restam cerca de 26,2%." },
          { t: "7.", why: "t > 0,602 ÷ 0,097 ≈ 6,2; o menor inteiro é 7 (restam ≈ 21%)." },
        ]}
        answer={4}
        solution={[
          <>Queremos <M><Pow b="0,8" e={<V>t</V>} /> &lt; 0,25</M>. Aplique log: <M><V>t</V> · log 0,8 &lt; log 0,25</M>.</>,
          <>Calcule com log 2: <M>log 0,8 = log <Frac n="8" d="10" /> = 3 · 0,301 − 1 = −0,097</M> e <M>log 0,25 = log <Frac n="1" d="4" /> = −2 · 0,301 = −0,602</M>.</>,
          <><M><V>t</V> · (−0,097) &lt; −0,602</M>. Ao dividir por um número <b>negativo</b>, a desigualdade inverte: <M><V>t</V> &gt; <Frac n="0,602" d="0,097" /> ≈ 6,2</M>.</>,
          <>Menor inteiro: <b>7 horas</b>. Conferindo: <M><Pow b="0,8" e="6" /> ≈ 0,262</M> (ainda 26,2%) e <M><Pow b="0,8" e="7" /> ≈ 0,210</M> ✓.</>,
        ]}
        strategy="Em decaimento, o logaritmo da base (0,8) é negativo: lembre de inverter a desigualdade. Escreva 0,8 = 8/10 e 0,25 = 1/4 para usar apenas log 2."
      />
    </Screen>
  );
}

/* ─────────── 11. Desafio integrador ─────────── */
function S11() {
  const { released } = useReleased("a4.s11.q");
  return (
    <Screen eyebrow="Questão-desafio integradora" title="Dois investimentos, um encontro">
      <Cols ratio="3-2" align="start">
        <Quiz
          id="a4.s11.q"
          prompt={
            <>
              <p>
                Ana aplicou R$ 1 000,00 a juros compostos de 21% ao ano. No mesmo dia, Bruno aplicou R$ 1 210,00 a juros compostos de 10% ao ano. Nenhum dos dois fez retiradas ou novos depósitos.
              </p>
              <p>Após quanto tempo os dois montantes serão iguais? Resolva sem calculadora.</p>
            </>
          }
          options={[
            { t: "1 ano", why: "Após 1 ano: Ana tem R$ 1 210,00 e Bruno, R$ 1 331,00." },
            { t: "2 anos", why: "1,21ᵗ ÷ 1,1ᵗ = 1,21 ⟹ 1,1ᵗ = 1,1² ⟹ t = 2." },
            { t: "cerca de 2,4 anos", why: "Esse seria o encontro com juros simples (R$ 210 contra R$ 121 por ano)." },
            { t: "11 anos", why: "Subtraiu as taxas (21 − 10). As taxas não se comparam por diferença." },
            { t: "nunca serão iguais", why: "Ana começa com menos, mas cresce mais rápido: em algum momento alcança Bruno." },
          ]}
          answer={1}
          solution={[
            <>Iguale os montantes: <M>1 000 · <Pow b="1,21" e={<V>t</V>} /> = 1 210 · <Pow b="1,1" e={<V>t</V>} /></M>.</>,
            <>Agrupe as potências de mesmo expoente: <M><Frac n={<Pow b="1,21" e={<V>t</V>} />} d={<Pow b="1,1" e={<V>t</V>} />} /> = <Pow b={<>(<Frac n="1,21" d="1,1" />)</>} e={<V>t</V>} /> = <Pow b="1,1" e={<V>t</V>} /></M>, e o lado direito fica <M>1 210 ÷ 1 000 = 1,21</M>.</>,
            <>Reconheça a potência: <M>1,21 = <Pow b="1,1" e="2" /></M>. Então <M><Pow b="1,1" e={<V>t</V>} /> = <Pow b="1,1" e="2" /></M> e <M><V>t</V> = 2</M>.</>,
            <>Com logaritmos, o mesmo resultado: <M><V>t</V> · log 1,1 = log 1,21 = 2 · log 1,1</M>. Conferindo: Ana tem <M>1 000 · 1,4641</M> e Bruno tem <M>1 210 · 1,21</M>. Os dois ficam com R$ 1 464,10 ✓.</>,
          ]}
          strategy="Integra três ideias: modelo exponencial, quociente de potências de mesmo expoente e reconhecimento de 1,21 = 1,1²."
        />
        <Panel title="Os dois montantes" tone="blue">
          {released ? (
            <Graph
              ariaLabel="Montantes de Ana e Bruno ao longo do tempo"
              xMin={0}
              xMax={4}
              yMin={900}
              yMax={2300}
              xStep={1}
              yStep={200}
              curves={[
                { f: (t) => 1000 * Math.pow(1.21, t), cls: "c-green", label: "Ana: 1 000 · 1,21ᵗ" },
                { f: (t) => 1210 * Math.pow(1.1, t), cls: "c-blue", label: "Bruno: 1 210 · 1,1ᵗ" },
              ]}
              points={[{ x: 2, y: 1464.1, cls: "c-amber", label: "t = 2: R$ 1 464,10", guides: true }]}
              xLabel="anos"
              yLabel="R$"
              yFmt={(y) => fmt(y, 0)}
              height={480}
            />
          ) : (
            <p className="muted">O gráfico aparece quando o gabarito for liberado.</p>
          )}
        </Panel>
      </Cols>
    </Screen>
  );
}

/* ─────────── 12. Revisão ─────────── */
function S12() {
  const cards = [
    { f: "O que é um logaritmo?", b: <>É um expoente: <M><Log b={<V>a</V>}><V>b</V></Log> = <V>x</V> ⟺ <Pow b={<V>a</V>} e={<V>x</V>} /> = <V>b</V></M>.</> },
    { f: "Quando existe?", b: <>Base positiva e diferente de 1; logaritmando positivo.</> },
    { f: "Produto e quociente", b: <>O log do produto é a soma dos logs; o log do quociente é a diferença.</> },
    { f: "Potência", b: <><M><Log b={<V>a</V>}><Pow b={<V>x</V>} e={<V>n</V>} /></Log> = <V>n</V> · <Log b={<V>a</V>}><V>x</V></Log></M>. O expoente “desce”.</> },
    { f: <>Como resolver <M><Pow b={<V>q</V>} e={<V>t</V>} /> = <V>k</V></M>?</>, b: <>Igualando bases, ou por <M><V>t</V> = log <V>k</V> ÷ log <V>q</V></M>.</> },
    { f: "Escala logarítmica", b: <>Uma diferença de n unidades corresponde a um fator <M><Pow b="10" e="n" /></M> (em dB, um fator <M><Pow b="10" e="n/10" /></M>).</> },
  ];
  return (
    <Screen eyebrow="Revisão dos conceitos" title="Seis ideias para levar" lead="Peça a resposta à turma antes de virar cada cartão.">
      <div className="grid-3">
        {cards.map((c, i) => (
          <RevealCard key={i} id={`a4.s12.c${i}`} front={<span className="rc-q">{c.f}</span>} back={<span className="small">{c.b}</span>} hint="Virar" />
        ))}
      </div>
    </Screen>
  );
}

/* ─────────── 13. Encerramento ─────────── */
function S13() {
  const cols = [
    { n: 1, h: "Da exponencial ao logaritmo", t: "O logaritmo é o expoente que leva a base até um número." },
    { n: 2, h: "Definição e cálculo", t: "Logaritmos podem ser inteiros, nulos, negativos ou fracionários." },
    { n: 3, h: "Propriedades", t: "Produto vira soma, quociente vira diferença e o expoente vira fator." },
    { n: 4, h: "Aplicações", t: "Logaritmos calculam tempos em modelos exponenciais e medem grandezas em escalas logarítmicas." },
  ];
  return (
    <Screen eyebrow="Encerramento" title="A jornada completa">
      <div className="journey">
        {cols.map((c) => (
          <div key={c.n} className="journey-step">
            <span className="journey-n">Aula {c.n}</span>
            <b>{c.h}</b>
            <p>{c.t}</p>
          </div>
        ))}
      </div>
      <div className="closing">
        <M big="xl">
          <Pow b={<span className="hl-blue"><V>a</V></span>} e={<span className="hl-green"><V>x</V></span>} /> = <span className="hl-white"><V>b</V></span> ⟺ <Log b={<span className="hl-blue"><V>a</V></span>}><span className="hl-white"><V>b</V></span></Log> = <span className="hl-green"><V>x</V></span>
        </M>
        <p className="lead center">Toda a unidade cabe nesta equivalência.</p>
      </div>
    </Screen>
  );
}

export const lesson4: Lesson = {
  n: 4,
  title: "Logaritmos aplicados ao ENEM",
  short: "Aplicações e simulado",
  goal: "Interpretar situações reais envolvendo modelos exponenciais e logarítmicos e desenvolver estratégias de resolução.",
  skills: [
    "Calcular tempos em juros compostos e crescimento populacional",
    "Distinguir modelos lineares, exponenciais e logarítmicos",
    "Interpretar decibéis e gráficos em escala logarítmica",
    "Usar aproximações fornecidas e interpretar arredondamentos no contexto",
  ],
  assessment: ["Simulado autoral de 5 questões com análise de distratores", "Questão-desafio integradora", "Classificação de modelos"],
  steps: [
    {
      title: "Quando o dinheiro dobra?",
      phase: "Mobilização",
      min: 5,
      C: S1,
      notes: [
        "Registre os palpites antes de qualquer conta. A alternativa de 10 anos revela o raciocínio de juros simples: não corrija ainda.",
        "Libere o gabarito e resolva junto com a turma; o simulador da próxima tela confere o resultado.",
      ],
    },
    {
      title: "Simulador de juros",
      phase: "Exploração e explicação",
      min: 5,
      C: S2,
      notes: [
        "Reproduza o problema de abertura (R$ 5 000, 10%, meta 2×) e mostre a linha vertical em t ≈ 7,27.",
        "Aumente a taxa e pergunte: o tempo cai pela metade quando a taxa dobra? (não exatamente).",
        "Compare a curva com a reta tracejada de juros simples.",
      ],
    },
    {
      title: "Modelos e escalas",
      phase: "Exploração e explicação",
      min: 6,
      C: S3,
      notes: [
        "Dedique cerca de 1,5 minuto por aba.",
        "Na aba de decibéis, destaque +10 dB = ×10 na intensidade. Evite dizer que o som fica “10 vezes mais alto”: a percepção humana é outra grandeza.",
        "Na escala logarítmica, alterne linear/log e peça que a turma explique o que mudou.",
      ],
    },
    {
      title: "Classificar modelos",
      phase: "Prática orientada",
      min: 3,
      C: S4,
      notes: ["Faça os itens com resposta oral rápida. Use o painel da direita como apoio."],
    },
    {
      title: "Roteiro de resolução",
      phase: "Prática orientada",
      min: 1,
      C: S5,
      notes: ["Deixe o roteiro visível por um minuto e peça que copiem os cinco passos."],
    },
    {
      title: "Simulado · questão 1",
      phase: "Exercícios e aplicação",
      min: 4,
      C: Q1,
      notes: ["Tempo sugerido: 3 min de resolução individual (use o cronômetro) + 1 min de correção.", "Gabarito: C (9 meses). Distratores: B (arredondamento), D (juros simples)."],
    },
    {
      title: "Simulado · questão 2",
      phase: "Exercícios e aplicação",
      min: 4,
      C: Q2,
      notes: ["Gabarito: B (18 horas). Questão resolvida por reconhecimento de potências, sem logaritmos decimais."],
    },
    {
      title: "Simulado · questão 3",
      phase: "Exercícios e aplicação",
      min: 4,
      C: Q3,
      notes: ["Gabarito: D (1 000). Distrator A (1,5) é o mais escolhido: discuta por que dB não se dividem."],
    },
    {
      title: "Simulado · questão 4",
      phase: "Exercícios e aplicação",
      min: 4,
      C: Q4,
      notes: ["Gabarito: A (≈ 20,5 anos). Reforce que o resultado depende da hipótese de taxa constante."],
    },
    {
      title: "Simulado · questão 5",
      phase: "Exercícios e aplicação",
      min: 4,
      C: Q5,
      notes: ["Gabarito: E (7 horas). Ponto-chave: dividir por log 0,8 < 0 inverte a desigualdade.", "Contexto fictício com números didáticos; não representa um medicamento real."],
    },
    {
      title: "Desafio integrador",
      phase: "Exercícios e aplicação",
      min: 5,
      C: S11,
      notes: ["Resolução em duplas. Dica, se necessário: divida as duas potências de expoente t.", "Após liberar, o gráfico mostra o encontro em t = 2."],
    },
    {
      title: "Revisão",
      phase: "Avaliação e fechamento",
      min: 3,
      C: S12,
      notes: ["Vire os cartões só depois de ouvir a turma."],
    },
    {
      title: "Encerramento",
      phase: "Avaliação e fechamento",
      min: 2,
      C: S13,
      notes: ["Retome a primeira pergunta da Aula 1 (2^? = 32) e mostre como a turma chegou até os modelos do ENEM."],
    },
  ],
};

