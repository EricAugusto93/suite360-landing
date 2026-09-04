/**
 * Cinco marcas compactas (18x18) para os "sinais" detectados pelo radar do
 * Hero — desenhos proprios, distintos dos icones de ProblemIcons.tsx (que
 * carregam uma semantica de "incompleto/ausente"; aqui a leitura e neutra/
 * positiva: "isto foi encontrado pela varredura"). Usam `currentColor`,
 * mesmo padrao de uso do lucide-react.
 */

type IconProps = { className?: string };

export function LocationMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M9 2.5l4 4-4 9-4-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function ReviewsMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" opacity="0.3" />
      <path d="M9 3.5a5.5 5.5 0 014.2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="3.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function RepliesMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 6.2A2.2 2.2 0 015.2 4h7.6A2.2 2.2 0 0115 6.2v3a2.2 2.2 0 01-2.2 2.2H9l-2.6 2.4v-2.4H5.2A2.2 2.2 0 013 9.2v-3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhotosMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="7.5" r="1" fill="currentColor" />
      <path
        d="M4.5 12l3-3 2.2 2.2 2.5-2.7 2.3 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoriesMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 3.5h4.6c.3 0 .58.12.8.34l5.3 5.3a1.1 1.1 0 010 1.56l-3.1 3.1a1.1 1.1 0 01-1.56 0l-5.3-5.3a1.1 1.1 0 01-.34-.8V3.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="6.3" cy="6.3" r="0.9" fill="currentColor" />
    </svg>
  );
}
