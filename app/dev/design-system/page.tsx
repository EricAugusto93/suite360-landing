import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Progress } from "@/components/ui/Progress";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Design System (dev) — Suite360 Films",
  robots: { index: false, follow: false },
};

const typographySamples = [
  {
    className: "text-display font-semibold",
    label: "display",
    sample: "Diagnóstico gratuito",
  },
  {
    className: "text-h1 font-semibold",
    label: "h1",
    sample: "Poucas empresas aproveitam o potencial do Google",
  },
  {
    className: "text-h2 font-semibold",
    label: "h2",
    sample: "Como analisamos sua empresa",
  },
  {
    className: "text-h3 font-semibold",
    label: "h3",
    sample: "O que acontece depois do diagnóstico",
  },
  {
    className: "text-h4 font-medium",
    label: "h4",
    sample: "Otimização completa",
  },
  {
    className: "text-body",
    label: "body",
    sample: "Texto de parágrafo padrão da landing page.",
  },
  {
    className: "text-small",
    label: "small",
    sample: "Texto de apoio, legendas e observações.",
  },
  {
    className: "text-caption",
    label: "caption",
    sample: "Texto auxiliar em badges e rodapés.",
  },
  {
    className: "text-label font-medium uppercase tracking-wide",
    label: "label",
    sample: "Rótulo de campo",
  },
];

const colorTokens = [
  { name: "background", classes: "bg-background border border-border" },
  { name: "foreground", classes: "bg-foreground" },
  { name: "muted", classes: "bg-muted border border-border" },
  { name: "muted-foreground", classes: "bg-muted-foreground" },
  { name: "border", classes: "bg-border" },
  { name: "primary", classes: "bg-primary" },
  {
    name: "primary-foreground",
    classes: "bg-primary-foreground border border-border",
  },
  { name: "accent", classes: "bg-accent border border-border" },
  { name: "accent-foreground", classes: "bg-accent-foreground" },
  { name: "card", classes: "bg-card border border-border" },
  { name: "danger", classes: "bg-danger" },
];

export default function DesignSystemDevPage() {
  // FASE 10: alem do noindex, a rota retorna 404 real em producao — nao
  // basta impedir indexacao, alguem ainda poderia acessar a URL direto.
  // `next dev` sempre roda com NODE_ENV=development, entao isso nao afeta
  // o ambiente local (ver PLANEJAMENTO.md, secao 14.10).
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    // Sem <main> proprio: o RootLayout ja fornece o landmark <main> da pagina.
    <div>
      <div className="border-border bg-accent border-b">
        <Container className="py-3">
          <p className="text-small text-accent-foreground font-medium">
            Página interna de desenvolvimento — demonstra o design system (FASE
            02). Não faz parte da landing page final da Suite360 Films.
          </p>
        </Container>
      </div>

      <Section>
        <Container className="flex flex-col gap-16">
          <header className="flex flex-col gap-2">
            <h1 className="text-display font-semibold">
              Design System — Suite360
            </h1>
            <p className="text-body text-muted-foreground">
              Tokens e componentes de UI base criados na FASE 02. Cores e
              tipografia são provisórias até a identidade visual oficial ser
              definida.
            </p>
          </header>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Tipografia</h2>
            <div className="flex flex-col gap-4">
              {typographySamples.map((item) => (
                <div
                  key={item.label}
                  className="border-border flex flex-col gap-1 border-b pb-4"
                >
                  <span className="text-caption text-muted-foreground tracking-wide uppercase">
                    {item.label}
                  </span>
                  <p className={item.className}>{item.sample}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Cores</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {colorTokens.map((token) => (
                <div key={token.name} className="flex flex-col gap-2">
                  <div className={`h-16 w-full rounded-md ${token.classes}`} />
                  <span className="text-small text-muted-foreground">
                    {token.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Sombras e radius</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="border-border bg-card text-small flex h-20 items-center justify-center rounded-sm border">
                radius-sm
              </div>
              <div className="border-border bg-card text-small flex h-20 items-center justify-center rounded-md border">
                radius-md
              </div>
              <div className="border-border bg-card text-small flex h-20 items-center justify-center rounded-lg border">
                radius-lg
              </div>
              <div className="border-border bg-card text-small flex h-20 items-center justify-center rounded-xl border">
                radius-xl
              </div>
              <div className="bg-card text-small shadow-subtle flex h-20 items-center justify-center rounded-md">
                shadow-subtle
              </div>
              <div className="bg-card text-small shadow-medium flex h-20 items-center justify-center rounded-md">
                shadow-medium
              </div>
              <div className="bg-card text-small shadow-elevated flex h-20 items-center justify-center rounded-md">
                shadow-elevated
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Button</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button href="#" variant="primary">
                  Como link (href) <ArrowRight size={16} />
                </Button>
                <IconButton
                  icon={<X size={18} />}
                  aria-label="Fechar"
                  variant="outline"
                />
                <IconButton
                  icon={<ArrowRight size={18} />}
                  aria-label="Avançar"
                  variant="solid"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Card</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <p className="text-body">
                  Card base, sem conteúdo específico de produto ainda.
                </p>
              </Card>
              <Card className="shadow-medium p-6">
                <p className="text-body">
                  Card com shadow-medium para estados de destaque.
                </p>
              </Card>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Input</h2>
            <div className="grid max-w-md gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-city">Cidade</Label>
                <Input id="demo-city" placeholder="Ex: Curitiba" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-company">Nome da empresa</Label>
                <Input
                  id="demo-company"
                  placeholder="Ex: Barbearia Central"
                  error="Campo obrigatório."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-disabled">Campo desabilitado</Label>
                <Input id="demo-disabled" placeholder="Indisponível" disabled />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Badge</h2>
            <div className="flex flex-wrap gap-3">
              <Badge variant="neutral">Diagnóstico gratuito</Badge>
              <Badge variant="accent">Sem compromisso</Badge>
              <Badge variant="outline">Etapa 1 de 5</Badge>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Progress</h2>
            <div className="flex max-w-md flex-col gap-4">
              <Progress value={20} label="Etapa 1 de 5" />
              <Progress value={60} label="Etapa 3 de 5" />
              <Progress value={100} label="Etapa 5 de 5" />
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">Divider</h2>
            <Divider />
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-h2 font-semibold">
              ScrollReveal (role para baixo)
            </h2>
            <div className="flex flex-col gap-24 pb-24">
              <ScrollReveal variant="fade-up">
                <Card className="p-8">
                  <p className="text-body">
                    fade-up — role a página para ver esta animação.
                  </p>
                </Card>
              </ScrollReveal>
              <ScrollReveal variant="fade">
                <Card className="p-8">
                  <p className="text-body">fade</p>
                </Card>
              </ScrollReveal>
              <ScrollReveal variant="scale">
                <Card className="p-8">
                  <p className="text-body">scale</p>
                </Card>
              </ScrollReveal>
            </div>
          </section>
        </Container>
      </Section>
    </div>
  );
}
