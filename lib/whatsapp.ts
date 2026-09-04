import { resolveStateLabel } from "./constants";
import type { DiagnosticData } from "./types";

/**
 * Resolve o rotulo de segmento a ser exibido/enviado: o valor selecionado,
 * ou o texto customizado quando o visitante escolheu "Outro".
 */
export function resolveSegmentLabel(data: DiagnosticData): string {
  if (data.segment === "Outro") {
    return data.customSegment.trim();
  }
  return data.segment ?? "";
}

/**
 * Monta a mensagem do diagnostico (PLANEJAMENTO.md, secao 9). Funcao pura.
 * Assume dados completos: por construcao, o DiagnosticWizard so permite
 * chegar a confirmacao com segmento/cidade/empresa ja validados (nao
 * vazios), entao nao ha necessidade de logica defensiva para "remover
 * campos vazios" aqui — eles nunca chegam vazios nesse fluxo.
 */
export function buildDiagnosticMessage(data: DiagnosticData): string {
  const segment = resolveSegmentLabel(data);
  const stateLabel = resolveStateLabel(data.estado);
  const location = stateLabel ? `${data.city} - ${stateLabel}` : data.city;
  return `Olá! Vim pela página da Suite360 e quero receber meu Diagnóstico Gratuito do Perfil da Empresa no Google. Minha empresa é ${data.companyName}, do segmento ${segment}, em ${location}.`;
}

/**
 * Mensagem generica para quem quer falar direto com um especialista, sem
 * ter preenchido o diagnostico (Hero, CTA final, botao flutuante). Nao
 * finge que um diagnostico foi realizado.
 */
export function buildSpecialistMessage(): string {
  return "Olá! Vim pela página da Suite360 e gostaria de conversar com um especialista sobre o Perfil da minha empresa no Google.";
}

/**
 * Normaliza um numero de WhatsApp para o formato exigido pela URL wa.me:
 * somente digitos (codigo do pais + DDD + numero). Nao assume nenhuma
 * regra especifica de pais/operadora alem de um comprimento minimamente
 * plausivel para um telefone real — evita inventar regras comerciais nao
 * fornecidas. Retorna null quando o valor esta ausente ou nao parece um
 * numero de telefone valido.
 */
export function normalizeWhatsAppNumber(
  raw: string | undefined | null,
): string | null {
  if (!raw) return null;
  const digitsOnly = raw.replace(/\D/g, "");
  // Faixa plausivel para um numero internacional completo (codigo do
  // pais + DDD/area + numero). E.164 permite ate 15 digitos no total.
  if (digitsOnly.length < 10 || digitsOnly.length > 15) return null;
  return digitsOnly;
}

/**
 * Le e normaliza o numero configurado via NEXT_PUBLIC_WHATSAPP_NUMBER
 * (.env.example). Unico ponto de leitura dessa variavel — nenhum outro
 * arquivo deve acessar `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` direto.
 */
export function getConfiguredWhatsAppNumber(): string | null {
  return normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}

export function isWhatsAppConfigured(): boolean {
  return getConfiguredWhatsAppNumber() !== null;
}

/**
 * Unico ponto de construcao de URLs do WhatsApp no projeto (evita montar
 * `wa.me/...` manualmente em Hero, Header, Diagnostico, CTA final ou
 * botao flutuante). Retorna null quando o numero nao esta configurado —
 * quem chama decide o que fazer (ex.: renderizar um botao desabilitado),
 * mas nunca recebe um link falso.
 */
export function buildWhatsAppUrl(message: string): string | null {
  const number = getConfiguredWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
