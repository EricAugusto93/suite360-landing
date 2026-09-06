import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Logo } from "./Logo";

type LegalLink = { label: string; href: string };

// Adicionar aqui quando as paginas de Politica de Privacidade / Termos de Uso existirem.
const legalLinks: LegalLink[] = [];

type InstitutionalDetail = { label: string; value: string };

// Preencher quando CNPJ ou endereco oficiais da Suite360 forem fornecidos.
const institutionalDetails: InstitutionalDetail[] = [];

type ContactIconProps = { size?: number; className?: string };

/**
 * `lucide-react` removeu os icones de marca (Instagram incluso) das
 * versoes atuais — nao ha `Instagram` exportado. Glifo generico de
 * "camera/app" (quadrado arredondado + lente + flash), no mesmo traco
 * (`currentColor`, strokeWidth 2) dos icones Lucide ao lado, para nao
 * destoar visualmente — mesma logica ja usada no projeto para o "G" do
 * Google (representacao neutra, nao o logo oficial da marca).
 */
function InstagramGlyphIcon({ size = 24, className }: ContactIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

type ContactDetail = {
  Icon: (props: ContactIconProps) => React.ReactNode;
  /** So para contexto de leitores de tela (o icone e aria-hidden) — nunca aparece como link. */
  label: string;
  value: string;
};

// Telefone/Instagram/site informados pelo usuario — exibidos como TEXTO
// informativo, de proposito sem <a>/tel:/mailto: (instrucao explicita: nao
// criar links nem direcionar para paginas externas).
const CONTACT_DETAILS: ContactDetail[] = [
  { Icon: Phone, label: "Telefone", value: "(41) 99111-1965" },
  { Icon: InstagramGlyphIcon, label: "Instagram", value: "@suite360films" },
  { Icon: Mail, label: "Site", value: "suite360films.com.br" },
];

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

        {/*
          Contato institucional — apenas texto informativo (pedido
          explicito: sem <a>, sem tel:/mailto:, sem apontar Instagram/site
          para fora do site). Coluna unica no mobile; no desktop os itens
          se distribuem lado a lado com `flex-wrap`, ocupando a largura
          disponivel de forma equilibrada sem forcar 3 colunas rigidas.
        */}
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
          {CONTACT_DETAILS.map(({ Icon, label, value }) => (
            <li
              key={label}
              className="text-small text-muted-foreground flex items-center gap-2.5"
            >
              <span aria-hidden="true" className="text-primary shrink-0">
                <Icon size={16} />
              </span>
              <span>
                <span className="sr-only">{label}: </span>
                {value}
              </span>
            </li>
          ))}
        </ul>

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
