import { Nfc, Star } from "lucide-react";

/**
 * Display NFC premium (ETAPA 2, "Display NFC" — substitui o retangulo azul
 * solido anterior) — placa de vidro/acrilico tecnologico com nucleo NFC
 * central, inspirada na referencia visual aprovada pelo cliente.
 *
 * 100% HTML/CSS (gradientes e sombras inline, mesma convencao ja usada em
 * DiagnosticSection/MethodologySection/AmbientBackground neste projeto) +
 * dois icones `lucide-react` ja instalados (`Nfc`, `Star`) — nenhuma
 * dependencia nova, nenhuma imagem rasterizada, nenhum SVG customizado.
 *
 * So CSS puro, sem estado/efeito/listener — por isso continua Server
 * Component (sem "use client"), igual ao `NfcShowcase.tsx` original.
 *
 * SEGUNDA CORRECAO DA ETAPA 2 — duas mudancas:
 *
 * 1. Celular reconhecivel — a primeira correcao deixava so ~18px visiveis
 *    (uma "ponta"), insuficiente para mostrar canto + moldura + tela. O
 *    aparelho (moldura + area de "tela" interna, SEM logotipo/icone/texto)
 *    cresceu substancialmente (64px de largura no mobile -> 112px no
 *    desktop) e a janela de recorte tambem cresceu, mantendo a fracao
 *    visivel em ~40-45% do corpo do aparelho — dentro do "aproximadamente
 *    25-35%" pedido, arredondado pra cima de proposito para garantir que o
 *    canto arredondado + moldura + tela fiquem claramente legiveis (o
 *    criterio objetivo do pedido — "reconhecer imediatamente" — pesa mais
 *    que acertar a fracao exata). Mesma estrutura de duas camadas de antes
 *    (janela com `overflow-hidden` proprio + celular maior deslocado pra
 *    dentro dela), so os numeros mudaram.
 *
 * 2. Escala responsiva — o teto de largura da placa (antes fixo em 280px
 *    em qualquer tela) agora cresce por breakpoint: 320px (base — cobre
 *    320-430px moveis, onde a coluna real e mais estreita que 320px de
 *    qualquer forma, entao o teto novo NUNCA reduz o mobile pequeno,
 *    so permite 390/430px crescerem alem do limite antigo de 280px) ->
 *    340px (sm) -> 360px (md, tablet) -> 400px (lg, desktop — a coluna
 *    disponivel no grid de 2 colunas mede ~420px, 400px deixa uma margem
 *    de seguranca sem ultrapassar a metade do grid). Nucleo/aneis/estrelas/
 *    pontos/ondas ganharam tiers `md:`/`lg:` novos (antes paravam em `sm:`)
 *    para nao ficarem desproporcionalmente pequenos dentro de uma placa
 *    maior no tablet/desktop.
 *
 * Preto continua predominante ao redor (a placa e translucida, nao um
 * bloco solido — reaproveita `--s360-ambient-navy`).
 *
 * `aria-hidden="true"` + `pointer-events-none` aplicados UMA VEZ no
 * container raiz — mesmo padrao ja usado em toda atmosfera decorativa do
 * projeto (DiagnosticSection.tsx/MethodologySection.tsx).
 *
 * ETAPA 3 (refinamento/fidelidade) — nao muda estrutura/tamanho geral, so
 * polimento: sombra em camadas, um anel a menos (3->2), celular/glow mais
 * discretos, estrelas 1px maiores. Aprovado no zoom, mas no tamanho REAL
 * da secao ficou discreto/vazio demais — corrigido na rodada seguinte.
 *
 * CORRECAO DA ETAPA 3 (recuperar impacto no tamanho real) — 4 ajustes:
 * 1. Nucleo ~30% maior em todos os breakpoints (botao/icone/2 aneis/glow
 *    escalados juntos, mesma proporcao) — precisa ser reconhecivel na
 *    secao inteira, nao so no zoom.
 * 2. Celular reconstruido: rotacao mais acentuada (13deg -> 19deg, entra
 *    mais "de lado" em vez de quase reto — e isso que lia como "placa
 *    vertical cortada"), janela e corpo maiores, area de "tela" com
 *    contraste restaurado (a Etapa 3 escureceu demais tentando deixa-lo
 *    "complementar" e ele deixou de parecer uma tela).
 * 3. Composicao reequilibrada: o nucleo deslocou ~8-9% para a esquerda do
 *    centro (`translate-x` no proprio nucleo, aneis/pontos se movem
 *    junto por serem filhos do mesmo wrapper) — abre espaco real para as
 *    ondas + celular ocuparem a metade direita da placa, em vez de tanta
 *    area vazia entre o nucleo centralizado e o celular na borda.
 * 4. Profundidade reforcada mais um degrau (reflexo, linha superior,
 *    sombra da base, glow da borda, acento lilas) — ainda abaixo dos
 *    valores originais pre-Etapa-3 (nunca "azul chapado" nem brilho
 *    espalhado), so recuperando parte do que foi contido demais.
 *
 * ETAPA 4 (microanimacoes controladas) — 5 movimentos MUITO sutis, so CSS
 * (`@keyframes` num `<style>` literal, mesmo padrao ja usado em
 * MethodologySection.tsx — nao precisa de "use client"/Motion/listener):
 * pulso no glow do nucleo, expansao leve das 2 ondas (com atraso entre
 * elas, pra nao pulsarem em uniss e parecer "piscar"), orbita lenta dos 2
 * pontos (26s/30s, sentidos opostos), variacao minima da borda da placa, e
 * o reflexo diagonal deslizando devagar (16s). Nenhuma anima o texto, a
 * placa inteira, nem usa JS. `prefers-reduced-motion` — a regra global em
 * app/globals.css (`animation-duration:0.01ms!important;animation-
 * iteration-count:1!important` para `*`) ja neutraliza tudo automatica-
 * mente: cada keyframe aqui tem o estado 0%/100% IGUAL ao estado base
 * (definido fora do keyframe, nas proprias classes/estilos dos elementos)
 * — entao apos a unica iteracao quase instantanea, cada elemento volta
 * exatamente a aparencia estatica ja aprovada nas etapas anteriores, nunca
 * preso em opacity:0 ou numa posicao intermediaria da animacao.
 */
