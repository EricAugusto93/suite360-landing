import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { METHODOLOGY_AREAS } from "@/lib/constants";
import { MethodologyCard } from "./MethodologyCard";
import {
  ContentIcon,
  LocalPresenceIcon,
  ReputationIcon,
  StructureIcon,
} from "./MethodologyIcons";

type MethodologyGroup = {
  Icon: typeof StructureIcon;
  title: string;
  description: string;
  items: string[];
};

// Os quatro criterios do briefing — mantidos exatamente (rotulos e ordem)
// per instrucao explicita do usuario ("nao renomeie, remova ou adicione
// opcoes").
const GROUPS: MethodologyGroup[] = [
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

/** Microvisualização honesta e abstrata (sem numeros/dados reais) — um
 * detalhe visual diferente por card, reforçando a leitura de "interface de
 * analise" em vez de quatro cards identicos. */
function CardVisual({ index }: { index: number }) {
  if (index === 0) {
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
  }
  if (index === 1) {
    // Conteúdo: pilha de conteúdos (barras decrescentes, cartões).
    return (
      <div className="flex h-14 items-end justify-center gap-2">
        <span className="bg-card-hover border-border/80 h-10 w-8 rounded-md border" />
        <span className="bg-card-hover border-border/80 h-12 w-8 rounded-md border" />
        <span className="border-primary/40 bg-accent h-14 w-8 rounded-md border" />
        <span className="bg-card-hover border-border/80 h-9 w-8 rounded-md border" />
      </div>
    );
  }
  if (index === 2) {
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
  }
  // Presença local: radar / alcance geográfico concêntrico.
  return (
    <div className="relative flex h-14 items-center justify-center">
      <span className="border-border/70 absolute h-14 w-14 rounded-full border" />
      <span className="border-border/80 absolute h-9 w-9 rounded-full border" />
      <span className="bg-primary s360-glow-blue absolute h-2 w-2 rounded-full" />
    </div>
  );
}

/**
 * Painel escuro grande semelhante a uma interface de analise — nao mais
 * quatro pequenos cartões brancos (pedido explicito do usuario). Grid 2x2
 * com uma cruz de linhas conectando os quatro modulos ao centro do painel,
 * cada card com icone tecnico proprio (MethodologyIcons.tsx) + uma
 * microvisualizacao diferente + as mesmas tags/descricao ja existentes. O
 * card e um `motion.div` com `whileHover="hover"`: os elementos internos do
 * icone (variants "rest"/"hover", sem animate proprio) herdam esse estado,
 * entao passar o mouse no CARD inteiro dispara a microanimacao do icone.
 */
export function MethodologySection() {
  return (
    <Section variant="elevated">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="border-border bg-card relative w-full overflow-hidden rounded-xl border p-7 sm:p-10 lg:p-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--s360-glow-blue),transparent_70%)] opacity-70 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <span className="text-label text-primary font-medium tracking-wide uppercase">
                Metodologia
              </span>
              <Badge variant="outline" className="border-primary/30">
                <span
                  aria-hidden="true"
                  className="bg-primary h-1.5 w-1.5 rounded-full"
                />
                Análise em 4 dimensões
              </Badge>
            </div>
            <h2 className="text-h2 max-w-3xl font-semibold tracking-tight text-balance">
              Como analisamos sua empresa.
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl text-balance">
              Os dados que você informou são o ponto de partida. Nossa análise
              vai além disso, considerando o perfil como um todo.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2">
            {/* Cruz de conexão entre os 4 módulos — puramente decorativa. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden sm:block"
            >
              <span className="bg-border absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" />
              <span className="bg-border absolute top-1/2 right-0 left-0 h-px -translate-y-1/2" />
              <span className="bg-primary s360-glow-blue absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>

            {GROUPS.map(({ Icon, title, description, items }, index) => (
              <MethodologyCard
                key={title}
                Icon={Icon}
                title={title}
                description={description}
                items={items}
                visual={<CardVisual index={index} />}
              />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.15}
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
