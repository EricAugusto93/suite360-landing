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
import { ProblemVisual } from "./ProblemVisuals";

type ProblemItem = {
  icon: typeof IncompleteInfoIcon;
  title: string;
  description: string;
  /** Classes de posicionamento no bento grid (varia tamanho por card). */
  span: string;
};

// Mesmas cinco dimensoes representadas na HeroVisual, agora como pontos de
// atencao. Linguagem em possibilidade ("pode", "podem") — nunca afirma que o
// perfil do visitante esta ruim (PLANEJAMENTO.md / instrucao da FASE 04).
// Icones proprios (ProblemIcons.tsx) — pedido explicito do usuario para
// substituir os icones Lucide padrao por marcas mais sofisticadas/tecnicas.
// ETAPA 6/7: array preservado integralmente (titulos, descricoes, icones,
// ordem, spans) — nao movido para outro arquivo. Os spans ja produzem a
// composicao assimetrica pedida na ETAPA 7 (card 1 ocupa as 2 colunas/2
// linhas da esquerda; card 2 fecha a linha 1 na direita; cards 3-4 dividem
// a linha 2 da direita; card 5 fecha com a largura toda) via auto-placement
// padrao do CSS Grid — nenhuma mudanca de span foi necessaria.
// ETAPA 8A: `showDetail` removido — controlava a antiga mini-simulacao
// exclusiva do card 1; agora os 5 cards recebem uma microvisualizacao
// propria (`ProblemVisual`, escolhida pelo INDICE em `ProblemVisuals.tsx`,
// nunca pelo titulo), entao a flag ficaria morta no array.
const problems: ProblemItem[] = [
  {
    icon: IncompleteInfoIcon,
    title: "Informações incompletas",
    description:
      "Endereço, categoria ou horários desatualizados podem confundir quem pesquisa por você.",
    span: "lg:col-span-2 lg:row-span-2",
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
 * Grid tecnico LOCAL desta secao (ETAPA 6) — mesmo principio visual ja
 * aprovado na Metodologia/Diagnostico (linhas finas azuladas + mascara
 * radial localizada), definido aqui do zero: nao importa constantes
 * privadas daqueles arquivos. Duas variantes de tamanho de celula (menor no
 * mobile, 48-72px no desktop, conforme pedido).
 */
const PROBLEM_GRID_IMAGE =
  "linear-gradient(rgba(70,130,220,0.065) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,220,0.065) 1px, transparent 1px)";
const PROBLEM_GRID_MASK =
  "radial-gradient(ellipse 65% 60% at 86% 6%, black 0%, black 28%, transparent 72%)";

/**
 * Mascara vertical do container decorativo inteiro (ETAPA 6, secao 10) —
 * garante que a atmosfera local desapareca gradualmente antes de tocar as
 * bordas superior/inferior da secao, para nunca criar uma divisao de cor
 * visivel com as secoes vizinhas (o fundo infinito global, `AmbientBackground`,
 * continua sendo a camada de base por baixo de tudo).
 */
const PROBLEM_ATMOSPHERE_FADE =
  "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)";

/**
 * Composicao abstrata de circuito (ETAPA 6, secao 13) — canto superior
 * direito, "parte do mesmo sistema" visual do circuito do Diagnostico mas
 * uma variacao propria (tracado em zigue-zague descendo para a esquerda,
 * nao o bloco em L usado la): 4 nos (3 azuis + 1 violeta), opacidade
 * decrescente. Estatica nesta etapa, SVG simples, nenhuma lib nova.
 */
function ProblemCircuit() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 210"
      className="pointer-events-none absolute top-0 right-0 hidden h-[210px] w-[300px] opacity-[0.32] sm:block"
    >
      <path
        d="M300 55 L235 55 L235 15"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M235 55 L190 100 L190 150 L145 150"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M145 150 L100 150"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="1.5 3"
        opacity="0.22"
      />
      <circle cx="235" cy="15" r="3" fill="var(--s360-primary)" opacity="0.65" />
      <circle cx="235" cy="55" r="3.5" fill="var(--s360-primary)" opacity="0.8" />
      <circle cx="190" cy="150" r="3" fill="#8b5cf6" opacity="0.55" />
      <circle cx="100" cy="150" r="2.5" fill="var(--s360-primary)" opacity="0.3" />
    </svg>
  );
}

