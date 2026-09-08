"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { METHODOLOGY_AREAS } from "@/lib/constants";
import { OptimizationPreview } from "./OptimizationPreview";

/**
 * Junta o titulo/descricao/etiquetas de "Otimizacao completa" (texto e
 * marcacao IDENTICOS aos de antes) com o painel visual, num unico Client
 * Component — necessario so para poder compartilhar o estado de hover
 * entre as etiquetas e o painel (pedido explicito do usuario: passar o
 * mouse numa etiqueta destaca os modulos correspondentes dentro do
 * comparativo). As etiquetas em si nao mudam nada (mesmo `Badge`, mesmo
 * texto, sem classe extra) — so o `<li>` ganha handlers de mouse.
 */
export function OptimizationShowcase() {
  const [activeArea, setActiveArea] = useState<string | null>(null);

  return (
    <>
      {/*
        ETAPA 3 — `mt-16`/`sm:mt-20` fixo somava, junto com o `py-28` (agora
        `py-16 sm:py-20 md:py-28 lg:py-40` de Section.tsx) do Processo e da
        Solucao, um vazio estrutural de 288px no mobile. Reduzido para
        `mt-8`/`sm:mt-10` (32px/40px) abaixo de 768px; `md:mt-16` (768-
        1023px) e `lg:mt-20` (1024px+, o MESMO valor original de sempre)
        preservam o comportamento desktop exatamente como antes — o antigo
        `sm:mt-20` nunca tinha um tier proprio de `lg`, entao repeti-lo
        aqui como `lg:mt-20` e o que garante "nao reduza o desktop".
      */}
      <ScrollReveal
        variant="fade-up"
        delay={0.1}
        direction="left"
        mobileDistance={28}
        className="mt-8 flex w-full max-w-3xl flex-col items-center gap-4 text-center sm:mt-10 md:mt-16 lg:mt-20"
      >
        <h3 className="text-h1 font-semibold text-balance">
          Otimização completa
        </h3>
        <p className="text-body text-muted-foreground max-w-xl text-balance">
          Não é uma edição pontual de cadastro. É a execução estratégica das
          melhorias identificadas na análise, considerando as mesmas frentes
          da nossa metodologia.
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {METHODOLOGY_AREAS.map((area) => (
            <li
              key={area}
              onMouseEnter={() => setActiveArea(area)}
              onMouseLeave={() =>
                setActiveArea((current) => (current === area ? null : current))
              }
            >
              <Badge variant="accent">{area}</Badge>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal
        variant="fade-up"
        delay={0.15}
        direction="left"
        mobileDistance={28}
        className="mt-10 w-full max-w-4xl"
      >
        <OptimizationPreview activeArea={activeArea} />
      </ScrollReveal>
    </>
  );
}
