import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"div">;

/**
 * Base generica de card. Variantes especificas (card de problema, de
 * segmento, de metodologia, etc.) sao construidas em cima desta base
 * nas proximas fases — nao criar aqui.
 *
 * FASE 13: sombra suave (nunca sombra preta forte) + contorno fino, nao
 * um no lugar do outro. Raio `rounded-lg` (20px) — faixa "cards: 16-24px"
 * da instrucao; `rounded-xl` (28px) fica reservado para showcases grandes
 * (ex.: NfcShowcase). `OptionCard` tem seu proprio raio independente, nao
 * usa este componente.
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-card text-card-foreground shadow-subtle rounded-lg border",
        className,
      )}
      {...props}
    />
  );
}
