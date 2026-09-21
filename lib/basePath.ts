/**
 * Prefixo de path usado quando a landing e publicada fora da raiz do
 * dominio (export estatico para https://suite360films.com/Google — ver
 * `next.config.ts`, `STATIC_EXPORT`). Variavel publica (`NEXT_PUBLIC_*`)
 * de proposito: componentes Client (ex.: `HeroVisual.tsx`) tambem
 * precisam dela no navegador, nao so no servidor.
 *
 * `next/image` com `images.unoptimized: true` NAO aplica o `basePath`
 * automaticamente ao `src` — achado real, confirmado inspecionando o HTML
 * exportado (o prefixo normalmente vem da construcao da URL do loader de
 * otimizacao de imagem, que e pulada quando `unoptimized` esta ativo).
 * Componentes que usam `next/image` com um `src` de `/public` (nao um
 * import estatico) precisam prefixar manualmente com este valor.
 *
 * Vazio no build normal (Vercel/`next dev`) — nenhuma mudanca de
 * comportamento ali; os `src` continuam exatamente como estavam.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
