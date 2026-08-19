import {
  CHARITY_MENTION,
  MDA_LOGO_SRC,
  SELLER_DISPLAY_PHONE,
  SELLER_WHATSAPP,
  SHOP_NAME,
  SHOP_TAGLINE,
  SITE_CREATOR,
} from "@/lib/config";
import { StarOfDavidIcon } from "./Icons";
import WhatsAppButton from "./WhatsAppButton";

export default function Footer() {
  const telHref = `tel:+${SELLER_WHATSAPP}`;

  return (
    <footer className="mt-24 border-t border-gold-400/30 bg-garnet-950 text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-gold-200">
              <StarOfDavidIcon className="h-5 w-5 shrink-0" />
              {SHOP_NAME}
            </p>
            <p className="text-sm text-cream-100/65">{SHOP_TAGLINE}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cream-100/45">
              Produits casher & de qualité
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300/90">
              Nous contacter
            </p>
            <p className="text-sm text-cream-100/75">
              Pour plus d&apos;infos, contactez-nous au{" "}
              <a
                href={telHref}
                className="font-semibold text-gold-200 hover:underline"
              >
                {SELLER_DISPLAY_PHONE}
              </a>
            </p>
            <p className="text-xs text-cream-100/50">
              Retrait 16ᵉ arrondissement · Livraison à Paris
            </p>
            <WhatsAppButton
              message="Bonjour ! J'ai une question sur vos corbeilles de Roch Hachana."
              label="Contactez-nous sur WhatsApp"
              className="mt-1 !px-4 !py-2 !text-xs"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-300/90">
              Un geste solidaire
            </p>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MDA_LOGO_SRC}
                alt="Magen David Adom"
                className="h-6 w-6 shrink-0 rounded-full"
              />
              <p className="text-sm text-cream-100/75">{CHARITY_MENTION}</p>
            </div>
          </div>
        </div>

        <div className="ornament-divider mt-10 pt-6 text-center">
          <p className="text-xs tracking-wide text-cream-100/40">
            Chana Tova Oumétouka — Que votre année soit douce et sucrée
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] text-cream-100/25">
          Créé par {SITE_CREATOR}
        </p>
      </div>
    </footer>
  );
}
