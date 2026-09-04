"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type OptionCardProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Cartao selecionavel generico, usado pelas etapas de Segmento e Porte.
 * Padrao "toggle button" (button real + aria-pressed) em vez de
 * role="radio"/roving-tabindex: mais simples de implementar corretamente
 * e ja plenamente acessivel por teclado (Tab + Enter/Espaco), que e o que
 * a FASE 05 pede explicitamente.
 */
export function OptionCard({
  selected,
  onClick,
  children,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-4 text-center transition-colors duration-200",
        "focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        selected
          ? "border-primary bg-accent text-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
