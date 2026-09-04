"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItemProps = {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/**
 * Item de accordion acessivel e independente (cada item guarda seu proprio
 * estado — sem Context/estado compartilhado, permanece "simples" como
 * pedido na instrucao da fase). Padrao ARIA: heading envolve o botao
 * (trigger), painel com role="region" + aria-labelledby (viavel aqui pois
 * sao poucos itens — 4 perguntas).
 *
 * A animacao de altura usa a tecnica de CSS grid (0fr -> 1fr), sem medir
 * pixels via JS. A regra global de `prefers-reduced-motion` em
 * globals.css ja reduz a duracao de qualquer `transition` para ~0, entao
 * este componente nao precisa de logica extra para respeitar reduced
 * motion.
 */
export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const triggerId = useId();

  return (
    <div>
      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="focus-visible:ring-primary focus-visible:ring-offset-background group flex w-full items-center justify-between gap-4 rounded-sm py-6 text-left focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="text-h4 group-hover:text-primary font-medium transition-colors duration-200">
            {question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "border-border bg-background group-hover:border-primary/40 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color] duration-300",
              open ? "border-primary/40 rotate-45" : "rotate-0",
            )}
          >
            <Plus
              size={16}
              className={cn(
                "transition-colors duration-200",
                open ? "text-primary" : "text-muted-foreground",
              )}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-body text-muted-foreground max-w-2xl pb-6">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
