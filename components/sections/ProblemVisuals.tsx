"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Microvisualizacoes analiticas dos 5 cards de "Sinais de Alerta" (ETAPA 8A:
 * composicao/desenho; ETAPA 8B: refinamento de escala/contraste; ETAPA 9:
 * microanimacao de entrada propria por visual).
 *
 * ETAPA 9 tornou este arquivo um Client Component ("use client") — o mesmo
 * padrao ja usado por `MethodologyVisuals.tsx` para o mesmo problema
 * (precisa de `motion.*`/`useReducedMotion` nos elementos SVG/HTML internos
 * de cada composicao). Continua sem estado proprio, sem efeito, sem
 * listener de scroll: cada visual dispara sua propria sequencia via
 * `whileInView` (propagada aos filhos por variants — o mesmo padrao usado
 * em MethodologyMotion.tsx/MethodologyVisuals.tsx), observando a PROPRIA
 * entrada na viewport, nunca um relogio compartilhado entre os 5. Executa
 * uma unica vez (`viewport={{ once: true }}`), sem looping continuo.
 * `ProblemSection.tsx` continua um Server Component — importar um Client
 * Component como leaf nao muda isso.
 *
 * Cada visual e deliberadamente distinto dos outros 4 (nunca o mesmo
 * grafico so trocando o icone): paineis de integridade, anel+estrela,
 * galeria de 3 paineis, grafo de nos, bolhas de conversa. Nenhum usa nome
 * real de campo, numero, porcentagem ou texto simulando metrica — so forma
 * abstrata, coerente com a linguagem azul-eletrico/navy/violeta ja
 * estabelecida na Metodologia e no Diagnostico.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const VISUAL_GRID_IMAGE =
  "linear-gradient(rgba(70,130,220,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,220,0.08) 1px, transparent 1px)";
const VISUAL_GRID_MASK =
  "radial-gradient(ellipse 70% 70% at 16% 12%, black 0%, black 26%, transparent 70%)";

type VisualFrameProps = {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
};

/**
 * Linguagem visual compartilhada pelos 5 microvisuais (ETAPA 8A, secao 5):
 * fundo navy/quase preto, borda azul-acinzentada translucida, grid tecnico
 * muito discreto, radial azul interno, radius 18px, highlight interno de
 * 1px, sombra azul moderada. So o card 1 (`highlighted`) recebe um frame
 * um pouco mais luminoso (borda/sombra levemente mais fortes) — nunca
 * parece um card independente, so uma "janela" dentro do card real.
 *
 * ETAPA 9 (secao 14): a propria moldura (borda/grid/radial) permanece
 * estatica — so o CONTEUDO dentro dela anima. Evita competir com o
 * movimento continuo do fundo infinito global.
 */
function VisualFrame({ children, className, highlighted }: VisualFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative overflow-hidden rounded-[18px] border",
        highlighted
          ? "border-[rgba(8,102,255,0.32)] bg-[linear-gradient(165deg,rgba(11,20,36,0.92)_0%,rgba(7,10,16,0.96)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(8,102,255,0.1),0_16px_34px_-18px_rgba(8,102,255,0.36)]"
          : "border-[rgba(103,140,255,0.19)] bg-[linear-gradient(165deg,rgba(15,17,24,0.85)_0%,rgba(8,10,15,0.92)_100%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_10px_20px_-14px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage: VISUAL_GRID_IMAGE,
          backgroundSize: "24px 24px",
          maskImage: VISUAL_GRID_MASK,
          WebkitMaskImage: VISUAL_GRID_MASK,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 18% 12%, rgba(8,102,255,0.13), transparent 62%)",
        }}
      />
      <div className="relative flex h-full w-full items-center justify-center p-3">
        {children}
      </div>
    </div>
  );
}

