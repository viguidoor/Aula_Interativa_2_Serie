import React, { useId } from "react";
import { fmt } from "./Math";

export type Curve = { f: (x: number) => number; cls?: string; dash?: boolean; label?: string; xFrom?: number; xTo?: number };
export type Pt = { x: number; y: number; cls?: string; label?: string; guides?: boolean };
export type Line = { v: number; cls?: string; label?: string };

type Props = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep?: number;
  yStep?: number;
  yLog?: boolean; // eixo y em escala logarítmica (yMin > 0)
  xLog?: boolean;
  curves?: Curve[];
  points?: Pt[];
  hLines?: Line[];
  vLines?: Line[];
  xLabel?: string;
  yLabel?: string;
  ariaLabel: string;
  height?: number;
  xFmt?: (x: number) => string;
  yFmt?: (y: number) => string;
  bars?: { x: number; y: number; cls?: string; label?: string }[];
};

const W = 960;

export function Graph(p: Props) {
  const H = p.height ?? 540;
  const pad = { l: p.yLabel ? 124 : 96, r: 28, t: 24, b: 64 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const clip = useId().replace(/:/g, "");

  const tx = (x: number) => {
    if (p.xLog) return pad.l + ((Math.log10(x) - Math.log10(p.xMin)) / (Math.log10(p.xMax) - Math.log10(p.xMin))) * iw;
    return pad.l + ((x - p.xMin) / (p.xMax - p.xMin)) * iw;
  };
  const ty = (y: number) => {
    if (p.yLog) {
      const a = Math.log10(p.yMin), b = Math.log10(p.yMax);
      return pad.t + ih - ((Math.log10(Math.max(y, 1e-300)) - a) / (b - a)) * ih;
    }
    return pad.t + ih - ((y - p.yMin) / (p.yMax - p.yMin)) * ih;
  };

  const xTicks: number[] = [];
  if (p.xLog) {
    for (let k = Math.ceil(Math.log10(p.xMin)); k <= Math.floor(Math.log10(p.xMax)); k++) xTicks.push(Math.pow(10, k));
  } else {
    const xs = p.xStep ?? niceStep(p.xMax - p.xMin);
    for (let x = Math.ceil(p.xMin / xs) * xs; x <= p.xMax + 1e-9; x += xs) xTicks.push(round(x));
  }
  const yTicks: number[] = [];
  if (p.yLog) {
    for (let k = Math.ceil(Math.log10(p.yMin)); k <= Math.floor(Math.log10(p.yMax)); k++) yTicks.push(Math.pow(10, k));
  } else {
    const ys = p.yStep ?? niceStep(p.yMax - p.yMin);
    for (let y = Math.ceil(p.yMin / ys) * ys; y <= p.yMax + 1e-9; y += ys) yTicks.push(round(y));
  }
  const xF = p.xFmt ?? ((x: number) => fmt(x, 2));
  const yF = p.yFmt ?? ((y: number) => fmt(y, 2));

  const path = (c: Curve) => {
    const a = c.xFrom ?? p.xMin, b = c.xTo ?? p.xMax;
    const n = 360;
    let d = "";
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const y = c.f(x);
      const bad = !isFinite(y) || (p.yLog && y <= 0);
      if (bad) { pen = false; continue; }
      // limita valores muito fora da área para evitar coordenadas gigantes
      const yy = Math.max(Math.min(ty(y), pad.t + ih + 2000), pad.t - 2000);
      d += `${pen ? "L" : "M"}${tx(x).toFixed(1)},${yy.toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  const inX = (x: number) => x >= p.xMin - 1e-9 && x <= p.xMax + 1e-9;
  const inY = (y: number) => y >= p.yMin - 1e-9 && y <= p.yMax + 1e-9;

  return (
    <svg className="graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={p.ariaLabel} preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id={clip}>
          <rect x={pad.l} y={pad.t} width={iw} height={ih} />
        </clipPath>
      </defs>
      <rect x={pad.l} y={pad.t} width={iw} height={ih} className="g-plot" />
      {xTicks.map((x) => (
        <g key={"x" + x}>
          <line x1={tx(x)} x2={tx(x)} y1={pad.t} y2={pad.t + ih} className={x === 0 ? "g-axis" : "g-grid"} />
          <text x={tx(x)} y={pad.t + ih + 30} className="g-tick" textAnchor="middle">{xF(x)}</text>
        </g>
      ))}
      {yTicks.map((y) => (
        <g key={"y" + y}>
          <line x1={pad.l} x2={pad.l + iw} y1={ty(y)} y2={ty(y)} className={y === 0 && !p.yLog ? "g-axis" : "g-grid"} />
          <text x={pad.l - 12} y={ty(y) + 7} className="g-tick" textAnchor="end">{yF(y)}</text>
        </g>
      ))}
      <g clipPath={`url(#${clip})`}>
        {p.bars?.map((b, i) => {
          const bw = Math.min(56, iw / ((p.bars?.length ?? 1) * 1.8));
          const y0 = p.yLog ? ty(p.yMin) : ty(Math.max(p.yMin, 0));
          return <rect key={i} x={tx(b.x) - bw / 2} width={bw} y={Math.min(ty(b.y), y0)} height={Math.abs(y0 - ty(b.y))} rx={4} className={`g-bar ${b.cls ?? ""}`} />;
        })}
        {p.hLines?.map((l, i) => (
          <line key={"h" + i} x1={pad.l} x2={pad.l + iw} y1={ty(l.v)} y2={ty(l.v)} className={`g-ref ${l.cls ?? ""}`} />
        ))}
        {p.vLines?.map((l, i) => (
          <line key={"v" + i} x1={tx(l.v)} x2={tx(l.v)} y1={pad.t} y2={pad.t + ih} className={`g-ref ${l.cls ?? ""}`} />
        ))}
        {p.curves?.map((c, i) => (
          <path key={"c" + i} d={path(c)} className={`g-curve ${c.cls ?? ""} ${c.dash ? "g-dash" : ""}`} fill="none" />
        ))}
        {p.points?.filter((q) => inX(q.x) && inY(q.y)).map((q, i) => (
          <g key={"p" + i}>
            {q.guides && (
              <>
                <line x1={tx(q.x)} x2={tx(q.x)} y1={ty(q.y)} y2={pad.t + ih} className="g-guide" />
                <line x1={pad.l} x2={tx(q.x)} y1={ty(q.y)} y2={ty(q.y)} className="g-guide" />
              </>
            )}
            <circle cx={tx(q.x)} cy={ty(q.y)} r={9} className={`g-pt ${q.cls ?? ""}`} />
          </g>
        ))}
      </g>
      {p.hLines?.filter((l) => l.label && inY(l.v)).map((l, i) => (
        <text key={"hl" + i} x={pad.l + iw - 8} y={ty(l.v) - 10} className={`g-lbl ${l.cls ?? ""}`} textAnchor="end">{l.label}</text>
      ))}
      {p.vLines?.filter((l) => l.label && inX(l.v)).map((l, i) => (
        <text key={"vl" + i} x={tx(l.v) + 8} y={pad.t + 26} className={`g-lbl ${l.cls ?? ""}`}>{l.label}</text>
      ))}
      {p.points?.filter((q) => q.label && inX(q.x) && inY(q.y)).map((q, i) => {
        const right = tx(q.x) < pad.l + iw * 0.7;
        const top = ty(q.y) > pad.t + 40;
        return (
          <text key={"pl" + i} x={tx(q.x) + (right ? 16 : -16)} y={ty(q.y) + (top ? -14 : 30)} className={`g-lbl g-lbl-pt ${q.cls ?? ""}`} textAnchor={right ? "start" : "end"}>
            {q.label}
          </text>
        );
      })}
      {p.curves?.filter((c) => c.label).map((c, i) => (
        <text key={"cl" + i} x={pad.l + 14} y={pad.t + 30 + i * 30} className={`g-lbl ${c.cls ?? ""}`}>{c.label}</text>
      ))}
      {p.xLabel && <text x={pad.l + iw} y={H - 8} className="g-axis-lbl" textAnchor="end">{p.xLabel}</text>}
      {p.yLabel && <text className="g-axis-lbl" textAnchor="middle" transform={`translate(22, ${pad.t + ih / 2}) rotate(-90)`}>{p.yLabel}</text>}
    </svg>
  );
}

function round(x: number) {
  return Math.round(x * 1e6) / 1e6;
}

export function niceStep(range: number, target = 6) {
  const raw = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const s = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return s * mag;
}

export function niceMax(v: number) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return s * mag;
}
