import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

// Categorias de evidencia futura (PLANEJAMENTO.md, secao 4 / instrucao da
// FASE 08) — rotulos apenas, nao provas reais. Nenhum numero, nome de
// cliente, estrela ou logo e mostrado: nao existem ainda, e a instrucao
// da fase e explicita em nao fabricar nada disso.
const EVIDENCE_CATEGORIES = [
  "Perfil otimizado",
  "Relatório de entrega",
  "Display NFC",
  "Depoimento autorizado",
];

/**
 * Sem ativos reais ainda (fotos, relatorios, depoimentos), esta secao e
 * deliberadamente curta e textual — uma composicao editorial, em vez de
 * uma grade de cards vazios/placeholder tentando parecer prova real
 * (instrucao da fase, secoes 4 e 5).
 *
 * Copy revisada na FASE 12: a versao anterior dizia explicitamente "a
 * medida que os primeiros trabalhos forem concluidos e autorizados... este
 * espaco vai reunir evidencias" — uma frase de pipeline interno (preview do
 * que ainda nao existe), que soa como site inacabado para um visitante real
 * (instrucao da fase, secoes 46/47: "nao prometa conteudo futuro"). A nova
 * versao descreve o PADRAO de evidencia (o que conta como prova aqui),
 * sem prometer uma entrega futura — mesma honestidade, sem a linguagem de
 * "ainda nao temos". Ver PLANEJAMENTO.md, secao 14.12.
 */
export function SocialProofSection() {
  return (
    // ETAPA 5 — `overflow-hidden` adicionado (mesma razao documentada em
    // ProcessSection.tsx): a correcao real do fade lateral mobile fez os
    // `ScrollReveal` desta secao passarem a deslocar conteudo de verdade;
    // sem ancestral com `overflow-hidden`, isso podia extrapolar a
    // viewport durante o estado oculto/em transicao.
    <Section variant="base" className="relative isolate overflow-hidden">
      {/*
        AJUSTE MOBILE (correcao visual efetiva) — secao sem nenhuma camada
        decorativa local. CORRECAO FINAL MOBILE (recuperar o preto) —
        tamanho/alpha do canto lilas reduzidos (h-72 alpha 0.32 -> h-52
        alpha 0.2), azul topo-direita tambem reduzido, para esta virar uma
        "area localizada de cor" (pedido explicito), nao um preenchimento
        de secao inteira.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 md:hidden"
      >
        <div
          className="absolute top-0 right-0 h-48 w-48 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--s360-ambient-blue-soft), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 h-52 w-52 -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
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
            Evidências
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Trabalho que pode ser visto, não apenas prometido.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Cada entrega gera evidência concreta — o perfil otimizado, o
            relatório de acompanhamento, o display físico em uso. Preferimos
            mostrar isso a empilhar estrelas, depoimentos genéricos ou números
            sem contexto.
          </p>
        </ScrollReveal>

        {/*
          ETAPA 10 (padronizacao do fade lateral) — `direction` trocado de
          "right" para "left": a lista de badges (uma unica unidade — cada
          badge nao anima individualmente) entra da esquerda para a
          direita agora. O bloco de texto (eyebrow/titulo/descricao) acima
          mantem seu `direction="right"` original — fora do escopo desta
          etapa (que pediu explicitamente so "o bloco/lista de
          evidencias", identificado pela propria instrucao de nao animar
          cada badge — ou seja, esta lista).
        */}
        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          direction="left"
          mobileDistance={28}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {EVIDENCE_CATEGORIES.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </ScrollReveal>
      </Container>
    </Section>
  );
}