/**
 * Visual 01 — painel de integridade de perfil. 4 trilhos horizontais
 * (campos abstratos do perfil): 2 completos (azul solido + indicador
 * circular preenchido), 1 tracejado/incompleto (violeta), 1 praticamente
 * ausente (opacidade muito baixa) — leitura de "estrutura incompleta" sem
 * nomear nenhum campo real. Trilho tecnico vertical conectando os 4 pontos
 * a esquerda, reforcando "paineis conectados do mesmo sistema".
 *
 * ETAPA 9 (secao 8) — sequencia: 1. linha vertical (`scaleY`, origem no
 * topo); 2. trilho azul 1 (`scaleX`, origem a esquerda); 3. trilho azul 2;
 * 4. trilho violeta tracejado (continua tracejado no estado final — so a
 * escala anima, o `border-dashed` nunca muda); 5. trilho ausente/discreto
 * (mesma opacidade final muito baixa de sempre); 6. os 4 indicadores
 * circulares do fim de cada trilho, juntos, por ultimo ("pontos finais").
 * Os pontos de INICIO de cada trilho (a bolinha a esquerda) entram junto
 * com o proprio trilho — nao viraram um 7o passo separado, o pedido lista
 * 6 passos exatos.
 */
function IntegrityVisual({
  highlighted,
  className,
}: {
  highlighted?: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };
  const t = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  const rows = [
    { dot: "bg-primary", bar: "bg-[rgba(103,140,255,0.36)]", delay: 0.17 },
    { dot: "bg-primary", bar: "bg-[rgba(103,140,255,0.36)]", delay: 0.29 },
    {
      dot: "bg-purple-luminous",
      bar: "border-purple-luminous/50 border border-dashed",
      delay: 0.41,
    },
    {
      dot: "bg-[rgba(103,140,255,0.18)]",
      bar: "bg-[rgba(103,140,255,0.08)]",
      delay: 0.53,
    },
  ] as const;
  const rowWidths = ["flex-1", "w-2/3", "flex-1", "w-1/3"];

  return (
    <VisualFrame highlighted={highlighted} className={className}>
      <motion.div
        className="relative flex h-full w-full max-w-[460px] flex-col justify-center gap-5 px-2"
        initial="hidden"
        {...rootTrigger}
      >
        <motion.span
          aria-hidden="true"
          className="from-primary/25 absolute top-1 bottom-1 left-[11px] w-px origin-top bg-gradient-to-b via-transparent to-transparent"
          variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1 } }}
          transition={t(0.05, 0.35)}
        />

        {rows.map((row, i) => (
          <div key={i} className="relative flex items-center gap-3">
            <motion.span
              className={cn("relative z-10 h-2 w-2 shrink-0 rounded-full", row.dot)}
              variants={{ hidden: { opacity: 0, scale: 0.4 }, visible: { opacity: 1, scale: 1 } }}
              transition={t(row.delay, 0.22)}
            />
            <motion.span
              className={cn("h-2.5 origin-left rounded-full", rowWidths[i], row.bar)}
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
              transition={t(row.delay, 0.28)}
            />
            {/* 6. Ponto final — os 4 indicadores, mesmo atraso (aparecem juntos), depois de todos os trilhos. */}
            <motion.span
              aria-hidden="true"
              className={cn(
                "h-3 w-3 shrink-0 rounded-full",
                i === 0 || i === 1
                  ? "border-primary/55 border"
                  : i === 2
                    ? "border-purple-luminous/65 border border-dashed"
                    : "bg-[rgba(103,140,255,0.08)]",
              )}
              variants={{ hidden: { opacity: 0, scale: 0.3 }, visible: { opacity: 1, scale: 1 } }}
              transition={t(0.62, 0.22)}
            />
          </div>
        ))}
      </motion.div>
    </VisualFrame>
  );
}

/**
 * Visual 02 — anel parcial + estrela central abstrata + poucos marcadores
 * esparsos ao redor (nunca preenchendo o anel todo — "poucas") + sequencia
 * curta de registros abaixo, terminando num traco tracejado (espaco vazio
 * intencional). Um unico marcador violeta entre os azuis, ecoando o acento
 * da secao sem virar um gradiente literal na propria estrela.
 *
 * ETAPA 9 (secao 9) — sequencia: 1. arco parcial "desenhando" via
 * `pathLength` (fracao final identica a antiga `strokeDasharray="70 240"`
 * — 70/240 — nunca vira um circulo completo); 2. estrela (fade+escala);
 * 3. os 3 marcadores esparsos (fade+escala, stagger curto); 4. as 3 linhas
 * inferiores (`scaleX`, origem a esquerda, em sequencia).
 */
