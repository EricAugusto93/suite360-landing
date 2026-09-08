"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type OptionCardProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  /** Nao usado hoje por nenhuma etapa, mas suportado para completar os estados pedidos (ETAPA 4A) — encaminha para o atributo nativo `disabled`. */
  disabled?: boolean;
};

/**
 * Cartao selecionavel generico, usado pelas etapas de Segmento e Porte.
 * Padrao "toggle button" (button real + aria-pressed) em vez de
 * role="radio"/roving-tabindex: mais simples de implementar corretamente
 * e ja plenamente acessivel por teclado (Tab + Enter/Espaco).
 *
 * ETAPA 4A: superficie com profundidade real (gradiente sutil + borda
 * azul-acinzentada, no lugar do antigo `bg-card`/`border-border` chapados),
 * elevacao leve no hover (so em dispositivos com hover real — Tailwind ja
 * restringe `hover:` a `@media (hover:hover)`), e um indicador circular de
 * selecao (check) no canto superior direito, renderizado so quando
 * `selected` e verdadeiro. A selecao nunca depende so da cor: borda +
 * fundo + check aparecem juntos. Continua sendo um `<button type="button">`
 * real com `aria-pressed` — nenhuma mudanca semantica.
 */
export function OptionCard({
  selected,
  onClick,
  children,
  className,
  disabled,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border px-3 py-5 text-center transition-[border-color,background-color,box-shadow,transform] duration-200",
        "focus-visible:ring-primary focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-primary bg-[linear-gradient(165deg,rgba(13,26,46,0.95)_0%,rgba(8,16,28,0.98)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(8,102,255,0.15),0_10px_26px_-10px_rgba(8,102,255,0.4)]"
          : "border-[rgba(103,140,255,0.14)] bg-[linear-gradient(165deg,rgba(21,23,29,0.9)_0%,rgba(12,14,19,0.95)_100%)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_12px_26px_-16px_rgba(8,102,255,0.3)]",
        className,
      )}
    >
      {children}

      {selected && (
        <span
          aria-hidden="true"
          className="bg-primary pointer-events-none absolute top-2 right-2 flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] shadow-[0_0_8px_1px_rgba(8,102,255,0.55)]"
        >
          <Check size={13} strokeWidth={3} className="text-white" />
        </span>
      )}
    </button>
  );
}
