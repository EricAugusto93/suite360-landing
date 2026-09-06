import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial — voltou a ser o wordmark "Suite" (pedido explicito do
 * usuario, revertendo o lockup quadrado "Suite360 Films" em marmore preto
 * usado anteriormente). Arquivo fonte (`logo suite.png`, na raiz do
 * projeto) tinha uma area retangular opaca branca por tras do texto, bem
 * maior que o desenho em si — mesmo defeito de exportacao ja documentado
 * antes neste projeto. Corrigido da mesma forma (nao redesenhado): pixels
 * quase-brancos tornados transparentes e a imagem cortada para o conteudo
 * real via sharp, sem alterar nenhum pixel do desenho em si. Resultado
 * salvo em `public/brand/suite360-logo.png` (462x294, mesmas proporcoes do
 * arquivo fonte).
 *
 * O desenho e preto sobre fundo transparente — precisa do "chip" claro
 * (Header/Footer sao escuros) para ter contraste, mesmo padrao usado antes
 * do lockup em marmore. Tamanho aumentado bem alem do anterior (pedido
 * explicito: "aumentar o tamanho de forma que se ajuste perfeitamente ao
 * cabecalho") — a altura do chip (~48px no mobile, ~60px no desktop) usa
 * a maior parte da altura do Header (h-16/h-20) sem tocar as bordas.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="focus-visible:ring-primary focus-visible:ring-offset-background bg-[#f7f7f8] inline-flex w-fit shrink-0 items-center self-start rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-3.5 sm:py-2.5"
    >
      <Image
        src="/brand/suite360-logo.png"
        alt="Suite360 Films"
        width={462}
        height={294}
        priority
        className="h-8 w-auto sm:h-10"
      />
    </Link>
  );
}
