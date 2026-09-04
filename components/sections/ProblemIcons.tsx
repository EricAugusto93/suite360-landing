/**
 * Cinco icones tecnicos e proprios para os pontos de atencao do perfil —
 * substituem os icones Lucide padrao (MapPin/Star/Images/Tag/MessageSquare)
 * usados antes, a pedido explicito do usuario ("icones mais bonitos,
 * sofisticados e tecnologicos"). Desenhados em SVG (viewBox 24x24, traco
 * 1.5px), usando `currentColor` — herdam a cor de texto do elemento pai
 * (mesmo padrao de uso do lucide-react, então o componente que os usa nao
 * muda: so troca o `icon` por um destes).
 */

type IconProps = { className?: string };

/** Informações incompletas — cartão de dados com um campo tracejado (em falta). */
export function IncompleteInfoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7.5" y1="9" x2="16.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7.5" y1="12.4" x2="14" y2="12.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <line
        x1="7.5"
        y1="15.8"
        x2="16.5"
        y2="15.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1.6 2.2"
        opacity="0.4"
      />
    </svg>
  );
}

/** Poucas avaliações — anel de progresso parcial com um ponto de destaque. */
export function FewReviewsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path
        d="M12 5a7 7 0 015.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="5" r="1.4" fill="currentColor" />
      <circle cx="9.4" cy="12" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="12.6" cy="14.2" r="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/** Fotos pouco estratégicas — molduras sobrepostas com uma marca de conteúdo genérico. */
export function GenericPhotosIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="7.5" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="7" y="4.5" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="8" r="1.1" fill="currentColor" />
      <path
        d="M8.3 12.3l2.3-2.3 2 2 2.5-2.5 2.9 2.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Categorias mal aproveitadas — etiqueta conectada a um nó desalinhado. */
export function MisalignedTagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5.5h6.1c.4 0 .78.16 1.06.44l6.1 6.1a1.5 1.5 0 010 2.12l-4.1 4.1a1.5 1.5 0 01-2.12 0l-6.1-6.1A1.5 1.5 0 015.5 11V5.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <path
        d="M15 15.5l3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="1 2.2"
        opacity="0.55"
      />
    </svg>
  );
}

/** Respostas ausentes — balão de pergunta respondido por um balão tracejado (sem resposta). */
export function MissingReplyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7.2A2.2 2.2 0 016.2 5h5.6A2.2 2.2 0 0114 7.2v2.6a2.2 2.2 0 01-2.2 2.2H9l-2.6 2.6v-2.6H6.2A2.2 2.2 0 014 9.8V7.2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13.2 10.8h4.6A2.2 2.2 0 0120 13v2.4a2.2 2.2 0 01-2.2 2.2H17v2.4l-2.4-2.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="1.8 2.2"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}
