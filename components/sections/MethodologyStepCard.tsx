"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type {
  ContentIcon,
  LocalPresenceIcon,
  ReputationIcon,
  StructureIcon,
} from "./MethodologyIcons";

type IconComponent =
  | typeof StructureIcon
  | typeof ContentIcon
  | typeof ReputationIcon
  | typeof LocalPresenceIcon;

type MethodologyStepCardProps = {
  /** Rotulo curto da etapa, ex. "Dimensão 01" — calculado a partir do indice, nunca escrito a mao. */
  label: string;
  Icon: IconComponent;
  title: string;
  description: string;
  items: string[];
  visual: React.ReactNode;
  /** So a primeira etapa recebe um leve destaque azul adicional (pedido do usuario: "pode aparecer com destaque mais intenso"). */
  highlighted?: boolean;
};

/**
 * Card de uma etapa da jornada da Metodologia — reformulado para caber
 * dentro de uma timeline vertical (ver MethodologySection.tsx) em vez de
 * uma grade 2x2 desconectada. Empilhado (rotulo/titulo/descricao/chips em
 * cima, microvisualizacao embaixo) ate `lg`; a partir dai, icone/conteudo/
 * visualizacao ficam lado a lado — "distribuir texto e microvisualizacao
 * de forma mais horizontal" no desktop, mantendo tablet ainda vertical
 * (apenas com mais respiro), como pedido explicitamente.
 *
 * Isola a interatividade (Motion `whileHover`) num Client Component leaf —
 * mesmo padrao ja usado por ScrollReveal/HeroVisual/DiagnosticWizard, para
 * que MethodologySection continue um Server Component. `whileHover="hover"`
 * aqui e o que os elementos internos do `Icon` (variants "rest"/"hover" sem
 * animate proprio, ver MethodologyIcons.tsx) herdam — passar o mouse no
 * CARD inteiro dispara a microanimacao do icone. O Tailwind v4 ja restringe
 * `hover:` a dispositivos com suporte real a hover (`@media (hover: hover)`),
 * entao nenhum guard extra e necessario para a instrucao de "hover somente
 * em dispositivos que suportam".
 */
export function MethodologyStepCard({
  label,
  Icon,
  title,
  description,
  items,
  visual,
  highlighted,
}: MethodologyStepCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className={cn(
        "border-border bg-muted group relative flex w-full flex-1 flex-col gap-5 overflow-hidden rounded-lg border p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary/35 sm:gap-6 sm:p-7 lg:flex-row lg:items-start lg:gap-8 lg:p-8",
        highlighted && "border-primary/25",
      )}
    >
      {/* Realce interno discreto, só visível no hover (dispositivos com hover real). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(8,102,255,0.1), transparent 60%)",
        }}
      />

      <div className="relative shrink-0 lg:pt-1">
        <Icon />
      </div>

      <div className="relative flex flex-1 flex-col gap-3">
        <span className="text-caption text-primary font-medium tracking-wide uppercase">
          {label}
        </span>
        <p className="text-h4 font-semibold">{title}</p>
        <p className="text-small text-muted-foreground">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <Badge variant="neutral">{item}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex shrink-0 items-center justify-center pt-2 lg:w-32 lg:justify-end lg:pt-1">
        {visual}
      </div>
    </motion.div>
  );
}
