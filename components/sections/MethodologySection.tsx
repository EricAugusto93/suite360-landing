import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { METHODOLOGY_AREAS } from "@/lib/constants";
import { MethodologyStepCard } from "./MethodologyStepCard";
import {
  ContentIcon,
  LocalPresenceIcon,
  ReputationIcon,
  StructureIcon,
} from "./MethodologyIcons";

type MethodologyStep = {
  Icon: typeof StructureIcon;
  title: string;
  description: string;
  items: string[];
};

// As quatro frentes do briefing — fonte da verdade, mantidas exatamente
// (rotulos, ordem, descricoes e itens) per instrucao explicita do usuario
// ("nao renomeie, remova ou adicione dimensoes"). `METHODOLOGY_AREAS`
// tambem alimenta o hover da secao de Otimizacao (OptimizationShowcase) —
// os titulos abaixo continuam vindo da mesma fonte para os dois nunca
// dessincronizarem.
const STEPS: MethodologyStep[] = [
  {
    Icon: StructureIcon,
    title: METHODOLOGY_AREAS[0],
    description: "A base de como sua empresa se apresenta no Google.",
    items: ["Informações", "Categorias", "Descrição"],
  },
  {
    Icon: ContentIcon,
    title: METHODOLOGY_AREAS[1],
    description: "O que reforça a identidade do negócio visualmente.",
    items: ["Fotos", "Produtos", "Serviços"],
  },
  {
    Icon: ReputationIcon,
    title: METHODOLOGY_AREAS[2],
    description: "Como os clientes validam a experiência publicamente.",
    items: ["Avaliações", "Respostas"],
  },
  {
    Icon: LocalPresenceIcon,
    title: METHODOLOGY_AREAS[3],
    description: "Consistência e relevância para quem pesquisa perto de você.",
    items: ["Consistência", "Relevância local"],
  },
];

/**
 * Microvisualização honesta e abstrata (sem numeros/dados reais) — um
 * detalhe visual diferente por etapa, reforçando a leitura de "interface de
 * analise" em vez de cards identicos. Selecionada por indice (nao por
 * titulo) para nao quebrar se os rotulos mudarem de ordem; usa `% 4` como
 * fallback defensivo caso uma quinta etapa seja adicionada no futuro (o
 * layout/numeracao/linha ja se adaptam automaticamente — so as 4
 * composicoes visuais abaixo sao especificas das 4 dimensoes reais atuais).
 */
