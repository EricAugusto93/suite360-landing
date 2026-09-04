"use client";

import { motion } from "motion/react";

/**
 * Quatro icones tecnicos e proprios para as 4 frentes da metodologia —
 * substituem o padrao "lucide dentro de um circulo" (critica explicita do
 * usuario). Desenhados em SVG puro (viewBox 64x64, traco 1.5px, branco +
 * azul + roxo, com area preenchida), sem nenhuma lib de icones nova.
 *
 * Cada um usa Motion `variants` nos elementos internos SEM `animate`/
 * `whileHover` proprios — eles herdam o estado "rest"/"hover" do ancestral
 * mais proximo que declarar isso (o Card, em MethodologySection), entao a
 * microanimacao dispara quando o CARD inteiro recebe hover, nao so o
 * icone. Cores em hex literal (nao var() do CSS): atributos de apresentacao
 * SVG nem sempre resolvem custom properties de forma confiavel entre
 * navegadores — os valores abaixo espelham os tokens de app/globals.css.
 */

const WHITE = "#f7f7f8";
const BLUE = "#0866ff";
const PURPLE = "#a855f7";
const LINE = "rgba(255,255,255,0.35)";

const svgClass = "h-14 w-14 sm:h-16 sm:w-16";

/** Estrutura do perfil — modulos conectados, um deles em destaque. */
export function StructureIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={svgClass}
      aria-hidden="true"
    >
      <motion.line
        x1="32"
        y1="32"
        x2="15"
        y2="17"
        stroke={LINE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="32"
        y1="32"
        x2="49"
        y2="17"
        stroke={LINE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3, delay: 0.06 }}
      />
      <motion.line
        x1="32"
        y1="32"
        x2="32"
        y2="51"
        stroke={LINE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3, delay: 0.12 }}
      />

      <motion.circle
        cx="15"
        cy="17"
        r="4.5"
        fill="none"
        stroke={PURPLE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.55 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.25 }}
      />
      <motion.circle
        cx="49"
        cy="17"
        r="4.5"
        fill="none"
        stroke={PURPLE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.55 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.25, delay: 0.08 }}
      />
      <motion.circle
        cx="32"
        cy="51"
        r="4.5"
        fill="none"
        stroke={PURPLE}
        strokeWidth="1.5"
        variants={{ rest: { opacity: 0.55 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.25, delay: 0.16 }}
      />
      <motion.circle
        cx="49"
        cy="17"
        r="1.6"
        fill={PURPLE}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.24 }}
      />

      <rect
        x="23"
        y="23"
        width="18"
        height="18"
        rx="5"
        fill={BLUE}
        fillOpacity="0.16"
        stroke={BLUE}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Conteúdo — camadas de midia sobrepostas com indicador de atualizacao. */
export function ContentIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={svgClass}
      aria-hidden="true"
    >
      <motion.rect
        x="12"
        y="16"
        width="32"
        height="24"
        rx="4"
        fill="none"
        stroke={LINE}
        strokeWidth="1.5"
        variants={{
          rest: { x: 0, y: 0, opacity: 0.55 },
          hover: { x: -3, y: -2, opacity: 0.85 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.g
        variants={{
          rest: { x: 0, y: 0 },
          hover: { x: 3, y: 2 },
        }}
        transition={{ duration: 0.3, delay: 0.04 }}
      >
        <rect
          x="18"
          y="22"
          width="32"
          height="24"
          rx="4"
          fill={BLUE}
          fillOpacity="0.14"
          stroke={BLUE}
          strokeWidth="1.5"
        />
        <line
          x1="24"
          y1="30"
          x2="43"
          y2="30"
          stroke={WHITE}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <line
          x1="24"
          y1="35"
          x2="38"
          y2="35"
          stroke={WHITE}
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <line
          x1="24"
          y1="40"
          x2="33"
          y2="40"
          stroke={WHITE}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
      </motion.g>
      <motion.circle
        cx="49"
        cy="18"
        r="3.2"
        fill={PURPLE}
        variants={{
          rest: { scale: 0.85, opacity: 0.7 },
          hover: { scale: 1.15, opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "49px 18px" }}
      />
    </svg>
  );
}

/** Reputação — estrela geometrica com arco de pontuacao parcial. */
export function ReputationIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={svgClass}
      aria-hidden="true"
    >
      <motion.circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        variants={{
          rest: { strokeDasharray: "80 138.2", opacity: 0.7 },
          hover: { strokeDasharray: "116 138.2", opacity: 1 },
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
      <path
        d="M32 19 L35.2 27.4 L44 27.6 L36.9 33 L39.4 41.6 L32 36.6 L24.6 41.6 L27.1 33 L20 27.6 L28.8 27.4 Z"
        fill={WHITE}
        fillOpacity="0.92"
      />
      <motion.circle
        cx="12"
        cy="20"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.4 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.05 }}
      />
      <motion.circle
        cx="52"
        cy="20"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.4 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
      <motion.circle
        cx="9"
        cy="40"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.4 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
      />
    </svg>
  );
}

/** Presença local — radar geografico com pulso de localizacao. */
export function LocalPresenceIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={svgClass}
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="18"
        stroke={LINE}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <circle cx="32" cy="32" r="10" stroke={LINE} strokeWidth="1.5" />
      <motion.circle
        cx="32"
        cy="32"
        r="10"
        stroke={BLUE}
        strokeWidth="1.5"
        style={{ transformOrigin: "32px 32px" }}
        variants={{
          rest: { scale: 1, opacity: 0 },
          hover: { scale: 2, opacity: [0.9, 0] },
        }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <circle cx="32" cy="32" r="2.6" fill={BLUE} />
      <motion.circle
        cx="32"
        cy="12"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle
        cx="52"
        cy="32"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.05 }}
      />
      <motion.circle
        cx="32"
        cy="52"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
      <motion.circle
        cx="12"
        cy="32"
        r="1.7"
        fill={PURPLE}
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
      />
    </svg>
  );
}
