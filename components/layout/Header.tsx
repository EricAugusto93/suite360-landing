"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TrackedCtaLink } from "@/components/ui/TrackedCtaLink";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

/**
 * Header global: marca + um unico CTA contextual. Continua apontando para
 * #diagnostico (instrucao da FASE 09, secao 10) — o diagnostico segue
 * sendo o caminho principal, mesmo agora que o WhatsApp pode estar
 * disponivel via outros CTAs.
 *
 * Fundo inicialmente transparente (sobre o Hero, sempre claro); ao rolar,
 * ganha fundo translucido + blur + borda inferior — pedido explicito.
 * Deteccao de scroll via `IntersectionObserver` observando um sentinela
 * de 1px no topo da pagina (app/layout.tsx), nao um listener de scroll
 * (mais leve, sem recalculo a cada frame). Vira Client Component so por
 * causa desse estado — o resto do Header continua simples.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("header-scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-border/60 bg-background/70 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Logo />
        <TrackedCtaLink
          href="#diagnostico"
          source="header"
          destination="diagnostic"
          variant="primary"
          size="sm"
        >
          <span className="hidden sm:inline">Diagnóstico gratuito</span>
          <span className="sm:hidden">Diagnóstico</span>
        </TrackedCtaLink>
      </Container>
    </header>
  );
}
