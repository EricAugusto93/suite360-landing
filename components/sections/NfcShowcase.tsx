import { NfcDisplayVisual } from "./NfcDisplayVisual";

/**
 * Representacao conceitual do display fisico — fotos reais do produto
 * ainda nao foram fornecidas (PLANEJAMENTO.md, secao 14, item 2).
 *
 * ETAPA 2 ("Display NFC premium") — o retangulo azul solido original foi
 * substituido por `NfcDisplayVisual` (placa de vidro/acrilico + nucleo NFC),
 * construido em HTML/CSS/icones ja existentes, sem imagem rasterizada.
 * Este arquivo continua so o "envelope" (visual + legenda) — a composicao
 * visual em si vive isolada em `NfcDisplayVisual.tsx`.
 *
 * Legenda revisada na FASE 12: descreve o que a imagem E ("representacao
 * conceitual"), sem prometer uma substituicao futura ao visitante — essa
 * e uma nota de pipeline interno, que pertence aqui e em PLANEJAMENTO.md,
 * nao na interface publica (ver PLANEJAMENTO.md, secao 14.12). Texto
 * preservado identico na ETAPA 2 (pedido explicito).
 */
export function NfcShowcase() {
  return (
    <div className="flex flex-col gap-3">
      <NfcDisplayVisual />
      <p className="text-caption text-muted-foreground text-center">
        Representação conceitual do display de avaliações.
      </p>
    </div>
  );
}
