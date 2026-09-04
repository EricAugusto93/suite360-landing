import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionVariant = "base" | "alt" | "elevated";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  variant?: SectionVariant;
};

/**
 * Toda a experiencia e escura por padrao (app/globals.css) — as variantes
 * abaixo nao alternam claro/escuro, elas alternam o TOM de preto usado
 * pela secao, para criar separacao sem recorrer ao mesmo preto chapado em
 * toda parte (pedido explicito do usuario).
 */
const variantClasses: Record<SectionVariant, string> = {
  /** Preto profundo — tom "de repouso" da pagina. */
  base: "bg-background",
  /** Leve variacao de preto — alterna com `base` entre secoes vizinhas. */
  alt: "bg-background-alt",
  /** Superficie elevada — paineis de maior impacto (Problema, Metodologia, CTA final). */
  elevated: "bg-muted",
};

/**
 * Ritmo vertical e variante de fundo padrao para as secoes da landing.
 * Nao inclui largura maxima — combine com <Container> para o conteudo interno.
 * FASE 14: espacamento vertical amplo (112-160px) — composicao editorial,
 * secoes com presenca real em vez de conteudo pequeno cercado de vazio.
 */
export function Section({
  variant = "base",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-28 sm:py-36 lg:py-40",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
