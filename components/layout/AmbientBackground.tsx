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
 *
 * ETAPA 2 (auditoria "fundo mobile, espacamentos e fade lateral", secao 1):
 * dos 7 blobs originais so 1 era lilas (~72%), deixando quase toda a
 * pagina sem nenhuma presenca roxa. 3 novos blobs (`md:hidden` — SO
 * abaixo de 768px, sem JS/listener, o proprio Tailwind resolve) preenchem
 * ~24%/~33.5%/~66% da rolagem (recalibrados na ETAPA 3 apos a reducao do
 * padding vertical das secoes ter encolhido a altura total da pagina —
 * ver comentarios nos blobs A/B/C abaixo), reutilizando exatamente o MESMO token
 * (`--s360-ambient-purple`) e as MESMAS classes de drift/keyframe ja
 * existentes — nenhuma cor, keyframe ou valor de blob original mudou. O
 * alpha do token lilas (0.12) ja e mais baixo que o do azul principal
 * (0.16), entao reaproveita-lo tal como esta ja garante "menos intenso que
 * o azul" sem precisar de nenhum ajuste artificial de opacidade (que nem
 * funcionaria aqui: um `opacity` estatico inline seria sobrescrito pela
 * propria animacao `infinite`, que already controla `opacity` do 0% ao
 * 100%) — a variacao entre os 3 novos halos fica so em tamanho (dentro da
 * faixa 85-125vw / 38-58vh pedida, mais pra baixo da faixa que os grandes
 * blobs azuis) e no ponto de corte do gradiente (68-74%, mesma variacao ja
 * usada nos blobs originais), nunca no token.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/*
        CORRECAO FINAL MOBILE (recuperar o preto) — a versao anterior
        ("AJUSTE MOBILE") usava 10 campos GIGANTES (38-46% de altura, 100%
        de largura, centros a so 10% de distancia) que se sobrepunham em
        28-36 pontos percentuais uns aos outros — e cada secao ainda ganhou
        seu PROPRIO halo lilas local por cima disso. O resultado (correto,
        confirmado pelo cliente) foi um bloco roxo solido cobrindo quase
        toda a pagina, sem preto sobrando.

        Esta camada global volta a ser um acompanhamento discreto, nao a
        fonte principal de cor — os halos locais de cada secao (Process/
        Solution/Diagnostic/Problem/SocialProof/FAQ, todos abaixo do -z-10
        de cada arquivo) agora carregam a responsabilidade principal de
        mostrar azul/lilas onde a instrucao pede, com intervalos pretos
        reais entre eles. Aqui: 7 campos MENORES (10-14% de altura, 55-65%
        de largura, nao mais 100%), com espacamento de 16% entre centros —
        como a meia-altura de cada campo fica em ~5-7%, sobra ~6-9 pontos
        percentuais de preto real entre um campo e o proximo (nada de
        sobreposicao). 4 azuis contra 3 lilas (proporcao pedida: azul mais
        presente que lilas). Alpha do lilas reduzido de 0.27-0.29 para
        0.16-0.18 (mesmos componentes RGB do token `--s360-ambient-purple`,
        so a transparencia exclusiva deste bloco mobile mudou — o token em
        si, usado pelos halos animados abaixo e pelo desktop, continua
        0.12, intocado). Falloff mais curto (`transparent` 66-70%, era
        84-90%) — os campos dissolvem no preto rapido, em vez de se
        espalhar por uma area enorme.
      */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 62% 12% at 85% 4%, var(--s360-ambient-blue), transparent 68%)",
            "radial-gradient(ellipse 58% 11% at 15% 20%, rgba(139,92,246,0.17), transparent 66%)",
            "radial-gradient(ellipse 60% 12% at 82% 38%, var(--s360-ambient-blue-soft), transparent 68%)",
            "radial-gradient(ellipse 58% 11% at 14% 54%, rgba(139,92,246,0.17), transparent 66%)",
            "radial-gradient(ellipse 62% 12% at 85% 70%, var(--s360-ambient-blue), transparent 68%)",
            "radial-gradient(ellipse 58% 11% at 16% 86%, rgba(139,92,246,0.17), transparent 66%)",
            "radial-gradient(ellipse 58% 11% at 80% 98%, var(--s360-ambient-blue-soft), transparent 66%)",
          ].join(", "),
        }}
      />

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

      {/*
        ETAPA 2 — Halo lilas A, exclusivo mobile: entre Sinais de Alerta e o
        inicio do Diagnostico, pelo lado esquerdo, discreto (menor dos 3
        novos). `md:hidden` — nao existe em 768px+, desktop fica identico.
        ETAPA 3 — `top` recalibrado de 22% para 24%: a reducao do padding
        vertical (`Section.tsx`) encurtou a altura total da pagina, o que
        desloca a posicao percentual real de toda transicao abaixo do
        Hero. Recalculado via `getBoundingClientRect` apos as mudancas
        (zona de exposicao real — inicio do fade da propria atmosfera do
        Sinais de Alerta, ~86% da altura daquela secao, ate o topo do
        Diagnostico — ficou em ~23.9%-26.5%, centro ~25.2%).
      */}
      <div
        className="s360-ambient-blob s360-ambient-anim-a md:hidden absolute top-[24%] left-[-16%] h-[42vh] w-[100vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-purple) 0%, transparent 70%)",
          animationDelay: "-5s",
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

      {/*
        ETAPA 2 — Halo lilas B, exclusivo mobile: iluminando a transicao
        Diagnostico -> Metodologia, pelo lado direito, o maior dos 3 novos
        halos. `top:33.5%` — validacao visual da Etapa 2 encontrou a
        limitacao estrutural documentada abaixo (DiagnosticSection.tsx e o
        painel de MethodologySection.tsx bloqueando o fundo global com
        camadas locais opacas, sobrando so uma fresta estreita entre eles).
        ETAPA 3 corrigiu justamente essa causa raiz para este arquivo (ver
        mascara de fade adicionada a atmosfera externa do Diagnostico em
        DiagnosticSection.tsx — nao mais opaca de ponta a ponta). Recalculo
        pos-mudanca (fade inicia a ~90% da altura da propria secao do
        Diagnostico, e a altura total da pagina encolheu com a reducao do
        padding): a janela efetivamente exposta ficou mais generosa
        (~34.1%-35.5%, centro ~34.8%), e o `top:33.5%` ja calculado antes
        continua caindo corretamente no centro dela — nenhum ajuste de
        posicao foi necessario aqui, mas o RESULTADO visual deve ser
        sensivelmente melhor agora que a atmosfera do Diagnostico nao
        bloqueia mais o fundo global nas suas proprias bordas.
      */}
      <div
        className="s360-ambient-blob s360-ambient-anim-c md:hidden absolute top-[33.5%] right-[-17%] h-[52vh] w-[118vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-purple) 0%, transparent 74%)",
          animationDelay: "-8s",
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
        ETAPA 2 — Halo lilas C, exclusivo mobile: entre Processo e Solucao,
        pelo lado esquerdo, reduzindo a sensacao de fundo completamente
        preto ali. Nem ProcessSection.tsx nem o inicio de SolutionSection.tsx
        tem camada de atmosfera local opaca (so o painel "Janela de analise"
        mais abaixo, `OptimizationPreview.tsx`, tem fundo solido) — a
        janela exposta ao fundo global aqui e generosa, bem mais tolerante
        que a do halo B.
        ETAPA 3 — `top` recalibrado de 65% para 66%: com a reducao do
        `mt-16`/`py-28` (Section.tsx/OptimizationShowcase.tsx), a altura
        total da pagina encolheu e a janela real (Processo -> inicio do
        painel opaco da Otimizacao) recalculada via `getBoundingClientRect`
        ficou em ~65.3%-68.2%, centro ~66.8% — pequeno ajuste para
        continuar centralizado no vazio real, nunca dentro da timeline do
        Processo nem atras do painel opaco.
      */}
      <div
        className="s360-ambient-blob s360-ambient-anim-b md:hidden absolute top-[66%] left-[-13%] h-[40vh] w-[90vw]"
        style={{
          background:
            "radial-gradient(circle, var(--s360-ambient-purple) 0%, transparent 68%)",
          animationDelay: "-4s",
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
