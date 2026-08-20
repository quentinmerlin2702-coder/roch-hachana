# Les Douceurs de Roch Hachana — Corbeilles cadeaux casher

Site e-commerce (sans paiement en ligne) pour vendre des corbeilles cadeaux
casher de Roch Hachana à Paris. Retrait dans le 16ᵉ arrondissement ou
livraison à Paris (+15 €). Next.js (App Router) + Tailwind CSS.

## Démarrer en local

```bash
npm install
npm run dev
```

Le site est accessible sur http://localhost:3000

## Modifier les produits

Les deux corbeilles (**La Classique** et **La Premium**) sont définies dans
**`data/products.json`**. Chaque produit a :

```json
{
  "id": "p1",
  "slug": "corbeille-classique",
  "name": "La Classique",
  "price": 99,
  "image": "/images/panier-classique.svg",
  "badge": "Format généreux",
  "shortDescription": "Résumé affiché sur les cartes produit.",
  "description": "Description complète affichée sur la fiche produit.",
  "contents": ["Ingrédient 1", "Ingrédient 2"]
}
```

`contents` liste les ingrédients de la corbeille (affichés sans prix). Pour
ajouter une troisième corbeille, ajoutez simplement un objet dans ce fichier.
`badge` est facultatif.

### Remplacer les photos

Les images actuelles (`public/images/*.svg`) sont des **visuels de
remplacement générés automatiquement** (couleurs miel/grenat). Pour mettre de
vraies photos :

1. Déposez vos photos dans `public/images/` (formats `.jpg`, `.png`, `.webp`…).
2. Mettez à jour le champ `"image"` du produit correspondant dans
   `data/products.json` (ex : `"/images/panier-classique.jpg"`).

Pour régénérer les visuels de remplacement : `node scripts/generate-placeholder-images.mjs`.

### Image de partage (WhatsApp, réseaux sociaux)

`public/og-image.jpg` s'affiche automatiquement en aperçu quand le lien du
site est partagé sur WhatsApp ou les réseaux sociaux (balises Open Graph
dans `app/layout.tsx`). Elle est générée à partir de
`public/images/signature-calligraphie.png` — si vous remplacez cette photo,
régénérez l'image de partage avec :

```bash
node scripts/generate-og-image.mjs
```

## Configuration de la boutique

Le fichier **`lib/config.ts`** centralise les réglages :

- `SHOP_NAME`, `SHOP_TAGLINE` : nom et accroche de la boutique.
- `SELLER_WHATSAPP` : **numéro WhatsApp du vendeur à remplacer avant la mise
  en ligne** (format international sans `+` ni espaces, ex : `33601020304`).
- `SELLER_DISPLAY_PHONE` : téléphone affiché sur le site.
- `SELLER_EMAIL` : adresse qui reçoit l'email récapitulatif pour chaque
  commande (actuellement `joseph.hababou2655@gmail.com`).
- `EMAIL_FROM` : adresse d'expédition des emails de commande (voir
  ci-dessous).
- `PICKUP_INFO` : texte affiché concernant le retrait (16ᵉ arrondissement).
- `DELIVERY_INFO`, `DELIVERY_FEE`, `DELIVERY_AREA_LABEL` : informations et
  supplément de livraison (Paris uniquement, 15 € par défaut).
- `CHARITY_MENTION`, `MDA_LOGO_SRC` : mention et badge du partenariat
  solidaire avec Magen David Adom, affichés en haut de chaque page (bandeau),
  dans le footer et sur la confirmation de commande. Le fichier
  `public/images/mda-badge.svg` est un badge générique (étoile de David
  rouge) créé pour ce projet — **remplacez-le par le logo officiel fourni
  par Magen David Adom** dans le cadre de votre partenariat, en gardant le
  même nom de fichier (ou mettez à jour `MDA_LOGO_SRC`).
- `SIGNATURE_MENTION` : présente la signature de la maison (le tableau
  calligraphié), affichée dans la section "Notre signature" de l'accueil.
- `CHARITY_MENTION` : mention du don reversé à Magen David Adom, affichée sur
  l'accueil, le footer et la confirmation.

## Base de données des commandes (Supabase)

Chaque commande est enregistrée dans une table `orders` sur
[Supabase](https://supabase.com) (Postgres hébergé, offre gratuite
largement suffisante pour ce site).

### 1. Créer le projet

