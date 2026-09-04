import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentPropsWithoutRef<"div">;

/**
 * Largura maxima e padding horizontal consistentes para todo o conteudo
 * da landing. Nao inclui espacamento vertical — isso e responsabilidade
 * do componente Section, que normalmente envolve um Container.
 */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--s360-container-max-width)] px-6 sm:px-8 lg:px-12",
        className,
      )}
      {...props}
    />
  );
}
