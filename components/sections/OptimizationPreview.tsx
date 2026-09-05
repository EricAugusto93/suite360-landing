"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import {
  CategoriesMark,
  LocationMark,
  PhotosMark,
  RepliesMark,
  ReviewsMark,
} from "./RadarIcons";

type OptimizationPreviewProps = {
  /** Area da metodologia sob hover (vem de OptimizationShowcase) — destaca os modulos correspondentes. `null` = nenhum destaque. */
  activeArea?: string | null;
};

type ModuleId = "location" | "category" | "reviews" | "photos" | "replies";

type ModuleDef = {
  id: ModuleId;
  label: string;
  Icon: typeof LocationMark;
  beforeState: string;
  afterState: string;
  /** A quais das 4 areas da metodologia este modulo pertence (pode ser mais de uma). */
  areas: readonly string[];
  /** So os modulos com alerta no estado "Antes" (pedido: "tres pequenos alertas"). */
  alert?: boolean;
};

// 5 dos 7 "modulos reconheciveis" pedidos — cabecalho (tratado a parte, no
// topo do painel) e indicador de completude (tratado a parte, no rodape)
// fecham os outros 2. Mapeamento de areas replica os exemplos do proprio
// pedido (ex.: "Presenca local destaca localizacao e alcance").
const MODULES: ModuleDef[] = [
  {
    id: "location",
    label: "Localização",
    Icon: LocationMark,
    beforeState: "Não preenchido",
    afterState: "Estruturado",
    areas: ["Estrutura do perfil", "Presença local"],
    alert: true,
  },
  {
    id: "category",
    label: "Categoria",
    Icon: CategoriesMark,
    beforeState: "Pendente",
    afterState: "Configurado",
    areas: ["Estrutura do perfil"],
    alert: true,
  },
  {
    id: "reviews",
    label: "Avaliações",
    Icon: ReviewsMark,
    beforeState: "Sem otimização",
    afterState: "Organizado",
    areas: ["Reputação"],
  },
  {
    id: "photos",
    label: "Fotos",
    Icon: PhotosMark,
    beforeState: "Incompleto",
    afterState: "Organizado",
    areas: ["Conteúdo"],
  },
  {
    id: "replies",
    label: "Respostas",
    Icon: RepliesMark,
    beforeState: "Pendente",
    afterState: "Configurado",
    areas: ["Reputação"],
    alert: true,
  },
];

const LINE_COUNT = MODULES.length + 2; // + cabecalho + completude

/** Timing da sequencia (2.5-4s no total) — 0 quando reduced (estado final imediato). */
function dt(reduced: boolean, base: number, index = 0, step = 0) {
  return reduced ? 0 : base + index * step;
}

function AvatarGlyph({ isAfter, className }: { isAfter: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={isAfter ? "#4385FF" : "currentColor"}
        strokeWidth="1.4"
        opacity={isAfter ? 0.6 : 0.35}
      />
      <path
        d="M7 16.5c1.2-2.4 3-3.6 5-3.6s3.8 1.2 5 3.6"
        stroke={isAfter ? "#4385FF" : "currentColor"}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={isAfter ? 0.9 : 0.4}
      />
      <circle cx="12" cy="9.2" r="2.6" fill={isAfter ? "#0866FF" : "currentColor"} opacity={isAfter ? 1 : 0.3} />
    </svg>
  );
}

function StarRow({ isAfter }: { isAfter: boolean }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
          <path
            d="M6 1.2l1.3 2.7 3 .4-2.15 2.1.5 3-2.65-1.4-2.65 1.4.5-3L1.7 4.3l3-.4z"
            fill={isAfter ? "#4385FF" : "none"}
            stroke={isAfter ? "#4385FF" : "currentColor"}
            strokeWidth="0.8"
            opacity={isAfter ? 1 : 0.3}
          />
        </svg>
      ))}
    </div>
  );
}

function GalleryMini({ isAfter }: { isAfter: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-4 w-full rounded-[3px]",
            isAfter
              ? "bg-primary/25 border-primary/40 border"
              : i === 0
                ? "bg-white/10"
                : "border border-dashed border-white/15",
          )}
        />
      ))}
    </div>
  );
}

function CompletenessGauge({ isAfter }: { isAfter: boolean }) {
  const circumference = 2 * Math.PI * 9;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={isAfter ? "#0866FF" : "#71717A"}
        strokeWidth="2"
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
        strokeDasharray={
          isAfter ? `${circumference} 0` : `${circumference * 0.28} ${circumference}`
        }
        opacity={isAfter ? 1 : 0.7}
      />
    </svg>
  );
}

