"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { useIsMobileViewport } from "@/lib/useIsMobileViewport";
import {
  CategoriesMark,
  LocationMark,
  PhotosMark,
  RepliesMark,
  ReviewsMark,
} from "./RadarIcons";

type Target = {
  label: string;
  Icon: typeof LocationMark;
  /** Graus, 0 = topo, sentido horario. */
  angle: number;
  /** Raio em % do container (nao uma orbita: posicao fixa, sem rotacao). */
  radius: number;
};

// As mesmas cinco dimensoes do Perfil da Empresa no Google, agora como
// "sinais" detectados pelo radar — posicoes fixas (sem orbitar), pedido
// explicito do usuario para abandonar a leitura de "sistema solar".
const TARGETS: Target[] = [
  { label: "Localização", Icon: LocationMark, angle: 0, radius: 40 },
  { label: "Respostas", Icon: RepliesMark, angle: 80, radius: 37 },
  { label: "Fotos", Icon: PhotosMark, angle: 155, radius: 40 },
  { label: "Categorias", Icon: CategoriesMark, angle: 222, radius: 38 },
  { label: "Avaliações", Icon: ReviewsMark, angle: 296, radius: 36 },
];

// Duracao de um ciclo completo de pulso dos rotulos — nao ha mais um
// feixe visivel girando (removido a pedido do usuario), mas os rotulos
// continuam acendendo em sequencia num loop, como se o radar continuasse
// varrendo a regiao "por baixo dos panos".
const LABEL_LOOP_DURATION = 11;
const WAVE_DURATION = 4.5;
const WAVE_COUNT = 4;

/**
 * No mobile, o radar so aparece DEPOIS do texto/CTAs (ver Hero.tsx:
 * `mobileDelay={0.42}` no ScrollReveal que envolve o HeroVisual). Sem este
 * atraso extra, as ondas e o pulso dos sinais comecariam a "correr" desde o
 * mount — por baixo do wrapper ainda transparente — e na hora em que o
 * radar terminasse de entrar, o movimento ja estaria fora de fase (pedido
 * explicito do usuario: ondas/pinos so podem comecar APOS a entrada do
 * radar). Valor = mobileDelay (0.42s) + duracao da transicao de entrada
 * (mobileRevealTransition, 0.65s) do lib/motion.ts, arredondado. So se
 * aplica no mobile — no desktop este componente sempre monta com o wrapper
 * ja visivel de imediato (sem mobileDelay), entao `entranceDelay` fica 0 e
 * o comportamento e identico ao de antes.
 */
const MOBILE_ENTRANCE_DELAY = 1.1;

function polarToPercent(angleDeg: number, radiusPercent: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: 50 + radiusPercent * Math.sin(rad),
    top: 50 - radiusPercent * Math.cos(rad),
  };
}

/** Garante um array de tempos estritamente nao-decrescente entre 0 e 1 (exigencia do Motion para `times`). */
function pulseTimes(fraction: number): number[] {
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const points = [
    0,
    clamp(fraction - 0.02),
    clamp(fraction),
    clamp(fraction + 0.06),
    1,
  ];
  for (let i = 1; i < points.length; i++) {
    if (points[i] < points[i - 1]) points[i] = points[i - 1];
  }
  return points;
}

const IDLE_BORDER = "rgba(255,255,255,0.12)";
const ACTIVE_BORDER = "rgba(8,102,255,0.75)";

