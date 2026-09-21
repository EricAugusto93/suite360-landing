import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/*
 * Geist como fonte-base provisória: variável, performática via next/font (self-hosted),
 * sensação tecnológica/premium compatível com a direção visual do playbook.
 * Trocar quando a tipografia oficial da marca for definida (PLANEJAMENTO.md, secoes 6 e 14).
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Espelha --s360-background de app/globals.css (experiencia majoritariamente dark).
  themeColor: "#050505",
};

// Revisada na FASE 10: menciona analise/otimizacao (nao so "presenca"),
// mantendo marca + Perfil da Empresa no Google + diagnostico gratuito,
// sem prometer ranking e sem keyword stuffing.
const description =
  "Suite360 Films — análise e otimização do Perfil da Empresa no Google. Diagnóstico gratuito e sem compromisso.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Suite360 Films",
  description,
  // `siteUrl` absoluto (nao "/") de proposito: "/" resolvido contra
  // `metadataBase` sempre "reseta" para a raiz do host (regra de resolucao
  // de URL relativa), ignorando qualquer path do proprio `metadataBase` —
  // inofensivo enquanto o site vive na raiz do dominio (Vercel), mas
  // produziria um canonical ERRADO (raiz do dominio, nao a landing) no
  // export estatico publicado em `/Google` (ver next.config.ts). Usar
  // `siteUrl` direto funciona corretamente nos dois cenarios.
  alternates: {
    canonical: siteUrl,
  },
  // Favicon/apple-touch-icon agora vem dos arquivos de convencao do App
  // Router (app/icon.png, app/apple-icon.png — gerados a partir da logo
  // oficial). Um campo `icons` explicito aqui SUBSTITUIRIA esses arquivos
  // (comportamento documentado do Next.js), entao o campo foi removido de
  // proposito — antes ele existia so como um data URI vazio para evitar um
  // 404 de `/favicon.ico`, enquanto nao havia nenhum icone quadrado oficial.
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Suite360 Films",
    title: "Suite360 Films",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Suite360 Films",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * JSON-LD minimo e 100% factual (FASE 10): so nome e URL, os unicos dados
 * que ja temos com certeza. `Organization` foi deliberadamente descartado
 * por exigir campos que nao temos ainda (logo, endereco, redes sociais) —
 * ver PLANEJAMENTO.md, secao 14.10.
 */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Suite360 Films",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} antialiased`}>
      <body className="relative flex min-h-screen flex-col">
        {/*
          "Fundo infinito" — camada ambiental unica atras de TODA a pagina
          (ver AmbientBackground.tsx), em vez de cada Section pintar seu
          proprio retangulo solido (o que criava faixas horizontais visiveis
          entre secoes vizinhas). Primeiro filho do <body> (que precisa de
          `relative` para este `absolute inset-0` se esticar corretamente
          por toda a altura real da pagina, nao so a primeira tela) —
          renderizado antes do Header/main/Footer para ficar atras deles na
          ordem de empilhamento padrao (sem precisar de z-index negativo).
        */}
        <AmbientBackground />

        {/*
          Sentinela observada pelo Header (IntersectionObserver) para saber
          se a pagina ainda esta no topo — o Header comeca transparente e
          ganha fundo/blur assim que este elemento sai da viewport. Mais
          leve que um listener de scroll (sem recalculo a cada frame).
        */}
        <div
          id="header-scroll-sentinel"
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-px w-px"
        />

        {/*
          Sem JavaScript, o Motion nunca hidrata e qualquer conteudo dentro
          de <ScrollReveal> ficaria preso no estado inicial (opacity:0),
          renderizado assim no HTML do servidor. Esta regra forca esse
          conteudo a ficar visivel quando JS esta desabilitado — ver
          components/ui/ScrollReveal.tsx e PLANEJAMENTO.md, secao 14.10.
        */}
        <noscript>
          <style>{`.motion-reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
