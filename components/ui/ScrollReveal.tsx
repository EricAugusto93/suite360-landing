"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  defaultTransition,
  mobileDirectionVariants,
  mobileRevealTransition,
  motionVariants,
  type MobileRevealDirection,
  type MotionVariantName,
} from "@/lib/motion";
import { useIsMobileViewport } from "@/lib/useIsMobileViewport";

type ScrollRevealProps = {
  children: ReactNode;
  variant?: MotionVariantName;
  className?: string;
  /** Elemento raiz renderizado — "li" para uso direto dentro de <ol>/<ul> (evita um <div> como filho invalido de uma lista). */
  as?: "div" | "li";
  /**
   * "viewport" (padrao) anima quando o elemento entra na tela — ideal para
   * conteudo abaixo da dobra. "mount" anima assim que o componente monta,
   * sem depender de deteccao de viewport — para conteudo acima da dobra
   * (ex. Hero), que ja esta visivel no carregamento.
   */
  trigger?: "viewport" | "mount";
  /** Anima apenas na primeira vez que entra na viewport (so vale para trigger="viewport"). */
  once?: boolean;
  /**
   * Fracao do elemento visivel necessaria para disparar a animacao (so
   * vale para trigger="viewport"). Padrao baixo (0.15) de proposito: em
   * viewports curtos (celular em paisagem) uma secao alta pode nunca
   * atingir 30% visivel de uma vez so — ver PLANEJAMENTO.md, secao 14.10.
   */
  amount?: number;
  /** Atraso em segundos antes da animacao comecar — util para entradas em sequencia. */
  delay?: number;
  /**
   * NOVO — pedido explicito do usuario: entrada lateral (ou vertical, para
   * "up") exclusiva do mobile (<768px). So tem efeito quando informada;
   * sem essa prop, o componente se comporta EXATAMENTE como antes em
   * qualquer largura de tela (nenhuma regressao em desktop/tablet, que
   * nunca usam esta prop). Em telas >=768px esta prop e ignorada por
   * completo — o `variant` normal continua valendo.
   */
  direction?: MobileRevealDirection;
  /** Distancia do deslocamento mobile em px (24-40 lateral / 24-32 vertical pedido). Default 32. */
  mobileDistance?: number;
  /** Atraso especifico do mobile (ex.: reordenar elementos no Hero) — cai em `delay` se omitido. */
  mobileDelay?: number;
};

/**
 * Wrapper padrao de reveal (fade / fade-up / scale), com uma variante
 * adicional exclusiva do mobile (`direction`) pedida pelo usuario para dar
 * as secoes uma entrada com fade + deslocamento lateral/vertical e ritmo
 * alternado, acima de 767px o comportamento e 100% preservado. Respeita
 * prefers-reduced-motion via hook do Motion (a media query global em
 * globals.css cobre transicoes CSS simples, mas nao animacoes JS do Motion).
 *
 * Todo wrapper leva a classe `motion-reveal`, usada apenas como gancho
 * para o fallback de `<noscript>` em app/layout.tsx: sem JavaScript, o
 * Motion nunca hidrata e o conteudo ficaria preso em `opacity:0` (o
 * estado "hidden" e renderizado inline no HTML do servidor) — a regra
 * `<noscript>` forca esses elementos a ficarem visiveis nesse cenario.
 * Ver PLANEJAMENTO.md, secao 14.10.
 *
 * IMPORTANTE (bug real encontrado e corrigido nesta mesma classe de
 * problema, varias vezes neste projeto): nunca deixar um valor SO
 * conhecido no cliente (media query de reduced-motion, e agora de
 * viewport mobile) mudar o que e renderizado na PRIMEIRA passada — so o
 * `animate`/`transition` (que o Motion nunca aplica durante o SSR) pode
 * depender desses valores; `initial="hidden"` e os `variants` usados por
 * ele continuam vindo de `motionVariants[variant]` (o mesmo de sempre)
 * ate o hook `useIsMobileViewport` confirmar, DEPOIS de montado, que a
 * tela e mobile — so a partir dai a variante lateral entra em jogo.
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  className,
  trigger = "viewport",
  once = true,
  amount = 0.15,
  delay = 0,
  as = "div",
  direction,
  mobileDistance = 32,
  mobileDelay,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const isMobile = useIsMobileViewport();

  // So ativa a variante mobile depois de confirmado (pos-montagem) que a
  // tela e realmente mobile — `isMobile` comeca `false` (mesmo valor do
  // servidor), entao a primeira pintura do cliente usa sempre
  // `motionVariants[variant]`, igual ao servidor. Nenhum mismatch possivel.
  const useMobileReveal = isMobile && direction !== undefined;

  const effectiveVariants = useMobileReveal
    ? mobileDirectionVariants(direction, mobileDistance)
    : motionVariants[variant];
  const effectiveTransitionBase = useMobileReveal ? mobileRevealTransition : defaultTransition;
  const effectiveDelay = useMobileReveal && mobileDelay !== undefined ? mobileDelay : delay;
  const effectiveAmount = useMobileReveal ? 0.2 : amount;
  const effectiveMargin = useMobileReveal ? "0px 0px -60px 0px" : undefined;

  const triggerProps = reduced
    ? { animate: "visible", transition: { duration: 0 } }
    : trigger === "mount"
      ? { animate: "visible", transition: { ...effectiveTransitionBase, delay: effectiveDelay } }
      : {
          whileInView: "visible",
          viewport: { once, amount: effectiveAmount, margin: effectiveMargin },
          transition: { ...effectiveTransitionBase, delay: effectiveDelay },
        };

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      className={cn("motion-reveal", className)}
      initial="hidden"
      variants={effectiveVariants}
      {...triggerProps}
    >
      {children}
    </MotionTag>
  );
}
