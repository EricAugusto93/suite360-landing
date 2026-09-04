"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
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
  /** Graus, 0 = topo, sentido horario — mesmo sentido da varredura. */
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

const SWEEP_DURATION = 10; // segundos — dentro da faixa 8-12s pedida.
const WAVE_DURATION = 4.2; // segundos — dentro da faixa 3.5-5s pedida.
const WAVE_COUNT = 4;

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
  const points = [0, clamp(fraction - 0.02), clamp(fraction), clamp(fraction + 0.06), 1];
  for (let i = 1; i < points.length; i++) {
    if (points[i] < points[i - 1]) points[i] = points[i - 1];
  }
  return points;
}

const IDLE_BORDER = "rgba(255,255,255,0.12)";
const ACTIVE_BORDER = "rgba(8,102,255,0.75)";

function RadarTarget({ target, index, reduced }: { target: Target; index: number; reduced: boolean }) {
  const { label, Icon, angle, radius } = target;
  const { left, top } = polarToPercent(angle, radius);
  const fraction = angle / 360;
  const flip = left > 50;

  const sharedTransition = reduced
    ? undefined
    : {
        duration: SWEEP_DURATION,
        repeat: Infinity,
        ease: "easeInOut" as const,
        times: pulseTimes(fraction),
      };

  const floatTransition = reduced
    ? undefined
    : {
        duration: 4.5 + index * 0.35,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: index * 0.25,
      };

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
      initial={{ y: 0 }}
      animate={reduced ? { y: 0 } : { y: [0, -3, 0] }}
      transition={reduced ? { duration: 0 } : floatTransition}
    >
      <div className={cn("flex items-center gap-2", flip && "flex-row-reverse")}>
        {/* Ponto luminoso + anel de pulso quando a varredura passa. */}
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
            transition={reduced ? { duration: 0 } : sharedTransition}
          />
          <motion.span
            aria-hidden="true"
            className="bg-primary h-2 w-2 rounded-full"
            initial={{ scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: [1, 1, 1.5, 1, 1] }}
            transition={reduced ? { duration: 0 } : sharedTransition}
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
              : { backgroundColor: [IDLE_BORDER, IDLE_BORDER, ACTIVE_BORDER, IDLE_BORDER, IDLE_BORDER] }
          }
          transition={reduced ? { duration: 0 } : sharedTransition}
        />

        {/* Painel dark translucido com icone + rotulo. */}
        <motion.div
          className="border-border bg-background/70 flex items-center gap-1.5 rounded-md border px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-2.5"
          initial={{ borderColor: IDLE_BORDER }}
          animate={
            reduced
              ? { borderColor: IDLE_BORDER }
              : { borderColor: [IDLE_BORDER, IDLE_BORDER, ACTIVE_BORDER, IDLE_BORDER, IDLE_BORDER] }
          }
          transition={reduced ? { duration: 0 } : sharedTransition}
        >
          <motion.span
            className="text-primary shrink-0"
            initial={{ scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: [1, 1, 1.25, 1, 1] }}
            transition={reduced ? { duration: 0 } : sharedTransition}
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
 * "Radar do Perfil da Empresa no Google" — substitui a composicao anterior
 * (orbitas elipticas + satelites girando), que lia como sistema solar.
 * Agora e um radar tecnologico visto de frente: nucleo central emissor,
 * ondas expansivas, varredura giratoria (feixe conico, nao um ponteiro) e
 * cinco "sinais" (Localização/Avaliações/Respostas/Fotos/Categorias) em
 * posicoes FIXAS — eles nao orbitam, apenas flutuam 2-4px e pulsam quando a
 * varredura passa pela sua posicao angular (sincronizado via `times` do
 * Motion, mesma duracao do loop de rotacao — sem JS de scroll/raf).
 *
 * Puramente decorativo (aria-hidden) — o mesmo conteudo (as 5 dimensoes)
 * existe como texto real na ProblemSection. `useReducedMotion` desliga
 * toda animacao continua: o radar fica estatico, com os 5 sinais e o
 * nucleo sempre visiveis.
 */
