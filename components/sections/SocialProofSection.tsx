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
    <Section variant="base">
      <Container className="flex flex-col items-center">
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

        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          direction="right"
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