function ReviewsVisual({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };
  const t = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };
  const ARC_FRACTION = 70 / 240;

  return (
    <VisualFrame className={className}>
      <motion.div
        className="flex flex-col items-center gap-3.5"
        initial="hidden"
        {...rootTrigger}
      >
        <svg viewBox="0 0 100 100" className="h-[78px] w-[78px]">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(103,140,255,0.2)"
            strokeWidth="4.5"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--s360-primary)"
            strokeWidth="4.5"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: ARC_FRACTION } }}
            transition={t(0.05, 0.5)}
          />
          <motion.path
            d="M50 34 L54.5 45.5 L67 46.5 L57.5 54.5 L60.5 67 L50 60 L39.5 67 L42.5 54.5 L33 46.5 L45.5 45.5 Z"
            fill="var(--s360-primary)"
            variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 0.9, scale: 1 } }}
            style={{ transformOrigin: "50px 50px" }}
            transition={t(0.32, 0.28)}
          />
          <motion.circle
            cx="50"
            cy="11"
            r="2.5"
            fill="var(--s360-primary)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.75, scale: 1 } }}
            style={{ transformOrigin: "50px 11px" }}
            transition={t(0.46, 0.22)}
          />
          <motion.circle
            cx="83"
            cy="63"
            r="2.2"
            fill="#8b5cf6"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.7, scale: 1 } }}
            style={{ transformOrigin: "83px 63px" }}
            transition={t(0.51, 0.22)}
          />
          <motion.circle
            cx="19"
            cy="68"
            r="2"
            fill="var(--s360-primary)"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.45, scale: 1 } }}
            style={{ transformOrigin: "19px 68px" }}
            transition={t(0.56, 0.22)}
          />
        </svg>
        <div className="flex w-full max-w-[165px] flex-col gap-2">
          <motion.span
            className="h-[7px] w-full origin-left rounded-full bg-[rgba(103,140,255,0.34)]"
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={t(0.66, 0.26)}
          />
          <motion.span
            className="h-[7px] w-2/3 origin-left rounded-full bg-[rgba(103,140,255,0.24)]"
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={t(0.72, 0.24)}
          />
          <motion.span
            className="border-primary/30 h-[7px] w-1/3 origin-left rounded-full border border-dashed"
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={t(0.78, 0.22)}
          />
        </div>
      </motion.div>
    </VisualFrame>
  );
}

/**
 * Visual 03 — galeria abstrata de 3 paineis: central em destaque (borda
 * azul, icone de "imagem" simples em SVG, marca violeta de canto indicando
 * desalinhamento), laterais apagados (opacidade reduzida, leve rotacao).
 * Compacto por padrao (pensado para o espaco reduzido dos cards 3-4), mas
 * o mesmo desenho funciona em qualquer largura.
 *
 * ETAPA 9 (secao 10) — sequencia: 1. painel lateral esquerdo; 2. painel
 * lateral direito; 3. painel central "avancando" (fade + escala 0.92→1,
 * sem flutuar continuamente no estado final); 4. icone de imagem; 5. ponto
 * violeta de canto.
 */
