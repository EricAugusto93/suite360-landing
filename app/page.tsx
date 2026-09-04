import { DiagnosticSection } from "@/components/sections/DiagnosticSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Hero } from "@/components/sections/Hero";
import { MethodologySection } from "@/components/sections/MethodologySection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { TestimonialWheel } from "@/components/sections/TestimonialWheel";
import type { Testimonial } from "@/lib/types";

// Preencher com depoimentos reais e autorizados por clientes quando
// existirem (nome, cargo/empresa, trecho da fala). Enquanto vazio,
// <TestimonialWheel> nao renderiza nada — nenhum depoimento fictício no
// site real. Testado com dados de exemplo (rotulos de "campo vazio",
// nunca texto que pudesse ser lido como depoimento real) e revertido para
// vazio antes de finalizar — mesma disciplina de todo o projeto (nunca
// deixar prova social fictícia no estado final). Ver PLANEJAMENTO.md,
// secao 14.17.
const testimonials: Testimonial[] = [];

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <DiagnosticSection />
      <MethodologySection />
      <ProcessSection />
      <SolutionSection />
      <SocialProofSection />
      <TestimonialWheel testimonials={testimonials} />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
