import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Exigido pelo Next.js para `output: "export"` — sem parametros dinamicos
// aqui, entao nao muda nada no build normal (ja era estatico por padrao).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
