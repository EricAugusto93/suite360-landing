import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionVariant = "base" | "alt" | "elevated";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  variant?: SectionVariant;
};

/**
 * ATE A REFORMULACAO DO "FUNDO INFINITO": cada variante pintava um tom de
 * preto solido diferente (bg-background/bg-background-alt/bg-muted) para
 * separar secoes vizinhas sem repetir o mesmo preto chapado. Na pratica
 * isso criava o problema oposto — faixas horizontais bem visiveis exatamente
 * nos limites entre secoes com variantes diferentes (pedido explicito do
 * usuario para eliminar).
 *
 * As tres variantes agora sao transparentes: a atmosfera continua (ver
 * AmbientBackground.tsx, renderizada uma unica vez atras de toda a pagina
 * em app/layout.tsx) e quem preenche o fundo. `variant` continua existindo
 * — e todo `<Section variant="...">` do projeto continua passando esse
 * prop sem precisar mudar nenhum arquivo — apenas para permitir uma
 * futura distincao semantica sem repetir o erro de pintar retangulos
 * solidos por secao.
 */
const variantClasses: Record<SectionVariant, string> = {
  base: "bg-transparent",
  alt: "bg-transparent",
  elevated: "bg-transparent",
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
