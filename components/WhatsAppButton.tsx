import { SELLER_WHATSAPP } from "@/lib/config";

type WhatsAppButtonProps = {
  message: string;
  label?: string;
  className?: string;
};

/**
 * Bouton qui ouvre WhatsApp avec un message pré-rempli.
 * Le message n'est JAMAIS envoyé automatiquement : c'est le client qui,
 * une fois dans WhatsApp, doit lui-même appuyer sur "Envoyer".
 */
export default function WhatsAppButton({
  message,
  label = "Contacter le vendeur sur WhatsApp",
  className = "",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:brightness-95 active:brightness-90 " +
        className
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-5 w-5 shrink-0 fill-current"
      >
        <path d="M16.04 3C9.37 3 3.98 8.39 3.98 15.06c0 2.23.6 4.32 1.65 6.12L3 29l8.02-2.58a12.03 12.03 0 0 0 5.02 1.1h.01c6.67 0 12.06-5.4 12.06-12.06C28.11 8.39 22.72 3 16.04 3Zm0 21.9h-.01a10 10 0 0 1-5.1-1.4l-.37-.22-4.76 1.53 1.55-4.64-.24-.38a9.87 9.87 0 0 1-1.53-5.27C5.58 9.5 10.28 4.8 16.04 4.8c2.79 0 5.4 1.09 7.37 3.06a10.36 10.36 0 0 1 3.05 7.2c0 5.75-4.7 10.44-10.42 10.44Zm5.72-7.82c-.31-.16-1.85-.91-2.14-1.01-.29-.11-.5-.16-.71.16-.21.31-.81 1.01-1 1.22-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.83.39-.29.31-1.09 1.07-1.09 2.6 0 1.53 1.12 3.01 1.27 3.22.16.21 2.2 3.36 5.32 4.71.74.32 1.32.51 1.77.65.74.24 1.42.2 1.95.12.6-.09 1.85-.75 2.11-1.48.26-.73.26-1.35.18-1.48-.08-.13-.28-.21-.59-.36Z" />
      </svg>
      {label}
    </a>
  );
}
