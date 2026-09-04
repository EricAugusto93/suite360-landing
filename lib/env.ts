/**
 * Validacao minima de configuracao publica (FASE 12). Nao e um framework de
 * validacao de env — sao 2 funcoes puras, usadas nos 2 lugares que
 * precisam decidir se um valor configurado e realmente utilizavel antes de
 * confiar nele (evita, por exemplo, `new URL(siteUrl)` quebrar a aplicacao
 * inteira por causa de um valor mal formatado em produção). O numero de
 * WhatsApp ja tem sua propria validacao dedicada em `lib/whatsapp.ts`
 * (`normalizeWhatsAppNumber`) — nao duplicada aqui.
 */

export function isValidSiteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

export function isValidGtmId(value: string): boolean {
  return GTM_ID_PATTERN.test(value);
}
