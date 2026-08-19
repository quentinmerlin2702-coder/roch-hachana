import { CHARITY_MENTION, MDA_LOGO_SRC } from "@/lib/config";

/**
 * Bandeau tout en haut du site, pour mettre en avant le partenariat
 * solidaire avec Magen David Adom.
 */
export default function TopBanner() {
  return (
    <div className="bg-garnet-950 text-cream-100">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-4 py-2.5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MDA_LOGO_SRC}
          alt="Magen David Adom"
          className="h-4 w-4 shrink-0 rounded-full"
        />
        <p className="text-[11px] font-medium tracking-wide text-gold-200 sm:text-xs">
          {CHARITY_MENTION}
        </p>
      </div>
    </div>
  );
}
