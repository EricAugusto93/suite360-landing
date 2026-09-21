import type { NextConfig } from "next";

/**
 * Export estatico para publicacao em https://suite360films.com/Google
 * (hospedagem HostGator/cPanel, fora da Vercel) — SOMENTE quando
 * `STATIC_EXPORT=true` for passado ao `next build`. Sem essa flag, o build
 * (usado pela Vercel e pelo `next dev` local) continua exatamente como
 * antes: sem `output: "export"`, sem `basePath`, imagens otimizadas
 * normalmente. Isso e proposital — gravar essas opcoes incondicionalmente
 * quebraria a implantacao atual na Vercel (que serve a raiz do dominio
 * `suite360-landing.vercel.app`, sem nenhum prefixo de path).
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
// Mesma fonte de verdade usada por `lib/basePath.ts` (componentes Client
// que montam `src` de imagem manualmente, ja que `images.unoptimized`
// pula o prefixamento automatico do `next/image` — ver esse arquivo).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
