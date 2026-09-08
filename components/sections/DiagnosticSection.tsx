import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { DIAGNOSTIC_STEP_IDS } from "@/lib/types";

/**
 * Grid tecnico LOCAL desta secao (ETAPA 2) — mesmo principio visual do grid
 * da Metodologia (linhas finas azuladas + mascara radial localizada), mas
 * definido aqui do zero: nao importa `METHODOLOGY_GRID_IMAGE`/`_MASK` (sao
 * privados de `MethodologySection.tsx`) para nao criar acoplamento indevido
 * entre secoes independentes. Mascara deslocada para o canto superior
 * direito (onde o circuito decorativo tambem vive) — mais visivel ali,
 * dissolvendo em direcao ao resto da secao, sem nunca formar um retangulo.
 *
 * ETAPA 3 reaproveita a MESMA textura de linhas (`DIAGNOSTIC_GRID_IMAGE`)
 * para o grid interno do console — e so o padrao de linhas, sem logica
 * nenhuma; a mascara interna (`CONSOLE_GRID_MASK`, mais abaixo) e propria,
 * deslocada para a borda direita do painel, uma composicao diferente da
 * externa.
 */
const DIAGNOSTIC_GRID_IMAGE =
  "linear-gradient(rgba(70,130,220,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,220,0.06) 1px, transparent 1px)";
const DIAGNOSTIC_GRID_MASK =
  "radial-gradient(ellipse 70% 60% at 88% 4%, black 0%, black 30%, transparent 72%)";

/**
 * Mascara do grid INTERNO do console (ETAPA 3) — deslocada para a borda
 * direita do painel (nao o canto superior da secao inteira, como a
 * externa), dissolvendo em direcao ao centro/esquerda, onde vivem as
 * perguntas e opcoes do wizard. Composicao propria, distinta da mascara
 * externa (`DIAGNOSTIC_GRID_MASK`).
 */
const CONSOLE_GRID_MASK =
  "radial-gradient(ellipse 60% 85% at 100% 45%, black 0%, black 22%, transparent 68%)";

/**
 * Composicao abstrata de circuito (ETAPA 2, secao 11) — versao EXTERNA e
 * discreta, atras do cabecalho: 3 nos conectados por linhas finas, um deles
 * com um pequeno acento violeta (nunca o azul sozinho, para ecoar o acento
 * roxo ja usado no glow de fundo). Estatica (sem animacao) nesta etapa — o
 * circuito interno do console sera tratado numa etapa futura. SVG simples,
 * nenhuma lib nova.
 */
function DiagnosticCircuit() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 220"
      className="pointer-events-none absolute top-0 right-0 hidden h-[220px] w-[320px] opacity-[0.35] sm:block"
    >
      <path
        d="M180 20 L260 20 L260 70 L300 70"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M260 70 L260 130 L215 130 L215 170"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <circle cx="180" cy="20" r="3" fill="var(--s360-primary)" opacity="0.7" />
      <circle cx="260" cy="70" r="3.5" fill="var(--s360-primary)" opacity="0.8" />
      <circle cx="215" cy="170" r="3" fill="#8b5cf6" opacity="0.65" />
    </svg>
  );
}

/**
 * Circuito INTERNO do console (ETAPA 3, secao 5) — vive na borda direita do
 * proprio painel, "parte do mesmo sistema" do circuito externo mas com uma
 * composicao diferente (nao uma copia): tracado vertical (nao um bloco
 * fixo no canto), 3 segmentos angulares, 4 nos (3 azuis + 1 violeta) com
 * opacidade decrescente de cima para baixo — o "desaparecimento gradual"
 * pedido, sem depender de mascara adicional. `preserveAspectRatio="none"`
 * porque o painel muda de altura entre etapas (formulario de estado vs.
 * grid de segmento, por exemplo); um traçado abstrato esticar verticalmente
 * nao compromete a leitura (nao e um icone com proporcao fixa a preservar).
 */
