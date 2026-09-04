import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "accent" | "outline";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent text-accent-foreground",
  outline: "border border-border text-foreground",
};

/**
 * Selo curto para indicadores de confianca ("Diagnostico gratuito",
 * "Sem compromisso"). Sem texto especifico da landing definido aqui.
 */
export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
