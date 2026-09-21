"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Usado só por `app/not-found.tsx`. `Button`/`TrackedCtaLink` renderizam
 * um `<a href>` puro (nunca `next/link`) — correto para os outros CTAs do
 * site, que só usam âncoras (`#diagnostico`, relativas à própria página,
 * nunca afetadas por `basePath`). Mas o "voltar para a página inicial"
 * usa `href="/"` (caminho absoluto da raiz): com `basePath` configurado
 * (export estático para `/Google`, ver `next.config.ts`), um `<a href="/">`
 * cru iria para a raiz real do domínio (fora da landing), não para
 * `/Google/`. `next/link` resolve `href="/"` com o `basePath` automaticamente
 * — por isso este componente existe só para reproduzir a MESMA aparência e
 * o MESMO evento de analytics do `TrackedCtaLink` (`cta_click`, `source:
 * "not_found"`, `destination: "home"`), com um `<Link>` em vez de `<a>`.
 * Classes copiadas literalmente de `Button` (`variant="primary" size="lg"`)
 * — nenhuma mudança visual.
 */
export function BackHomeLink() {
  return (
    <Link
      href="/"
      onClick={() => trackEvent("cta_click", { source: "not_found", destination: "home" })}
      className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98] h-12 px-8 text-body mt-2"
    >
      Voltar para a página inicial
    </Link>
  );
}
