// Icônes fines (traits, style ligne) utilisées à la place des emojis pour un
// rendu plus sobre et premium. Toutes acceptent une className standard.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Étoile de David — casher / Magen David. */
export function StarOfDavidIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <polygon points="12,3 19.8,17 4.2,17" />
      <polygon points="12,21 4.2,7 19.8,7" />
    </svg>
  );
}

/** Plume de calligraphie — signature artisanale. */
export function FeatherIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M20.5 3.5c-4 0-9 2-12.5 5.5C4.5 12.5 3 17 3 20.5c3.5 0 8-1.5 11.5-5 3.5-3.5 5.5-8.5 5.5-12.5Z" />
      <path d="M13 11 4 20" />
      <path d="M14 7.5c-2 1-4.5 3-6 5" />
    </svg>
  );
}

/** Voiture — livraison. */
export function DeliveryIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 16V9.5a1 1 0 0 1 1-1h9.5l4 4H21a1 1 0 0 1 1 1V16" />
      <path d="M3 16h1.5M17.5 16H9.5M21 16h-1" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

/** Maison — retrait. */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
      <path d="M10 20.5v-6h4v6" />
    </svg>
  );
}

/** Billet — espèces. */
export function CashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="2.5" y="6.5" width="19" height="12" rx="1.5" />
      <circle cx="12" cy="12.5" r="3" />
      <path d="M5.5 9v0M18.5 16v0" />
    </svg>
  );
}

/** Carte bancaire — Revolut. */
export function CardIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.8" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" />
    </svg>
  );
}

/** Cadeau — message cadeau. */
export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3.5" y="9.5" width="17" height="11" rx="1" />
      <path d="M3.5 13.5h17" />
      <path d="M12 9.5v11" />
      <path d="M12 9.5c-1-2.8-3-4-4.5-3.2C6 7 6.3 9 8 9.5Z" />
      <path d="M12 9.5c1-2.8 3-4 4.5-3.2C18 7 17.7 9 16 9.5Z" />
    </svg>
  );
}

/** Cœur — geste solidaire / association. */
export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 20.2S3.8 15 3.8 9.3A4.3 4.3 0 0 1 12 6.8a4.3 4.3 0 0 1 8.2 2.5c0 5.7-8.2 10.9-8.2 10.9Z" />
    </svg>
  );
}

/** Coche dans un cercle — confirmation. */
export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.3 12.3 2.6 2.6 4.8-5.4" />
    </svg>
  );
}

/** Panier / corbeille vide. */
export function BasketIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 10h16l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3L4 10Z" />
      <path d="M8 10 9.5 4M16 10 14.5 4M2.5 10h19" />
    </svg>
  );
}

/** Loupe — page introuvable. */
export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}
