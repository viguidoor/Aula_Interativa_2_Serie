import type React from "react";

export type Phase = "Mobilização" | "Exploração e explicação" | "Prática orientada" | "Exercícios e aplicação" | "Avaliação e fechamento";

export const PHASES: Phase[] = ["Mobilização", "Exploração e explicação", "Prática orientada", "Exercícios e aplicação", "Avaliação e fechamento"];

export type Step = {
  /** título curto para navegação */
  title: string;
  phase: Phase;
  /** duração recomendada em minutos */
  min: number;
  /** orientações ao professor (não aparecem na tela da turma) */
  notes: string[];
  C: React.FC;
};

export type Lesson = {
  n: number;
  title: string;
  short: string;
  goal: string;
  skills: string[];
  assessment: string[];
  steps: Step[];
};
