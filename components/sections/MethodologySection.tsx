import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { METHODOLOGY_AREAS } from "@/lib/constants";
import { AnimatedMarker, AnimatedTimelineSegment } from "./MethodologyMotion";
import { MethodologyStepCard } from "./MethodologyStepCard";
import { MethodologyVisual } from "./MethodologyVisuals";
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

// Grid tecnico GERAL do painel (ETAPA 4B) — distinto do grid interno das
// microvisualizacoes (MethodologyVisuals.tsx) e do `.s360-grid-texture`
// global (linhas brancas, reaproveitado sem alteracao logo abaixo): este e
// um grid LOCAL, azul-acinzentado, construido so aqui. Definido como
// constante para nao duplicar a string entre a variante mobile e desktop
// (mesmo desenho, so o tamanho da celula muda por breakpoint).
const METHODOLOGY_GRID_IMAGE =
  "linear-gradient(rgba(70,130,220,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,220,0.07) 1px, transparent 1px)";
// Mascara unica (radial, deslocada para o canto superior direito) — mais
// visivel ali, dissolvendo em direcao ao canto inferior esquerdo. Uma unica
// elipse resolve "mais forte no topo direito, mais fraca a esquerda,
// desaparece embaixo" sem depender de compor múltiplas mascaras (suporte
// inconsistente de `mask-composite` entre navegadores) e sem nunca formar
// uma borda reta.
const METHODOLOGY_GRID_MASK =
  "radial-gradient(ellipse 85% 75% at 78% 8%, black 0%, black 35%, transparent 78%)";

/** Icone abstrato de 3 barras — usado apenas no pill "N etapas / visão
 * completa" do cabecalho. SVG inline simples, sem lib nova. */
function BarsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 text-primary"
    >
      <rect x="1" y="8.5" width="3" height="5.5" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="6.5" y="4.5" width="3" height="9.5" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="12" y="1.5" width="3" height="12.5" rx="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Jornada vertical conectada — as etapas devem parecer parte de um unico
 * processo de analise, com inicio/progressao/conclusao, nao quatro cartoes
 * soltos.
 *
 * ETAPA 3 (timeline/marcadores/conexao): cada `<li>` virou um grid de 2
 * colunas (`auto` = marcador, `minmax(0,1fr)` = card) em vez do `flex`
 * anterior — a largura da coluna do marcador passou a vir do proprio
 * tamanho do marcador (nao mais um valor fixo desperdicando espaco no
 * mobile), liberando largura real para o card. A linha vertical continua
 * sendo um segmento por etapa (nao um unico elemento absoluto no `<ol>`):
 * cada segmento nasce onde o marcador termina e vai ate o fim do proprio
 * `<li>` (incluindo o `pb-*` de espacamento entre etapas), entao encosta
 * sem folga no marcador seguinte — visualmente uma linha unica e continua,
 * sem precisar medir em JS a altura variavel dos cards. So o ultimo item
 * nao tem segmento (evita a linha continuar depois da ultima etapa); o
 * primeiro e o ultimo ganham um pequeno "rabo" de fade (acabamento suave,
 * nunca um corte abrupto). Conector horizontal + ponto de juncao com o
 * card sao filhos do proprio marcador (`position:absolute; left-full`),
 * entao se alinham sozinhos com qualquer tamanho de marcador por
 * breakpoint, sem calculo manual de posicao.
 *
 * ETAPA 5 (animacoes): a entrada de cada `<li>` (mobile lateral alternado
 * 01 direita/02 esquerda/03 direita/04 esquerda via `direction`, desktop
 * fade-up discreto) continua vindo do MESMO `ScrollReveal` de sempre — so o
 * `delay` mudou, para o card entrar depois da sequencia marcador->conector
 * (ver `MethodologyMotion.tsx`). O trilho estatico da linha permanece
 * intacto; uma camada animada (`AnimatedTimelineSegment`) cresce por cima
 * dele quando a etapa entra em vista. O marcador virou `AnimatedMarker`
 * (Client Component em `MethodologyMotion.tsx`) — mesma aparencia final,
 * com uma entrada curta (escala+opacidade) e o conector/ponto de juncao
 * animados via propagacao de variants. Todas as pecas disparam de forma
 * independente (cada uma observa a PROPRIA entrada na viewport), sem
 * `useScroll` nem listener manual, e executam uma unica vez.
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
          className="border-border relative isolate w-full overflow-hidden rounded-xl border px-4 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16"
        >
          {/*
            Atmosfera tecnologica e profundidade do painel (ETAPA 4B) — uma
            unica camada decorativa (`aria-hidden`, `pointer-events-none`,
            `-z-10`) com varias sub-camadas empilhadas, atras de todo o
            conteudo real (que ganhou `relative z-10` mais abaixo — o
            `isolate` no painel garante que esse z-index fica contido aqui
            dentro, sem interferir em nada fora da secao). So CSS/gradientes
            e nenhuma imagem — a unica animacao desta camada e a respiracao
            sutil de 3 dos glows (ETAPA 5, ver abaixo); grid e base
            permanecem estaticos.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            {/*
              ETAPA 5 — respiracao ambiental muito sutil, so nos glows (nunca
              no grid, na base ou na luz da timeline — pedido explicito).
              Puro CSS local (nao toca app/globals.css): um <style> literal
              renderiza as @keyframes no DOM desta secao, referenciadas via
              `animation` inline nos 3 glows abaixo. A regra global de
              `prefers-reduced-motion` em app/globals.css (`animation-duration:
              0.01ms !important` para `*`) ja neutraliza essas animacoes
              automaticamente para quem pediu menos movimento — nenhum
              tratamento extra precisou ser adicionado aqui.
            */}
            <style>{`
              @keyframes s360-mv-breathe-a {
                0%, 100% { opacity: 0.85; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.035); }
              }
              @keyframes s360-mv-breathe-b {
                0%, 100% { opacity: 0.7; transform: translate(0px, 0px); }
                50% { opacity: 0.92; transform: translate(5px, -5px); }
              }
              @keyframes s360-mv-breathe-c {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 0.85; transform: scale(1.04); }
              }
            `}</style>

            {/* 1. Base do painel — substitui o antigo `bg-card` chapado por
                um gradiente vertical escuro (quase preto no centro, com uma
                pequena retomada azul-marinho na altura em que a timeline
                comeca). */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #0d111a 0%, #0a0d14 16%, #07090e 40%, #0d1a2e 60%, #0a0d14 82%, #07090e 100%)",
              }}
            />

            {/* 2. Grid tecnico + brilho central (ja existentes, preservados sem alteracao). */}
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
                animation: "s360-mv-breathe-c 9s ease-in-out infinite",
              }}
            />

            {/* 3. Iluminacao radial superior — reforca o canto superior
                direito no desktop (atras da linha editorial/titulo); no
                mobile fica centralizada, sem virar uma faixa azul forte. */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 85% 5%, rgba(8,107,255,0.16), rgba(8,107,255,0.06) 35%, transparent 70%)",
                animation: "s360-mv-breathe-a 12s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                background:
                  "radial-gradient(ellipse 95% 38% at 50% 0%, rgba(8,107,255,0.14), rgba(8,107,255,0.05) 40%, transparent 72%)",
                animation: "s360-mv-breathe-a 12s ease-in-out infinite",
              }}
            />

            {/* 4. Grid tecnico GERAL — celula menor no mobile, maior no
                desktop; mascara radial unica (ver METHODOLOGY_GRID_MASK)
                deixa mais visivel no topo direito e dissolve gradualmente,
                sem nunca formar um retangulo. */}
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                backgroundImage: METHODOLOGY_GRID_IMAGE,
                backgroundSize: "40px 40px",
                maskImage: METHODOLOGY_GRID_MASK,
                WebkitMaskImage: METHODOLOGY_GRID_MASK,
              }}
            />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                backgroundImage: METHODOLOGY_GRID_IMAGE,
                backgroundSize: "60px 60px",
                maskImage: METHODOLOGY_GRID_MASK,
                WebkitMaskImage: METHODOLOGY_GRID_MASK,
              }}
            />

            {/* 5. Luz ambiental atras da timeline — coluna difusa alinhada
                com a mesma centralizacao `max-w-[1120px]` do conteudo real
                (onde a coluna do marcador comeca), mais intensa perto do
                topo (etapa 01) e esmaecendo em direcao a etapa 04. Nao
                altera a propria linha/marcadores da Etapa 3, so acrescenta
                luz atras deles. */}
            <div className="absolute inset-y-0 left-1/2 w-full max-w-[1120px] -translate-x-1/2">
              <div
                className="absolute inset-y-0 left-0 w-[110px] sm:w-[130px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,102,255,0.16) 0%, rgba(8,102,255,0.08) 45%, transparent 85%)",
                  filter: "blur(36px)",
                }}
              />
            </div>

            {/* 6. Pequeno acento violeta — regiao secundaria (direita,
                altura das etapas 02/03), bem mais discreto que o azul. */}
            <div
              className="absolute top-1/2 right-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl sm:h-80 sm:w-80"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
                animation: "s360-mv-breathe-b 13s ease-in-out infinite",
              }}
            />
          </div>

          {/*
            Cabecalho editorial — reestruturado (ETAPA 2) para se aproximar
            da referencia aprovada: alinhado a esquerda (nao mais centrado,
            "para nao ficar perdido no centro"), com a linha eyebrow/regua/
            badge numa unica fileira, titulo grande dominando a composicao,
            e o indicador de quantidade como um pill real (nao mais um
            <p> simples).
          */}
          <div className="relative z-10 mx-auto flex max-w-[1120px] flex-col items-start gap-7 text-left">
            {/*
              ETAPA 5 — sequencia com pequeno stagger (linha editorial ->
              titulo -> descricao -> pill), cada pedaco com seu proprio
              ScrollReveal (delay incremental). So `opacity`/`y` (variant
              "fade-up" padrao, sem `direction`) — o deslocamento lateral
              exclusivo do mobile continua so no painel externo (Etapa 2),
              nao duplicado aqui, para nao "deslizar duas vezes". Nao anima
              palavra por palavra nem aplica efeito de digitacao.
            */}
            <ScrollReveal variant="fade-up" amount={0.4}>
              {/* Linha editorial superior — eyebrow + regua + badge numa unica fileira, inclusive no mobile enquanto couber. */}
              <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-label text-primary shrink-0 font-medium tracking-wide whitespace-nowrap uppercase">
                  Metodologia
                </span>
                <span
                  aria-hidden="true"
                  className="via-primary/60 h-px min-w-6 flex-1 bg-gradient-to-r from-transparent to-transparent"
                />
                <span className="border-primary/40 bg-accent text-accent-foreground inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium whitespace-nowrap sm:px-4 sm:py-2 sm:text-[0.875rem]">
                  <span
                    aria-hidden="true"
                    className="bg-primary s360-glow-blue h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  Análise em {total} dimensões
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.08} amount={0.4}>
              <h2 className="max-w-[760px] text-[clamp(2.75rem,7vw,5rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance">
                Como analisamos sua empresa.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.16} amount={0.4}>
              <p className="text-muted-foreground max-w-[45rem] text-[1rem] leading-relaxed text-balance sm:text-[1.125rem] lg:text-[1.25rem]">
                Os dados que você informou são o ponto de partida. Nossa
                análise vai além disso, considerando o perfil como um todo.
              </p>
            </ScrollReveal>

            {/*
              Indicador de quantidade — agora um pill real (icone + numero
              dinamico + separador + texto), nao mais um <p> simples.
              Quantidade sempre calculada a partir de STEPS.length.
            */}
            <ScrollReveal variant="fade-up" delay={0.24} amount={0.4}>
              <div className="border-primary/40 bg-accent text-accent-foreground inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[0.9rem] font-medium">
                <BarsIcon />
                <span>
                  {total} etapas{" "}
                  <span aria-hidden="true" className="text-primary">
                    •
                  </span>{" "}
                  visão completa
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Jornada conectada. */}
          <ol className="relative z-10 mx-auto mt-14 flex max-w-[1120px] flex-col sm:mt-16">
            {STEPS.map((step, index) => {
              const isFirst = index === 0;
              const isLast = index === total - 1;
              const number = String(index + 1).padStart(2, "0");

              return (
                <ScrollReveal
                  key={step.title}
                  as="li"
                  variant="fade-up"
                  direction={index % 2 === 0 ? "right" : "left"}
                  mobileDistance={24}
                  delay={0.6 + index * 0.05}
                  amount={0.2}
                  className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 pb-6 last:pb-0 sm:gap-x-4 sm:pb-8 lg:gap-x-6 lg:pb-11"
                >
                  {/*
                    Linha vertical continua — construida como um segmento
                    por etapa (nao um unico elemento no <ol>) de proposito:
                    cada segmento comeca exatamente onde o marcador termina
                    e vai ate o fim do seu proprio <li> (incluindo o
                    espacamento pb-*), entao encosta sem folga no marcador
                    seguinte — visualmente uma linha unica e continua, sem
                    depender de medir a altura variavel dos cards em JS.
                    Trecho inicial (etapa 1) em azul eletrico vivido;
                    demais trechos em azul mais contido, conforme pedido.
                  */}
                  {!isLast && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute top-[46px] bottom-0 left-[23px] w-[2px] sm:top-[56px] sm:left-[28px] lg:top-[68px] lg:left-[34px]"
                        style={{
                          background: isFirst
                            ? "linear-gradient(to bottom, var(--s360-primary), rgba(103,140,255,0.55))"
                            : "linear-gradient(to bottom, rgba(103,140,255,0.5), rgba(103,140,255,0.15))",
                          boxShadow: isFirst
                            ? "0 0 12px 1px rgba(8,102,255,0.45)"
                            : "0 0 8px 1px rgba(8,102,255,0.2)",
                        }}
                      />
                      {/*
                        ETAPA 5 — camada animada, sobreposta ao trilho
                        estatico acima (que continua existindo, inalterado).
                        Mesmas classes de posicionamento (garante alinhamento
                        exato); cresce de cima para baixo quando a etapa
                        entra na viewport.
                      */}
                      <AnimatedTimelineSegment
                        isFirst={isFirst}
                        className="absolute top-[46px] bottom-0 left-[23px] w-[2px] sm:top-[56px] sm:left-[28px] lg:top-[68px] lg:left-[34px]"
                      />
                    </>
                  )}

                  {/* Acabamento suave no inicio da linha — nasce um pouco antes do centro do primeiro marcador, nunca um corte abrupto. */}
                  {isFirst && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-6 left-[23px] h-6 w-[2px] sm:left-[28px] lg:left-[34px]"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, var(--s360-primary))",
                      }}
                    />
                  )}

                  {/* Acabamento suave no final — termina logo apos o ultimo marcador, nunca prolongada ate o fim do painel. */}
                  {isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute top-[46px] left-[23px] h-6 w-[2px] sm:top-[56px] sm:left-[28px] lg:top-[68px] lg:left-[34px]"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(103,140,255,0.45), transparent)",
                      }}
                    />
                  )}

                  {/*
                    Marcador numerado. Etapa 01: fundo azul escuro (accent),
                    borda azul eletrica, halo externo (box-shadow) e um
                    segundo anel sutil. Etapas 02-04: fundo grafite azulado
                    translucido, borda azul acinzentada, leve iluminacao
                    interna — deixam de parecer "circulos pretos soltos".
                    O conector horizontal + ponto de juncao sao filhos deste
                    elemento (`relative`), ancorados em `left-full` +
                    centralizados verticalmente — encostam exatamente na
                    borda esquerda do card ao lado, sem calculo manual de
                    posicao por breakpoint.
                  */}
                  <AnimatedMarker
                    isFirst={isFirst}
                    number={number}
                    delay={0.15}
                    className={cn(
                      "relative z-10 flex h-[46px] w-[46px] items-center justify-center rounded-full font-semibold sm:h-[56px] sm:w-[56px] sm:text-[1rem] lg:h-[68px] lg:w-[68px]",
                      "text-[0.875rem] lg:text-[1.125rem]",
                      isFirst ? "text-white" : "text-foreground",
                    )}
                  />

                  <MethodologyStepCard
                    label={`Dimensão ${number}`}
                    Icon={step.Icon}
                    title={step.title}
                    description={step.description}
                    items={step.items}
                    visual={
                      <MethodologyVisual index={index} highlighted={isFirst} />
                    }
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
