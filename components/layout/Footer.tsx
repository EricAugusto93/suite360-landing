import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Logo } from "./Logo";

type LegalLink = { label: string; href: string };

// Adicionar aqui quando as paginas de Politica de Privacidade / Termos de Uso existirem.
const legalLinks: LegalLink[] = [];

type InstitutionalDetail = { label: string; value: string };

// Preencher quando CNPJ, endereco, telefone ou e-mail oficiais da Suite360 forem fornecidos.
const institutionalDetails: InstitutionalDetail[] = [];

/**
 * Estrutura pronta para receber links legais e dados institucionais reais
 * (arrays acima). Enquanto vazios, as respectivas secoes simplesmente nao
 * renderizam — nenhuma informacao e inventada (PLANEJAMENTO.md, secao 14).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <Container className="flex flex-col gap-8 py-16">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-small text-muted-foreground max-w-sm">
            Presença e desempenho local no Google.
          </p>
        </div>

        {institutionalDetails.length > 0 && (
          <dl className="text-small text-muted-foreground flex flex-col gap-1">
            {institutionalDetails.map((detail) => (
              <div key={detail.label} className="flex gap-2">
                <dt className="text-foreground font-medium">{detail.label}:</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Divider />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted-foreground">
            © {year} Suite360 Films. Todos os direitos reservados.
          </p>

          {legalLinks.length > 0 && (
            <nav aria-label="Links legais">
              <ul className="flex gap-4">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-caption text-muted-foreground hover:text-foreground focus-visible:ring-primary focus-visible:ring-offset-background underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Container>
    </footer>
  );
}
