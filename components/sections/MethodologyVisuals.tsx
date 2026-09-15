"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/cn";

type MethodologyVisualProps = {
  /** Indice da etapa (STEPS) — decide qual das 4 composicoes renderizar. */
  index: number;
  /** So a etapa 01 recebe intensidade ligeiramente maior (pedido explicito). */
  highlighted?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Microvisualizações da Metodologia (ETAPA 4A: composição/desenho; ETAPA 5:
 * microanimação de entrada própria por visualização). Continuam 100%
 * decorativas (`aria-hidden`), honestas (nenhum numero/metrica real) e sem
 * biblioteca nova.
 *
 * ETAPA 5 tornou este arquivo um Client Component ("use client") — passo
 * necessário para usar `motion.*`/`useReducedMotion` nos elementos SVG/HTML
 * internos de cada composição. Continua sem estado próprio, sem efeito,
 * sem listener de scroll: cada visualização dispara sua própria sequência
 * via `whileInView` (propagada aos filhos por variants, mesmo padrão já
 * usado em MethodologyIcons.tsx/MethodologyMotion.tsx neste projeto),
 * observando a PRÓPRIA entrada na viewport — nenhuma delas depende de um
 * relógio compartilhado. Executa uma única vez (`viewport={{ once: true }}`),
 * sem looping.
 */
export function MethodologyVisual({
  index,
  highlighted = false,
}: MethodologyVisualProps) {
  let content: React.ReactNode;
  switch (index % 4) {
    case 0:
      content = <ProfileStructureVisual highlighted={highlighted} />;
      break;
    case 1:
      content = <ContentVisual highlighted={highlighted} />;
      break;
    case 2:
      content = <ReputationVisual />;
      break;
    default:
      content = <LocalPresenceVisual />;
      break;
  }

  return <VisualFrame highlighted={highlighted}>{content}</VisualFrame>;
}

/**
 * Container visual compartilhado pelas 4 composicoes — mesma linguagem
 * (fundo azul-marinho quase preto, borda fina azul acinzentada, radius,
 * grid interno discreto, iluminacao radial) para as etapas lerem como parte
 * de UM sistema, nao quatro widgets desenhados sem relacao entre si.
 * Puramente estático — a moldura em si não anima, só o conteúdo dentro dela.
 *
 * CORRECAO CONJUNTA MOBILE — `min-h-[150px]` (a faixa SEM prefixo, que ate
 * aqui valia para toda largura de tela) reduzido para `min-h-[128px]`
 * (~15% menor), exclusivo de telas abaixo de 640px: `sm:min-h-[190px]` (ja
 * existia) continua valendo a partir de 640px sem nenhuma mudanca, entao
 * tablet/desktop permanecem identicos. `min-h` (nao `h`) preserva a garantia
 * de nao cortar nada — se o conteudo de alguma composicao precisar de mais
 * espaco que 128px, a moldura cresce normalmente para acomodar.
 */
function VisualFrame({
  children,
  highlighted,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative min-h-[128px] w-full overflow-hidden rounded-[18px] border sm:min-h-[190px] lg:h-[200px]",
        highlighted ? "border-primary/45" : "border-[rgba(122,158,255,0.22)]",
      )}
      style={{
        background: highlighted
          ? "linear-gradient(160deg, rgba(8,102,255,0.16), var(--s360-accent) 65%)"
          : "var(--s360-accent)",
        boxShadow: highlighted
          ? "0 0 32px -10px rgba(8,102,255,0.55)"
          : "0 0 20px -12px rgba(8,102,255,0.3)",
      }}
    >
      {/* Grid tecnico discreto, exclusivo das microvisualizacoes — nao e o
          grid geral da secao. Celulas pequenas, opacidade muito baixa, mais
          visivel no centro e dissolvido nas bordas via mascara radial. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(122,158,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(122,158,255,0.35) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 80%)",
        }}
      />
      {/* Iluminacao radial suave, centralizada atras do conteudo. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(67,133,255,0.16), transparent 70%)",
        }}
      />

      <div className="relative flex h-full w-full items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

/** Estados hidden/visible compartilhados por elementos que so precisam de fade+leve escala. */
const FADE_SCALE = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Visualização 01 — Estrutura do perfil: um nó central (a estrutura)
 * conectado a três nós externos (as frentes que a compõem) — mesma leitura
 * de "mapa de estrutura" da composição anterior, agora em escala real e com
 * profundidade (gradiente + glow), não um desenho em miniatura.
 *
 * ETAPA 5: linhas aparecem primeiro, depois os nós externos, o nó central
 * acende por último (fade + escala, o glow já embutido no fill/filter dele
 * cresce junto — sem precisar animar o filtro em si).
 */
function ProfileStructureVisual({ highlighted }: { highlighted?: boolean }) {
  const id = useId();
  const coreGrad = `${id}-core`;
  const coreGlow = `${id}-core-glow`;
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  const nodes = [
    { x: 44, y: 34 },
    { x: 176, y: 34 },
    { x: 110, y: 126 },
  ] as const;
  const center = { x: 110, y: 74 };

  return (
    <motion.svg
      viewBox="0 0 220 150"
      className="h-full max-h-[108px] w-full max-w-[175px] sm:max-h-[130px] sm:max-w-[210px]"
      aria-hidden="true"
      initial="hidden"
      {...rootTrigger}
    >
      <defs>
        <radialGradient id={coreGrad} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6fa8ff" />
          <stop offset="55%" stopColor="#2f7bff" />
          <stop offset="100%" stopColor="#0a1730" />
        </radialGradient>
        <filter id={coreGlow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4385ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* 1. Conexões — atrás dos nós, primeiro a aparecer. */}
      {nodes.map((n, i) => (
        <motion.line
          key={i}
          x1={center.x}
          y1={center.y}
          x2={n.x}
          y2={n.y}
          stroke={`url(#${id}-line)`}
          strokeWidth="1.5"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.55 } }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.4, delay: i * 0.06 }
          }
        />
      ))}

      {/* 2. Nós externos — surgem em seguida. */}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="11"
          fill="#0d0d14"
          stroke="#a855f7"
          strokeWidth="1.5"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: highlighted ? 0.95 : 0.85, scale: 1 },
          }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.35, ease: EASE, delay: 0.25 + i * 0.06 }
          }
        />
      ))}

      {/* 3. Nó central — acende por último. */}
      <motion.rect
        x={center.x - 30}
        y={center.y - 30}
        width="60"
        height="60"
        rx="16"
        fill={`url(#${coreGrad})`}
        stroke="#f7f7f8"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        filter={`url(#${coreGlow})`}
        variants={{
          hidden: { opacity: 0, scale: 0.7 },
          visible: { opacity: 1, scale: 1 },
        }}
        style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.5 }
        }
      />
    </motion.svg>
  );
}

