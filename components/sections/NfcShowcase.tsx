import { Nfc } from "lucide-react";

/**
 * Representacao conceitual do display fisico — fotos reais do produto
 * ainda nao foram fornecidas (PLANEJAMENTO.md, secao 14, item 2). Um
 * retangulo estilizado com o icone de NFC deixa claro que e um diagrama,
 * nao uma tentativa de simular fotografia do item real.
 *
 * Legenda revisada na FASE 12: descreve o que a imagem E ("representacao
 * conceitual"), sem prometer uma substituicao futura ao visitante — essa
 * e uma nota de pipeline interno, que pertence aqui e em PLANEJAMENTO.md,
 * nao na interface publica (ver PLANEJAMENTO.md, secao 14.12).
 */
export function NfcShowcase() {
  return (
    <div className="flex flex-col gap-3">
      <div
        aria-hidden="true"
        className="bg-primary shadow-elevated relative mx-auto flex aspect-[16/10] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-xl"
      >
        <div className="border-primary-foreground/20 absolute h-24 w-24 rounded-full border" />
        <div className="border-primary-foreground/20 absolute h-16 w-16 rounded-full border" />
        <Nfc size={32} className="text-primary-foreground relative" />
      </div>
      <p className="text-caption text-muted-foreground text-center">
        Representação conceitual do display de avaliações.
      </p>
    </div>
  );
}
