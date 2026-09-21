import type { Metadata } from "next";
import { BackHomeLink } from "@/components/ui/BackHomeLink";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Página não encontrada — Suite360 Films",
  robots: { index: false, follow: false },
};

/**
 * Substitui a pagina de 404 generica do Next.js por uma versao minima
 * com a mesma linguagem visual do resto do site (FASE 10) — Header/Footer
 * ja vem do RootLayout automaticamente.
 */
export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="text-label text-muted-foreground font-medium tracking-wide uppercase">
        Erro 404
      </span>
      <h1 className="text-h1 font-semibold text-balance">
        Essa página não existe.
      </h1>
      <p className="text-body text-muted-foreground max-w-sm text-balance">
        O endereço pode ter mudado ou nunca ter existido. Volte para a página
        inicial para continuar.
      </p>
      <BackHomeLink />
    </Container>
  );
}
