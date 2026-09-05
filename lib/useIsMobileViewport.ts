"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** O servidor nao tem nenhuma nocao de largura de viewport — `false` e o unico valor honesto. */
function getServerSnapshot() {
  return false;
}

/**
 * Detecta o breakpoint mobile (<=767px) via `matchMedia`, usando
 * `useSyncExternalStore` — a ferramenta do proprio React para ler estado
 * externo mutavel (como `matchMedia`) COM seguranca de hidratacao: durante
 * o SSR e a primeira pintura do cliente, `getServerSnapshot` (`false`) e
 * usado sempre; so depois da hidratacao o React troca para `getSnapshot`
 * (o valor real do navegador) e rerenderiza se for diferente.
 *
 * Isso evita a classe de bug de hidratacao ja documentada varias vezes
 * neste projeto (ex.: HeroVisual.tsx, ScrollReveal.tsx) sem precisar de um
 * `useEffect` + `setState` manual (que o lint de `react-hooks` acusa, com
 * razao, como um padrao propenso a cascata de renders evitavel) — aqui a
 * "cascata" e exatamente o que queremos, e o React ja faz isso de forma
 * correta e otimizada por baixo dos panos.
 */
export function useIsMobileViewport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
