import type { Transition, Variants } from "motion/react";

/**
 * Base de animacoes reutilizaveis (FASE 02). Composicoes especificas de secao
 * (Hero, diagnostico, etc.) virao nas proximas fases — aqui ficam apenas os
 * blocos genericos de entrada usados pelo ScrollReveal e por componentes futuros.
 */

export const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

// Transition fica de fora das variants (nao "transition: defaultTransition" aqui)
// para que o ScrollReveal possa compor um `delay` por instancia via prop, sem
// precisar de uma variant nova para cada atraso possivel.
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const motionVariants = {
  fade: fadeIn,
  "fade-up": fadeUp,
  scale: scaleIn,
} as const;

export type MotionVariantName = keyof typeof motionVariants;