/**
 * Tamanho do titulo por indice (ETAPA 7, secao 8) — hierarquia tipografica
 * proporcional ao papel de cada card na composicao, nao um valor unico para
 * os cinco: o card dominante (indice 0) ganha o titulo maior; os dois cards
 * horizontais (indices 1 e 4) ficam no meio; os dois cards menores lado a
 * lado (indices 2 e 3) recebem o menor tamanho, para nao comprimir o
 * conteudo deles. Funcao pura baseada so no indice — nao duplica dado no
 * array `problems` (que continua so com title/description/icon/span).
 */
function titleSizeClass(index: number): string {
  if (index === 0) {
    return "text-[1.5rem] sm:text-[1.625rem] lg:text-[1.6875rem]"; // ~24 / 26 / 27px
  }
  if (index === 1 || index === 4) {
    return "text-[1.375rem] lg:text-[1.5rem]"; // ~22 / 24px
  }
  return "text-[1.3125rem] lg:text-[1.375rem]"; // ~21 / 22px
}

/**
 * Painel escuro elevado (bento grid) — um dos "momentos" de maior impacto
 * do ritmo de tons alternados entre secoes (`variant="elevated"`, ver
 * Section.tsx). Tamanhos variados entre os 5 cards (um bento real, nao uma
 * grade repetitiva); cada card ganha sua propria microvisualizacao
 * decorativa (`ProblemVisual`, ver ETAPA 8A abaixo — nenhuma e uma captura
 * real de nenhum perfil, nem inventa metricas). Icones em chip quadrado
 * com borda azul (nao um circulo generico) — mesma linguagem "tech chip"
 * usada em HeroVisual/NfcShowcase.
 *
 * ETAPA 6 — cabecalho reformulado para o mesmo vocabulario editorial ja
 * aprovado na Metodologia/Diagnostico: eyebrow + regua + pill dinamico
 * (esquerda), titulo grande, descricao maior, atmosfera local (grid tecnico
 * + glow azul + acento violeta + circuito), tudo atras do conteudo real e
 * integrado ao fundo infinito global. Preservado integralmente nesta etapa.
 *
 * ETAPA 7 — arquitetura visual dos 5 cards: faixa superior com numeracao
 * dinamica (`String(index+1).padStart(2,"0")`) + trilho fino + status
 * "ATENÇÃO" (mesmo markup nos 5 cards, sem novo campo no array); superficie
 * com profundidade real (gradiente diagonal + borda azul-acinzentada +
 * sombra em camadas, com um tratamento mais intenso so no card 1 — borda
 * mais visivel, glow externo, iluminacao radial interna proxima ao canto
 * superior esquerdo, inspirado no card em destaque da Metodologia sem
 * copia-lo literalmente); radius/padding ajustados para o alvo mobile
 * (22px/24px); pequenas marcas de canto (ponto + "L" fino) so a partir de
 * `lg` (onde a geometria assimetrica do Bento existe de fato), substituindo
 * o antigo ponto azul solto do canto superior direito do icone pelo mesmo
 * papel de "conexao com o sistema", agora ancorado ao card inteiro. O
 * proprio Bento (grid/spans/ordem/conteudo/ScrollReveal por card) continua
 * estruturalmente identico — so o "acabamento" mudou.
 *
 * ETAPA 8A — cada um dos 5 cards ganha sua propria microvisualizacao
 * (`ProblemVisual`, `components/sections/ProblemVisuals.tsx`), escolhida
 * pelo INDICE (nunca pelo titulo). Layout interno do corpo do card varia em
 * 2 padroes, por indice: cards horizontais (1 e 4 — "Poucas avaliações" e
 * "Respostas ausentes") colocam icone+titulo+descricao numa coluna a
 * esquerda e o visual a direita a partir de `lg` (empilhado no mobile);
 * os demais (0, 2, 3) mantem a coluna vertical original com o visual
 * ancorado embaixo via `mt-auto`. Nenhum span do Bento mudou.
 */