/** Icone proprio do nucleo: lupa (analise) + tracos de grafico + brilho + nos de conexao. */
function CoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="14" cy="14" r="7" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
      <line x1="19.2" y1="19.2" x2="25" y2="25" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 15.5l1.8-2.4 1.6 1.4 2.2-3" stroke="#4385FF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="1.3" fill="#8B5CF6" />
      <circle cx="24.5" cy="10.5" r="0.8" fill="#8B5CF6" opacity="0.6" />
    </svg>
  );
}

function AnalysisGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 7.5l1-1.3 0.9 0.8 1.2-1.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ModuleRowProps = {
  module: ModuleDef;
  isAfter: boolean;
  highlighted: boolean;
  started: boolean;
  reduced: boolean;
  index: number;
};

function ModuleRow({ module, isAfter, highlighted, started, reduced, index }: ModuleRowProps) {
  const { Icon, label, beforeState, afterState, alert } = module;
  const baseDelay = isAfter ? 1.8 : 0.7;
  const delay = dt(reduced, baseDelay, index, 0.15);

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2.5 rounded-md border px-2.5 py-2 transition-colors duration-300",
        isAfter
          ? "border-white/10 bg-[#17171C]"
          : "border-white/[0.07] bg-[#111114]",
        highlighted && (isAfter ? "border-primary/50" : "border-white/25"),
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: reduced ? 0 : 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative shrink-0">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border",
            isAfter
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-white/10 bg-white/[0.03] text-white/40",
          )}
        >
          <Icon className="h-[14px] w-[14px]" />
        </span>
        {!isAfter && alert && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#D6A84B" }}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-caption font-medium",
            isAfter ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        {module.id === "reviews" ? (
          <StarRow isAfter={isAfter} />
        ) : module.id === "photos" ? (
          <GalleryMini isAfter={isAfter} />
        ) : (
          <span
            className={cn(
              "h-1.5 rounded-full",
              isAfter ? "bg-primary w-full" : "border border-dashed border-white/15 w-2/3",
            )}
          />
        )}
      </div>

      <span
        className={cn(
          "text-caption shrink-0 rounded-full px-2 py-0.5 font-medium whitespace-nowrap",
          isAfter ? "bg-accent text-accent-foreground" : "text-foreground-subtle bg-white/[0.04]",
        )}
      >
        {isAfter ? afterState : beforeState}
      </span>
    </motion.div>
  );
}

type PanelProps = {
  isAfter: boolean;
  activeArea?: string | null;
  started: boolean;
  reduced: boolean;
};

function ProfilePanel({ isAfter, activeArea, started, reduced }: PanelProps) {
  const headerHighlighted = activeArea === "Estrutura do perfil";
  const completenessHighlighted = activeArea === "Presença local";
  const panelDelay = dt(reduced, isAfter ? 1.5 : 0.3);

  return (
    <motion.div
      className={cn(
        "relative z-10 flex flex-1 flex-col gap-3 rounded-xl border p-4 sm:p-5",
        isAfter
          ? "border-primary/20 bg-[#0d0d10] shadow-[0_0_40px_-16px_rgba(8,102,255,0.25)]"
          : "border-white/[0.08] bg-[#0b0b0d]",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: panelDelay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Cabecalho — 1o dos 7 "modulos": avatar generico + titulo + badge. */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-md border px-2.5 py-2 transition-colors duration-300",
          isAfter ? "border-white/10 bg-[#17171C]" : "border-white/[0.07] bg-[#111114]",
          headerHighlighted && (isAfter ? "border-primary/50" : "border-white/25"),
        )}
      >
        <AvatarGlyph
          isAfter={isAfter}
          className={cn("h-8 w-8 shrink-0", isAfter ? "text-primary" : "text-white/50")}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-caption text-muted-foreground font-medium tracking-wide uppercase">
            {isAfter ? "Depois" : "Antes"}
          </span>
          <span className={cn("text-small font-medium", isAfter ? "text-foreground" : "text-muted-foreground")}>
            Perfil da empresa
          </span>
        </div>
        <span
          className={cn(
            "text-caption shrink-0 rounded-full px-2.5 py-1 font-medium",
            isAfter ? "bg-accent text-accent-foreground" : "bg-white/[0.05] text-foreground-subtle",
          )}
        >
          {isAfter ? "Otimizado" : "Incompleto"}
        </span>
      </div>

      {/* 2-6: os 5 modulos de MODULES. */}
      <div className="flex flex-col gap-2">
        {MODULES.map((module, index) => (
          <ModuleRow
            key={module.id}
            module={module}
            isAfter={isAfter}
            highlighted={activeArea != null && module.areas.includes(activeArea)}
            started={started}
            reduced={reduced}
            index={index}
          />
        ))}
      </div>

      {/* 7 — indicador de completude. */}
      <motion.div
        className={cn(
          "mt-auto flex items-center gap-2.5 rounded-md border px-2.5 py-2 transition-colors duration-300",
          isAfter ? "border-white/10 bg-[#17171C]" : "border-white/[0.07] bg-[#111114]",
          completenessHighlighted && (isAfter ? "border-primary/50" : "border-white/25"),
        )}
        initial={{ opacity: 0, y: 6 }}
        animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{
          duration: reduced ? 0 : 0.45,
          delay: dt(reduced, isAfter ? 1.8 : 0.7, MODULES.length, 0.15),
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <CompletenessGauge isAfter={isAfter} />
        <span className={cn("text-caption flex-1", isAfter ? "text-foreground" : "text-muted-foreground")}>
          Completude do perfil
        </span>
        <span
          className={cn(
            "text-caption shrink-0 rounded-full px-2 py-0.5 font-medium",
            isAfter ? "bg-accent text-accent-foreground" : "text-foreground-subtle bg-white/[0.04]",
          )}
        >
          {isAfter ? "Otimizado" : "Incompleto"}
        </span>
      </motion.div>

      {/* Varredura azul sutil, uma unica vez, so no painel "Depois". */}
      {isAfter && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(100deg, transparent 30%, rgba(67,133,255,0.12) 50%, transparent 70%)",
          }}
          initial={{ x: "-120%", opacity: 0 }}
          animate={started ? { x: "120%", opacity: [0, 1, 0] } : { x: "-120%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: dt(reduced, 2.75) }}
        />
      )}
    </motion.div>
  );
}

