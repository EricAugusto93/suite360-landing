import { AccordionItem } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

type FaqItem = {
  question: string;
  answer: string;
};

// As 4 objecoes obrigatorias (PLANEJAMENTO.md, secao 5 / instrucao da
// FASE 08). Respostas honestas: reconhecem o que e verdade (o cliente
// pode editar o proprio perfil), recusam a garantia de ranking, explicam
// o motivo do diagnostico gratuito sem falar em "captura de leads", e nao
// inventam modelo de mensalidade que nao foi definido no briefing.
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Eu mesmo consigo editar meu perfil?",
    answer:
      "Sim, você mesmo consegue editar o seu Perfil da Empresa no Google — o acesso é seu. A diferença está na análise, no critério e na execução: avaliamos o conjunto com a mesma metodologia usada no diagnóstico, estruturamos as mudanças e cuidamos da consistência de tudo, em vez de ajustes pontuais e isolados.",
  },
  {
    question: "Isso garante primeiro lugar?",
    answer:
      "Não. Nenhuma agência pode garantir uma posição específica no Google — o posicionamento depende de diversos fatores, muitos deles fora do nosso controle. O que fazemos é melhorar a estrutura, a completude e o aproveitamento do seu perfil, aumentando as chances de uma presença mais forte.",
  },
  {
    question: "Por que o diagnóstico é gratuito?",
    answer:
      "Porque é a etapa inicial para entender o cenário da sua empresa e identificar possíveis oportunidades, antes de qualquer conversa. É assim que decidimos, junto com você, se existe uma oportunidade real de trabalho.",
  },
  {
    question: "Vou precisar contratar mensalmente?",
    answer:
      "O diagnóstico não cria nenhum compromisso. Caso exista uma proposta de trabalho, o formato é apresentado com clareza antes de qualquer contratação.",
  },
];

export function FAQSection() {
  return (
    <Section variant="alt">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <span className="text-label text-primary font-medium tracking-wide uppercase">
            Perguntas frequentes
          </span>
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Dúvidas comuns antes de começar.
          </h2>
          <p className="text-body text-muted-foreground text-balance">
            Respostas diretas, sem letras miúdas.
          </p>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          className="border-border bg-card mt-14 w-full max-w-3xl rounded-xl border sm:mt-20"
        >
          <div className="divide-border divide-y px-6 sm:px-8">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.question} question={item.question}>
                {item.answer}
              </AccordionItem>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
