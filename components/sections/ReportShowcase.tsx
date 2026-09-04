import { FileText } from "lucide-react";

/**
 * Modelo abstrato de documento (paginas empilhadas + linhas esqueleticas) —
 * o relatorio real ainda nao existe (PLANEJAMENTO.md, secao 14, item 2).
 * Nenhum numero, posicao ou grafico e mostrado, mesmo de forma generica,
 * para nao correr o risco de parecer um dado real por engano.
 *
 * Legenda revisada na FASE 12: descreve o que a imagem E ("modelo
 * ilustrativo"), sem prometer uma substituicao futura ao visitante — essa
 * e uma nota de pipeline interno, que pertence aqui e em PLANEJAMENTO.md,
 * nao na interface publica (ver PLANEJAMENTO.md, secao 14.12).
 */
export function ReportShowcase() {
  return (
    <div className="flex flex-col gap-3">
      <div
        aria-hidden="true"
        className="relative mx-auto h-36 w-full max-w-[260px]"
      >
        <div className="border-border bg-muted absolute inset-x-4 top-4 h-full rounded-xl border" />
        <div className="border-border bg-card absolute inset-x-2 top-2 h-full rounded-xl border" />
        <div className="border-border bg-card shadow-medium absolute inset-0 flex flex-col gap-2 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <FileText size={16} className="text-primary" />
            <div className="flex gap-1.5">
              <span className="bg-border h-1.5 w-1.5 rounded-full" />
              <span className="bg-border h-1.5 w-1.5 rounded-full" />
              <span className="bg-border h-1.5 w-1.5 rounded-full" />
            </div>
          </div>
          <div className="bg-muted h-1.5 w-3/4 rounded-full" />
          <div className="bg-muted h-1.5 w-full rounded-full" />
          <div className="bg-muted h-1.5 w-2/3 rounded-full" />
        </div>
      </div>
      <p className="text-caption text-muted-foreground text-center">
        Modelo ilustrativo do relatório de entrega.
      </p>
    </div>
  );
}