function PhotosVisual({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };
  const t = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  return (
    <VisualFrame className={className}>
      <motion.div
        className="flex items-center justify-center gap-2.5"
        initial="hidden"
        {...rootTrigger}
      >
        <motion.div
          aria-hidden="true"
          className={cn(
            "shrink-0 -rotate-3 rounded-md border border-[rgba(103,140,255,0.18)] bg-[rgba(103,140,255,0.07)]",
            compact ? "h-[56px] w-[43px]" : "h-[66px] w-[51px]",
          )}
          variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 0.6, x: 0 } }}
          transition={t(0.05, 0.28)}
        />
        <motion.div
          className={cn(
            "border-primary/40 relative z-10 flex shrink-0 items-center justify-center rounded-md border bg-[rgba(103,140,255,0.11)]",
            compact ? "h-[68px] w-[56px]" : "h-[81px] w-[66px]",
          )}
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
          transition={t(0.26, 0.32)}
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            variants={{ hidden: { opacity: 0, scale: 0.6 }, visible: { opacity: 1, scale: 1 } }}
            transition={t(0.42, 0.24)}
          >
            <circle cx="7.5" cy="8" r="1.6" fill="var(--s360-primary)" opacity="0.85" />
            <path
              d="M3 17.5 L9 11 L13.5 15 L16.5 11.5 L21 17.5 Z"
              fill="none"
              stroke="var(--s360-primary)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </motion.svg>
          <motion.span
            aria-hidden="true"
            className="bg-purple-luminous absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
            transition={t(0.54, 0.22)}
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className={cn(
            "shrink-0 rotate-3 rounded-md border border-[rgba(103,140,255,0.18)] bg-[rgba(103,140,255,0.07)]",
            compact ? "h-[56px] w-[43px]" : "h-[66px] w-[51px]",
          )}
          variants={{ hidden: { opacity: 0, x: 8 }, visible: { opacity: 0.6, x: 0 } }}
          transition={t(0.14, 0.28)}
        />
      </motion.div>
    </VisualFrame>
  );
}

/**
 * Visual 04 — grafo simples: no central com forma abstrata de etiqueta
 * (retangulo + ponto), 2 conexoes ativas solidas, 1 conexao tracejada
 * (interrompida) e um no violeta totalmente desconectado (sem nenhuma
 * linha), comunicando "estrutura mal conectada" so com forma.
 *
 * ETAPA 9 (secao 11) — sequencia: 1. no central (fade+escala); 2. as 2
 * conexoes ativas solidas (`pathLength`, desenhando); 3. os 2 nos que elas
 * alcancam (fade+escala); 4. a conexao tracejada + seu no, juntos (so
 * opacidade — o `strokeDasharray="2 4"` proprio dela nunca muda, entao
 * continua visualmente "interrompida"/incompleta no estado final, como
 * pedido); 5. o no violeta desconectado, sozinho, sem nenhuma linha
 * chegando nele.
 */
function CategoriesVisual({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };
  const t = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  return (
    <VisualFrame className={className}>
      <motion.svg
        viewBox="0 0 160 100"
        className={cn("w-full max-w-[230px]", compact ? "h-[94px]" : "h-[106px]")}
        initial="hidden"
        {...rootTrigger}
      >
        <motion.path
          d="M80 50 L38 28"
          stroke="var(--s360-primary)"
          strokeWidth="1.6"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.65 } }}
          transition={t(0.17, 0.32)}
        />
        <motion.path
          d="M80 50 L38 74"
          stroke="var(--s360-primary)"
          strokeWidth="1.6"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55 } }}
          transition={t(0.23, 0.32)}
        />
        <motion.path
          d="M80 50 L124 32"
          stroke="var(--s360-primary)"
          strokeWidth="1.4"
          strokeDasharray="2 4"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.4 } }}
          transition={t(0.58, 0.26)}
        />
        <motion.rect
          x="70"
          y="41"
          width="20"
          height="18"
          rx="4"
          fill="none"
          stroke="var(--s360-primary)"
          strokeWidth="1.7"
          variants={{ hidden: { opacity: 0, scale: 0.6 }, visible: { opacity: 1, scale: 1 } }}
          style={{ transformOrigin: "80px 50px" }}
          transition={t(0.05, 0.28)}
        />
        <motion.circle
          cx="75"
          cy="46"
          r="1.6"
          fill="var(--s360-primary)"
          variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
          style={{ transformOrigin: "75px 46px" }}
          transition={t(0.12, 0.2)}
        />
        <motion.circle
          cx="38"
          cy="28"
          r="4.5"
          fill="var(--s360-primary)"
          variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.8, scale: 1 } }}
          style={{ transformOrigin: "38px 28px" }}
          transition={t(0.41, 0.24)}
        />
        <motion.circle
          cx="38"
          cy="74"
          r="4.5"
          fill="var(--s360-primary)"
          variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.6, scale: 1 } }}
          style={{ transformOrigin: "38px 74px" }}
          transition={t(0.47, 0.24)}
        />
        <motion.circle
          cx="124"
          cy="32"
          r="4.5"
          fill="var(--s360-primary)"
          variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.5, scale: 1 } }}
          style={{ transformOrigin: "124px 32px" }}
          transition={t(0.62, 0.22)}
        />
        <motion.circle
          cx="130"
          cy="78"
          r="4.5"
          fill="#8b5cf6"
          variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.85, scale: 1 } }}
          style={{ transformOrigin: "130px 78px" }}
          transition={t(0.78, 0.24)}
        />
      </motion.svg>
    </VisualFrame>
  );
}

