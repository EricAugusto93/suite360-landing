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

// Identidade (hidden === visible): usado quando um elemento nao tinha
// NENHUMA animacao de desktop antes (ex.: os cards da Metodologia, que so
// o painel externo animava) mas agora precisa aceitar a prop `direction`
// do ScrollReveal para ganhar a entrada lateral exclusiva do mobile — no
// desktop/tablet o resultado e estatico, igual a antes.
export const noneVariant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export const motionVariants = {
  fade: fadeIn,
  "fade-up": fadeUp,
  scale: scaleIn,
  none: noneVariant,
} as const;

export type MotionVariantName = keyof typeof motionVariants;

/**
 * Entrada exclusiva do mobile (<768px, ver `useIsMobileViewport`) — pedido
 * explicito do usuario: fade + deslocamento lateral (ou vertical, para
 * "up") com um pouco mais de presenca que o `fade-up` padrao, usada por
 * `ScrollReveal` quando a prop `direction` e passada. Nunca afeta
 * desktop/tablet — la o `variant` normal continua valendo exatamente como
 * antes.
 */
export type MobileRevealDirection = "left" | "right" | "up";

export function mobileDirectionVariants(
  direction: MobileRevealDirection,
  distance = 32,
): Variants {
  if (direction === "up") {
    return {
      hidden: { opacity: 0, x: 0, y: distance },
      visible: { opacity: 1, x: 0, y: 0 },
    };
  }
  const x = direction === "left" ? -distance : distance;
  return {
    hidden: { opacity: 0, x, y: 10 },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

export const mobileRevealTransition: Transition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1],
};