export function ProblemSection() {
  const problemCount = problems.length;

  return (
    <Section variant="elevated" className="relative isolate overflow-hidden">
      {/*
        Atmosfera local (ETAPA 6) — camada decorativa unica, atras de todo o
        conteudo real (`-z-10`), composta so por CSS/gradientes/SVG.
        Estatica nesta etapa (nenhuma animacao). Mascarada verticalmente
        (`PROBLEM_ATMOSPHERE_FADE`) para dissolver antes das bordas
        superior/inferior — o fundo infinito global continua sendo a base,
        esta camada so acrescenta um acento local atras do cabecalho.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: PROBLEM_ATMOSPHERE_FADE,
          WebkitMaskImage: PROBLEM_ATMOSPHERE_FADE,
        }}
      >
        {/* 1. Radial azul concentrado no topo direito — atras da linha editorial. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 52% at 85% 6%, rgba(8,102,255,0.15), rgba(8,102,255,0.05) 42%, transparent 72%)",
          }}
        />

        {/* 2. Grid tecnico localizado — celula menor no mobile, 48-72px no desktop. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage: PROBLEM_GRID_IMAGE,
            backgroundSize: "38px 38px",
            maskImage: PROBLEM_GRID_MASK,
            WebkitMaskImage: PROBLEM_GRID_MASK,
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: PROBLEM_GRID_IMAGE,
            backgroundSize: "60px 60px",
            maskImage: PROBLEM_GRID_MASK,
            WebkitMaskImage: PROBLEM_GRID_MASK,
          }}
        />

        {/* 3. Pequeno acento violeta — bem mais discreto que o azul, regiao distante do titulo. */}
        <div
          className="absolute top-1/3 right-0 h-52 w-52 -translate-y-1/4 translate-x-1/3 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.09), transparent 70%)",
          }}
        />

        {/* 3b. AJUSTE MOBILE — campo lilas no canto OPOSTO ao azul (inferior
            esquerdo). CORRECAO FINAL MOBILE (recuperar o preto) — tamanho/
            alpha reduzidos (h-72 alpha 0.32 -> h-52 alpha 0.2), luz de
            canto real, nao mais quase metade da secao. */}
        <div
          className="absolute bottom-0 left-0 h-52 w-52 -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl md:hidden"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
          }}
        />

        {/* 4. Circuito decorativo externo — atras do cabecalho, sem tocar o titulo. */}
        <ProblemCircuit />
      </div>

      <Container className="relative z-10 flex flex-col items-center">
        {/*
          ETAPA 9 (secao 4) — cabecalho animado em sequencia (linha editorial
          → titulo → descricao), em vez de um unico ScrollReveal cobrindo o
          bloco inteiro (que revelava tudo de uma vez so). O wrapper externo
          (nao-animado) preserva exatamente o mesmo layout de antes (flex-col,
          gap-6, largura maxima) — so a animacao foi dividida em 3 passos;
          cada ScrollReveal aqui usa um `className` minimo (ou nenhum) para
          nao alterar a caixa do proprio h2/p, so adiciona o wrapper motion.
          `direction="left"` preservado nos 3 passos — mesma entrada lateral
          exclusiva do mobile que ja existia (ScrollReveal ignora a prop em
          telas >=768px), agora em sequencia com pequenos atrasos (~0.08s)
          em vez de simultanea.
        */}
        <div className="flex w-full max-w-[1120px] flex-col items-start gap-6 text-left">
          <ScrollReveal
            variant="fade-up"
            direction="left"
            className="flex w-full flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="text-label text-primary shrink-0 font-semibold tracking-wide whitespace-nowrap uppercase">
              Sinais de alerta
            </span>
            <span
              aria-hidden="true"
              className="s360-glow-blue via-primary/60 h-px min-w-6 flex-1 bg-gradient-to-r from-transparent to-transparent"
            />
            <span className="border-primary/40 bg-accent text-accent-foreground inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium whitespace-nowrap sm:px-4 sm:py-2 sm:text-[0.875rem]">
              <span
                aria-hidden="true"
                className="bg-primary s360-glow-blue h-1.5 w-1.5 shrink-0 rounded-full"
              />
              {problemCount} pontos críticos
            </span>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" direction="left" delay={0.08}>
            <h2 className="max-w-[840px] text-[clamp(2.75rem,6vw,5.125rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance">
              Seu perfil pode estar afastando clientes sem você perceber.
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" direction="left" delay={0.16}>
            <p className="text-muted-foreground max-w-[680px] text-[1rem] leading-relaxed text-balance sm:text-[1.125rem] lg:text-[1.3125rem]">
              Alguns pontos parecem pequenos, mas influenciam diretamente a
              decisão de quem pesquisa por você.
            </p>
          </ScrollReveal>
        </div>

        {/*
          Cada card com seu proprio ScrollReveal (em vez de um unico
          wrapper para a grade inteira) — cada card entra como uma unidade
          so no mobile. ETAPA 10 (padronizacao do fade lateral): a
          alternancia direita/esquerda por indice (`index % 2 === 0 ?
          "right" : "left"`, pedida na ETAPA 9) foi substituida por
          `direction="left"` fixo em todos os 5 cards — todas as caixas da
          landing agora entram da esquerda para a direita no mobile, sem
          excecao. `delay={index * 0.08}` preservado (stagger real: o Bento
          se forma em ordem 01→02→03→04→05), tanto no mobile (onde cada
          card ainda entra como uma unidade so, faixa/icone/texto/visual
          juntos — so a microvisualizacao interna tem sequencia propria,
          ver ProblemVisuals.tsx, intocado) quanto no desktop (fade-up
          puro, sem lateral, ja que `direction` so tem efeito <768px).
          Grid/spans/ordem continuam identicos (ver comentario no array
          `problems` acima).
        */}
        <div className="relative z-10 mt-16 grid w-full grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map(
            ({ icon: Icon, title, description, span }, index) => {
              const number = String(index + 1).padStart(2, "0");
              const isPrimary = index === 0;
              const isHorizontal = index === 1 || index === 4;
              const isCompact = index === 2 || index === 3;

              const iconEl = (
                <div className="border-primary/25 bg-accent relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border">
                  <Icon className="text-primary h-[19px] w-[19px]" />
                  <span
                    aria-hidden="true"
                    className="bg-purple-luminous absolute -top-1 -right-1 h-2 w-2 rounded-full"
                  />
                </div>
              );

              const textEl = (
                <div className="flex flex-col gap-2">
                  <p
                    className={cn(
                      "font-semibold text-balance",
                      titleSizeClass(index),
                    )}
                  >
                    {title}
                  </p>
                  <p className="text-small text-muted-foreground">
                    {description}
                  </p>
                </div>
              );

              return (
                <ScrollReveal
                  key={title}
                  variant="fade-up"
                  delay={index * 0.08}
                  direction="left"
                  mobileDistance={28}
                  className={cn(
                    "group relative flex flex-col gap-6 overflow-hidden rounded-[22px] border p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 lg:p-7",
                    isPrimary
                      ? "border-[rgba(8,102,255,0.4)] bg-[linear-gradient(160deg,rgba(12,22,42,0.95)_0%,rgba(8,12,20,0.97)_55%,rgba(6,8,13,0.98)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_1px_0_0_0_rgba(103,140,255,0.14),0_0_0_1px_rgba(8,102,255,0.14),0_28px_64px_-26px_rgba(8,102,255,0.38)] hover:border-[rgba(8,102,255,0.55)]"
                      : "border-[rgba(103,140,255,0.16)] bg-[linear-gradient(165deg,rgba(20,22,29,0.9)_0%,rgba(11,13,18,0.96)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_14px_32px_-18px_rgba(0,0,0,0.5)] hover:border-primary/35",
                    span,
                  )}
                >
                  {/* Iluminacao interna do card 1 — proxima ao canto superior esquerdo (onde a microvisualizacao comeca), atras de todo o conteudo. */}
                  {isPrimary && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10"
                      style={{
                        background:
                          "radial-gradient(circle at 14% 8%, rgba(8,102,255,0.16), transparent 55%)",
                      }}
                    />
                  )}

                  {/*
                    Marcas de canto — "conexao com o sistema", so a partir de
                    `lg` (geometria assimetrica do Bento so existe dali pra
                    cima). Substituem o antigo ponto solto no canto do icone
                    pelo mesmo papel, agora ancorado ao card inteiro.
                  */}
                  <span
                    aria-hidden="true"
                    className="border-primary/25 pointer-events-none absolute top-4 right-4 hidden h-3 w-3 border-t border-r lg:block"
                  />
                  <span
                    aria-hidden="true"
                    className="bg-primary/40 pointer-events-none absolute -top-1 -right-1 hidden h-1.5 w-1.5 rounded-full lg:block"
                  />

                  {/* Faixa superior — numero dinamico, trilho fino, status "ATENÇÃO". */}
                  <div className="flex items-center gap-3">
                    <span className="text-primary shrink-0 font-mono text-[0.75rem] font-semibold tracking-wide">
                      {number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="from-primary/30 h-px min-w-0 flex-1 bg-gradient-to-r to-transparent"
                    />
                    <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.12em] uppercase">
                      <span
                        aria-hidden="true"
                        className="bg-purple-luminous h-1 w-1 rounded-full"
                      />
                      Atenção
                    </span>
                  </div>

                  {isHorizontal ? (
                    // Cards horizontais (02 e 05): texto numa coluna a
                    // esquerda, visual a direita a partir de `lg` (empilhado,
                    // texto primeiro, no mobile/tablet). Sem `flex-1` no
                    // wrapper: um item `flex-col` com `flex-basis:0%` dentro
                    // de um card de altura "hug" (sem altura fixa) fazia o
                    // Chromium subdimensionar o container e cortar ~150px do
                    // visual via `overflow-hidden` do card no mobile (bug
                    // real, confirmado por `scrollHeight` > `clientHeight`).
                    // Coluna de texto `flex-1 min-w-0` (em vez de
                    // `max-w-[300px] shrink-0`): no card 02, que e mais
                    // estreito (metade da largura em `lg`), a combinacao
                    // antiga (300px texto + gap + visual fixo) nao cabia em
                    // 1024px (overflow horizontal real de ~124px, confirmado
                    // por `scrollWidth`); com a coluna flexivel o texto
                    // encolhe/quebra em vez de transbordar, em qualquer
                    // largura de `lg` pra cima. Largura do visual diferente
                    // por card (180-240px no 02, 240-340px no 05 — faixas
                    // pedidas na secao 11), o card 05 e a largura toda.
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-6">
                      <div className="flex min-w-0 flex-col gap-4 lg:flex-1">
                        {iconEl}
                        {textEl}
                      </div>
                      <ProblemVisual
                        index={index}
                        className={cn(
                          "h-[150px] w-full shrink-0 lg:h-[150px]",
                          index === 4 ? "lg:w-[300px]" : "lg:w-[190px]",
                        )}
                      />
                    </div>
                  ) : isPrimary ? (
                    // Card 01 (ETAPA 8B, ponto 1): o card herda a altura
                    // combinada das linhas 1+2 do bento (ver comentario no
                    // array `problems`) — bem mais alto que o proprio
                    // conteudo dele. Em vez de icone+texto no topo e visual
                    // ancorado embaixo (`mt-auto`), deixando um unico vao
                    // vazio entre os dois, o grupo inteiro (icone, texto e
                    // visual) fica dentro de um `flex-1` centralizado
                    // verticalmente: o espaco excedente se distribui de
                    // forma simetrica acima do icone e abaixo do visual,
                    // lendo como respiro proposital em vez de vazio
                    // desalinhado. O visual em si tambem cresceu (170-205px
                    // → 175-240px) para reduzir a distancia entre texto e
                    // visual dentro do grupo.
                    <div className="flex flex-1 flex-col justify-center gap-6">
                      {iconEl}
                      {textEl}
                      <ProblemVisual
                        index={index}
                        highlighted
                        className="h-[175px] w-full sm:h-[185px] lg:h-[240px]"
                      />
                    </div>
                  ) : (
                    // Cards verticais (03, 04): fluxo original, visual
                    // ancorado embaixo via `mt-auto`.
                    <>
                      {iconEl}
                      {textEl}
                      <ProblemVisual
                        index={index}
                        compact={isCompact}
                        className="mt-auto h-[140px] w-full lg:h-[145px]"
                      />
                    </>
                  )}
                </ScrollReveal>
              );
            },
          )}
        </div>

        <ScrollReveal
          variant="fade-up"
          delay={0.15}
          direction="left"
          mobileDistance={28}
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
