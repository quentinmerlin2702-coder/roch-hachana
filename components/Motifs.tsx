// Motifs décoratifs très discrets (grenade, branche/feuilles), inspirés de
// Roch Hachana. Toujours utilisés en filigrane (faible opacité, décor
// purement visuel) : jamais au premier plan, jamais devant une photo produit.

type MotifProps = { className?: string };

/** Silhouette de grenade au trait fin, avec quelques pépins suggérés. */
export function PomegranateMotif({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M100 30c-6 8-10 14-10 14s-34 8-34 56c0 40 24 84 44 90 20-6 44-50 44-90 0-48-34-56-34-56s-4-6-10-14Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M78 42c4-10 14-18 22-18s18 8 22 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M92 20c2 4 8 4 10 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <circle cx="88" cy="110" r="4" />
        <circle cx="108" cy="98" r="4" />
        <circle cx="112" cy="128" r="4" />
        <circle cx="92" cy="140" r="4" />
        <circle cx="118" cy="150" r="4" />
      </g>
    </svg>
  );
}

/** Petite branche avec quelques feuilles, au trait fin. */
export function BranchMotif({ className }: MotifProps) {
  return (
    <svg
      viewBox="0 0 260 140"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 120c40-30 90-45 130-52 40-7 80-6 110-24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [55, 96, -18],
        [95, 82, 8],
        [140, 68, -14],
        [185, 52, 12],
        [222, 40, -10],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0,0 C10,-9 24,-6 22,6 C10,7 3,4 0,0 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          transform={`translate(${x},${y}) rotate(${r})`}
        />
      ))}
    </svg>
  );
}
