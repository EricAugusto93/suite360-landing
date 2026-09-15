"use client";

import { motion } from "motion/react";
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
  /** So a primeira etapa recebe destaque azul adicional (pedido do usuario: "destaque claramente perceptivel"). */
  highlighted?: boolean;
};

/**
 * Card de uma etapa da jornada da Metodologia (estrutura/escala da ETAPA 2:
 * altura/padding/radius maiores, hierarquia interna mais forte, chips
 * maiores e grid de duas colunas no desktop em vez do flex empilhado
 * original). ETAPA 4A: a coluna reservada para `visual` foi ajustada para
 * 220-280px (era 200-260px) e o espaco acima da visualizacao no mobile
 * aumentado (24-32px), para acomodar as novas microvisualizacoes maiores
 * (`MethodologyVisuals.tsx`) sem alterar mais nada da estrutura da Etapa 2.
 * ETAPA 4B: a superficie do card ganhou profundidade — gradiente sutil e
 * `box-shadow` inset (highlight superior + leve reflexo azul na borda
 * esquerda) no lugar do antigo `bg-muted` chapado — sem tocar em
 * radius/padding/altura/layout interno, so a "pele" do card.
 *
 * Mobile/tablet: coluna unica (icone, label, titulo, descricao, chips,
 * depois a visualizacao, em largura total). Desktop (`lg`): grid de 2
 * colunas (`conteudo` | `visualizacao`), a visualizacao reservando uma
 * faixa fixa de largura, verticalmente centralizada — em vez do `flex-row`
 * original, que deixava o card baixo e "achatado".
 *
 * Isola a interatividade (Motion `whileHover`) num Client Component leaf —
 * mesmo padrao ja usado por ScrollReveal/HeroVisual/DiagnosticWizard, para
 * que MethodologySection continue um Server Component. `whileHover="hover"`
 * aqui e o que os elementos internos do `Icon` (variants "rest"/"hover" sem
 * animate proprio, ver MethodologyIcons.tsx) herdam — passar o mouse no
 * CARD inteiro dispara a microanimacao do icone. O Tailwind v4 ja restringe
 * `hover:` a dispositivos com suporte real a hover (`@media (hover: hover)`),
 * entao nenhum guard extra e necessario.
 *
 * Chips e o pill do cabecalho (MethodologySection.tsx) deixaram de usar o
 * componente `Badge` nesta etapa: `Badge` define seu proprio padding/
 * tamanho de fonte fixos (`text-caption`, `px-3 py-1`) e este projeto nao
 * usa tailwind-merge — sobrepor esses valores via `className` teria um
 * resultado imprevisivel (depende da ordem de geracao do CSS, nao da ordem
 * das classes no JSX). Renderizar o `<span>` diretamente evita esse risco e
 * mantem o mesmo resultado visual pretendido (formato pill, nao clicavel).
 *
 * CORRECAO CONJUNTA MOBILE — compactacao exclusiva mobile (<640px), parte
 * da reducao de rolagem ate/dentro da Metodologia: padding externo
 * `p-6`->`p-5` e o espacamento entre os blocos internos (icone/label/
 * titulo/descricao/chips) `gap-6`->`gap-4`, alem da margem antes da
 * microvisualizacao `mt-6`->`mt-4` — `sm:p-8`/`sm:gap-7`/`sm:mt-8` e toda a
 * faixa `lg:*` (grid de 2 colunas, radius, borda, sombra, destaque do card
 * 01) permanecem exatamente como estavam.
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
        "group relative flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-[24px] border p-5 transition-[border-color,box-shadow] duration-300 sm:gap-7 sm:p-8 lg:grid lg:min-h-[240px] lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-center lg:gap-10 lg:p-10",
        highlighted
          ? "border-primary/50 hover:border-primary/60"
          : "border-border-strong hover:border-primary/35",
      )}
      style={{
        // ETAPA 4B — profundidade de superficie: gradiente sutil (grafite
        // para azul-marinho quase preto) no lugar do antigo `bg-muted`
        // chapado, mais um highlight interno de 1px no topo (luz pegando a
        // borda) e uma leve reflexao azul na borda esquerda, via
        // `box-shadow` inset — sem alterar radius/padding/altura/layout.
        background: highlighted
          ? "linear-gradient(165deg, rgba(13,26,46,0.92) 0%, rgba(9,12,19,0.97) 55%, rgba(7,9,14,0.98) 100%)"
          : "linear-gradient(165deg, rgba(23,23,29,0.92) 0%, rgba(14,17,25,0.96) 55%, rgba(9,11,16,0.98) 100%)",
        boxShadow: highlighted
          ? "inset 0 1px 0 0 rgba(255,255,255,0.07), inset 1px 0 0 0 rgba(103,140,255,0.12), 0 0 0 1px rgba(8,102,255,0.12), 0 24px 60px -24px rgba(8,102,255,0.4)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.04), inset 1px 0 0 0 rgba(103,140,255,0.07), 0 18px 40px -20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Card 1: leve gradiente azul interno permanente (destaque claramente perceptivel, sem exagerar). */}
      {highlighted && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 0%, rgba(8,102,255,0.16), transparent 60%)",
          }}
        />
      )}

      {/* Realce extra no hover, para todos os cards (dispositivos com hover real). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(8,102,255,0.1), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col gap-4">
        <Icon />
        <span className="text-primary text-[0.8rem] font-semibold tracking-wide uppercase sm:text-[0.85rem]">
          {label}
        </span>
        <p className="text-[1.5rem] leading-tight font-bold text-balance lg:text-[2rem]">
          {title}
        </p>
        <p className="text-muted-foreground text-[1rem] leading-relaxed lg:text-[1.125rem]">
          {description}
        </p>
        <ul className="flex flex-wrap gap-2.5">
          {items.map((item) => (
            <li key={item}>
              <span className="border-border-strong bg-background/60 text-foreground inline-flex items-center rounded-full border px-4 py-2 text-[0.9rem] font-medium whitespace-nowrap">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4 flex w-full items-center justify-center sm:mt-8 lg:mt-0 lg:justify-end">
        {visual}
      </div>
    </motion.div>
  );
}
