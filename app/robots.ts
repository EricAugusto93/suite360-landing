import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

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
