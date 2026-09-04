import { Quote, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import type { Testimonial } from "@/lib/types";

type TestimonialWheelProps = {
  testimonials: Testimonial[];
};

// Rotacao leve alternada por indice — o efeito de "roda"/leque pedido,
// nao uma grade reta. Volta a 0deg no hover (feedback discreto).
const CARD_ROTATIONS = [
  "-rotate-3",
  "rotate-2",
  "-rotate-2",
  "rotate-3",
  "-rotate-1",
  "rotate-1",
];

/**
 * "Roda" de depoimentos — pedido explicito do usuario (fora do fluxo de
 * fases), inspirada numa composicao vista no framer.com. Estruturado para
 * receber depoimentos REAIS e autorizados de clientes (nome, cargo/
 * empresa, trecho da fala) assim que existirem.
 *
 * Enquanto `testimonials` estiver vazio, a secao inteira nao renderiza —
 * mesmo padrao ja usado em Footer.tsx para links legais/dados
 * institucionais (arrays vazios ate existir conteudo real). Nenhum
 * depoimento fictício, nome inventado ou foto de banco de imagens e
 * mostrado no site real — a Suite360 Films nao tem depoimentos
 * autorizados ainda (mesma regra de honestidade de todas as fases
 * anteriores). Sem foto: um icone generico no lugar do avatar, nunca uma
 * foto de banco fingindo ser de um cliente real. Ver PLANEJAMENTO.md,
 * secao 14.17.
 */
export function TestimonialWheel({ testimonials }: TestimonialWheelProps) {
  if (testimonials.length === 0) return null;

  return (
    <Section variant="alt">
      <Container className="flex flex-col items-center">
        <ScrollReveal
          variant="fade-up"
          className="flex max-w-xl flex-col items-center gap-4 text-center"
        >
          <h2 className="text-h2 font-semibold tracking-tight text-balance">
            Veja o que nossos clientes acham.
          </h2>
        </ScrollReveal>

        <ScrollReveal
          variant="fade-up"
          delay={0.1}
          className="mt-16 flex w-full max-w-5xl flex-wrap items-start justify-center gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "border-border bg-card shadow-subtle flex w-64 flex-col gap-4 rounded-lg border p-6 transition-transform duration-200 hover:rotate-0 hover:-translate-y-1",
                CARD_ROTATIONS[index % CARD_ROTATIONS.length],
              )}
            >
              <Quote size={20} className="text-primary" aria-hidden="true" />
              <p className="text-small text-foreground">{testimonial.quote}</p>
              <div className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                >
                  <User size={16} />
                </span>
                <div className="flex flex-col">
                  <span className="text-small font-medium">
                    {testimonial.name}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </Container>
    </Section>
  );
}
