import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ProfilePanelProps = {
  variant: "before" | "after";
};

/**
 * Painel abstrato de "perfil" — apenas barras representando completude de
 * informacao (nao fotos, nao estrelas, nao numeros). Evita deliberadamente
 * qualquer elemento que possa ser lido como uma metrica (ex.: "4 de 5
 * estrelas" ou "X fotos") — a diferenca entre os dois estados é só
 * estrutural/qualitativa.
 */
function ProfilePanel({ variant }: ProfilePanelProps) {
  const isAfter = variant === "after";
  return (
    <div
      className={cn(
        "shadow-subtle flex flex-1 flex-col gap-4 rounded-xl border p-6",
        isAfter
          ? "border-primary/25 bg-card"
          : "border-border bg-card-hover",
      )}
    >
      {/* Pequeno "chrome" de janela — reforca a leitura de interface real
          sem simular nenhuma tela especifica (FASE 14). */}
      <div aria-hidden="true" className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="bg-border h-2 w-2 rounded-full" />
          <span className="bg-border h-2 w-2 rounded-full" />
          <span className="bg-border h-2 w-2 rounded-full" />
        </div>
        <span
          className={cn(
            "text-caption rounded-full px-2.5 py-0.5 font-medium",
            isAfter
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isAfter ? "Otimizado" : "Incompleto"}
        </span>
      </div>
      <span className="text-caption text-muted-foreground font-medium tracking-wide uppercase">
        {isAfter ? "Depois" : "Antes"}
      </span>
      <div
        className={cn(
          "h-3.5 rounded-full",
          isAfter ? "bg-primary w-full" : "bg-muted w-2/3",
        )}
      />
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "bg-muted h-2.5 rounded-full",
            isAfter ? "w-full" : "w-1/2",
          )}
        />
        <div
          className={cn(
            "bg-muted h-2.5 rounded-full",
            isAfter ? "w-5/6" : "w-1/3",
          )}
        />
        <div
          className={cn(
            "bg-muted h-2.5 rounded-full",
            isAfter ? "w-2/3" : "w-1/4",
          )}
        />
        <div
          className={cn(
            "bg-muted h-2.5 rounded-full",
            isAfter ? "w-3/4" : "w-1/5",
          )}
        />
      </div>
    </div>
  );
}

/**
 * Composicao conceitual "analise -> execucao": nao e uma captura real de
 * nenhum perfil, apenas um diagrama proprio ilustrando estrutura mais
 * completa apos a otimizacao. Aria-hidden porque e puramente ilustrativo —
 * o mesmo conteudo (o que muda) esta descrito em texto ao lado.
 *
 * Tratamento "showcase" (pedido do usuario, inspirado numa composicao do
 * framer.com): envolvido num painel maior, com mais presenca visual, em
 * vez do par de cards pequeno lado a lado usado antes — sem inventar
 * nenhum dado novo, so aumentando a escala do mesmo diagrama honesto.
 */
export function OptimizationPreview() {
  return (
    <div className="border-border bg-muted shadow-medium w-full overflow-hidden rounded-xl border">
      <div
        aria-hidden="true"
        className="border-border bg-background-alt flex items-center gap-1.5 border-b px-5 py-3"
      >
        <span className="bg-border h-2.5 w-2.5 rounded-full" />
        <span className="bg-border h-2.5 w-2.5 rounded-full" />
        <span className="bg-border h-2.5 w-2.5 rounded-full" />
        <span className="text-caption text-muted-foreground ml-2 font-medium">
          Janela de análise — antes / depois
        </span>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
        >
          <ProfilePanel variant="before" />
          <ArrowRight
            size={24}
            className="text-primary shrink-0 rotate-90 sm:rotate-0"
          />
          <ProfilePanel variant="after" />
        </div>
        <p className="text-caption text-muted-foreground text-center">
          Representação conceitual do processo de otimização — não reflete um
          perfil real.
        </p>
      </div>
    </div>
  );
}
