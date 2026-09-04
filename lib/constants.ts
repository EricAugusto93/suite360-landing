import {
  Briefcase,
  Ellipsis,
  PawPrint,
  Scissors,
  Sparkles,
  Stethoscope,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { BusinessSize, Segment, UF } from "./types";

type SegmentOption = {
  value: Segment;
  label: string;
  icon: typeof Scissors;
};

export const SEGMENT_OPTIONS: SegmentOption[] = [
  { value: "Barbearia", label: "Barbearia", icon: Scissors },
  { value: "Pet Shop", label: "Pet Shop", icon: PawPrint },
  { value: "Perfumaria", label: "Perfumaria", icon: Sparkles },
  { value: "Restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { value: "Clínica", label: "Clínica", icon: Stethoscope },
  { value: "Loja", label: "Loja", icon: Store },
  { value: "Escritório", label: "Escritório", icon: Briefcase },
  { value: "Outro", label: "Outro", icon: Ellipsis },
];

export const SIZE_OPTIONS: BusinessSize[] = ["Pequena", "Média", "Grande"];

type StateOption = { value: UF; label: string };

/**
 * Os 26 estados brasileiros + Distrito Federal, na ordem alfabetica da
 * sigla. `value` (UF) e o dado persistido pelo diagnostico; `label` (nome
 * completo) e o que aparece no select para o usuario.
 */
export const STATE_OPTIONS: StateOption[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

/** Resolve a sigla de UF armazenada para o nome completo exibido ao usuario. */
export function resolveStateLabel(uf: UF | null): string {
  return STATE_OPTIONS.find((option) => option.value === uf)?.label ?? "";
}

/**
 * NOTA (FASE 11): existia aqui um objeto `ANALYTICS_EVENTS` remapeando
 * nomes de evento camelCase -> snake_case. Removido: `lib/analytics.ts`
 * agora tipa os nomes de evento diretamente via `AnalyticsEventName`
 * (chaves de `EventParamsMap`), e o TypeScript ja impede um nome invalido
 * em `trackEvent(...)` — a camada extra de indirecao nao adicionava mais
 * seguranca nenhuma.
 */

/**
 * As 4 frentes da metodologia (FASE 06), reutilizadas como referencia na
 * secao de Solucao (FASE 07) para reforcar que a otimizacao cobre as mesmas
 * areas analisadas — fonte unica para nao dessincronizar os rotulos entre
 * MethodologySection e SolutionSection.
 */
export const METHODOLOGY_AREAS = [
  "Estrutura do perfil",
  "Conteúdo",
  "Reputação",
  "Presença local",
] as const;
