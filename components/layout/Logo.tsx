import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial — lockup completo "Suite360 Films" (+ "A nova
 * perspectiva."), sobre a textura em marmore preto da propria marca.
 *
 * Corrige um problema real encontrado no arquivo alternativo so-wordmark
 * ("logo suite.png"): aquele arquivo tem o MESMO conteudo completo (Suite +
 * 360 + Films + tagline), mas foi exportado sobre fundo BRANCO — como o
 * "360 Films"/tagline sao desenhados em branco, ficam invisiveis sobre o
 * proprio fundo branco (defeito de exportacao do arquivo fonte, nao algo
 * corrigivel via crop/transparencia: nao ha como distinguir "texto branco"
 * de "fundo branco" depois de exportados com a mesma cor). O arquivo em
 * marmore usado aqui e a mesma arte, exportada corretamente (fundo escuro
 * de proposito), entao TODO o conteudo (Suite/360/Films/tagline) fica
 * visivel — por isso e "a imagem original" pedida, sem nenhum pixel do
 * desenho alterado ou recolorido.
 *
 * Fundo ja escuro por natureza (a propria textura em marmore) — funciona
 * direto sobre o Header/Footer, sem precisar do "chip" claro (esse chip so
 * fazia sentido para a versao wordmark, com texto preto).
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="focus-visible:ring-primary focus-visible:ring-offset-background inline-flex w-fit shrink-0 items-center self-start rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Image
        src="/brand/suite360-logo.png"
        alt="Suite360 Films"
        width={875}
        height={875}
        priority
        className="h-11 w-11 rounded-lg sm:h-12 sm:w-12"
      />
    </Link>
  );
}
