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
 *
 * FASE 15 — achado real medido via QA: a versao anterior era `inset-x-0
 * bottom-0` (ponta a ponta) so no mobile, cobrindo por completo o botao
 * flutuante do WhatsApp (tambem fixed/bottom, `WhatsAppFloatingButton.tsx`,
 * fora do escopo desta correcao) nessa faixa de tela. Unificado para o
 * mesmo cartao ancorado a esquerda ja usado em `sm:` (nunca span total),
 * com `right-24` reservando a coluna do botao flutuante (56px de largura +
 * 20px de offset da borda) mais um respiro de 20px — vale em qualquer
 * largura de viewport, ja que os dois elementos sao ancorados a mesma
 * borda direita da tela. A partir de `sm:`, `right-auto`+`max-w-sm`
 * reproduzem exatamente o comportamento original (o cartao compacto nunca
 * chegava perto do botao flutuante nessas larguras).
 */
export function ConsentBanner({ onAccept, onReject }: ConsentBannerProps) {
  return (
    <div
      role="region"
      aria-label="Consentimento de cookies"
      className="border-border bg-card shadow-elevated fixed right-24 bottom-4 left-4 z-50 rounded-lg border p-4 sm:right-auto sm:max-w-sm"
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
