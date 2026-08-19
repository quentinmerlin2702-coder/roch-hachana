// Réglages généraux de la boutique.
// Modifiez ces valeurs pour personnaliser le site sans toucher au reste du code.

export const SHOP_NAME = "Les Douceurs de Roch Hachana";
export const SHOP_TAGLINE = "Corbeilles cadeaux casher pour Roch Hachana";

// Numéro WhatsApp du vendeur, au format international SANS "+" ni espaces.
export const SELLER_WHATSAPP = "33768435103";

export const SELLER_DISPLAY_PHONE = "07 68 43 51 03";

// Adresse qui reçoit l'email de notification pour chaque nouvelle commande.
export const SELLER_EMAIL = "joseph.hababou2655@gmail.com";

// Adresse d'expédition utilisée par Resend. "onboarding@resend.dev" fonctionne
// sans configuration pour envoyer VERS votre propre adresse (idéal pour les
// notifications de commande à vous-même). Si vous vérifiez votre propre nom
// de domaine sur resend.com, vous pourrez le remplacer par une adresse du
// type "commandes@votredomaine.com".
export const EMAIL_FROM = `${SHOP_NAME} <onboarding@resend.dev>`;

// Retrait et livraison
export const PICKUP_INFO =
  "Retrait gratuit dans le 16ᵉ arrondissement de Paris (adresse précisée par le vendeur après la commande).";

export const DELIVERY_INFO =
  "Livraison à domicile disponible uniquement à Paris, moyennant un supplément.";

// Aucune date précise n'est demandée dans le formulaire : toutes les
// commandes sont préparées durant cette période. Le jour et le créneau
// exacts sont ensuite convenus directement sur WhatsApp.
// ⚠️ À mettre à jour chaque année selon la date de Roch Hachana.
export const FULFILLMENT_WINDOW_LABEL = "la semaine du 7";

export const FULFILLMENT_INFO = `Retrait et livraison prévus durant ${FULFILLMENT_WINDOW_LABEL}. Pour connaître le jour et le créneau précis, contactez-nous directement sur WhatsApp.`;

// Montant du supplément de livraison, en euros.
export const DELIVERY_FEE = 15;

export const DELIVERY_AREA_LABEL = "Paris uniquement (75001 à 75020, 75116)";

// Mention affichée pour valoriser le partenariat solidaire.
export const CHARITY_MENTION =
  "Une partie du prix de chaque corbeille est reversée à l'association Magen David Adom.";

// Emplacement du logo/badge Magen David Adom affiché en haut du site.
// Le fichier actuel (public/images/mda-badge.svg) est un badge générique
// (étoile de David rouge) créé pour ce projet : remplacez-le par le logo
// officiel fourni par Magen David Adom dans le cadre de votre partenariat.
export const MDA_LOGO_SRC = "/images/mda-badge.svg";

// Ce qui rend chaque corbeille unique : un tableau calligraphié à la main.
export const SIGNATURE_MENTION =
  "La signature de nos corbeilles : un tableau calligraphié à la main d'une lettre hébraïque, unique à chaque création.";

export const CURRENCY_SYMBOL = "€";

// Crédit affiché en petit en bas du site.
export const SITE_CREATOR = "Joseph Hababou";
