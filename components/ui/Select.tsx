"use client";

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Mensagem de erro. Quando presente, ativa o estado visual/aria de erro. */
  error?: string;
};

/**
 * Select nativo estilizado (mesma linguagem visual do Input — altura,
 * bordas, glow de foco). Nativo de proposito: navegacao por teclado e
 * leitores de tela ja funcionam corretamente sem reimplementar um listbox
 * customizado (usado pela etapa de Estado do diagnostico).
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, error, id, "aria-describedby": ariaDescribedBy, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy = cn(ariaDescribedBy, errorId) || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "bg-card text-body text-foreground h-11 w-full appearance-none rounded-md border px-4 pr-10 transition-[color,background-color,border-color,box-shadow] duration-200",
              "focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_6px_var(--s360-glow-blue)] focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-danger"
                : "border-border hover:border-muted-foreground",
              className,
            )}
            {...props}
          />
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
          />
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-small text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
