import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { NfcShowcase } from "./NfcShowcase";
import { OptimizationShowcase } from "./OptimizationShowcase";
import { ReportShowcase } from "./ReportShowcase";

/**
 * Hierarquia visual deliberada (instrucao da FASE 07, secao 10):
 * Otimizacao e NFC recebem tratamento editorial "aberto" (sem Card,
 *2 colunas) por serem os elementos 1 e 2; Relatorio e Manual, por serem
 * complementos de suporte (3 e 4), ficam em Cards compactos lado a lado.
 * O contraste entre os dois tratamentos e o que comunica a hierarquia,
 * em vez de dar o mesmo peso visual aos quatro.
 */
export function SolutionSection() {
  return (
    <Section variant="alt">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="text-label text-primary font-medium tracking-wide uppercase">
            A solução
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Otimização completa da presença no Google.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Quando o diagnóstico revela oportunidades reais, executamos as
            melhorias de forma estruturada — com o mesmo critério da nossa
            metodologia.
          </p>
        </ScrollReveal>

        {/* 1 — Otimização completa (elemento principal, tratamento "showcase"
            grande e empilhado — pedido do usuario, inspirado numa
            composicao do framer.com: titulo grande em cima, visual grande
            embaixo, em vez da divisao lado a lado usada antes). Titulo,
            descricao, etiquetas e painel ficam juntos em OptimizationShowcase
            (Client Component) so para compartilhar o estado de hover entre
            as etiquetas e os modulos destacados no painel. */}
        <OptimizationShowcase />

        {/* 2 — Display NFC (complemento premium) */}
        <ScrollReveal
          variant="fade-up"
          delay={0.2}
          className="mt-16 grid w-full max-w-4xl items-center gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-14"
        >
          <div className="lg:order-2 lg:text-left">
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <h3 className="text-h3 font-semibold text-balance">
                Display NFC de avaliações
              </h3>
              <p className="text-body text-muted-foreground text-balance">
                Um complemento físico premium: o cliente aproxima o celular e
                chega direto à etapa de avaliar sua empresa, sem precisar
                digitar nada.
              </p>
              <p className="text-small text-muted-foreground text-balance">
                Funciona lado a lado com a otimização do perfil — não a
                substitui, apenas facilita reunir novas avaliações reais.
              </p>
            </div>
          </div>

          <div className="lg:order-1">
            <NfcShowcase />
          </div>
        </ScrollReveal>

        {/* 3 e 4 — Relatório e Manual (complementos de suporte) */}
        <ScrollReveal
          variant="fade-up"
          delay={0.25}
          className="mt-16 max-w-md text-center sm:mt-20"
        >
          <p className="text-h4 font-medium text-balance">
            Junto com a otimização, você também recebe:
          </p>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.3}
          className="mt-8 grid w-full max-w-2xl grid-cols-1 items-start gap-4 sm:grid-cols-2"
        >
          <Card className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-h4 font-semibold">Relatório profissional</p>
              <p className="text-small text-muted-foreground">
                Documenta o cenário analisado e as melhorias executadas, com
                comparação de antes/depois sempre que houver dados reais para
                isso.
              </p>
            </div>
            <ReportShowcase />
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <div
              aria-hidden="true"
              className="border-primary/25 bg-accent relative mx-auto flex h-16 w-16 items-center justify-center rounded-lg border"
            >
              <BookOpen size={24} className="text-primary" />
              <span
                aria-hidden="true"
                className="bg-purple-luminous absolute -top-1 -right-1 h-2 w-2 rounded-full"
              />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <p className="text-h4 font-semibold">Manual de boas práticas</p>
              <p className="text-small text-muted-foreground">
                Orientações práticas para manter a qualidade do perfil no dia a
                dia, com autonomia — sem depender de nós para tudo.
              </p>
            </div>
          </Card>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
