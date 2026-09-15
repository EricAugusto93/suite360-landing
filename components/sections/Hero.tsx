import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { WhatsAppLinkButton } from "@/components/ui/WhatsAppLinkButton";
import { buildSpecialistMessage, isWhatsAppConfigured } from "@/lib/whatsapp";
import { HeroVisual } from "./HeroVisual";

/**
 * Headline atualizada a pedido explicito do usuario (variacao de copy
 * "Autoridade + curiosidade"), substituindo a headline anterior do PDF do
 * Playbook. Dividida em partes (cor) para gerar enfase visual: concatenar
 * HEADLINE_PRE + HEADLINE_EMPHASIS + HEADLINE_MID + HEADLINE_PUNCH
 * reproduz a frase completa, char a char — a divisao so existe para poder
 * colorir "perdendo clientes" em azul e a segunda oracao em branco, sem
 * duplicar o texto em dois lugares.
 */
const HEADLINE_PRE = "Sua empresa pode estar ";
const HEADLINE_EMPHASIS = "perdendo clientes";
const HEADLINE_MID = " no Google — ";
const HEADLINE_PUNCH = "e você talvez nem saiba por quê.";

const SUBHEADLINE =
  "Descubra, através de um diagnóstico profissional e gratuito, o que pode estar limitando o potencial do seu Perfil da Empresa no Google.";