export function NfcDisplayVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[320px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[400px]"
    >
      {/* Placa — vidro/acrilico tecnologico, leve perspectiva (sem distorcer o conteudo interno, que permanece centralizado via flex). */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border"
        style={{
          borderColor: "rgba(67,133,255,0.48)",
          background:
            "linear-gradient(155deg, rgba(16,35,74,0.55) 0%, rgba(10,20,42,0.78) 55%, rgba(5,8,16,0.9) 100%)",
          boxShadow: [
            "0 22px 46px -16px rgba(0,0,0,0.65)", // sombra inferior — apoio/ancoragem da placa
            "0 0 34px -11px rgba(8,102,255,0.36)", // glow azul da borda — reforcado um degrau (era 30px/-12/0.3), ainda contido (nunca voltou aos 42px/0.4 originais)
            "inset 0 1px 0 0 rgba(147,197,255,0.22)", // highlight superior tingido de azul — mais aceso (era 0.16)
            "inset 0 -14px 22px -16px rgba(0,0,0,0.55)", // sombra interna da base, levemente mais profunda
          ].join(", "),
          transform: "perspective(700px) rotateY(-3.5deg) rotateX(1deg)",
          animation: "nfc-border-breathe 6s ease-in-out infinite", // variacao minima da intensidade da borda
        }}
      >
        {/* Keyframes das microanimacoes — locais deste componente, nao em app/globals.css (mesmo padrao de MethodologySection.tsx). */}
        <style>{`
          @keyframes nfc-core-pulse {
            0%, 100% { box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.09), 0 0 20px -4px rgba(8,102,255,0.55); }
            50% { box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.09), 0 0 27px -4px rgba(8,102,255,0.7); }
          }
          @keyframes nfc-wave-expand {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.07); opacity: 0.8; }
          }
          @keyframes nfc-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes nfc-orbit-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes nfc-border-breathe {
            0%, 100% { border-color: rgba(67,133,255,0.48); }
            50% { border-color: rgba(67,133,255,0.62); }
          }
          @keyframes nfc-reflection-sweep {
            0%, 100% { transform: translateX(-6%); opacity: 0.75; }
            50% { transform: translateX(6%); opacity: 1; }
          }
        `}</style>

        {/* Segunda linha interna — sugere espessura da placa, sem alterar a borda externa. */}
        <div className="absolute inset-[4px] rounded-[12px] border border-white/[0.17]" />

        {/* Reflexo diagonal suave — gradiente estatico de base, com um
            deslize levissimo em intervalo longo (16s) por cima. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.09) 46%, rgba(147,197,255,0.06) 56%, transparent 71%)",
            animation: "nfc-reflection-sweep 16s ease-in-out infinite",
          }}
        />

        {/* Acento lilas — pequeno mas perceptivel (alpha 0.36 -> 0.4). */}
        <div
          className="absolute bottom-0 left-0 h-16 w-16 -translate-x-1/3 translate-y-1/3 rounded-full blur-2xl md:h-20 md:w-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }}
        />

        {/* Cinco estrelas decorativas — abstratas, sem nota/numero/avaliacao.
            ETAPA 3 — 1px maior em cada tier + opacidade um pouco mais alta
            (0.55 -> 0.6): no mobile estavam pequenas demais para ler como
            "estrelas" com confianca; ainda claramente secundarias (bem
            menores/mais discretas que o nucleo, que continua o foco). */}
        <div className="absolute inset-x-0 top-3 flex items-center justify-center gap-1.5 sm:top-3.5 md:top-4 md:gap-2 lg:top-[18px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              fill="currentColor"
              strokeWidth={0}
              className="text-primary/60 h-[10px] w-[10px] sm:h-[11px] sm:w-[11px] md:h-[12px] md:w-[12px] lg:h-[13px] lg:w-[13px]"
            />
          ))}
        </div>

        {/* Nucleo NFC — botao central + aneis concentricos + pontos orbitais.
            CORRECAO ETAPA 3 — conjunto inteiro ~30% maior (era pequeno
            demais no tamanho real da secao) e deslocado ~8% a esquerda do
            centro (aneis/pontos se movem junto por serem filhos do mesmo
            wrapper) para abrir espaco real para ondas+celular do lado
            direito, reduzindo a area vazia entre eles. Deslocamento em PX
            fixo por breakpoint (~8% da largura real da placa naquele
            tier) — `translate-x` em % seria relativo ao proprio tamanho
            do nucleo (47-62px), um deslocamento quase imperceptivel de
            ~4-5px, nao aos ~8% da PLACA pedidos. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-[47px] w-[47px] -translate-x-[24px] items-center justify-center sm:h-[52px] sm:w-[52px] sm:-translate-x-[27px] md:h-[57px] md:w-[57px] md:-translate-x-[29px] lg:h-[62px] lg:w-[62px] lg:-translate-x-[32px]">
            {/* Aneis concentricos — 2 (mantidos da Etapa 3), escalados junto com o nucleo. */}
            <span className="absolute h-[68px] w-[68px] rounded-full border border-[rgba(103,140,255,0.22)] sm:h-20 sm:w-20 md:h-[91px] md:w-[91px] lg:h-[99px] lg:w-[99px]" />
            <span className="absolute h-[52px] w-[52px] rounded-full border border-[rgba(103,140,255,0.38)] sm:h-16 sm:w-16 md:h-[70px] md:w-[70px] lg:h-[75px] lg:w-[75px]" />

            {/* Pontos orbitais — ETAPA 4: reestruturados para orbita real
                (antes ficavam presos num canto do proprio anel, so
                aproximados; agora cada um vive dentro de um wrapper do
                MESMO diametro do anel correspondente, e e o WRAPPER que
                gira — o ponto em si so acompanha, sem precisar recalcular
                posicao). Azul orbita no anel externo (26s), lilas no anel
                interno, sentido oposto (30s) — lento e assincrono, nunca
                sincronizado/piscando. */}
            <span
              className="absolute h-[68px] w-[68px] sm:h-20 sm:w-20 md:h-[91px] md:w-[91px] lg:h-[99px] lg:w-[99px]"
              style={{ animation: "nfc-orbit 26s linear infinite" }}
            >
              <span
                className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3"
                style={{ background: "var(--s360-primary)", boxShadow: "0 0 7px 1px rgba(8,102,255,0.52)" }}
              />
            </span>
            <span
              className="absolute h-[52px] w-[52px] sm:h-16 sm:w-16 md:h-[70px] md:w-[70px] lg:h-[75px] lg:w-[75px]"
              style={{ animation: "nfc-orbit-reverse 30s linear infinite" }}
            >
              <span
                className="absolute bottom-0 left-1/3 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5"
                style={{ background: "var(--s360-purple)", boxShadow: "0 0 6px 1px rgba(139,92,246,0.48)" }}
              />
            </span>

            {/* Nucleo escuro central — glow reforcado um degrau (era 14px/-4/0.46, agora 20px/-4/0.55) para acompanhar o tamanho maior sem virar halo espalhado. ETAPA 4 — pulso muito suave no glow (4.5s). */}
            <div
              className="relative flex h-[47px] w-[47px] items-center justify-center rounded-full border border-white/10 sm:h-[52px] sm:w-[52px] md:h-[57px] md:w-[57px] lg:h-[62px] lg:w-[62px]"
              style={{
                background: "radial-gradient(circle, #101c30 0%, #05070d 100%)",
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.09), 0 0 20px -4px rgba(8,102,255,0.55)",
                animation: "nfc-core-pulse 4.5s ease-in-out infinite",
              }}
            >
              <Nfc size={20} className="text-primary-foreground relative h-5 w-5 sm:h-6 sm:w-6 md:h-[26px] md:w-[26px] lg:h-7 lg:w-7" />
            </div>
          </div>
        </div>

        {/*
          Ondas de aproximacao — dois arcos entre o nucleo e a janela do
          celular. Alpha reforcado um degrau (0.4/0.2 -> 0.48/0.26) e
          posicao mantida — com o nucleo tendo se deslocado a esquerda, a
          folga ate aqui so aumentou, entao continuam sem risco de
          sobrepor nada.
        */}
        <div className="absolute inset-y-0 right-[40px] flex w-6 items-center sm:right-[48px] sm:w-7 md:right-[54px] md:w-8 lg:right-[62px] lg:w-9">
          {/* ETAPA 4 — expansao discreta, cada arco com seu proprio atraso
              (0s / 0.9s) para nao pulsarem em uniss e nunca lerem como
              "piscando". */}
          <span
            className="absolute h-4 w-4 rounded-full border-2 border-transparent sm:h-5 sm:w-5 md:h-6 md:w-6"
            style={{
              borderRightColor: "rgba(103,140,255,0.48)",
              borderTopColor: "rgba(103,140,255,0.48)",
              animation: "nfc-wave-expand 5s ease-in-out infinite",
            }}
          />
          <span
            className="absolute h-7 w-7 rounded-full border-2 border-transparent sm:h-8 sm:w-8 md:h-9 md:w-9"
            style={{
              borderRightColor: "rgba(103,140,255,0.26)",
              borderTopColor: "rgba(103,140,255,0.26)",
              animation: "nfc-wave-expand 5s ease-in-out infinite 0.9s",
            }}
          />
        </div>
      </div>

      {/*
        Celular abstrato entrando pelo canto direito. DUAS camadas: uma
        "janela" com `overflow-hidden` proprio (nao o da placa, que tem
        cantos arredondados e cortaria o aparelho de forma estranha),
        ancorada na borda direita da propria placa — e DENTRO dela, o
        celular, maior que a janela e deslocado para a direita, entao so a
        fatia mais a esquerda fica visivel.
        CORRECAO ETAPA 3 — a rotacao rasa (13deg) fazia o recorte ler como
        "placa vertical cortada" em vez de canto de celular; subida para
        19deg (entra mais "de lado", a curva do canto fica bem mais
        evidente dentro da mesma janela). Corpo e janela cresceram de novo
        (fracao visivel ficou em ~38-40% do aparelho, dentro do
        "aproximadamente 35-45%" pedido desta vez).
      */}
      <div className="absolute top-1/2 right-0 h-[58%] w-[36px] -translate-y-1/2 overflow-hidden sm:w-[44px] md:w-[50px] lg:w-[58px]">
        {/* Celular — moldura + "tela" interna. CORRECAO ETAPA 3 — contraste
            da "tela" restaurado (a Etapa 3 escureceu demais tentando
            deixa-lo discreto e ele parou de parecer uma tela) e a borda
            voltou a ficar um pouco mais visivel, mas ainda mais discreta
            que a borda da propria placa — continua complementar, so
            deixou de ficar apagado demais para ser reconhecido. Sem
            icone/texto/logo. */}
        <div
          className="absolute top-1/2 right-[-49px] h-full w-20 -translate-y-1/2 rotate-[19deg] rounded-[16px] border sm:right-[-58px] sm:w-24 md:right-[-68px] md:w-28 lg:right-[-77px] lg:w-32"
          style={{
            borderColor: "rgba(170,195,230,0.4)",
            background: "linear-gradient(160deg, rgba(42,48,60,0.95) 0%, rgba(9,11,15,0.97) 100%)",
            boxShadow: "0 10px 24px -10px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="absolute inset-[5px] rounded-[10px]"
            style={{
              background: "linear-gradient(155deg, rgba(45,90,155,0.55) 0%, rgba(8,12,20,0.55) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(147,197,255,0.14)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
