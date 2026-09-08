import { cn } from "@/lib/cn";

type SegmentState = "completed" | "current" | "future";

type SegmentedProgressProps = {
  /** Numero da etapa atual, comecando visualmente em 1 (nunca indice 0). */
  currentStep: number;
  /** Quantidade real de etapas — sempre uma fonte dinamica (STEP_ORDER.length, calculado no DiagnosticWizard), nunca escrita a mao aqui. */
  totalSteps: number;
  /** Descricao acessivel opcional (ex.: com o nome da etapa atual, ja usada pelo wizard) — sobrescreve o `aria-valuetext` padrao quando informada. */
  label?: string;
};

/**
 * Progresso segmentado do console do Diagnostico (ETAPA 3) — substitui a
 * exibicao visual da antiga barra continua (`components/ui/Progress.tsx`,
 * que continua existindo e sendo usada normalmente por quem mais precisar
 * dela; nao foi alterada) por seis blocos discretos, um por etapa real do
 * wizard.
 *
 * Estado de cada segmento (secao 8 do pedido): compara o NUMERO da etapa do
 * segmento (indice + 1) com `currentStep`. Etapas anteriores a atual ficam
 * "completed"; a etapa atual fica "current"; as posteriores ficam "future".
 * Na Etapa 1 isso da 1 segmento "current" + 5 "future" (nada foi de fato
 * concluido ainda); a partir da Etapa 2, o(s) segmento(s) anterior(es)
 * passam a "completed" e o atual continua "current" — uma unica regra de
 * comparacao cobre as duas leituras pedidas ("so o primeiro ativo" na
 * etapa 1; "primeiro concluido + segundo atual" na etapa 2), sem precisar
 * de um caso especial para a primeira etapa.
 *
 * Server Component puro (sem "use client", sem hooks, sem estado) — recebe
 * tudo por props e renderiza JSX estatico, entao importa-lo no
 * `DiagnosticWizard.tsx` (Client Component) nao exige nenhuma mudanca de
 * runtime aqui.
 */
export function SegmentedProgress({
  currentStep,
  totalSteps,
  label,
}: SegmentedProgressProps) {
  const segments = Array.from({ length: totalSteps }, (_, index) => {
    const stepNumber = index + 1;
    const state: SegmentState =
      stepNumber < currentStep
        ? "completed"
        : stepNumber === currentStep
          ? "current"
          : "future";
    return { stepNumber, state };
  });

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-primary text-[0.7rem] font-semibold tracking-[0.08em] whitespace-nowrap uppercase sm:text-[0.75rem]">
          Etapa {String(currentStep).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground text-[0.7rem] font-medium tracking-[0.04em] whitespace-nowrap uppercase sm:text-[0.75rem]">
          {currentStep} de {totalSteps}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-valuetext={label ?? `Etapa ${currentStep} de ${totalSteps}`}
        className="flex items-center gap-1.5"
      >
        {segments.map(({ stepNumber, state }) => (
          <span
            key={stepNumber}
            aria-hidden="true"
            className={cn(
              // ETAPA 5 — cor E glow no MESMO conjunto de classes (nao mais
              // `style` inline separado) para que ambos entrem na lista de
              // `transition-[...]` e interpolem juntos ("glow acompanha",
              // 200-350ms pedido). O estado "current" usava um gradiente
              // (`background` shorthand via `style`) — CSS nao interpola
              // suavemente de uma cor solida para um gradiente (nem
              // vice-versa), entao a transicao declarada nunca se via de
              // fato; um azul solido mais claro no lugar do gradiente
              // resolve isso mantendo a mesma familia de cor (a extremidade
              // mais clara do gradiente antigo) e a diferenciacao de
              // intensidade em relacao a "completed" (glow mais forte).
              "h-1.5 flex-1 rounded-full transition-[background-color,box-shadow] duration-300",
              state === "future" && "bg-[rgba(103,140,255,0.14)]",
              state === "completed" &&
                "bg-[var(--s360-primary)] shadow-[0_0_8px_0_rgba(8,102,255,0.4)]",
              state === "current" &&
                "bg-[#4d8dff] shadow-[0_0_12px_1px_rgba(8,102,255,0.55)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
