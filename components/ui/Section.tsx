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
 *
 * ETAPA 3 (auditoria "fundo mobile, espacamentos") — o padding mobile
 * (112px, igual dos dois lados de toda transicao entre secoes) estava
 * contribuindo sozinho com 224px de vazio em toda fronteira "comum" da
 * pagina (Sinais de Alerta->Diagnostico, Metodologia->Processo, Provas
 * Sociais->FAQ). Reduzido para 64px (`py-16`) abaixo de 640px e 80px
 * (`sm:py-20`) entre 640-767px — a faixa 768px+ (tablet largo/desktop)
 * MANTEM os valores originais (`md:py-28` = 112px entre 768-1023px,
 * `lg:py-40` = 160px a partir de 1024px, o MESMO valor de sempre) —
 * "nao reduza o desktop" (pedido explicito desta etapa) e satisfeito
 * preservando literalmente o breakpoint `lg` original, mesmo com os dois
 * tiers novos abaixo dele.
 */
export function Section({
  variant = "base",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 sm:py-20 md:py-28 lg:py-40",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