/**
 * Visualização 02 — Conteúdo: três painéis, o central maior e em destaque
 * (borda azul, glow, ícone abstrato de imagem + traços de legenda), os
 * laterais recuados e discretos.
 *
 * ETAPA 5: painéis laterais aparecem primeiro; painel central sobe poucos
 * pixels (y) enquanto entra; um overlay de glow acende por cima dele
 * (simula a borda "acendendo" sem interpolar a string do box-shadow); os
 * traços internos surgem por último.
 */
function ContentVisual({ highlighted }: { highlighted?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <motion.div
      aria-hidden="true"
      className="flex h-full max-h-[125px] w-full max-w-[183px] items-end justify-center gap-3 sm:max-h-[150px] sm:max-w-[220px]"
      initial="hidden"
      {...rootTrigger}
    >
      <motion.div
        className="flex h-[58%] w-[26%] flex-col items-center justify-end gap-1.5 rounded-lg border border-[rgba(122,158,255,0.25)] bg-white/[0.03] p-2.5"
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
      >
        <span className="h-1 w-full rounded-full bg-white/12" />
        <span className="h-1 w-2/3 rounded-full bg-white/12" />
      </motion.div>

      <motion.div
        className="relative flex h-[90%] w-[36%] flex-col items-center justify-center gap-2.5 rounded-xl border p-3"
        style={{
          borderColor: highlighted
            ? "var(--s360-primary)"
            : "rgba(67,133,255,0.6)",
          background:
            "linear-gradient(165deg, rgba(8,102,255,0.22), var(--s360-accent) 70%)",
        }}
        variants={{
          hidden: { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.12 }
        }
      >
        {/* Glow "acendendo" — overlay separado, so a opacidade anima. */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ boxShadow: "0 0 26px -6px rgba(8,102,255,0.55)" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.4, delay: 0.3 }
          }
        />
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="relative h-7 w-7 text-primary"
          variants={FADE_SCALE}
          transition={
            reduced ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: 0.4 }
          }
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="8.5" cy="9" r="1.6" fill="currentColor" />
          <path
            d="M4 17l5-5 3 3 4-5 4 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <motion.span
          className="relative h-1 w-3/4 origin-left rounded-full bg-white/30"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: 0.55 }
          }
        />
        <motion.span
          className="relative h-1 w-1/2 origin-left rounded-full bg-white/18"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: 0.62 }
          }
        />
      </motion.div>

      <motion.div
        className="flex h-[58%] w-[26%] flex-col items-center justify-end gap-1.5 rounded-lg border border-[rgba(122,158,255,0.25)] bg-white/[0.03] p-2.5"
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.35, ease: EASE, delay: 0.05 }
        }
      >
        <span className="h-1 w-full rounded-full bg-white/12" />
        <span className="h-1 w-2/3 rounded-full bg-white/12" />
      </motion.div>
    </motion.div>
  );
}

