"use client";

import type { ReactNode } from "react";
import type { WhatsAppSource } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "./Button";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type WhatsAppLinkButtonProps = {
  message: string;
  source: WhatsAppSource;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Unico componente que decide "abrir o WhatsApp de verdade" vs "numero
 * ainda nao configurado" (PLANEJAMENTO.md, secao 9) — usado por Hero,
 * ConfirmationStep, CTA final e botao flutuante, para nao duplicar esse
 * branching em cada lugar. Quando configurado, renderiza um link real
 * (`target="_blank"`) para `buildWhatsAppUrl(message)`; caso contrario,
 * um botao desabilitado (visualmente normal, sem link falso).
 *
 * `source` e obrigatorio e tipado (FASE 11): todo clique em um botao de
 * WhatsApp dispara `whatsapp_click`, sem excecao, e a mensagem completa do
 * WhatsApp nunca e enviada ao analytics — so a origem do clique.
 */
export function WhatsAppLinkButton({
  message,
  source,
  children,
  variant = "primary",
  size = "md",
  className,
}: WhatsAppLinkButtonProps) {
  const url = buildWhatsAppUrl(message);

  if (!url) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackEvent("whatsapp_click", { source })}
    >
      {children}
    </Button>
  );
}
