/**
 * "Fundo infinito" — camada ambiental UNICA atras de toda a pagina,
 * substituindo as antigas faixas solidas por secao (`bg-background` /
 * `bg-background-alt` / `bg-muted` em `components/ui/Section.tsx`, agora
 * transparentes) que criavam divisoes horizontais visiveis entre secoes
 * vizinhas.
 *
 * Renderizada uma unica vez em `app/layout.tsx`, como o PRIMEIRO filho de
 * `<body>` — um unico `position: absolute; inset: 0` dentro do `<body
 * className="relative">`. Como o `<body>` nao tem altura explicita (so
 * `min-h-screen`), sua altura final e determinada pelo conteudo normal
 * (Header/main/Footer, todos em fluxo) — e so DEPOIS disso o filho
 * absoluto (fora do fluxo) se estica para cobrir exatamente essa altura
 * total. Isso garante que os focos de luz avancem por toda a extensao
 * real da pagina, nunca so a primeira tela.
 *
 * Puramente decorativo (`aria-hidden`, `pointer-events-none`) — nao e um
 * Client Component: toda a animacao e CSS puro (`@keyframes` em
 * globals.css), entao nao precisa de Motion/JS nem afeta o restante da
 * arvore em `app/layout.tsx` (Server Component).
 *
 * Posicoes em `top` percentuais (nao pixels fixos) fazem os focos se
 * distribuirem proporcionalmente por QUALQUER altura final de pagina —
 * peca central para funcionar igual em mobile (secoes empilhadas, pagina
 * bem mais alta) e desktop, sem duplicar valores por breakpoint.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Regiao inicial (Hero) — preto azulado com presenca azul discreta. */}
      <div
        className="s360-ambient-blob s360-ambient-anim-a absolute -top-[12%] left-1/2 h-[55vh] w-[130vw] -translate-x-1/2 sm:h-[70vh] sm:w-[75vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-blue) 0%, transparent 70%)",
          animationDelay: "-3s",
        }}
      />

      {/* Problema / Diagnostico — azul-marinho profundo, deslocado a direita. */}
      <div
        className="s360-ambient-blob s360-ambient-anim-b absolute top-[14%] right-[-15%] h-[50vh] w-[110vw] sm:h-[60vh] sm:w-[55vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-navy) 0%, transparent 72%)",
          animationDelay: "-9s",
        }}
      />

      {/* Metodologia / Processo — azul eletrico bem discreto, a esquerda. */}
      <div
        className="s360-ambient-blob s360-ambient-anim-c absolute top-[34%] left-[-10%] h-[55vh] w-[120vw] sm:h-[65vh] sm:w-[60vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-blue-soft) 0%, transparent 70%)",
          animationDelay: "-6s",
        }}
      />

      {/* Transicao para a Solucao — azul-marinho central, mistura organica. */}
      <div
        className="s360-ambient-blob s360-ambient-anim-a absolute top-[52%] left-1/2 h-[50vh] w-[130vw] -translate-x-1/2 sm:h-[60vh] sm:w-[70vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-navy) 0%, transparent 72%)",
          animationDelay: "-13s",
        }}
      />

      {/*
        Regiao de conversao (Otimizacao/NFC) — azul profundo de um lado,
        roxo sutil do outro (pedido explicito), nunca o roxo dominando.
      */}
      <div
        className="s360-ambient-blob s360-ambient-anim-b absolute top-[68%] left-[-12%] h-[50vh] w-[100vw] sm:h-[58vh] sm:w-[50vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-blue) 0%, transparent 70%)",
          animationDelay: "-2s",
        }}
      />
      <div
        className="s360-ambient-blob s360-ambient-anim-c absolute top-[72%] right-[-15%] h-[45vh] w-[95vw] sm:h-[52vh] sm:w-[45vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-purple) 0%, transparent 72%)",
          animationDelay: "-10s",
        }}
      />

      {/* Regiao final (FAQ/CTA/Footer) — retorno gradual a um tom escuro profundo. */}
      <div
        className="s360-ambient-blob s360-ambient-anim-a absolute top-[90%] left-1/2 h-[45vh] w-[120vw] -translate-x-1/2 sm:h-[55vh] sm:w-[65vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-navy) 0%, transparent 74%)",
          animationDelay: "-16s",
        }}
      />
    </div>
  );
}
