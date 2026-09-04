import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial da Suite360 Films (FASE 13), aplicada via `next/image`.
 * Arquivo original (`public/brand/suite360-logo.png`) tinha uma area
 * retangular opaca branca por tras do texto, bem maior que o desenho em
 * si — um defeito de exportacao, invisivel sobre fundo branco mas que
 * apareceria como uma caixa sobre qualquer outro fundo. Corrigido de
 * forma minima: pixels quase-brancos tornados transparentes e a imagem
 * cortada para o conteudo real — nenhum pixel do desenho (a marca em si)
 * foi alterado, redesenhado ou recolorido. Ver PLANEJAMENTO.md, secao 14.15.
 *
 * A marca fornecida contem apenas o texto "Suite" (sem "360"/"Films") —
 * usada aqui exatamente como entregue, sem completar o nome com texto
 * adicional (isso seria alterar a marca). O nome completo "Suite360
 * Films" continua em toda a copy/metadata da pagina, inalterado.
 *
 * Testado sobre fundo escuro: as bordas antialiased do arquivo foram
 * desenhadas para fundir com branco e aparecem como contorno claro sobre
 * fundo escuro. Nao ha versao oficial para fundo escuro e nenhum filtro CSS
 * foi usado para simular uma (instrucao explicita da fase) — em vez disso,
 * com a reformulacao para uma experiencia majoritariamente escura (Header
 * e Footer inclusive), a logo passou a ficar sobre um pequeno "chip" claro
 * (mesma tecnica usada por muitas marcas com logo mono-fundo em interfaces
 * dark): nenhum pixel do arquivo e alterado, so a superficie ao redor.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="focus-visible:ring-primary focus-visible:ring-offset-background inline-flex w-fit shrink-0 items-center self-start rounded-md bg-[#f7f7f8] px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Image
        src="/brand/suite360-logo.png"
        alt="Suite360 Films"
        width={462}
        height={294}
        priority
        className="h-6 w-auto sm:h-7"
      />
    </Link>
  );
}