export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[40rem]"
    >
      {/* Glow ambiente azul + roxo atras do radar inteiro. */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--s360-glow-blue),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--s360-glow-purple),transparent_75%)] blur-2xl" />

      {/* Disco do radar — area circular recortada (waves/varredura ficam contidas aqui). */}
      <div
        className="border-border absolute inset-[7%] overflow-hidden rounded-full border"
        style={{ background: "radial-gradient(circle, #0a0a0c 0%, #050505 78%)" }}
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
          tocam a borda. `initial` e SEMPRE o mesmo objeto constante (nao
          depende de `reduced`) para que a marcacao renderizada no servidor
          seja identica a primeira renderizacao no cliente — `reduced` so
          existe no cliente (media query), entao qualquer diferenca
          estrutural ou de `initial` condicionada a ele causa mismatch de
          hidratacao para quem tem prefers-reduced-motion ativado. Com
          `reduced`, o `animate` so "confirma" o mesmo estado do `initial`
          (nenhum movimento, onda invisivel) — o radar fica estatico.
        */}
        {Array.from({ length: WAVE_COUNT }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              borderColor:
                i % 2 === 0 ? "rgba(8,102,255,0.35)" : "rgba(139,92,246,0.3)",
            }}
            initial={{ scale: 0.15, opacity: 0 }}
            animate={
              reduced
                ? { scale: 0.15, opacity: 0 }
                : { scale: [0.15, 0.95], opacity: [0.55, 0] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: WAVE_DURATION,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: (i * WAVE_DURATION) / WAVE_COUNT,
                  }
            }
          />
        ))}

        {/* Varredura: cunha de luz sutil que gira 360°, nao um ponteiro. Mesma logica de `initial` constante acima. */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 312deg, rgba(8,102,255,0.09) 340deg, rgba(67,133,255,0.18) 358deg, transparent 360deg)",
          }}
          initial={{ rotate: 0 }}
          animate={reduced ? { rotate: 0 } : { rotate: 360 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: SWEEP_DURATION, repeat: Infinity, ease: "linear" }
          }
        />

        {/* Vinheta interna (escurece o perimetro do disco). */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* Núcleo — Perfil da Empresa no Google. Fora do disco recortado para o glow nao ser cortado. */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-md sm:h-32 sm:w-32" />
      <div className="border-border absolute top-1/2 left-1/2 h-[6.5rem] w-[6.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[7.5rem] sm:w-[7.5rem]" />
      <motion.div
        className="s360-glow-blue absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/10 sm:h-28 sm:w-28"
        style={{ backgroundColor: "#141416" }}
        initial={{ scale: 1 }}
        animate={reduced ? { scale: 1 } : { scale: [1, 1.04, 1] }}
        transition={
          reduced ? { duration: 0 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Iluminacao interna do nucleo. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.14), transparent 60%)",
          }}
        />
        {/*
          PLACEHOLDER do "G" do Google: nenhum ativo oficial foi fornecido
          ao projeto (public/brand/ so tem a logo da Suite360). Redesenhar
          o simbolo multicolor do Google a mao seria impreciso — em vez
          disso, um marcador neutro de "fonte de sinal" ocupa o lugar.
          Substituir por:
            <Image src="/brand/google-g.svg" alt="" width={56} height={56} className="h-14 w-14" />
          assim que o arquivo google-g.svg (ou .png transparente, ~256x256,
          "G" colorido oficial do Google) for adicionado em public/brand/.
        */}
        <div className="relative flex h-full w-full items-center justify-center">
          <svg viewBox="0 0 32 32" className="h-8 w-8 text-white/85" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
            <path d="M16 5.5v4.2M16 22.3v4.2M5.5 16h4.2M22.3 16h4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.6" fill="currentColor" />
          </svg>
        </div>
      </motion.div>

      {/* Sinais detectados — posicoes fixas, nao orbitam. */}
      {TARGETS.map((target, index) => (
        <RadarTarget key={target.label} target={target} index={index} reduced={reduced} />
      ))}
    </div>
  );
}