function TransformationCore({ started, reduced }: { started: boolean; reduced: boolean }) {
  return (
    <div className="relative z-10 flex shrink-0 items-center justify-center py-4 md:w-[16%] md:py-0">
      {/* Aneis finos — rotacao lenta continua so depois da revelacao concluir. */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full border border-white/10"
          style={{ width: `${64 + (i + 1) * 18}px`, height: `${64 + (i + 1) * 18}px` }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={
            started
              ? { opacity: 0.5 - i * 0.12, rotate: reduced ? 0 : 360 * (i % 2 === 0 ? 1 : -1) }
              : { opacity: 0, rotate: 0 }
          }
          transition={{
            opacity: { duration: reduced ? 0 : 0.6, delay: dt(reduced, 1.1) },
            rotate: reduced
              ? { duration: 0 }
              : { duration: 22 + i * 6, repeat: Infinity, ease: "linear", delay: dt(reduced, 1.1) },
          }}
        />
      ))}

      {/*
        Particulas minimas atravessando o nucleo. `initial` e SEMPRE o
        mesmo objeto constante (nao depende de `reduced`) — o servidor nao
        tem como saber a preferencia de movimento reduzido do visitante, e
        deixar essa marcacao divergir causa mismatch de hidratacao (mesmo
        cuidado do resto do arquivo/HeroVisual.tsx). Quando reduzido, o
        `animate` so confirma o mesmo estado do `initial` (paradas,
        invisiveis) em vez de nao renderizar o elemento.
      */}
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="bg-blue-luminous absolute h-1 w-1 rounded-full"
          initial={{ x: -26, opacity: 0 }}
          animate={
            reduced
              ? { x: -26, opacity: 0 }
              : started
                ? { x: [-26, 26], opacity: [0, 1, 0] }
                : { x: -26, opacity: 0 }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.7 + i * 1.1 }
          }
        />
      ))}

      {/* Nucleo. */}
      <motion.div
        className="s360-glow-blue relative flex h-16 w-16 items-center justify-center rounded-full border border-white/15"
        style={{ backgroundColor: "#111114" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: reduced ? 0 : 0.5, delay: dt(reduced, 1.05), ease: [0.16, 1, 0.3, 1] }}
      >
        {/* No de conexao esquerdo/direito — onde as linhas "entram/saem". */}
        <span aria-hidden="true" className="bg-primary/50 absolute top-1/2 -left-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
        <span aria-hidden="true" className="bg-primary/50 absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
        <CoreIcon className="h-7 w-7" />
      </motion.div>
    </div>
  );
}

/** Linhas de conexao decorativas atras dos paineis — cinza no descanso, acendem em azul durante a revelacao. Orientacao muda por breakpoint (horizontal no desktop/tablet, vertical no mobile). */
function ConnectionLines({ started, reduced }: { started: boolean; reduced: boolean }) {
  const lines = Array.from({ length: LINE_COUNT });
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[6%] inset-y-6 z-0 hidden flex-col justify-between md:flex"
      >
        {lines.map((_, i) => (
          <motion.div
            key={i}
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.08), rgba(8,102,255,0.4), rgba(255,255,255,0.08))",
            }}
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: dt(reduced, 0.9, i, 0.12) }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 inset-y-[8%] z-0 flex justify-between md:hidden"
      >
        {lines.map((_, i) => (
          <motion.div
            key={i}
            className="h-full w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(8,102,255,0.4), rgba(255,255,255,0.08))",
            }}
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: dt(reduced, 0.9, i, 0.12) }}
          />
        ))}
      </div>
    </>
  );
}