function RadarTarget({
  target,
  index,
  reduced,
  entranceDelay,
}: {
  target: Target;
  index: number;
  reduced: boolean;
  entranceDelay: number;
}) {
  const { label, Icon, angle, radius } = target;
  const { left, top } = polarToPercent(angle, radius);
  const fraction = angle / 360;
  const flip = left > 50;

  const sharedTransition = reduced
    ? { duration: 0 }
    : {
        duration: LABEL_LOOP_DURATION,
        repeat: Infinity,
        ease: "easeInOut" as const,
        times: pulseTimes(fraction),
        delay: entranceDelay,
      };

  const floatTransition = reduced
    ? { duration: 0 }
    : {
        duration: 4.5 + index * 0.35,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: index * 0.25 + entranceDelay,
      };

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
      initial={{ y: 0 }}
      animate={reduced ? { y: 0 } : { y: [0, -3, 0] }}
      transition={reduced ? { duration: 0 } : floatTransition}
    >
      <div
        className={cn("flex items-center gap-2", flip && "flex-row-reverse")}
      >
        {/* Ponto luminoso + anel de pulso. */}
        <div className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
          <motion.span
            aria-hidden="true"
            className="border-primary absolute h-2.5 w-2.5 rounded-full border"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={
              reduced
                ? { scale: 0.7, opacity: 0 }
                : { scale: [0.7, 0.7, 1, 2.6, 2.6], opacity: [0, 0, 0.9, 0, 0] }
            }
            transition={sharedTransition}
          />
          <motion.span
            aria-hidden="true"
            className="bg-primary h-2 w-2 rounded-full"
            initial={{ scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: [1, 1, 1.5, 1, 1] }}
            transition={sharedTransition}
          />
        </div>

        {/* Linha fina de conexao entre o ponto e a etiqueta. */}
        <motion.span
          aria-hidden="true"
          className="h-px w-3 sm:w-4"
          initial={{ backgroundColor: IDLE_BORDER }}
          animate={
            reduced
              ? { backgroundColor: IDLE_BORDER }
              : {
                  backgroundColor: [
                    IDLE_BORDER,
                    IDLE_BORDER,
                    ACTIVE_BORDER,
                    IDLE_BORDER,
                    IDLE_BORDER,
                  ],
                }
          }
          transition={sharedTransition}
        />

        {/* Painel dark translucido com icone + rotulo. */}
        <motion.div
          className="border-border bg-background/70 flex items-center gap-1.5 rounded-md border px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-2.5"
          initial={{ borderColor: IDLE_BORDER }}
          animate={
            reduced
              ? { borderColor: IDLE_BORDER }
              : {
                  borderColor: [
                    IDLE_BORDER,
                    IDLE_BORDER,
                    ACTIVE_BORDER,
                    IDLE_BORDER,
                    IDLE_BORDER,
                  ],
                }
          }
          transition={sharedTransition}
        >
          <motion.span
            className="text-primary shrink-0"
            initial={{ scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: [1, 1, 1.25, 1, 1] }}
            transition={sharedTransition}
          >
            <Icon className="h-[15px] w-[15px] sm:h-[17px] sm:w-[17px]" />
          </motion.span>
          <span className="text-caption text-foreground font-medium whitespace-nowrap">
            {label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * "Radar do Perfil da Empresa no Google" — radar tecnologico visto de
 * frente: nucleo central emissor com o "G", ondas expansivas fortes
 * partindo do centro (pedido explicito do usuario: mais visiveis que
 * antes) e cinco "sinais" fixos (as dimensoes analisadas —
 * Localização/Avaliações/Respostas/Fotos/Categorias, nunca renomeadas).
 * O feixe de varredura giratorio foi removido a pedido do usuario — so
 * restam as ondas pulsantes como movimento do radar.
 *
 * Puramente decorativo (aria-hidden) — o mesmo conteudo (as 5 dimensoes)
 * existe como texto real na ProblemSection. `useReducedMotion` desliga
 * toda animacao continua: o radar fica estatico, com os 5 sinais e o
 * nucleo sempre visiveis.
 */
export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const isMobile = useIsMobileViewport();
  const entranceDelay = isMobile ? MOBILE_ENTRANCE_DELAY : 0;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[40rem]"
    >
      {/* Glow ambiente azul atras do radar inteiro. */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--s360-glow-blue),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(67,133,255,0.28),transparent_75%)] blur-2xl" />

      {/* Disco do radar — area circular recortada (as ondas ficam contidas aqui). */}
      <div
        className="border-border absolute inset-[7%] overflow-hidden rounded-full border"
        style={{
          background: "radial-gradient(circle, #0a0a0c 0%, #050505 78%)",
        }}
      >
        {/* Grid radial discreto: 3 aneis estaticos. */}
        {[25, 50, 75].map((r) => (
          <span
            key={r}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
            style={{ width: `${r}%`, height: `${r}%` }}
          />
        ))}

        {/* Pontos de coordenada / marcacoes tecnicas no perimetro. */}
        {Array.from({ length: 16 }).map((_, i) => {
          const { left, top } = polarToPercent(i * 22.5, 46);
          return (
            <span
              key={i}
              className="absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
              style={{ left: `${left}%`, top: `${top}%` }}
            />
          );
        })}

        {/*
          Ondas do radar: nascem no centro, expandem e desvanecem — nunca
          tocam a borda. Reforcadas a pedido do usuario (borda mais
          grossa, opacidade de pico mais alta, glow proprio) para ficarem
          claramente visiveis, nao so um contorno fraco.
        */}
        {Array.from({ length: WAVE_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              border: `2px solid ${i % 2 === 0 ? "rgba(67,133,255,0.65)" : "rgba(8,102,255,0.55)"}`,
              boxShadow: `0 0 24px 2px ${i % 2 === 0 ? "rgba(67,133,255,0.35)" : "rgba(8,102,255,0.3)"}`,
            }}
            initial={{ scale: 0.12, opacity: 0 }}
            animate={
              reduced
                ? { scale: 0.12, opacity: 0 }
                : { scale: [0.12, 0.95], opacity: [0.9, 0] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: WAVE_DURATION,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: (i * WAVE_DURATION) / WAVE_COUNT + entranceDelay,
                  }
            }
          />
        ))}

        {/* Vinheta interna (escurece o perimetro do disco). */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/*
        Núcleo — "G" do Google, a pedido do usuario (referencia: esfera
        azul luminosa com aneis concentricos translucidos e um "G" branco
        em destaque). Diferente do simbolo colorido oficial do Google
        (aquele SIM exigiria o ativo oficial): aqui e apenas a LETRA "G"
        em branco, um caractere generico, sem tentar reproduzir a marca
        registrada — por isso pode ser renderizado diretamente, sem
        depender de nenhum arquivo externo.
      */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20 sm:h-36 sm:w-36" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/25 sm:h-32 sm:w-32" />
      <motion.div
        className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 sm:h-28 sm:w-28"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, #6fa8ff 0%, #2f7bff 42%, #0655d1 100%)",
          borderColor: "rgba(255,255,255,0.55)",
          boxShadow:
            "0 0 0 6px rgba(67,133,255,0.18), 0 0 50px 6px rgba(67,133,255,0.55), 0 0 110px 20px rgba(8,102,255,0.35), inset 0 0 18px 2px rgba(255,255,255,0.25)",
        }}
        initial={{ scale: 1 }}
        animate={reduced ? { scale: 1 } : { scale: [1, 1.04, 1] }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: entranceDelay,
              }
        }
      >
        {/* Iluminacao interna do nucleo. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.4), transparent 60%)",
          }}
        />
        <div className="relative flex h-full w-full items-center justify-center">
          <span className="text-3xl leading-none font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:text-4xl">
            G
          </span>
        </div>
      </motion.div>

      {/* Sinais detectados — posicoes fixas, nao orbitam. */}
      {TARGETS.map((target, index) => (
        <RadarTarget
          key={target.label}
          target={target}
          index={index}
          reduced={reduced}
          entranceDelay={entranceDelay}
        />
      ))}
    </div>
  );
}
