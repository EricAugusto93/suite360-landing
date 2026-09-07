"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Peças animadas da timeline da Metodologia (ETAPA 5) — isoladas num Client
 * Component leaf próprio (mesmo padrão já usado por ScrollReveal/
 * MethodologyStepCard/HeroVisual neste projeto), para que
 * `MethodologySection.tsx` continue um Server Component. Não duplica dados
 * de `STEPS`: recebe apenas os primitivos já calculados no `.map()`
 * (índice/booleans/número/classes), nunca o array inteiro.
 *
 * `ScrollReveal.tsx` e `lib/motion.ts` NÃO foram alterados (fora do escopo
 * desta etapa) — as peças aqui usam o mesmo padrão de segurança de
 * hidratação e o mesmo tratamento de `prefers-reduced-motion` (via
 * `useReducedMotion` do Motion) só que com timings/keyframes próprios da
 * timeline, que não fazem sentido generalizar para `lib/motion.ts` (usado
 * por outras seções).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type AnimatedTimelineSegmentProps = {
  /** Etapa 01 recebe um trecho mais luminoso (pedido explícito). */
  isFirst: boolean;
  /** Mesmas classes de posicionamento do segmento estático (ver MethodologySection.tsx) — garante alinhamento exato. */
  className: string;
};

/**
 * Camada azul ANIMADA, sobreposta ao trilho estático da Etapa 3 (que
 * continua existindo, inalterado — este componente nunca o substitui, só
 * soma). `scaleY` 0→1 com `transformOrigin: top`: a origem é sempre o topo,
 * crescendo para baixo. Cada segmento (um por etapa, mesma geometria já
 * validada na Etapa 3) dispara seu próprio `whileInView` quando a ETAPA
 * correspondente entra na tela — como os segmentos são contíguos ponta a
 * ponta, ver esse crescimento acontecer em sequência conforme o usuário
 * rola a página lê como um único percurso progressivo, sem precisar de um
 * relógio/`useScroll` compartilhado. Executa uma única vez e nunca regride
 * (a linha não "desaparece" depois de animada — o estado final é idêntico
 * ao trilho estático, só que mais brilhante).
 */
export function AnimatedTimelineSegment({
  isFirst,
  className,
}: AnimatedTimelineSegmentProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const triggerProps = reduced
    ? { animate: "visible" as const, transition: { duration: 0 } }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 1.1, ease: EASE },
      };

  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{
        transformOrigin: "top",
        background: isFirst
          ? "linear-gradient(to bottom, var(--s360-primary), rgba(103,140,255,0.7))"
          : "linear-gradient(to bottom, rgba(103,140,255,0.65), rgba(103,140,255,0.25))",
        boxShadow: isFirst
          ? "0 0 16px 2px rgba(8,102,255,0.55)"
          : "0 0 10px 1px rgba(8,102,255,0.3)",
      }}
      initial="hidden"
      variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
      {...triggerProps}
    />
  );
}

type AnimatedMarkerProps = {
  isFirst: boolean;
  /** Numeração já formatada (`String(index+1).padStart(2,"0")`) — calculada no `.map()`, nunca aqui. */
  number: string;
  /** Atraso (segundos) a partir do momento em que o marcador entra na viewport. */
  delay: number;
  /** Mesmas classes de tamanho/posição da Etapa 3 (responsivo por breakpoint). */
  className: string;
};

/**
 * Marcador numerado — a MESMA aparência final aprovada na Etapa 3 (fundo/
 * borda/halo/anel ou gradiente interno/número/conector horizontal/ponto de
 * junção), agora com uma entrada curta quando a etapa entra na viewport:
 * escala 0.88 (etapa 01) ou 0.94 (demais) → 1, opacidade parcial → 1.
 * Conector e ponto de junção usam propagação de variants do Motion (só
 * declaram `variants` com as MESMAS chaves "hidden"/"visible" do pai — sem
 * `whileInView` próprio, herdam o estado do marcador que os contém), cada
 * um com seu próprio atraso adicional, criando a sequência pedida: linha →
 * marcador → conector → ponto → (card, via ScrollReveal em
 * MethodologySection.tsx). Executa uma única vez
 * (`viewport={{ once: true }}`) — a etapa 01 tem um pequeno overshoot de
 * escala (pulso único mais evidente), as demais um acendimento discreto,
 * sem nenhum loop.
 */
export function AnimatedMarker({
  isFirst,
  number,
  delay,
  className,
}: AnimatedMarkerProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const markerVariants = {
    hidden: { opacity: isFirst ? 0.3 : 0.45, scale: isFirst ? 0.88 : 0.94 },
    visible: isFirst
      ? { opacity: 1, scale: [0.88, 1.05, 1] }
      : { opacity: 1, scale: 1 },
  };

  const markerTrigger = reduced
    ? { animate: "visible" as const, transition: { duration: 0 } }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.5 },
        transition: { duration: isFirst ? 0.5 : 0.4, ease: EASE, delay },
      };

  // Filhos: quando reduzido, aparecem juntos e instantaneos (duration 0,
  // sem atraso) — nunca dependem do atraso escalonado usado na animacao
  // normal (isso e o que garante "nenhum elemento inicia invisivel" sob
  // prefers-reduced-motion, ja que a propagacao de variants por si so nao
  // zera o `transition` proprio de cada filho).
  const childTransition = (extra: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay: delay + extra };

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={
        isFirst
          ? {
              background: "var(--s360-accent)",
              border: "2px solid var(--s360-primary)",
              boxShadow:
                "0 0 0 6px rgba(8,102,255,0.15), 0 0 40px 8px rgba(8,102,255,0.5)",
            }
          : {
              background: "rgba(16,35,61,0.55)",
              border: "1px solid rgba(122,158,255,0.35)",
              boxShadow: "0 2px 10px -2px rgba(8,102,255,0.25)",
            }
      }
      initial="hidden"
      variants={markerVariants}
      {...markerTrigger}
    >
      {isFirst ? (
        <motion.span
          aria-hidden="true"
          className="border-primary/25 pointer-events-none absolute -inset-1.5 rounded-full border"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={childTransition(0.15, 0.5)}
        />
      ) : (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 25%, rgba(122,158,255,0.18), transparent 65%)",
          }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={childTransition(0.1, 0.4)}
        />
      )}

      <span className="relative">{number}</span>

      {/* Conector horizontal + ponto de juncao com o card. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-full flex -translate-y-1/2 items-center"
      >
        <motion.span
          className="h-[2px] w-2 origin-left sm:w-4 lg:w-6"
          style={{
            background: isFirst
              ? "var(--s360-primary)"
              : "rgba(122,158,255,0.45)",
          }}
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={childTransition(0.2, 0.3)}
        />
        <motion.span
          className="-ml-0.5 h-2.5 w-2.5 rounded-full"
          style={{
            background: isFirst
              ? "var(--s360-primary)"
              : "rgba(122,158,255,0.6)",
            boxShadow: isFirst
              ? "0 0 10px 2px rgba(8,102,255,0.6)"
              : "0 0 6px 1px rgba(8,102,255,0.25)",
          }}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={childTransition(0.4, 0.25)}
        />
      </span>
    </motion.div>
  );
}
