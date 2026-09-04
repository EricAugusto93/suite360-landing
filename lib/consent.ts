export type ConsentChoice = "granted" | "denied";

const CONSENT_STORAGE_KEY = "s360_analytics_consent";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Permite que `AnalyticsProvider` (via `useSyncExternalStore`) saiba
 * imediatamente quando a escolha muda, sem precisar de um `useEffect` que
 * chama `setState` (evitado de proposito — ver AnalyticsProvider.tsx).
 */
export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Persistencia minima e exclusiva da ESCOLHA de consentimento (FASE 11,
 * secao 23) — nunca dados do diagnostico. `localStorage` e suficiente:
 * nao precisa ser lido pelo servidor, nem compartilhado entre
 * dispositivos, so lembrado no proprio navegador do visitante. Leitura e
 * escrita nunca lancam excecao (modo privado pode bloquear localStorage) —
 * pior caso, o banner reaparece na proxima visita.
 */
export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Falha silenciosa: o pior caso e o banner reaparecer na proxima visita.
  }
  notify();
}
