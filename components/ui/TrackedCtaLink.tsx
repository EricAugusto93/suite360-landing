"use client";

import type { ReactNode } from "react";
import type { CtaDestination, CtaSource } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";
import { Button } from "./Button";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type TrackedCtaLinkProps = {
  href: string;
  source: CtaSource;
  destination: CtaDestination;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Link de CTA (ex.: `href="#diagnostico"`) que registra `cta_click` no
 * clique. Existe porque Server Components nao podem passar funcoes (como
 * `onClick`) como prop para componentes filhos — o handler fica
 * encapsulado AQUI DENTRO de um Client Component, para que secoes como
 * Hero/Header/FinalCTASection continuem Server Components, passando apenas
 * strings serializaveis (href, source, destination).
 *
 * `source`/`destination` sao tipados (`lib/analytics.ts`) em vez de um
 * `eventParams` livre — impossivel disparar um evento com propriedade
 * fora da taxonomia (FASE 11, secao 8).
 */
export function TrackedCtaLink({
  href,
  source,
  destination,
  children,
  variant = "primary",
  size = "md",
  className,
}: TrackedCtaLinkProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackEvent("cta_click", { source, destination })}
    >
      {children}
    </Button>
  );
}
