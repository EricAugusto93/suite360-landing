import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  highlight?: boolean;
};

// Fluxo preservado do briefing (recebemos -> analisamos -> apontamos ->
// conversamos -> se fizer sentido, otimizacao). A etapa 5 e destacada
// (circulo preenchido) por ser a ponte para a futura secao de Solucao.
const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Recebemos os dados",
    description: "As informações do seu diagnóstico chegam até a nossa equipe.",
  },
  {
    number: "02",
    title: "Analisamos o cenário",
    description:
      "Avaliamos o Perfil da Empresa com os mesmos critérios da nossa metodologia.",
  },
  {
    number: "03",
    title: "Apontamos oportunidades",
    description: "Identificamos pontos específicos que podem ser melhorados.",
  },
  {
    number: "04",
    title: "Conversamos com você",
    description:
      "Compartilhamos o que encontramos e tiramos dúvidas, sem compromisso.",
  },
  {
    number: "05",
    title: "Apresentamos a otimização, se fizer sentido",
    description:
      "Quando existe uma oportunidade real, mostramos como seria a execução profissional das melhorias.",
    highlight: true,
  },
];

export function ProcessSection() {
  return (
    // ETAPA 5 — `overflow-hidden` adicionado: a correcao real do fade
    // lateral mobile (ver lib/useIsMobileViewport.ts/ScrollReveal.tsx)
    // fez os `ScrollReveal` desta secao (que ja usavam `direction` antes,
    // mas nunca de fato deslocavam nada por causa do bug) passarem a
    // deslocar conteudo de verdade — sem uma ancestral com `overflow-
    // hidden` (ProblemSection/DiagnosticSection ja tinham; esta nao
    // tinha), o deslocamento lateral podia extrapolar a viewport durante
    // o estado oculto/em transicao, causando um overflow horizontal real
    // (~4px, confirmado via `scrollWidth` antes desta correcao).
    <Section variant="base" className="relative isolate overflow-hidden">
      {/*
        AJUSTE MOBILE (correcao visual efetiva) — esta secao nao tinha
        NENHUMA camada decorativa local antes; dependia inteiramente do
        campo continuo global. Camada `-z-10` propria, ancorada A ESTA
        SECAO (nao a altura total da pagina) — o halo acompanha exatamente
        esta regiao de conteudo. Os cards (`bg-card`, opaco) continuam com
        a mesma superficie de sempre — o lilas aparece ENTRE/AO REDOR
        deles, nunca "atraves" do card.

        CORRECAO FINAL MOBILE (recuperar o preto) — a versao anterior tinha
        DOIS campos lilas grandes (h-80 e h-96, alpha 0.32/0.36) cobrindo o
        lado esquerdo do topo ao rodape da secao inteira, sem sobrar preto
        real entre os cards 03/04/05 pedidos como prioridade. Reduzido a UM
        unico campo lilas, menor (h-64), alpha mais baixo (0.32 -> 0.2),
        centralizado na altura media da timeline (onde ficam os cards
        03/04/05) — luz que nasce a esquerda e dissolve no preto acima/
        abaixo dela, com os cards 01/02 (topo) e boa parte do card 05
        (fim) voltando a ficar sobre fundo predominantemente preto.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 md:hidden"
      >
        <div
          className="absolute top-0 right-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--s360-ambient-blue), transparent 70%)",
            opacity: 0.7,
          }}
        />
        {/* Reposicionado (42% -> 62%) e a TRANSLACAO corrigida: usava
            `-translate-x-1/3 -translate-y-1/2` (deslocamento de 1/3 e 1/2
            do proprio tamanho), bem mais agressivo que o padrao de "canto"
            usado no resto do projeto (`-translate-x-1/4`, ver o azul logo
            acima) — isso empurrava a MAIOR parte do circulo para fora da
            viewport em 390px, sobrando so a borda mais fraca do gradiente
            radial visivel, quase imperceptivel. Corrigido para 1/4 (mesmo
            padrao), mantendo mais do nucleo do gradiente dentro da tela. */}
        <div
          className="absolute top-[62%] left-0 h-80 w-80 -translate-x-1/4 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.32), transparent 70%)",
          }}
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          direction="right"
          mobileDistance={28}
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="text-label text-primary font-medium tracking-wide uppercase">
            Depois do diagnóstico
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            O que acontece depois do diagnóstico.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Sem contratação automática. Primeiro a análise, depois uma conversa
            — e só então, se fizer sentido, uma proposta.
          </p>
        </ScrollReveal>

        {/*
          ETAPA 10 (padronizacao do fade lateral) — `direction` trocado de
          "right" para "left" nos 5 itens da timeline: entram da esquerda
          para a direita agora, como todas as outras caixas da landing
          (antes entravam pela direita). O cabecalho da secao logo acima
          mantem seu `direction="right"` original — fora do escopo desta
          etapa (que pediu explicitamente so os "cinco itens da timeline").
        */}
        <ol className="mt-14 flex w-full max-w-2xl list-none flex-col sm:mt-20">
          {PROCESS_STEPS.map((step, index) => (
            <ScrollReveal
              key={step.number}
              as="li"
              variant="fade-up"
              delay={0.08 + index * 0.06}
              amount={0.4}
              direction="left"
              mobileDistance={24}
              className="relative flex gap-5 pb-8 last:pb-0 sm:gap-7 sm:pb-10"
            >
              {index !== PROCESS_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-11 bottom-0 left-[1.375rem] w-px sm:top-12 sm:left-6"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--s360-primary), transparent)",
                  }}
                />
              ) : null}

              <div
                aria-hidden="true"
                className={cn(
                  "text-body relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-semibold sm:h-12 sm:w-12",
                  step.highlight
                    ? "border-primary bg-primary text-primary-foreground s360-glow-blue"
                    : "border-border bg-card-hover text-foreground",
                )}
              >
                {step.number}
              </div>

              <div className="border-border bg-card flex flex-1 flex-col gap-1.5 rounded-lg border px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-h4 font-semibold text-balance">
                  {step.title}
                </p>
                <p className="text-small text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
