"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
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

type MethodologyCardProps = {
  Icon: IconComponent;
  title: string;
  description: string;
  items: string[];
  visual: React.ReactNode;
};

/**
 * Isola a interatividade (Motion `whileHover`) num Client Component leaf —
 * mesmo padrao ja usado por ScrollReveal/HeroVisual/DiagnosticWizard, para
 * que MethodologySection continue um Server Component. `whileHover="hover"`
 * aqui e o que os elementos internos do `Icon` (variants "rest"/"hover" sem
 * animate proprio, ver MethodologyIcons.tsx) herdam — passar o mouse no
 * CARD inteiro dispara a microanimacao do icone, nao so o icone isolado.
 */
export function MethodologyCard({
  Icon,
  title,
  description,
  items,
  visual,
}: MethodologyCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="border-border bg-muted group relative z-10 flex min-h-[280px] flex-col gap-5 rounded-lg border p-7 transition-[border-color,background-color] duration-300 hover:border-primary/35 sm:min-h-[300px]"
    >
      <Icon />
      <div className="flex flex-col gap-2">
        <p className="text-h4 font-semibold">{title}</p>
        <p className="text-small text-muted-foreground">{description}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge variant="neutral">{item}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2">{visual}</div>
    </motion.div>
  );
}
