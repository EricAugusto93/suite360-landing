"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  defaultTransition,
  motionVariants,
  type MotionVariantName,
} from "@/lib/motion";

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
};

/**
 * Wrapper padrao de reveal (fade / fade-up / scale). Respeita
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
 * IMPORTANTE (bug real encontrado e corrigido): a versao anterior fazia
 * `if (shouldReduceMotion) return <Static>...` — um retorno antecipado que
 * troca o ELEMENTO renderizado (sem a classe `motion-reveal`/estilo inline)
 * quando `prefers-reduced-motion` esta ativo. `shouldReduceMotion` so existe
 * no cliente (media query do SO); no servidor e sempre `null`/false. Para um
 * visitante real com essa preferencia ativada, isso produzia uma arvore
 * DIFERENTE da renderizada no servidor — erro de hidratacao em TODA secao
 * que usa ScrollReveal (a pagina inteira). A correcao: sempre renderizar o
 * mesmo `MotionTag` com o mesmo `initial="hidden"` constante; a preferencia
 * de movimento reduzido so afeta `animate`/`transition` (que o Motion nunca
 * aplica durante o SSR, so depois de montado) — pula direto para "visible"
 * sem duracao, em vez de trocar a estrutura do DOM.
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
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const triggerProps = reduced
    ? { animate: "visible", transition: { duration: 0 } }
    : trigger === "mount"
      ? { animate: "visible", transition: { ...defaultTransition, delay } }
      : {
          whileInView: "visible",
          viewport: { once, amount },
          transition: { ...defaultTransition, delay },
        };

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      className={cn("motion-reveal", className)}
      initial="hidden"
      variants={motionVariants[variant]}
      {...triggerProps}
    >
      {children}
    </MotionTag>
  );
}
