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
    // ETAPA 5 — `overflow-hidden` adicionado (mesma razao documentada em
    // ProcessSection.tsx): a correcao real do fade lateral mobile fez os
    // `ScrollReveal` desta secao passarem a deslocar conteudo de verdade;
    // sem ancestral com `overflow-hidden`, isso podia extrapolar a
    // viewport durante o estado oculto/em transicao.
    <Section variant="alt" className="relative isolate overflow-hidden">
      {/*
        AJUSTE MOBILE (correcao visual efetiva) — secao sem nenhuma camada
        decorativa local antes. Camada `-z-10` ancorada A ESTA SECAO.

        CORRECAO FINAL MOBILE (recuperar o preto) — havia DOIS campos lilas
        nesta secao: este, grande (h-[26rem]=416px, alpha 0.34), cobrindo
        praticamente a metade inferior inteira da secao, E um segundo
        dedicado especificamente ao grid Relatorio/Manual (mais abaixo, no
        proprio grid). Os dois se somavam exatamente onde o cliente pediu
        para ter lilas "ao lado" dos cards — resultado: bloco solido, nao
        luz localizada. Removido o campo lilas AQUI (nivel de secao); o
        halo dedicado ao grid (ver mais abaixo) passa a ser a UNICA fonte
        de lilas desta secao — mais preciso, sem duplicacao. So azul fica
        no nivel da secao (Otimizacao/NFC, topo).
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 md:hidden"
      >
        <div
          className="absolute top-0 right-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--s360-ambient-blue), transparent 70%)",
            opacity: 0.65,
          }}
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center">
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
          direction="left"
          mobileDistance={28}
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
          direction="left"
          mobileDistance={28}
          className="mt-16 max-w-md text-center sm:mt-20"
        >
          <p className="text-h4 font-medium text-balance">
            Junto com a otimização, você também recebe:
          </p>
        </ScrollReveal>

        {/*
          AJUSTE MOBILE — reforco dedicado, exclusivo mobile, so ao redor
          deste grid (Relatorio/Manual) especificamente: `relative isolate`
          proprio + halos azul (direita) e lilas (esquerda) ancorados a este
          `<div>`, nao a secao inteira. CORRECAO FINAL MOBILE — apos remover
          o halo lilas duplicado do nivel de secao (acima), este e agora a
          UNICA fonte de lilas da secao; tamanho/alpha reduzidos (h-64 alpha
          0.36 -> h-52 alpha 0.22) para ficar "luz no canto", nao um bloco
          cobrindo o grid inteiro.
        */}
        <div className="relative isolate mt-8 grid w-full max-w-2xl grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 md:hidden"
          >
            <div
              className="absolute top-0 right-0 h-44 w-44 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, var(--s360-ambient-blue-soft), transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 h-52 w-52 -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
              }}
            />
          </div>
          <ScrollReveal
            variant="fade-up"
            delay={0.3}
            direction="left"
            mobileDistance={28}
          >
            <Card className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1 text-center">
                <p className="text-h4 font-semibold">Relatório profissional</p>
                <p className="text-small text-muted-foreground">
                  Documenta o cenário analisado e as melhorias executadas, com
                  comparação de antes/depois sempre que houver dados reais
                  para isso.
                </p>
              </div>
              <ReportShowcase />
            </Card>
          </ScrollReveal>

          {/*
            ETAPA 10 (padronizacao do fade lateral) — `direction` trocado
            de "right" para "left": card Manual entra da esquerda para a
            direita agora, igual ao card Relatório ao lado (que ja usava
            "left" desde antes) — os dois cards desta secao usam a mesma
            direcao, sem alternancia.
          */}
          <ScrollReveal
            variant="fade-up"
            delay={0.3}
            direction="left"
            mobileDistance={28}
          >
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
                  Orientações práticas para manter a qualidade do perfil no
                  dia a dia, com autonomia — sem depender de nós para tudo.
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
