"use client";

import { Button } from "@/components/ui/Button";

type ConsentBannerProps = {
  onAccept: () => void;
  onReject: () => void;
};

/**
 * Banner de consentimento (FASE 11) — so e montado pelo `AnalyticsProvider`
 * quando ha um `NEXT_PUBLIC_GTM_ID` real configurado E o visitante ainda
 * nao escolheu (ver lib/consent.ts). Sem GTM configurado, este componente
 * nunca chega a renderizar — nao ha "banner de cookies" inutil quando o
 * site nao usa nenhum cookie nao essencial (secao 18).
 *
 * Uma unica categoria real (analytics via GTM) — nao ha motivo para criar
 * categorias artificiais (secao 22). Aceitar e Rejeitar tem o mesmo peso
 * visual (mesmo tamanho, variantes de contraste equivalente): nenhum dark
 * pattern (secao 19).
 */
export function ConsentBanner({ onAccept, onReject }: ConsentBannerProps) {
  return (
    <div
      role="region"
      aria-label="Consentimento de cookies"
      className="border-border bg-card shadow-elevated fixed inset-x-0 bottom-0 z-50 border-t p-4 sm:right-auto sm:bottom-4 sm:left-4 sm:max-w-sm sm:rounded-lg sm:border"
    >
      <div className="flex flex-col gap-3">
        <p className="text-small text-foreground">
          Usamos cookies para entender como os visitantes usam esta página. Você
          pode aceitar ou rejeitar.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReject}
            className="flex-1"
          >
            Rejeitar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAccept}
            className="flex-1"
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
