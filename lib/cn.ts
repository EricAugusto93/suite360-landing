type ClassValue = string | number | false | null | undefined;

/**
 * Concatena classNames condicionalmente. Sem lib externa (clsx/tailwind-merge)
 * porque os componentes de UI aqui controlam suas proprias variantes e nao
 * precisam resolver conflitos de classes Tailwind sobrepostas.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