function StepVisual({ index }: { index: number }) {
  switch (index % 4) {
    case 0:
      // Estrutura: mapa de 3 nós conectados a um módulo central.
      return (
        <div className="relative flex h-14 items-center justify-center gap-3">
          <span className="bg-muted border-border/80 h-2.5 w-2.5 rounded-full border" />
          <span className="via-border/80 h-px w-6 bg-gradient-to-r from-transparent to-transparent" />
          <span className="border-primary/60 bg-accent h-3.5 w-3.5 rounded-full border-2" />
          <span className="via-border/80 h-px w-6 bg-gradient-to-r from-transparent to-transparent" />
          <span className="bg-muted border-border/80 h-2.5 w-2.5 rounded-full border" />
        </div>
      );
    case 1:
      // Conteúdo: pilha de conteúdos (barras decrescentes, cartões).
      return (
        <div className="flex h-14 items-end justify-center gap-2">
          <span className="bg-card-hover border-border/80 h-10 w-8 rounded-md border" />
          <span className="bg-card-hover border-border/80 h-12 w-8 rounded-md border" />
          <span className="border-primary/40 bg-accent h-14 w-8 rounded-md border" />
          <span className="bg-card-hover border-border/80 h-9 w-8 rounded-md border" />
        </div>
      );
    case 2:
      // Reputação: distribuição visual de avaliações (barras horizontais).
      return (
        <div className="flex h-14 flex-col justify-center gap-1.5">
          {[92, 68, 44, 22, 10].map((width, i) => (
            <div key={width} className="bg-muted h-1.5 w-full rounded-full">
              <div
                className={
                  i === 0
                    ? "bg-primary h-full rounded-full"
                    : "bg-border-strong h-full rounded-full"
                }
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
      );
    default:
      // Presença local: radar / alcance geográfico concêntrico.
      return (
        <div className="relative flex h-14 items-center justify-center">
          <span className="border-border/70 absolute h-14 w-14 rounded-full border" />
          <span className="border-border/80 absolute h-9 w-9 rounded-full border" />
          <span className="bg-primary s360-glow-blue absolute h-2 w-2 rounded-full" />
        </div>
      );
  }
}

/**
 * Jornada vertical conectada — substitui a grade 2x2 desconectada (pedido
 * explicito do usuario: as etapas devem parecer parte de um unico processo
 * de analise, com inicio/progressao/conclusao, nao quatro cartoes soltos).
 * Reutiliza a mesma geometria de timeline ja validada em ProcessSection.tsx
 * (marcador circular + segmento de linha conectando ao PROXIMO item, so o
 * ultimo item nao tem segmento) — mesma linguagem visual do restante do
 * site, sem inventar um padrao novo, e que ja resolve corretamente "linha
 * nunca continua depois do ultimo item" e "se adapta a mais itens".
 *
 * Cada `<li>` e um unico `ScrollReveal` (marcador + linha + card entram
 * juntos, como uma unidade) — nao anima marcador/linha/card em separado,
 * o que manteria a secao leve (poucos observers) e evitaria uma sensacao
 * de "cada pedacinho pisca por conta propria".
 */
export function MethodologySection() {
  const total = STEPS.length;

  return (
    <Section variant="elevated">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          direction="left"
          mobileDistance={32}
          className="border-border bg-card relative w-full overflow-hidden rounded-xl border p-7 sm:p-10 lg:p-14"
        >
          {/*
            Atmosfera tecnologica discreta: brilho radial azul (ja usado
            antes) + uma grade tecnica quase imperceptivel, mascarada para
            desaparecer suavemente nas bordas (nunca ocupando o fundo
            inteiro com a mesma intensidade, pedido explicito do usuario).
            100% CSS, sem imagens — nao afeta performance.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="s360-grid-texture absolute inset-0 opacity-40"
              style={{
                maskImage:
                  "radial-gradient(ellipse 70% 55% at 50% 0%, black 0%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 55% at 50% 0%, black 0%, transparent 75%)",
              }}
            />
            <div
              className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, var(--s360-glow-blue), transparent 70%)",
              }}
            />
          </div>

          {/* Cabecalho editorial da secao. */}
          <div className="relative flex flex-col items-center gap-5 text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-label text-primary font-medium tracking-wide uppercase">
                Metodologia
              </span>
              <span
                aria-hidden="true"
                className="via-primary h-px w-10 bg-gradient-to-r from-transparent to-transparent"
              />
              <Badge variant="outline" className="border-primary/30">
                <span
                  aria-hidden="true"
                  className="bg-primary s360-glow-blue h-1.5 w-1.5 rounded-full"
                />
                Análise em {total} dimensões
              </Badge>
            </div>
            <h2 className="text-h2 max-w-3xl font-semibold tracking-tight text-balance">
              Como analisamos sua empresa.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl text-balance">
              Os dados que você informou são o ponto de partida. Nossa análise
              vai além disso, considerando o perfil como um todo.
            </p>
            {/* Indicador compacto do processo — quantidade sempre calculada a partir do array real, nunca escrita a mao. */}
            <p className="text-caption text-muted-foreground/80 font-medium tracking-wide uppercase">
              {total} etapas • visão completa
            </p>
          </div>

          {/* Jornada conectada. */}
          <ol className="relative mt-14 flex flex-col sm:mt-16">
            {STEPS.map((step, index) => {
              const isFirst = index === 0;
              const isLast = index === total - 1;
              const number = String(index + 1).padStart(2, "0");

              return (
                <ScrollReveal
                  key={step.title}
                  as="li"
                  variant="fade-up"
                  direction="left"
                  mobileDistance={24}
                  delay={0.08 + index * 0.08}
                  amount={0.2}
                  className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7 sm:pb-12"
                >
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-11 bottom-0 left-[1.375rem] w-px sm:top-12 sm:left-6"
                      style={{
                        background:
                          "linear-gradient(to bottom, var(--s360-primary), transparent)",
                      }}
                    />
                  )}

                  <div
                    aria-hidden="true"
                    className={cn(
                      "text-body relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-semibold sm:h-12 sm:w-12",
                      isFirst
                        ? "border-primary bg-primary text-primary-foreground s360-glow-blue"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {number}
                  </div>

                  <MethodologyStepCard
                    label={`Dimensão ${number}`}
                    Icon={step.Icon}
                    title={step.title}
                    description={step.description}
                    items={step.items}
                    visual={<StepVisual index={index} />}
                    highlighted={isFirst}
                  />
                </ScrollReveal>
              );
            })}
          </ol>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.15}
          direction="left"
          mobileDistance={28}
          className="mt-16 max-w-2xl text-center sm:mt-20"
        >
          <p className="text-h3 text-foreground font-medium text-balance">
            Não olhamos apenas se o perfil existe — observamos como ele está
            estruturado, apresentado e percebido por quem pesquisa por você.
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
