"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { buildSpecialistMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Glifo do WhatsApp (fone-em-balao) desenhado em SVG proprio — lucide-react
 * nao tem o icone oficial da marca. Uso do glifo para linkar diretamente
 * para uma conversa real no WhatsApp (nao para simular ser o app oficial)
 * e uma pratica padrao de mercado para botoes "fale no WhatsApp", aceita
 * pelas diretrizes de marca da Meta para esse caso de uso especifico.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.02 4C9.4 4 4 9.4 4 16.02c0 2.12.56 4.13 1.53 5.87L4 28l6.28-1.5a11.96 11.96 0 005.74 1.46h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 9.4 22.65 4 16.02 4zm0 21.9h-.01a9.9 9.9 0 01-5.05-1.38l-.36-.21-3.76.9.9-3.66-.24-.38a9.87 9.87 0 01-1.53-5.25c0-5.48 4.46-9.94 9.96-9.94 2.66 0 5.15 1.04 7.03 2.92a9.86 9.86 0 012.9 7.02c0 5.48-4.46 9.98-9.94 9.98zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

/**
 * Botao flutuante discreto para visitantes de alta intencao que nao
 * querem preencher o diagnostico. Nao aparece se o WhatsApp nao estiver
 * configurado (nenhum "botao morto" — PLANEJAMENTO.md, secao 9).
 *
 * Some discretamente quando o rodape entra na tela (evita sobrepor os
 * links do Footer) — unica logica de visibilidade implementada, por ser
 * simples e robusta com um unico IntersectionObserver.
 */
export function WhatsAppFloatingButton() {
  const [hiddenByFooter, setHiddenByFooter] = useState(false);
  const url = buildWhatsAppUrl(buildSpecialistMessage());

  useEffect(() => {
    if (!url) return;
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) =>
      setHiddenByFooter(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [url]);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      aria-hidden={hiddenByFooter}
      tabIndex={hiddenByFooter ? -1 : 0}
      onClick={() => trackEvent("whatsapp_click", { source: "floating" })}
      className={cn(
        "bg-primary text-primary-foreground shadow-elevated focus-visible:ring-primary focus-visible:ring-offset-background fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full transition-[opacity,transform] duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:right-6",
        hiddenByFooter ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}