1. Créez un compte sur [supabase.com](https://supabase.com) et un nouveau
   projet (gratuit).
2. Dans **Project Settings → API**, récupérez :
   - **Project URL** → variable `SUPABASE_URL`
   - **service_role key** (dans "Project API keys", pas la clé `anon` !) →
     variable `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ La clé `service_role` a tous les droits sur la base : ne la partagez
   jamais, ne la mettez jamais dans du code exposé au navigateur. Elle n'est
   utilisée que côté serveur, dans `lib/supabase.ts`.

### 2. Créer la table

Dans le Dashboard Supabase, ouvrez **SQL Editor → New query**, collez le
contenu de **`supabase/schema.sql`** (fourni dans ce projet), puis **Run**.
Cela crée la table `orders` avec toutes les colonnes nécessaires (client,
téléphone, adresse, produits, quantités, prix, frais de livraison, total,
date, mode de paiement, statut de paiement, message cadeau) et active la
sécurité au niveau des lignes (RLS) — seule la clé `service_role` peut y
accéder, personne d'autre.

### 3. Configurer les variables d'environnement

**En local** : copiez `.env.local.example` en `.env.local` et remplissez
`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` avec les valeurs récupérées
à l'étape 1. Redémarrez `npm run dev`.

**Sur Vercel** : Project → **Settings → Environment Variables**, ajoutez les
mêmes deux variables (valeurs identiques à `.env.local`), pour les
environnements Production **et** Preview. Redéployez ensuite (ou faites un
nouveau push) pour qu'elles prennent effet. Vous pouvez aussi les ajouter en
ligne de commande avec la CLI Vercel :

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Sans ces variables, le site fonctionne quand même** : les commandes restent
enregistrées dans `data/orders.json` en local, seul l'enregistrement dans
Supabase est ignoré (avertissement dans les logs serveur). Une fois les
variables configurées, chaque commande est écrite dans Supabase automatiquement
— vous pouvez consulter/filtrer/exporter vos commandes depuis
**Table Editor → orders** dans le Dashboard Supabase, et y mettre à jour vous-même
la colonne `payment_status` (`pending` → `paid`) une fois le règlement reçu.

## Emails à chaque commande (Resend)

Chaque commande déclenche l'envoi de **deux emails** via
[Resend](https://resend.com) :

1. **Au vendeur** (`SELLER_EMAIL` dans `lib/config.ts`, actuellement
   `joseph.hababou2655@gmail.com`) : récapitulatif complet — client,
   téléphone, adresse, produits, quantités, prix, frais de livraison, total,
   mode et statut de paiement, message cadeau.
2. **Au client**, uniquement s'il a renseigné son email dans le formulaire
   (le champ est facultatif) : confirmation de commande avec le numéro de
   commande, le récapitulatif, et la mention **"Le vendeur vous contactera
   prochainement sur WhatsApp pour la finalisation"** mise en évidence.

### Configuration

1. Créez un compte gratuit sur [resend.com](https://resend.com) et générez
   une clé API.
2. Copiez `.env.local.example` en `.env.local` (si ce n'est pas déjà fait) et
   collez votre clé dans `RESEND_API_KEY`.
3. Sur Vercel, ajoutez la même variable `RESEND_API_KEY` dans **Project
   Settings → Environment Variables** (Production et Preview), comme pour
   Supabase ci-dessus.
4. Vérifiez que `SELLER_EMAIL` (dans `lib/config.ts`) est bien votre adresse.
5. Redémarrez `npm run dev`.

Par défaut, les emails sont envoyés depuis `onboarding@resend.dev`
(`EMAIL_FROM` dans `lib/config.ts`), ce qui fonctionne sans configuration
supplémentaire pour recevoir vos propres emails de notification. Pour l'email
envoyé aux clients (adresses variées, pas seulement la vôtre), il est
recommandé de vérifier votre propre nom de domaine dans Resend et de mettre à
jour `EMAIL_FROM` en conséquence — sinon certains fournisseurs de messagerie
peuvent classer les emails partant de `onboarding@resend.dev` en spam.

**Sans `RESEND_API_KEY` configurée, le site fonctionne normalement** : les
commandes sont toujours enregistrées, seul l'envoi des deux emails est ignoré
(avertissement dans les logs du serveur).

## Suivi des commandes dans un Google Doc

Chaque commande peut aussi être écrite automatiquement en haut d'un Google
Doc (le plus récent en premier), en plus de Supabase et des emails — pratique
pour tout voir d'un coup d'œil sans ouvrir Supabase.

Cela fonctionne via un petit script **Google Apps Script** directement relié
à votre document (pas besoin de compte Google Cloud ni de clé d'API
compliquée).

### Installation (une seule fois)

1. Ouvrez votre Google Doc de suivi.
2. Menu **Extensions → Apps Script**. Un nouvel onglet s'ouvre avec un
   éditeur de code.
3. Effacez le contenu par défaut (`function myFunction() {}`) et collez à la
   place tout le contenu du fichier **`google-apps-script/suivi-commandes.gs`**
   fourni dans ce projet.
4. Cliquez l'icône **💾 Enregistrer** (ou Ctrl+S), donnez un nom au projet si
   demandé (ex : "Suivi commandes").
5. Cliquez **Déployer → Nouveau déploiement**.
6. Cliquez l'icône ⚙️ à côté de "Sélectionner le type", choisissez
   **"Application Web"**.
7. Réglez : **Exécuter en tant que** = "Moi" ; **Qui a accès** =
   **"Tout le monde"** (nécessaire pour que le site puisse lui envoyer les
   commandes).
8. Cliquez **Déployer**. Google va demander d'**autoriser l'accès** au script
   sur votre document — acceptez (c'est votre propre script, sur votre
   propre document).
9. Une **URL** s'affiche (elle ressemble à
   `https://script.google.com/macros/s/AKfycb.../exec`) — copiez-la.
10. Mettez cette URL dans `GOOGLE_DOC_WEBHOOK_URL` (dans `.env.local` en
    local, et dans les variables d'environnement Vercel en production —
    même procédure que pour les autres clés ci-dessus).

Si vous modifiez le script plus tard, il faut créer un **nouveau
déploiement** (Déployer → Gérer les déploiements → ✏️ → Nouvelle version)
pour que les changements soient pris en compte.

**Sans `GOOGLE_DOC_WEBHOOK_URL` configurée, le site fonctionne normalement**,
seule l'écriture dans le Google Doc est ignorée.

## Espace "Commandes" (/admin)

Une page **`/admin`** liste toutes les commandes enregistrées dans Supabase,
dans une présentation lisible (client, téléphone, adresse, produits, total,
message cadeau), avec un bouton pour marquer chaque commande "payée" ou "en
attente". C'est une alternative plus agréable au Table Editor de Supabase,
pensée pour être **partagée avec vos associés**.

Elle est protégée par un identifiant + mot de passe (authentification
basique du navigateur — une fenêtre de connexion s'affiche à l'ouverture de
la page). Par défaut :

- Utilisateur : `corbeilles`
- Mot de passe : `Hababou2655`

Pour changer ces identifiants, définissez `ADMIN_USERNAME` et
`ADMIN_PASSWORD` dans `.env.local` (local) et dans les variables
d'environnement Vercel (production) — voir `.env.local.example`.

⚠️ Ne partagez le lien `https://votresite/admin` (et le mot de passe) qu'aux
personnes de confiance : cette page donne accès aux coordonnées de vos
clients.

## Retrait ou livraison

Lors de la commande, le client choisit :

- **Retrait gratuit** dans le 16ᵉ arrondissement de Paris (adresse exacte
  communiquée par le vendeur après la commande) ; ou
- **Livraison à Paris uniquement** (codes postaux 75001 à 75020, ou 75116
  pour le 16ᵉ), moyennant un supplément de `DELIVERY_FEE` (15 € par défaut).
  L'adresse est demandée dans le formulaire et validée côté serveur (code
  postal parisien obligatoire).