/**
 * Visualização 03 — Reputação: anel parcialmente preenchido (azul→violeta)
 * com estrela central, mais uma barra principal + secundárias abaixo — sem
 * nenhuma nota/percentual real, so proporcoes ilustrativas.
 *
 * ETAPA 5: o anel "desenha" via `pathLength` (0 → fração real já usada no
 * desenho estático), a estrela entra com escala suave logo depois, e as
 * barras crescem horizontalmente em sequência.
 *
 * CORRECAO CONJUNTA MOBILE — unica das 4 composicoes sem `max-h`/`max-w`
 * reduzidos: seus elementos (anel `h-16 w-16`, barras `h-1.5`) ja usam
 * tamanhos fixos em rem/px, nao um teto proporcional como as outras 3 —
 * encolhe-los exigiria mudar o proprio desenho (nao so a moldura ao redor),
 * o que a instrucao desta correcao pede explicitamente para nao fazer. A
 * moldura (`VisualFrame`, `min-h` reduzido acima) ainda cresce normalmente
 * para acomodar esta composicao sem cortar nada.
 */
function ReputationVisual() {
  const id = useId();
  const ringGrad = `${id}-ring`;
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  // Mesma fracao do circulo ja usada no desenho estatico (strokeDasharray
  // "152 214" = 152/214 do perimetro preenchido) — `pathLength` do Motion
  // usa uma escala 0-1, entao a fracao final e a mesma, so agora "desenhada".
  const RING_FRACTION = 152 / 214;

  return (
    <motion.div
      aria-hidden="true"
      className="flex h-full w-full max-w-[200px] flex-col items-center justify-center gap-4"
      initial="hidden"
      {...rootTrigger}
    >
      <svg viewBox="0 0 84 84" className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
        <defs>
          <linearGradient id={ringGrad} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--s360-primary)" />
            <stop offset="85%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle
          cx="42"
          cy="42"
          r="34"
          fill="none"
          stroke="rgba(122,158,255,0.25)"
          strokeWidth="5"
        />
        <motion.circle
          cx="42"
          cy="42"
          r="34"
          fill="none"
          stroke={`url(#${ringGrad})`}
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: RING_FRACTION },
          }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.7, ease: EASE }
          }
        />
        <motion.path
          d="M42 24.5l4.4 9 9.9 1.4-7.1 7 1.7 9.9-8.9-4.7-8.9 4.7 1.7-9.9-7.1-7 9.9-1.4z"
          fill="#f7f7f8"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 0.92, scale: 1 },
          }}
          style={{ transformOrigin: "42px 42px" }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.3, ease: EASE, delay: 0.55 }
          }
        />
      </svg>

      <div className="flex w-full flex-col gap-2">
        {[100, 74, 52, 30].map((width, i) => (
          <div key={width} className="h-1.5 w-full rounded-full bg-white/8">
            <motion.div
              className={cn(
                "h-full origin-left rounded-full",
                i === 0 ? "bg-primary" : "bg-[rgba(122,158,255,0.4)]",
              )}
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
              style={{ width: `${width}%` }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.35, ease: EASE, delay: 0.75 + i * 0.1 }
              }
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Visualização 04 — Presença local: radar de alcance (anéis concêntricos +
 * arco parcial + linhas radiais + pontos periféricos), com uma forma
 * abstrata central lembrando um pino de localização.
 *
 * ETAPA 5: anéis aparecem do centro para fora (o menor primeiro), pontos
 * periféricos surgem em seguida, o arco é "desenhado" via `pathLength`, e o
 * pino central aparece por último.
 */
function LocalPresenceVisual() {
  const id = useId();
  const glowId = `${id}-glow`;
  const shouldReduceMotion = useReducedMotion();
  const reduced = Boolean(shouldReduceMotion);

  const rootTrigger = reduced
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  const center = 80;
  // Do centro para fora: raio crescente = indice crescente de atraso.
  const rings = [28, 46, 64];
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  const dots = [15, 105, 195, 300];
  const ARC_FRACTION = 70 / 402;

  return (
    <motion.svg
      viewBox="0 0 160 160"
      className="h-full max-h-[125px] w-full max-w-[125px] sm:max-h-[150px] sm:max-w-[150px]"
      aria-hidden="true"
      initial="hidden"
      {...rootTrigger}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="rgba(67,133,255,0.55)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <motion.circle
        cx={center}
        cy={center}
        r="70"
        fill={`url(#${glowId})`}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.4 } }}
        transition={reduced ? { duration: 0 } : { duration: 0.5 }}
      />

      {/* 1. Aneis do centro para fora. */}
      {rings.map((r, i) => (
        <motion.circle
          key={r}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(122,158,255,0.22)"
          strokeWidth="1"
          variants={{
            hidden: { opacity: 0, scale: 0.3 },
            visible: { opacity: 1, scale: 1 },
          }}
          style={{ transformOrigin: `${center}px ${center}px` }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.35, ease: EASE, delay: i * 0.1 }
          }
        />
      ))}

      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={center}
            y1={center}
            x2={center + 68 * Math.cos(rad)}
            y2={center + 68 * Math.sin(rad)}
            stroke="rgba(122,158,255,0.14)"
            strokeWidth="1"
          />
        );
      })}

      {/* 2. Pontos perifericos. */}
      {dots.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = center + 55 * Math.cos(rad);
        const y = center + 55 * Math.sin(rad);
        return (
          <motion.circle
            key={deg}
            cx={x}
            cy={y}
            r="3"
            fill="#a855f7"
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 0.75, scale: 1 },
            }}
            style={{ transformOrigin: `${x}px ${y}px` }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.3, ease: EASE, delay: 0.4 + i * 0.06 }
            }
          />
        );
      })}

      {/* 3. Arco parcial — "desenhado" via pathLength. */}
      <motion.circle
        cx={center}
        cy={center}
        r="64"
        fill="none"
        stroke="var(--s360-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(-35 ${center} ${center})`}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: ARC_FRACTION, opacity: 0.85 },
        }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.65 }
        }
      />

      {/* 4. Pino central — por ultimo. */}
      <motion.path
        d="M80 58c9 0 16.5 7.2 16.5 16 0 11.5-16.5 27-16.5 27S63.5 85.5 63.5 74c0-8.8 7.5-16 16.5-16z"
        fill="var(--s360-primary)"
        variants={{
          hidden: { opacity: 0, scale: 0.5, y: -6 },
          visible: { opacity: 0.92, scale: 1, y: 0 },
        }}
        style={{ transformOrigin: `${center}px 74px` }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.35, ease: EASE, delay: 0.9 }
        }
      />
      <motion.circle
        cx="80"
        cy="74"
        r="5.5"
        fill="#050505"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.55 } }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.25, delay: 1.0 }
        }
      />
    </motion.svg>
  );
}
