import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

/**
 * Moldura tipo "janela de produto" ao redor do diagnóstico — pedido
 * explicito do usuario, para que a experiência pareça uma demonstração
 * interativa real, não um formulário solto no centro da página. Barra
 * superior com os mesmos "pontos de janela" já usados nos showcases da
 * Solução (mesma linguagem visual, reaproveitada). Gradiente radial azul
 * extremamente sutil no fundo da seção (o mesmo halo do Hero, em escala
 * bem menor) — não altera nenhuma lógica do wizard, só a moldura em volta.
 */
export function DiagnosticSection() {
  return (
    <Section
      id="diagnostico"
      variant="alt"
      className="relative scroll-mt-20 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,var(--s360-glow-blue),transparent_70%)] opacity-60 blur-3xl" />

      <Container className="relative flex flex-col items-center gap-10">
        <ScrollReveal
          variant="fade-up"
          direction="right"
          mobileDistance={28}
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="text-label text-primary font-medium tracking-wide uppercase">
            Diagnóstico Google 360
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            O primeiro passo é entender o cenário da sua empresa.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Gratuito, profissional e sem compromisso.
          </p>
        </ScrollReveal>

        {/*
          O painel inteiro (barra de janela + DiagnosticWizard) entra como
          UMA unica peca no mobile — nunca campo a campo (pedido explicito
          do usuario: animar cada campo deixaria o formulario "cansativo").
        */}
        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          direction="right"
          mobileDistance={32}
          className="border-border bg-card shadow-elevated w-full max-w-2xl overflow-hidden rounded-xl border hover:border-primary/25 transition-colors duration-300"
        >
          <div
            aria-hidden="true"
            className="border-border bg-muted flex items-center gap-1.5 border-b px-5 py-3"
          >
            <span className="bg-border h-2.5 w-2.5 rounded-full" />
            <span className="bg-border h-2.5 w-2.5 rounded-full" />
            <span className="bg-border h-2.5 w-2.5 rounded-full" />
          </div>
          <div className="p-6 sm:p-10">
            <DiagnosticWizard />
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