/**
 * Painel "Janela de analise — antes/depois" — reformulacao pedida pelo
 * usuario (o layout anterior, 2 retangulos + barras + seta, lia como
 * placeholder). Continua uma composicao 100% conceitual: nenhum numero,
 * porcentagem ou resultado inventado — so estados textuais qualitativos
 * ("Incompleto"/"Otimizado" etc.), a mesma disciplina de honestidade usada
 * em todo o projeto. `activeArea` (vindo de OptimizationShowcase.tsx) liga
 * o hover das 4 etiquetas de metodologia aos modulos correspondentes.
 *
 * Sequencia de revelacao dispara uma unica vez ao entrar na viewport
 * (`startedInView`, setado via `onViewportEnter`). O gate real usado pelos
 * filhos e `active = startedInView || reduced`: nunca setState direto num
 * efeito so por causa de `reduced` (o linter de react-hooks acusa — com
 * razao — cascata de renders evitavel) e nunca deixamos `reduced` afetar
 * `initial` (so `animate`, que o Motion nunca aplica durante o SSR) — mesmo
 * cuidado de hidratacao usado em HeroVisual.tsx. Com `prefers-reduced-motion`
 * ativo, `active` fica `true` desde o primeiro render no cliente (mostra o
 * estado final imediatamente, sem esperar o scroll), com todas as
 * transicoes em duracao 0.
 */
export function OptimizationPreview({ activeArea = null }: OptimizationPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const [startedInView, setStartedInView] = useState(false);
  const started = startedInView || reduced;

  return (
    <motion.div
      className="s360-grid-texture relative w-full overflow-hidden rounded-[26px] border"
      style={{ backgroundColor: "#09090B", borderColor: "rgba(255,255,255,0.12)" }}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      onViewportEnter={() => setStartedInView(true)}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow azul extremamente discreto atras do painel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-40 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--s360-glow-blue), transparent 70%)" }}
      />

      {/* Barra superior — ferramenta propria, nao imitacao de navegador/macOS. */}
      <div
        aria-hidden="true"
        className="relative z-10 flex items-center gap-3 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      >
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="bg-border h-2.5 w-2.5 rounded-full" />
          <span className="bg-border h-2.5 w-2.5 rounded-full" />
          <span className="bg-border h-2.5 w-2.5 rounded-full" />
        </div>
        <span className="text-caption text-muted-foreground min-w-0 truncate font-medium">
          Janela de análise — antes / depois
        </span>

        <span className="hidden h-3.5 w-px shrink-0 bg-white/10 sm:block" />

        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <AnalysisGlyph className="text-primary h-3.5 w-3.5" />
          <span className="text-caption text-muted-foreground font-medium whitespace-nowrap">
            Comparação de perfil
          </span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <motion.span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "#36C98F" }}
            initial={{ opacity: 1 }}
            animate={reduced ? { opacity: 1 } : { opacity: [1, 0.35, 1] }}
            transition={reduced ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-caption hidden font-medium whitespace-nowrap min-[400px]:inline"
            style={{ color: "#36C98F" }}
          >
            Análise concluída
          </span>
        </div>
      </div>

      {/* Conteudo: Antes / nucleo / Depois. */}
      <div className="relative flex flex-col gap-6 p-5 sm:p-8 md:flex-row md:items-stretch md:gap-0">
        <ConnectionLines started={started} reduced={reduced} />

        <div className="relative z-10 md:w-[42%]">
          <ProfilePanel isAfter={false} activeArea={activeArea} started={started} reduced={reduced} />
        </div>

        <TransformationCore started={started} reduced={reduced} />

        <div className="relative z-10 md:w-[42%]">
          <ProfilePanel isAfter={true} activeArea={activeArea} started={started} reduced={reduced} />
        </div>
      </div>

      {/* Legenda conceitual — mantida, com acabamento proprio (divisor + icone). */}
      <div
        className="relative z-10 flex items-center justify-center gap-2 border-t px-5 py-4"
        style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "#0b0b0d" }}
      >
        <svg viewBox="0 0 16 16" className="text-foreground-subtle h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8" y1="7.2" x2="8" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="8" cy="5.3" r="0.9" fill="currentColor" />
        </svg>
        <p className="text-caption text-foreground-subtle text-center">
          Representação conceitual do processo de otimização — não reflete um
          perfil real.
        </p>
      </div>
    </motion.div>
  );
}
