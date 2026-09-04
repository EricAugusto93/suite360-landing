import { Images, MapPin, MessageSquare, Star, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { WhatsAppLinkButton } from "@/components/ui/WhatsAppLinkButton";
import { buildSpecialistMessage, isWhatsAppConfigured } from "@/lib/whatsapp";

// Mesmas 5 dimensoes do HeroVisual/ProblemSection — reaparecem aqui em
// escala minima, so como elemento grafico "relacionado ao diagnostico"
// fechando a narrativa visual (pedido do usuario, secao 7 da instrucao).
const DIAGNOSTIC_DIMENSIONS = [MapPin, Star, Tag, Images, MessageSquare];

/**
 * Fecha a narrativa devolvendo o visitante ao mecanismo principal
 * (#diagnostico) — sem repetir as 5 etapas aqui (instrucao da FASE 09,
 * secao 15). Visual simples e de alto contraste, sem mockups/cards.
 *
 * FASE 12: sem WhatsApp configurado, o CTA secundario e omitido (nao
 * aparece desabilitado com "disponivel em breve") — mesma decisao do
 * Hero, ver PLANEJAMENTO.md, secao 14.12.
 *
 * `variant="elevated"` — encerramento visual de alto impacto, a superficie
 * mais clara da escada de pretos (mesma usada pelo painel da Metodologia),
 * com o brilho azul+roxo pedido explicitamente para o CTA final funcionar
 * como um "bloco amplo" que fecha a narrativa. Nenhum componente filho
 * precisou mudar: os tokens semanticos (texto, botoes) ja resolvem para os
 * valores escuros em toda a pagina.
 */
export function FinalCTASection() {
  const whatsappConfigured = isWhatsAppConfigured();

  return (
    <Section variant="elevated" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--s360-glow-blue),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,var(--s360-glow-purple),transparent_70%)] blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <ScrollReveal
          variant="fade-up"
          className="flex items-center gap-3"
        >
          {DIAGNOSTIC_DIMENSIONS.map((Icon, index) => (
            <span
              key={index}
              className="border-primary/20 bg-card flex h-9 w-9 items-center justify-center rounded-lg border"
            >
              <Icon size={15} className="text-primary" aria-hidden="true" />
            </span>
          ))}
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.05}
          className="flex max-w-2xl flex-col items-center gap-4"
        >
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Quero descobrir como está a minha empresa no Google.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Leva menos de um minuto, é gratuito e não cria nenhum compromisso.
          </p>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          <TrackedCtaLink
            href="#diagnostico"
            source="final_cta"
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
              source="final_cta"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Falar com um especialista
            </WhatsAppLinkButton>
          )}
        </ScrollReveal>
      </Container>
    </Section>
  );
}
