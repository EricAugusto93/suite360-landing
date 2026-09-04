import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import {
  FewReviewsIcon,
  GenericPhotosIcon,
  IncompleteInfoIcon,
  MisalignedTagIcon,
  MissingReplyIcon,
} from "./ProblemIcons";

type ProblemItem = {
  icon: typeof IncompleteInfoIcon;
  title: string;
  description: string;
  /** Classes de posicionamento no bento grid (varia tamanho por card). */
  span: string;
  /** So o card grande (Informacoes incompletas) recebe a mini-simulacao. */
  showDetail?: boolean;
};

// Mesmas cinco dimensoes representadas na HeroVisual, agora como pontos de
// atencao. Linguagem em possibilidade ("pode", "podem") — nunca afirma que o
// perfil do visitante esta ruim (PLANEJAMENTO.md / instrucao da FASE 04).
// Icones proprios (ProblemIcons.tsx) — pedido explicito do usuario para
// substituir os icones Lucide padrao por marcas mais sofisticadas/tecnicas.
const problems: ProblemItem[] = [
  {
    icon: IncompleteInfoIcon,
    title: "Informações incompletas",
    description:
      "Endereço, categoria ou horários desatualizados podem confundir quem pesquisa por você.",
    span: "lg:col-span-2 lg:row-span-2",
    showDetail: true,
  },
  {
    icon: FewReviewsIcon,
    title: "Poucas avaliações",
    description:
      "Um perfil com poucas avaliações recentes passa menos confiança do que poderia.",
    span: "lg:col-span-2",
  },
  {
    icon: GenericPhotosIcon,
    title: "Fotos pouco estratégicas",
    description:
      "Fotos genéricas ou desatualizadas nem sempre mostram o real diferencial do negócio.",
    span: "lg:col-span-1",
  },
  {
    icon: MisalignedTagIcon,
    title: "Categorias mal aproveitadas",
    description:
      "Categorias e serviços mal configurados reduzem a chance de aparecer nas buscas certas.",
    span: "lg:col-span-1",
  },
  {
    icon: MissingReplyIcon,
    title: "Respostas ausentes",
    description:
      "Perguntas e avaliações sem resposta podem passar uma impressão de descuido.",
    span: "sm:col-span-2 lg:col-span-4",
  },
];

/**
 * Painel escuro elevado (bento grid) — um dos "momentos" de maior impacto
 * do ritmo de tons alternados entre secoes (`variant="elevated"`, ver
 * Section.tsx). Tamanhos variados entre os 5 cards (um bento real, nao uma
 * grade repetitiva); o card maior ("Informações incompletas") ganha uma
 * mini-simulação de interface (barras de preenchimento, mesma linguagem
 * honesta já usada em OptimizationPreview/ReportShowcase — não é uma
 * captura real de nenhum perfil). Icones em chip quadrado com borda azul
 * (nao um circulo generico) — mesma linguagem "tech chip" usada em
 * HeroVisual/NfcShowcase.
 */
export function ProblemSection() {
  return (
    <Section variant="elevated">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="flex max-w-3xl flex-col items-center gap-5 text-center"
        >
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Seu perfil pode estar afastando clientes sem você perceber.
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl text-balance">
            Alguns pontos parecem pequenos, mas influenciam diretamente a
            decisão de quem pesquisa por você.
          </p>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          className="mt-16 grid w-full grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
        >
          {problems.map(({ icon: Icon, title, description, span, showDetail }) => (
            <div
              key={title}
              className={cn(
                "border-border bg-card group flex flex-col gap-5 rounded-lg border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]",
                span,
              )}
            >
              <div className="flex items-center justify-between">
                <div className="border-primary/25 bg-accent relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border">
                  <Icon className="text-primary h-[19px] w-[19px]" />
                  <span
                    aria-hidden="true"
                    className="bg-purple-luminous absolute -top-1 -right-1 h-2 w-2 rounded-full"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="bg-primary/60 h-1.5 w-1.5 rounded-full transition-colors duration-300 group-hover:bg-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-h4 font-medium">{title}</p>
                <p className="text-small text-muted-foreground">
                  {description}
                </p>
              </div>

              {showDetail && (
                <div
                  aria-hidden="true"
                  className="bg-background border-border mt-auto flex flex-col gap-2 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-muted h-2 w-1/3 rounded-full" />
                    <span className="text-caption text-muted-foreground/70">
                      incompleto
                    </span>
                  </div>
                  <span className="bg-muted h-2 w-full rounded-full" />
                  <span className="bg-muted h-2 w-2/3 rounded-full" />
                  <span className="border-border h-2 w-1/2 rounded-full border border-dashed" />
                </div>
              )}
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.15}
          className="mt-16 max-w-2xl text-center sm:mt-20"
        >
          <p className="text-h3 text-foreground font-medium text-balance">
            A pergunta natural é: como está o Perfil da sua empresa agora?
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
