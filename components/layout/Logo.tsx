import Image from "next/image";
import Link from "next/link";

/**
 * Logo oficial da Suite360 Films — lockup completo ("Suite360 Films" + "A
 * nova perspectiva.") sobre a textura em marmore preto da propria marca,
 * substituindo a versao anterior (so o texto "Suite", sobre fundo branco).
 * Usada exatamente como entregue (`public/brand/suite360-logo.png`),
 * nenhum pixel do desenho foi alterado ou recolorido.
 *
 * Diferente da versao anterior, este arquivo ja e pensado para fundo
 * escuro (o proprio fundo em marmore da marca), entao o "chip" claro que
 * existia so para dar contraste ao texto preto do logo antigo nao e mais
 * necessario — a imagem funciona diretamente sobre o Header/Footer,
 * ambos escuros.
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