export function Hero() {
  // FASE 12: sem WhatsApp configurado, o CTA secundario e omitido em vez
  // de aparecer desabilitado com uma legenda "disponivel em breve" — evita
  // expor um roteiro de lancamento ao visitante (instrucao da fase, secoes
  // 46/47). O CTA principal (diagnostico) continua sendo o unico caminho
  // visivel, o que e honesto: nao ha nada quebrado, so uma opcao a menos
  // por enquanto. Ver PLANEJAMENTO.md, secao 14.12.
  const whatsappConfigured = isWhatsAppConfigured();

  return (
    <Section className="relative flex min-h-[88svh] items-center overflow-hidden pt-24 pb-20 sm:pt-28">
      {/*
        Fundo do Hero: gradiente diagonal verde-azulado com duas pontas
        mais claras (pedido explicito do usuario, referencia visual em
        anexo) + preto no meio, grid tecnico por cima e um halo azul atras
        do radar. Duas camadas separadas (gradiente + grid) porque
        `.s360-grid-texture` define seu proprio `background-image` — se o
        gradiente fosse aplicado na MESMA div via `style`, o `background`
        inline sobrescreveria a imagem da grade (shorthand reseta tudo).
        SEM `-z-index` negativo: `Section` tem `position:relative` mas
        nenhum `z-index` proprio, entao NAO cria um novo contexto de
        empilhamento — um filho com z-index negativo "escapa" para o
        contexto do ancestral mais proximo que cria um, e acaba pintado
        ATRAS do proprio fundo solido da Section (bug real, confirmado por
        amostragem de pixel: o fundo aparecia sempre como #050505 puro,
        mesmo com o gradiente aplicado corretamente no computed style).
        A ordem no DOM (antes do Container) ja garante que fica atras do
        conteudo, sem precisar de z-index — mesmo padrao usado em
        FinalCTASection.tsx.

        Duas variantes por breakpoint (nunca a mesma no mobile e no
        desktop): no desktop o layout e texto-a-esquerda/radar-a-direita,
        entao um gradiente DIAGONAL com as "duas pontas" mais claras fica
        atras de conteudo com folga — a faixa escura central e larga o
        suficiente (16% a 60%) para cobrir toda a coluna de texto, nunca
        so uma faixa fina no meio (isso ja causou um problema real: o
        cinza do texto secundario foi calibrado para contraste sobre preto
        puro — mesmo um leve clareamento por baixo dele já derrubava a
        legibilidade quase a zero, mesmo com opacidade "sutil"). Tom
        deslocado para mais azulado (menos verde) a pedido do usuario. No
        mobile tudo empilha numa coluna estreita e centralizada — o
        gradiente diagonal colocaria o texto sobre a ponta mais clara,
        entao a versao mobile continua um gradiente vertical dedicado,
        escuro onde o texto fica (topo) e mais claro so perto do radar
        (embaixo, onde o layout empilhado o posiciona).
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(120deg, rgba(20,75,150,0.16) 0%, #050505 16%, #050505 60%, rgba(35,140,235,0.32) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #050505 45%, rgba(35,140,235,0.18) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="s360-grid-texture pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 h-[44rem] w-[44rem] translate-x-1/4 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--s360-glow-blue), transparent 70%)",
        }}
      />

      {/*
        AJUSTE MOBILE (fundo azul e lilas mais visivel) — o Hero nao tinha
        NENHUMA presenca lilas antes desta correcao (so o gradiente vertical
        azul acima e o glow azul a direita). Acento lilas exclusivo mobile
        (`lg:hidden` — nao existe no gradiente diagonal do desktop, que fica
        inalterado), ancorado no canto inferior esquerdo, fora da coluna de
        texto central (preserva a legibilidade do H1/subheadline, que ja
        teve um problema real de contraste documentado nesta secao). Reforca
        o campo continuo global (AmbientBackground.tsx) exatamente na regiao
        onde ele comeca (~4% do topo da pagina), completando a leitura
        "azul em cima/direita, lilas embaixo/esquerda" logo na primeira tela.

        CORRECAO FINAL MOBILE (recuperar o preto) — tamanho/alpha reduzidos
        (h-80 alpha 0.38 -> h-60 alpha 0.22), consistente com o recalibre
        aplicado nas demais secoes.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl lg:hidden"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
        }}
      />
      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col gap-7 text-center lg:text-left">
          {/*
            Sem ScrollReveal de propósito: este H1 é o candidato mais
            provável a LCP da página. Animar sua entrada via Motion faz o
            HTML do servidor renderizar `opacity:0` inline (estado inicial
            do Framer) — em conexões lentas ou se o JS demorar/falhar, o
            maior elemento de conteúdo ficaria invisível até a hidratação.
            Renderizado direto, sem essa dependência. Ver PLANEJAMENTO.md,
            seção 14.10.
          */}
          <h1 className="text-display font-semibold tracking-tight text-balance">
            <span className="text-muted-foreground">{HEADLINE_PRE}</span>
            <span className="text-primary-hover">{HEADLINE_EMPHASIS}</span>
            <span className="text-muted-foreground">{HEADLINE_MID}</span>
            <span className="text-foreground">{HEADLINE_PUNCH}</span>
          </h1>

          <ScrollReveal
            trigger="mount"
            delay={0.08}
            direction="right"
            mobileDistance={28}
          >
            <p className="text-h4 text-muted-foreground mx-auto max-w-xl font-normal text-balance lg:mx-0">
              {SUBHEADLINE}
            </p>
          </ScrollReveal>

          <ScrollReveal
            trigger="mount"
            delay={0.16}
            direction="right"
            mobileDistance={28}
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
              <TrackedCtaLink
                href="#diagnostico"
                source="hero"
                destination="diagnostic"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Quero meu diagnóstico gratuito
              </TrackedCtaLink>

              {whatsappConfigured && (
                <WhatsAppLinkButton
                  message={buildSpecialistMessage()}
                  source="hero"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Falar com um especialista
                </WhatsAppLinkButton>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal
            trigger="mount"
            delay={0.22}
            direction="right"
            mobileDistance={28}
          >
            <div className="text-caption text-muted-foreground flex flex-col items-center gap-x-5 gap-y-1.5 sm:flex-row lg:items-start lg:justify-start">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-primary" />
                Diagnóstico gratuito
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-primary" />
                Sem compromisso
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/*
          No mobile o radar deve ser o ULTIMO elemento do Hero a entrar
          (depois do texto e dos CTAs acima) — pedido explicito do usuario.
          `mobileDelay` sobrescreve so o atraso mobile (0.42s, apos o ultimo
          bloco de texto a 0.22s + sua propria transicao); `variant="scale"`
          e `delay={0.12}` continuam exatamente como antes para desktop, que
          nunca le `direction`/`mobileDelay`.
        */}
        <ScrollReveal
          trigger="mount"
          variant="scale"
          delay={0.12}
          direction="right"
          mobileDistance={24}
          mobileDelay={0.42}
        >
          <HeroVisual />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
