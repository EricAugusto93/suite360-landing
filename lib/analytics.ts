import { isValidGtmId } from "./env";
import type { DiagnosticStepId } from "./types";

export type CtaSource = "header" | "hero" | "final_cta" | "not_found";
export type CtaDestination = "diagnostic" | "home";
export type WhatsAppSource = "hero" | "final_cta" | "floating" | "diagnostic";

/**
 * Taxonomia de eventos (FASE 11, secao 7): poucos eventos + propriedades,
 * em vez de um nome por botao. Cada chave e o nome real do evento
 * (snake_case, enviado como esta para o dataLayer); o tipo do valor e o
 * formato de propriedades permitido para aquele evento (`undefined` quando
 * o evento nao aceita nenhuma).
 */
type EventParamsMap = {
  cta_click: { source: CtaSource; destination: CtaDestination };
  whatsapp_click: { source: WhatsAppSource };
  diagnostic_start: undefined;
  diagnostic_step_complete: { step: DiagnosticStepId };
  diagnostic_complete: undefined;
};

export type AnalyticsEventName = keyof EventParamsMap;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Unico ponto de leitura de `NEXT_PUBLIC_GTM_ID`. Variavel publica por
 * natureza (id de container GTM, nao um segredo) — ver FASE 11, secao 44.
 * Validado (FASE 12): um valor presente mas mal formatado (ex.: erro de
 * digitacao) e tratado como "nao configurado", em vez de gerar um
 * `<script src="...id=...">` quebrado silenciosamente.
 */
export function getGtmId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GTM_ID;
  if (!raw || !isValidGtmId(raw)) return undefined;
  return raw;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(getGtmId());
}

/**
 * Camada central de eventos (FASE 11). Nenhum componente deve chamar
 * `window.dataLayer.push`/`gtag` diretamente — todos passam por aqui, o
 * unico lugar que sabe que a integracao e GTM. Tipada por design: o nome
 * do evento e suas propriedades sao validados em tempo de compilacao via
 * `EventParamsMap`, entao nao existe `trackEvent("qualquer-string", {...})`
 * solto pelo projeto.
 *
 * Sem `NEXT_PUBLIC_GTM_ID` configurado, e um no-op seguro (alem do log em
 * dev) — nunca lanca excecao, nunca bloqueia a experiencia (secao 26).
 *
 * Deliberadamente NAO importa `sendGTMEvent` de `@next/third-parties/google`
 * aqui: esse pacote marca seus modulos como Client Component ("use client"),
 * e este arquivo tambem e usado por Server Components (`app/layout.tsx`,
 * via `isAnalyticsConfigured`/`getGtmId`) para decidir se renderiza
 * `<GoogleTagManager>`. Import-lo aqui acoplaria esse limite sem
 * necessidade. `window.dataLayer.push(...)` e o mesmo contrato publico que
 * `sendGTMEvent` usa por baixo — replica-lo em 2 linhas mantem este
 * arquivo isomorfo (seguro em Server e Client Components). Ver
 * PLANEJAMENTO.md, secao 14.11.
 */
export function trackEvent<E extends AnalyticsEventName>(
  name: E,
  ...args: EventParamsMap[E] extends undefined
    ? []
    : [params: EventParamsMap[E]]
): void {
  const params = args[0];

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, params ?? {});
  }

  if (!isAnalyticsConfigured() || typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  } catch {
    // Uma falha de analytics nunca pode quebrar a experiencia (secao 26).
  }
}
