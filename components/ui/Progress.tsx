import { cn } from "@/lib/cn";

type ProgressProps = {
  /** Valor de 0 a 100. */
  value: number;
  className?: string;
  label?: string;
};

/**
 * Barra de progresso generica e acessivel. A barra real do diagnostico
 * (FASE 05) reaproveita este componente, apenas alimentando `value` a
 * partir da etapa atual — nenhuma logica de wizard mora aqui.
 */
export function Progress({ value, className, label }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "bg-muted h-1.5 w-full overflow-hidden rounded-full",
        className,
      )}
    >
      <div
        className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
