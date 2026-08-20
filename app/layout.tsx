import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { SHOP_NAME, SHOP_TAGLINE } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const description =
  "Corbeilles cadeaux casher pour Roch Hachana à Paris. Retrait dans le 16ᵉ arrondissement ou livraison à Paris. Commande simple, sans paiement en ligne : réglez en espèces ou par Revolut.";

export const metadata: Metadata = {
  // Nécessaire pour que l'image de partage (og-image.png) soit résolue en
  // URL absolue par WhatsApp/réseaux. Sur Vercel, VERCEL_URL est fourni
  // automatiquement ; une fois un nom de domaine personnalisé configuré,
  // vous pouvez le mettre ici en dur pour plus de fiabilité (ex :
  // new URL("https://lesdouceursderoschachana.fr")).
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: `${SHOP_NAME} — ${SHOP_TAGLINE}`,
  description,
  openGraph: {
    title: `${SHOP_NAME} — ${SHOP_TAGLINE}`,
    description,
    siteName: SHOP_NAME,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SHOP_NAME }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SHOP_NAME} — ${SHOP_TAGLINE}`,
    description,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-[#3a1e14]">
        <TopBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