## Codes promo

Définis dans **`lib/promo.ts`**. Le champ "Code promo" est toujours visible
dans le formulaire (retrait ou livraison), mais un code n'a un effet que
s'il en a un pour le mode choisi — par exemple `HABABOU26` offre la
livraison, donc il n'a d'effet que si le client choisit la livraison.
Revalidé côté serveur à chaque commande : un code invalide ou modifié dans
le navigateur n'a aucun effet sur le total facturé.

Le supplément de livraison est automatiquement ajouté au total de la
commande, affiché au client et inclus dans l'email de notification.

## Fonctionnement des commandes (sans paiement en ligne)

- Le site **n'intègre aucun moyen de paiement en ligne** (pas de Stripe, pas
  de PayPlug, pas d'API bancaire).
- Lors de la validation du formulaire de commande, le client choisit entre
  **paiement en espèces au retrait/à la livraison** ou **paiement par
  Revolut**. Le statut de paiement (`payment_status`) est toujours `pending`
  à la création : c'est vous qui le passez à `paid` dans Supabase une fois le
  règlement reçu.
- La commande est enregistrée dans **Supabase** (voir ci-dessus) et, en
  copie de secours, dans `data/orders.json` en local. Ce fichier contient les
  coordonnées des clients : il est volontairement exclu de git
  (`.gitignore`) et ne doit pas être partagé publiquement.
- La page de confirmation affiche le numéro de commande, le récapitulatif, le
  mode de paiement choisi, et un bouton **"Contacter le vendeur sur
  WhatsApp"**.
- Ce bouton ouvre WhatsApp avec un message pré-rempli, mais **n'envoie
  jamais rien automatiquement** : c'est le client qui doit appuyer sur
  "Envoyer" dans WhatsApp s'il le souhaite. Le vendeur consulte les commandes
  reçues (Supabase et/ou les emails) et recontacte lui-même chaque client.

### ⚠️ À propos de `data/orders.json` sur Vercel

Ce fichier fonctionne très bien en local (`npm run dev` / `npm run start`).
Sur une plateforme serverless comme Vercel, le système de fichiers n'est pas
persistant entre les requêtes : les écritures dans `data/orders.json` en
production peuvent donc être perdues d'un déploiement à l'autre. Ce n'est
plus un problème une fois Supabase configuré (c'est la vraie base de
données), `data/orders.json` reste alors une simple copie de secours utile
surtout en local.

## Pages du site

| Page | URL |
| --- | --- |
| Accueil | `/` |
| Catalogue | `/catalogue` |
| Fiche produit | `/produit/[slug]` |
| Panier | `/panier` |
| Formulaire de commande | `/commande` |
| Confirmation de commande | `/confirmation` |
