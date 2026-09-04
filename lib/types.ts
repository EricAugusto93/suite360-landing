export type Segment =
  | "Barbearia"
  | "Pet Shop"
  | "Perfumaria"
  | "Restaurante"
  | "Clínica"
  | "Loja"
  | "Escritório"
  | "Outro";

export type BusinessSize = "Pequena" | "Média" | "Grande";

/**
 * Sigla de UF — os 26 estados brasileiros + Distrito Federal. Usado para
 * armazenar o campo "Estado" do diagnostico (a sigla e o valor persistido;
 * o nome completo, exibido ao usuario, vem de `STATE_OPTIONS` em
 * lib/constants.ts).
 */
export type UF =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

/**
 * Dados coletados pelo Diagnostico Google 360 (FASE 05). Estrutura pensada
 * para alimentar `lib/whatsapp.ts` sem precisar de mudancas quando a
 * integracao real for ativada (FASE 09).
 *
 * `estado`: campo adicionado a pedido do usuario, selecionado antes de
 * `city` (a etapa "state" fica entre "size" e "city" em
 * `DIAGNOSTIC_STEP_IDS`, abaixo).
 */
export type DiagnosticData = {
  segment: Segment | null;
  /** Preenchido apenas quando segment === "Outro". */
  customSegment: string;
  size: BusinessSize | null;
  estado: UF | null;
  city: string;
  companyName: string;
};

/**
 * Depoimento real e autorizado de cliente (pedido do usuario, fora do
 * fluxo de fases). Sem foto — nenhuma foto real de cliente existe ainda,
 * e nao usamos foto de banco de imagens fingindo ser de um cliente real
 * (ver components/sections/TestimonialWheel.tsx).
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const DIAGNOSTIC_STEP_IDS = [
  "segment",
  "size",
  "state",
  "city",
  "company",
  "confirmation",
] as const;

export type DiagnosticStepId = (typeof DIAGNOSTIC_STEP_IDS)[number];