/**
 * Visual 05 — bolhas de conversa abstratas: mensagem recebida (cheia),
 * trilho tracejado interrompido antes de chegar na resposta (nunca conecta
 * de fato), indicador pendente (ponto violeta) e uma bolha de resposta
 * vazia/tracejada — "conversa sem retorno" so com forma, sem nome, horario
 * ou contador.
 *
 * ETAPA 9 (secao 12) — sequencia: 1. bolha recebida; 2-3. a conexao
 * tracejada "desenha" via `pathLength` — o proprio path (`M2 10 L38 10`) ja
 * termina antes do fim do viewBox (60), entao desenha-lo ja e "iniciar E
 * interromper antes do destino" na mesma animacao, sem inventar um segundo
 * traçado; 4. indicador pendente (circulo violeta); 5. bolha de resposta
 * vazia. A conexao nunca alcanca a segunda bolha, no estado inicial ou
 * final.
 */
function ResponsesVisual({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);
  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };
  const t = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  return (
    <VisualFrame className={className}>
      <motion.div
        className="flex items-center gap-4"
        initial="hidden"
        {...rootTrigger}
      >
        <motion.div
          className="border-primary/35 flex h-[44px] w-[70px] shrink-0 items-center justify-center rounded-xl rounded-bl-sm border bg-[rgba(103,140,255,0.1)]"
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          transition={t(0.05, 0.3)}
        >
          <span className="h-2 w-9 rounded-full bg-[rgba(103,140,255,0.45)]" />
        </motion.div>
        <svg viewBox="0 0 60 20" className="h-5 w-12 shrink-0">
          <motion.path
            d="M2 10 L38 10"
            stroke="var(--s360-primary)"
            strokeWidth="1.6"
            strokeDasharray="3 4"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.5 } }}
            transition={t(0.24, 0.36)}
          />
          <motion.circle
            cx="50"
            cy="10"
            r="3.3"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.6"
            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 0.75, scale: 1 } }}
            style={{ transformOrigin: "50px 10px" }}
            transition={t(0.5, 0.26)}
          />
        </svg>
        <motion.div
          className="border-purple-luminous/55 flex h-[44px] w-[70px] shrink-0 items-center justify-center rounded-xl rounded-br-sm border border-dashed"
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
          transition={t(0.64, 0.28)}
        >
          <span aria-hidden="true" className="bg-purple-luminous/65 h-2 w-2 rounded-full" />
        </motion.div>
      </motion.div>
    </VisualFrame>
  );
}

export type ProblemVisualProps = {
  /** Indice real do problema no array de `ProblemSection.tsx` — identificador estavel, nunca o titulo, para escolher a composicao. */
  index: number;
  /** So o card 1 (indice 0) recebe o frame um pouco mais luminoso. */
  highlighted?: boolean;
  /** Cards 3-4 (indices 2-3) sao mais estreitos — reduz levemente as dimensoes internas do visual correspondente. */
  compact?: boolean;
  className?: string;
};

/**
 * Seletor por indice (ETAPA 8A, secao 4) — nunca por titulo. `default`
 * defensivo (nunca deve ser alcancado com os 5 problemas atuais, mas evita
 * um `undefined` silencioso se o array crescer no futuro).
 */
export function ProblemVisual({
  index,
  highlighted,
  compact,
  className,
}: ProblemVisualProps) {
  switch (index) {
    case 0:
      return <IntegrityVisual highlighted={highlighted} className={className} />;
    case 1:
      return <ReviewsVisual className={className} />;
    case 2:
      return <PhotosVisual compact={compact} className={className} />;
    case 3:
      return <CategoriesVisual compact={compact} className={className} />;
    case 4:
      return <ResponsesVisual className={className} />;
    default:
      return null;
  }
}
