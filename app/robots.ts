import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Exigido pelo Next.js para `output: "export"` — sem parametros dinamicos
// aqui, entao nao muda nada no build normal (ja era estatico por padrao).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pagina interna de demonstracao do design system, sem valor para busca.
      disallow: "/dev/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