function ConsoleCircuit() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[140px] opacity-[0.3] sm:block"
    >
      <path
        d="M140 40 L90 40 L90 110 L120 140"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M120 140 L120 230 L80 260"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.32"
      />
      <path
        d="M80 260 L80 330"
        stroke="var(--s360-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.16"
      />
      <circle cx="90" cy="40" r="3" fill="var(--s360-primary)" opacity="0.6" />
      <circle cx="120" cy="140" r="3.5" fill="var(--s360-primary)" opacity="0.7" />
      <circle cx="80" cy="260" r="3" fill="#8b5cf6" opacity="0.5" />
      <circle cx="80" cy="330" r="2.5" fill="var(--s360-primary)" opacity="0.28" />
    </svg>
  );
}

/**
 * Moldura tipo "janela de produto" ao redor do diagnóstico — pedido
 * explicito do usuario, para que a experiência pareça uma demonstração
 * interativa real, não um formulário solto no centro da página. Não altera
 * nenhuma lógica do wizard, só a moldura em volta.
 *
 * ETAPA 2 — cabecalho reformulado (eyebrow "DIAGNÓSTICO GRATUITO" + régua +
 * pill dinâmico de etapas) e atmosfera externa (gradiente + grid técnico
 * localizado + glow azul + acento violeta + circuito decorativo). Nada
 * disso foi alterado na Etapa 3 (secao 2 do pedido: cabecalho aprovado,
 * preservado pixel-a-pixel).
 *
 * ETAPA 3 — a antiga barra de "3 pontos de janela" virou um console
 * analitico: barra superior com indicadores de sistema + label "ANÁLISE
 * GUIADA" (esquerda) e "SEU NEGÓCIO, COM MAIS DIREÇÃO" (direita, oculto
 * abaixo de `sm`), superficie com gradiente/borda/sombra proprios (em vez
 * do antigo `bg-card`/`border-border` chapados) e uma atmosfera interna
 * propria (grid muito discreto + radial azul + acento violeta + circuito
 * na borda direita) — tudo via classes/arbitrary values do Tailwind (nao
 * via prop `style`, que `ScrollReveal` nao repassa) e SVG simples, sem nova
 * dependencia. `DIAGNOSTIC_STEP_IDS.length` (lib/types.ts) continua sendo a
 * fonte da quantidade de etapas do pill do cabecalho — nao mudou.
 */
