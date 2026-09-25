import React from "react";

/**
 * Notação matemática leve, sem dependências (funciona igual no Figma Make).
 * Uso: <M><Pow b="2" e="5" /> = 32</M>, <Log b="2">32</Log>, <Frac n="1" d="8" />
 */

type N = React.ReactNode;

export function M({ children, big, className = "" }: { children: N; big?: boolean | "xl"; className?: string }) {
  const size = big === "xl" ? " m-xl" : big ? " m-big" : "";
  return <span className={`m${size} ${className}`}>{children}</span>;
}

/** variável em itálico */
export function V({ children }: { children: N }) {
  return <i className="m-var">{children}</i>;
}

export function Pow({ b, e, bClass, eClass }: { b: N; e: N; bClass?: string; eClass?: string }) {
  return (
    <span className="m-pow">
      <span className={`m-base ${bClass ?? ""}`}>{b}</span>
      <sup className={`m-exp ${eClass ?? ""}`}>{e}</sup>
    </span>
  );
}

export function Log({
  b,
  children,
  paren = true,
  bClass,
  aClass,
}: {
  b?: N;
  children: N;
  paren?: boolean;
  bClass?: string;
  aClass?: string;
}) {
  return (
    <span className="m-log">
      <span className="m-fn">log</span>
      {b !== undefined && <sub className={`m-sub ${bClass ?? ""}`}>{b}</sub>}
      <span className={aClass}>
        {paren ? "(" : " "}
        {children}
        {paren ? ")" : ""}
      </span>
    </span>
  );
}

export function Frac({ n, d }: { n: N; d: N }) {
  return (
    <span className="m-frac" role="math" aria-label={`${String(n)} sobre ${String(d)}`}>
      <span className="m-num">{n}</span>
      <span className="m-den">{d}</span>
    </span>
  );
}

export function Sqrt({ children, idx }: { children: N; idx?: N }) {
  return (
    <span className="m-sqrt">
      {idx && <sup className="m-root-idx">{idx}</sup>}
      <span className="m-radic">√</span>
      <span className="m-radicand">{children}</span>
    </span>
  );
}

/** sinais com espaçamento matemático */
export const eq = <span className="m-op">=</span>;
export const iff = <span className="m-op m-iff">⟺</span>;
export const imp = <span className="m-op">⟹</span>;
export const plus = <span className="m-op">+</span>;
export const minus = <span className="m-op">−</span>;
export const times = <span className="m-op">·</span>;
export const approx = <span className="m-op">≈</span>;
export const neq = <span className="m-op">≠</span>;

/** Formata número em pt-BR com casas decimais configuráveis */
export function fmt(x: number, digits = 3): string {
  if (!isFinite(x)) return "—";
  const r = Number(x.toFixed(digits));
  return r.toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export function fmtMoney(x: number): string {
  return x.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
}

/** Número em notação de potência de 10 quando muito grande/pequeno */
export function Sci({ x, digits = 2 }: { x: number; digits?: number }) {
  if (x === 0) return <>0</>;
  const k = Math.floor(Math.log10(Math.abs(x)) + 1e-9);
  if (k >= -2 && k <= 6) return <>{fmt(x, digits)}</>;
  const mant = x / Math.pow(10, k);
  const mantStr = fmt(mant, digits);
  return (
    <>
      {mantStr === "1" ? "" : <>{mantStr} {times} </>}
      <Pow b="10" e={k < 0 ? `−${-k}` : k} />
    </>
  );
}
