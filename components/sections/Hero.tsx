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
    <Section className="s360-grid-texture relative flex min-h-[88svh] items-center overflow-hidden pt-24 pb-20 sm:pt-28">
      {/*
        Fundo do Hero: preto profundo + grid tecnico quase imperceptivel
        (classe .s360-grid-texture no Section) + halo azul atras do
        HeroVisual + vinheta suave nas bordas (escurece os cantos para dar
        profundidade sem virar "um gradiente" perceptivel).
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[44rem] w-[44rem] translate-x-1/4 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--s360-glow-blue), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, #050505 100%)",
        }}
      />
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
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

          <ScrollReveal trigger="mount" delay={0.08}>
            <p className="text-h4 text-muted-foreground mx-auto max-w-xl font-normal text-balance lg:mx-0">
              {SUBHEADLINE}
            </p>
          </ScrollReveal>

          <ScrollReveal trigger="mount" delay={0.16}>
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

          <ScrollReveal trigger="mount" delay={0.22}>
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

        <ScrollReveal trigger="mount" variant="scale" delay={0.12}>
          <HeroVisual />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