export function DiagnosticSection() {
  const stepCount = DIAGNOSTIC_STEP_IDS.length;

  return (
    <Section
      id="diagnostico"
      variant="alt"
      className="relative isolate scroll-mt-20 overflow-hidden"
    >
      {/*
        Atmosfera externa (ETAPA 2) — camada decorativa unica, atras de todo
        o conteudo real (`-z-10`), composta so por CSS/gradientes/SVG.
        Estatica nesta etapa (nenhuma animacao): gradiente vertical quase
        preto, radial azul concentrado no topo direito, grid tecnico
        localizado (mascarado) e um acento violeta discreto — mesmo
        vocabulario visual da Metodologia, construido aqui do zero.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* 1. Base — gradiente vertical quase preto. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0a0d14 0%, #07090e 45%, #0a0f1a 78%, #07090e 100%)",
          }}
        />

        {/* 2. Radial azul concentrado no topo direito. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 88% 0%, rgba(8,102,255,0.16), rgba(8,102,255,0.05) 40%, transparent 72%)",
          }}
        />

        {/* 3. Grid tecnico localizado (mais visivel no topo direito, dissolve gradualmente). */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: DIAGNOSTIC_GRID_IMAGE,
            backgroundSize: "52px 52px",
            maskImage: DIAGNOSTIC_GRID_MASK,
            WebkitMaskImage: DIAGNOSTIC_GRID_MASK,
          }}
        />

        {/* 4. Pequeno acento violeta — bem mais discreto que o azul, apoia o no roxo do circuito. */}
        <div
          className="absolute top-1/4 right-0 h-56 w-56 -translate-y-1/3 translate-x-1/3 rounded-full opacity-70 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
          }}
        />

        {/* 5. Circuito decorativo externo — atras do cabecalho, sem interferir no painel. */}
        <DiagnosticCircuit />
      </div>

      <Container className="relative flex flex-col items-start gap-10">
        <ScrollReveal
          variant="fade-up"
          direction="right"
          mobileDistance={28}
          className="flex w-full max-w-[1120px] flex-col items-start gap-6 text-left"
        >
          {/* Linha editorial — eyebrow + régua + pill numa unica fileira, inclusive no mobile enquanto couber (quebra organizada em telas muito estreitas). */}
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-label text-primary shrink-0 font-semibold tracking-wide whitespace-nowrap uppercase">
              Diagnóstico gratuito
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
              {stepCount} etapas • resultado personalizado
            </span>
          </div>

          <h2 className="max-w-[800px] text-[clamp(2.75rem,6vw,5.125rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance">
            O primeiro passo é entender o cenário da sua empresa.
          </h2>

          <p className="text-muted-foreground max-w-[45rem] text-[1rem] leading-relaxed text-balance sm:text-[1.125rem] lg:text-[1.3125rem]">
            Gratuito, profissional e sem compromisso.
          </p>
        </ScrollReveal>

        {/*
          O painel inteiro (console + DiagnosticWizard) entra como UMA unica
          peca no mobile — nunca campo a campo (pedido explicito do usuario:
          animar cada campo deixaria o formulario "cansativo").

          ETAPA 3 — superficie do console reconstruida via arbitrary values
          do Tailwind (gradiente diagonal quase preto + borda azul-acinzentada
          + radius 26px + sombra em camadas com highlight interno), no lugar
          do antigo `bg-card`/`border-border`/`rounded-xl` chapados.
          `isolate` contem o `-z-10` da atmosfera interna dentro do proprio
          console, sem vazar para o resto da secao.
        */}
        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          direction="right"
          mobileDistance={32}
          className="relative isolate z-10 w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-[rgba(103,140,255,0.16)] bg-[linear-gradient(165deg,rgba(13,20,34,0.97)_0%,rgba(8,11,18,0.98)_55%,rgba(6,8,13,0.99)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_1px_0_0_0_rgba(103,140,255,0.1),0_30px_70px_-28px_rgba(0,0,0,0.65)] transition-colors duration-300 hover:border-primary/30"
        >
          {/*
            Atmosfera interna do console (ETAPA 3) — atras de todo o
            conteudo real (`-z-10`), contida pelo `isolate` do painel: grid
            tecnico muito discreto, radial azul concentrado do lado direito,
            um pequeno acento violeta perto da base, e o circuito interno
            (borda direita, opacidade decrescente). Nao cobre as opcoes
            (mascarada para a borda direita, dissolvendo em direcao ao
            centro/esquerda) e nao anima nesta etapa.
          */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: DIAGNOSTIC_GRID_IMAGE,
                backgroundSize: "44px 44px",
                maskImage: CONSOLE_GRID_MASK,
                WebkitMaskImage: CONSOLE_GRID_MASK,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 55% 70% at 100% 45%, rgba(8,102,255,0.14), rgba(8,102,255,0.04) 45%, transparent 75%)",
              }}
            />
            <div
              className="absolute right-8 bottom-0 h-40 w-40 translate-y-1/3 rounded-full opacity-60 blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
              }}
            />
            <ConsoleCircuit />
          </div>

          {/*
            Barra superior — console analitico, nao mais uma janela
            generica. Esquerda: 3 indicadores de sistema (azul escuro / azul
            eletrico com glow / violeta) + label "ANÁLISE GUIADA". Direita:
            texto decorativo "SEU NEGÓCIO, COM MAIS DIREÇÃO", oculto abaixo
            de `sm` para nao congestionar em 320-390px. Inteira `aria-hidden`
            (decoracao de moldura, mesmo padrao da antiga barra de pontos) —
            a informacao real de progresso vive no `SegmentedProgress`
            abaixo, com sua propria semantica de `progressbar`.
          */}
          <div
            aria-hidden="true"
            className="flex items-center justify-between gap-4 border-b border-[rgba(103,140,255,0.14)] bg-[rgba(6,9,15,0.55)] px-5 py-4 sm:px-8"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#132038" }}
                />
                <span className="bg-primary s360-glow-blue h-2 w-2 rounded-full" />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#8b5cf6" }}
                />
              </div>
              <span className="text-muted-foreground truncate text-[0.7rem] font-semibold tracking-[0.09em] whitespace-nowrap uppercase sm:text-[0.75rem]">
                Análise guiada
              </span>
            </div>
            <span className="text-muted-foreground/60 hidden shrink-0 text-[0.7rem] font-medium tracking-[0.09em] whitespace-nowrap uppercase sm:block">
              Seu negócio, com mais direção
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-12">
            <DiagnosticWizard />
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
