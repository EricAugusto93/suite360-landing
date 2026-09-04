import { isValidSiteUrl } from "./env";

/**
 * URL de producao do site. Usada em metadata (canonical, Open Graph),
 * app/robots.ts e app/sitemap.ts. Dominio real da Suite360 Films ainda
 * nao definido — ver PLANEJAMENTO.md, secao 14, item 6. Configuravel via
 * NEXT_PUBLIC_SITE_URL (ver .env.example) sem precisar alterar codigo.
 *
 * Validado (FASE 12): um valor ausente OU mal formatado cai no mesmo
 * fallback seguro de desenvolvimento — sem essa validacao, um valor
 * configurado incorretamente (ex.: sem protocolo) quebraria `new
 * URL(siteUrl)` em app/layout.tsx e derrubaria a aplicacao inteira. Em
 * producao, avisa no log do servidor (nunca no cliente) quando o fallback
 * esta ativo, para o problema ficar visivel a quem opera o deploy.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const hasValidSiteUrl = Boolean(
  configuredSiteUrl && isValidSiteUrl(configuredSiteUrl),
);

if (process.env.NODE_ENV === "production" && !hasValidSiteUrl) {
  console.warn(
    "[site] NEXT_PUBLIC_SITE_URL ausente ou invalida em producao — usando " +
      "http://localhost:3000 como fallback. Configure o dominio real antes do lancamento.",
  );
}

export const siteUrl = (
  hasValidSiteUrl ? configuredSiteUrl! : "http://localhost:3000"
).replace(/\/+$/, "");
