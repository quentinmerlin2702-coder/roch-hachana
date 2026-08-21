import {
  DELIVERY_AREA_LABEL,
  DELIVERY_FEE,
  FULFILLMENT_INFO,
  PICKUP_INFO,
  SIGNATURE_MENTION,
} from "@/lib/config";
import { formatPrice } from "@/lib/format";
import WhatsAppButton from "./WhatsAppButton";

const items = [
  {
    question: "Comment se passe le paiement ?",
    answer:
      "En espèces ou par Revolut, directement au moment du retrait ou de la livraison. Aucun paiement n'est demandé en ligne : vous réglez le vendeur en personne.",
  },
  {
    question: "Où et quand puis-je récupérer ma commande ?",
    answer: `${PICKUP_INFO} Vous pouvez aussi choisir la livraison à domicile (${DELIVERY_AREA_LABEL}), moyennant ${formatPrice(DELIVERY_FEE)}. ${FULFILLMENT_INFO}`,
  },
  {
    question: "Puis-je ajouter un message pour la personne qui reçoit la corbeille ?",
    answer:
      "Oui : lors de la commande, un champ facultatif vous permet d'écrire un message qui sera glissé dans la corbeille par le vendeur.",
  },
  {
    question: "Le tableau calligraphié est-il vraiment unique à chaque corbeille ?",
    answer: SIGNATURE_MENTION,
  },
  {
    question: "J'ai une autre question, comment vous contacter ?",
    answer: "Le plus simple est de nous écrire directement sur WhatsApp, nous répondons rapidement.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border border-gold-200/60 bg-cream-50 px-5 py-4 open:shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-garnet-800 marker:content-none">
            {item.question}
            <span className="shrink-0 text-lg font-normal text-gold-600 transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-honey-900/75">
            {item.answer}
          </p>
        </details>
      ))}
      <div className="mt-2 flex justify-center">
        <WhatsAppButton
          message="Bonjour ! J'ai une question sur vos corbeilles de Roch Hachana."
          label="Poser ma question sur WhatsApp"
        />
      </div>
    </div>
  );
}
