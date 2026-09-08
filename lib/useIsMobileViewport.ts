"use client";

import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Detecta o breakpoint mobile (<=767px) via `matchMedia`.
 *
 * ETAPA 5 (auditoria "fundo mobile, espacamentos e fade lateral") — ate
 * aqui este hook usava `useSyncExternalStore(subscribe, getSnapshot,
 * getServerSnapshot)`. Em teoria, a assinatura de 3 argumentos garante que
 * o React reamostra `getSnapshot()` uma vez, automaticamente, logo depois
 * da hidratacao, e rerenderiza se o valor do cliente (`true` em telas
 * mobile) divergir do valor usado no servidor (`getServerSnapshot`,
 * sempre `false`) — SEM depender de nenhum outro motivo de rerender.
 *
 * CAUSA RAIZ ENCONTRADA E REPRODUZIDA (Etapa 4/5): essa autocorrecao pos-
 * hidratacao do `useSyncExternalStore` e agendada pelo React como um
 * trabalho de PRIORIDADE BAIXA (o mesmo tipo de agendamento usado para
 * evitar tearing entre stores externos) — em uso normal, num navegador
 * real com uma aba interativa/em foco, isso e aplicado quase
 * instantaneamente (bem abaixo de 1 frame). Mas em Chromium headless sob
 * automacao (confirmado nesta auditoria via Playwright, em dev E em build
 * de producao, com esperas de ate 4s, sem NENHUM outro motivo de rerender
 * no componente) esse trabalho de baixa prioridade pode nunca chegar a
 * ser aplicado — o componente fica preso indefinidamente usando o valor
 * de `getServerSnapshot()` (`false`), mesmo com `window.matchMedia(...).
 * matches` retornando `true` o tempo todo quando consultado diretamente.
 * A prova mais direta: um `ScrollReveal` que nunca mais rerenderiza por
 * NENHUM outro motivo (esperando `whileInView`, fora da viewport) fica
 * preso; um componente que rerenderiza por qualquer OUTRO motivo (ex.: o
 * `DiagnosticWizard`, apos uma interacao que despacha uma nova acao no
 * reducer) chama `getSnapshot()` de novo nesse rerender e imediatamente
 * pega o valor correto — confirmando que a API do navegador sempre
 * respondeu certo; so a autocorrecao ESPECIFICA do `useSyncExternalStore`
 * e que nao disparava a tempo neste ambiente.
 *
 * CORRECAO MINIMA (autorizada explicitamente pela Etapa 5 como alternativa
 * quando `useSyncExternalStore` nao pode ser tornado confiavel): `useState`
 * (inicial `false`, o mesmo valor "honesto" de servidor de antes — SSR-
 * safe, sem leitura de `window` fora de efeito, sem warning de hidratacao)
 * + `useEffect` sincronizando imediatamente com o valor real assim que o
 * componente monta. `useEffect` e um "passive effect" da fila NORMAL do
 * React (a mesma usada por praticamente todo hook "isClient"/media-query
 * do ecossistema) — nao e o mesmo agendamento de baixa prioridade que
 * causava o problema, entao dispara de forma confiavel logo apos o mount,
 * independente de outro rerender acontecer ou nao. Listener de `change`
 * registrado uma unica vez por instancia montada, com cleanup no unmount
 * (`removeEventListener`) — sem polling, sem `setInterval`, sem leitura de
 * `navigator.userAgent`.
 */
export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronizacao intencional de UMA UNICA vez com matchMedia logo apos o mount (mesmo padrao "isClient" usado em praticamente todo hook de media query); o estado inicial `false` ja e SSR-safe, esta chamada so corrige o valor assim que o navegador real esta disponivel, nao e uma cascata evitavel
    setIsMobile(mql.matches);

    function handleChange() {
      setIsMobile(mql.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
