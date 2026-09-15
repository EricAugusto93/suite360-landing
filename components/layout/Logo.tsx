import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial — lockup completo "Suite360 Films" + "A nova perspectiva.",
 * arquivo `suite360-wordmark.png` (840x387), gerado a partir do arquivo
 * fonte enviado pelo usuario ("logo suite.png") em duas correcoes pontuais,
 * ambas confirmadas explicitamente antes de aplicar:
 *
 * 1. O arquivo fonte tinha um retangulo branco OPACO atras so da palavra
 *    "Suite" (confirmado pixel a pixel — o resto, "360"/"Films"/tagline/
 *    bordas, ja era transparente de verdade). Removido via un-matte contra
 *    branco (luminancia -> alpha, preservando a anti-serrilhagem original)
 *    numa regiao identificada por flood-fill (o "blob" conectado da
 *    palavra "Suite", comprovadamente separado do blob de "360"/"Films").
 *    Nenhum pixel de "360"/"Films"/tagline foi tocado nessa etapa.
 * 2. "Suite" era desenhado em preto solido — invisivel sobre o fundo do
 *    header (`--s360-background: #050505`, quase preto puro). Recolorido
 *    para branco (mesmo tom de "360"/"Films"/tagline), mantendo a mesma
 *    cobertura/anti-serrilhagem calculada no passo 1 — so a cor da tinta
 *    mudou, nenhuma letra foi redesenhada, redimensionada ou recortada.
 *
 * Depois disso, a imagem foi cortada (crop) so no espaco vazio/transparente
 * ao redor de todo o conteudo visivel (nenhum pixel de desenho removido) —
 * necessario para o `next/image` calcular a proporcao real do lockup
 * (840x387, bem mais largo que alto) em vez de um quadrado com margem
 * vazia. `w-auto` + altura fixa preserva essa proporcao original em
 * qualquer tamanho de tela.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="focus-visible:ring-primary focus-visible:ring-offset-background inline-flex w-fit shrink-0 items-center self-start rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Image
        src="/brand/suite360-wordmark-v2.png"
        alt="Suite360 Films — A nova perspectiva."
        width={840}
        height={387}
        priority
        className="h-12 w-auto sm:h-14"
      />
    </Link>
  );
}
