import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  highlight?: boolean;
};

// Fluxo preservado do briefing (recebemos -> analisamos -> apontamos ->
// conversamos -> se fizer sentido, otimizacao). A etapa 5 e destacada
// (circulo preenchido) por ser a ponte para a futura secao de Solucao.
const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Recebemos os dados",
    description: "As informações do seu diagnóstico chegam até a nossa equipe.",
  },
  {
    number: "02",
    title: "Analisamos o cenário",
    description:
      "Avaliamos o Perfil da Empresa com os mesmos critérios da nossa metodologia.",
  },
  {
    number: "03",
    title: "Apontamos oportunidades",
    description: "Identificamos pontos específicos que podem ser melhorados.",
  },
  {
    number: "04",
    title: "Conversamos com você",
    description:
      "Compartilhamos o que encontramos e tiramos dúvidas, sem compromisso.",
  },
  {
    number: "05",
    title: "Apresentamos a otimização, se fizer sentido",
    description:
      "Quando existe uma oportunidade real, mostramos como seria a execução profissional das melhorias.",
    highlight: true,
  },
];

export function ProcessSection() {
  return (
    <Section variant="base">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="text-label text-primary font-medium tracking-wide uppercase">
            Depois do diagnóstico
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            O que acontece depois do diagnóstico.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Sem contratação automática. Primeiro a análise, depois uma conversa
            — e só então, se fizer sentido, uma proposta.
          </p>
        </ScrollReveal>

        <ol className="mt-14 flex w-full max-w-2xl list-none flex-col sm:mt-20">
          {PROCESS_STEPS.map((step, index) => (
            <ScrollReveal
              key={step.number}
              as="li"
              variant="fade-up"
              delay={0.08 + index * 0.06}
              amount={0.4}
              className="relative flex gap-5 pb-8 last:pb-0 sm:gap-7 sm:pb-10"
            >
              {index !== PROCESS_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-11 bottom-0 left-[1.375rem] w-px sm:top-12 sm:left-6"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--s360-primary), transparent)",
                  }}
                />
              ) : null}

              <div
                aria-hidden="true"
                className={cn(
                  "text-body relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-semibold sm:h-12 sm:w-12",
                  step.highlight
                    ? "border-primary bg-primary text-primary-foreground s360-glow-blue"
                    : "border-border bg-card-hover text-foreground",
                )}
              >
                {step.number}
              </div>

              <div className="border-border bg-card flex flex-1 flex-col gap-1.5 rounded-lg border px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-h4 font-semibold text-balance">
                  {step.title}
                </p>
                <p className="text-small text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
