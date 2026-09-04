"use client";

import { useSyncExternalStore } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { getGtmId, isAnalyticsConfigured } from "@/lib/analytics";
import {
  getStoredConsent,
  storeConsent,
  subscribeConsent,
} from "@/lib/consent";
import { ConsentBanner } from "./ConsentBanner";

/**
 * No servidor nunca ha uma escolha conhecida (a escolha so existe no
 * `localStorage` do navegador do visitante, por design — secao 23).
 * `null` tambem e o valor correto no primeiro paint do cliente, antes de
 * `useSyncExternalStore` conseguir ler o valor real — evita qualquer
 * mismatch de hidratacao sem precisar de um `useEffect`/estado "hydrated".
 */
function getServerSnapshot(): null {
  return null;
}

/**
 * Componente isolado (FASE 11, secao 15) — `app/layout.tsx` continua
 * Server Component, so renderiza `<AnalyticsProvider />` como mais um
 * filho (mesmo padrao do `WhatsAppFloatingButton`).
 *
 * Sem `NEXT_PUBLIC_GTM_ID` configurado: nao renderiza absolutamente nada
 * (nem banner, nem script) — secao 13/18.
 *
 * Com `NEXT_PUBLIC_GTM_ID` configurado: o container GTM (`<GoogleTagManager>`,
 * de `@next/third-parties/google` — mecanismo oficial do Next para scripts
 * de terceiros, secao 16) so e montado DEPOIS que o visitante aceita no
 * `ConsentBanner`. Rejeitar nunca carrega o script. A escolha fica em
 * `localStorage` (lib/consent.ts) — nunca dados do diagnostico.
 */
export function AnalyticsProvider() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getStoredConsent,
    getServerSnapshot,
  );

  if (!isAnalyticsConfigured()) return null;
  const gtmId = getGtmId();
  if (!gtmId) return null;

  return (
    <>
      {consent === "granted" && <GoogleTagManager gtmId={gtmId} />}
      {consent === null && (
        <ConsentBanner
          onAccept={() => storeConsent("granted")}
          onReject={() => storeConsent("denied")}
        />
      )}
    </>
  );
}
