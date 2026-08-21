import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { StarOfDavidIcon, FeatherIcon, DeliveryIcon } from "@/components/Icons";
import { BranchMotif, PomegranateMotif } from "@/components/Motifs";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";

const steps = [
  {
    number: "I",
    title: "Choisissez votre corbeille",
    text: "La Classique ou la Premium, selon vos envies et votre budget.",
  },
  {
    number: "II",
    title: "Passez commande en 2 minutes",
    text: "Vos coordonnées, un message cadeau si vous le souhaitez, et c'est enregistré.",
  },
  {
    number: "III",
    title: "Retrait ou livraison",
    text: "16ᵉ arrondissement gratuit, ou livraison à Paris (+15 €).",
  },
];

const highlights = [
  {
    Icon: StarOfDavidIcon,
    title: "Casher & de qualité",
    text: "Une sélection de produits casher soigneusement choisis pour votre table de fête.",
  },
  {
    Icon: FeatherIcon,
    title: "Signature artisanale",
    text: "Chaque corbeille est accompagnée d'un tableau calligraphié à la main.",
  },
  {
    Icon: DeliveryIcon,
    title: "Retrait 16ᵉ ou livraison",
    text: "Retrait gratuit dans le 16ᵉ arrondissement, ou livraison partout à Paris.",
  },
];

export default function HomePage() {
  const products = getProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-garnet-950/90 via-garnet-900/50 to-garnet-950/15" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32">
          <span className="rounded-full border border-gold-300/40 bg-garnet-950/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gold-200 backdrop-blur-sm">
            Roch Hachana 5787 · Paris
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-cream-50 drop-shadow-sm sm:text-5xl md:text-6xl">
            Chana Tova !
            <br />
            Offrez la douceur de la fête
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-cream-100/90 drop-shadow-sm">
            Des corbeilles cadeaux casher, gourmandes et signées d&apos;un
            tableau calligraphié unique, composées avec soin pour célébrer
            Roch Hachana.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center rounded-full border border-gold-300/70 bg-cream-50 px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-garnet-900 shadow-sm transition hover:bg-cream-100 active:scale-[0.98]"
            >
              Découvrir les corbeilles
            </Link>
            <a
              href="#signature"
              className="inline-flex items-center justify-center rounded-full border border-cream-50/40 px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-cream-50 transition hover:border-gold-300 hover:text-gold-200 active:scale-[0.98]"
            >
              Notre signature
            </a>
          </div>
        </div>
      </section>

      {/* Points forts */}
      <section className="relative overflow-hidden py-20">
        <BranchMotif className="pointer-events-none absolute -right-6 -top-4 h-28 w-auto text-garnet-800 opacity-[0.06] sm:h-36" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {highlights.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-cream-300 bg-cream-50 p-7 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/50 bg-gold-50 text-garnet-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-garnet-800">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-honey-900/70">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="ornament-divider py-1 text-gold-400">
        <StarOfDavidIcon className="h-3.5 w-3.5" />
      </div>

      {/* Notre signature */}
      <section id="signature" className="relative scroll-mt-20 overflow-hidden">
        <PomegranateMotif className="pointer-events-none absolute -left-10 bottom-0 h-64 w-auto text-garnet-800 opacity-[0.05] sm:h-80" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="rounded-3xl border border-gold-300/50 bg-cream-50 p-5 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/signature-calligraphie.png"
                alt="Tableau calligraphié à la main d'une lettre hébraïque, signature de nos corbeilles"
                className="h-auto w-full rounded-xl"
              />
            </div>
          </Reveal>
          <Reveal delay={150} className="text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
              Notre signature
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-garnet-800 sm:text-3xl">
              Un tableau calligraphié, unique à chaque corbeille
            </h2>
            <p className="mt-4 max-w-xl text-honey-900/75 lg:max-w-none">
              Ce qui rend nos corbeilles uniques : chacune est accompagnée
              d&apos;un tableau calligraphié à la main d&apos;une lettre
              hébraïque. Un geste artisanal qui transforme un simple cadeau
              gourmand en un objet à part entière, prêt à orner la table de
              fête.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="ornament-divider py-1 text-gold-400">
        <StarOfDavidIcon className="h-3.5 w-3.5" />
      </div>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Simple & rapide
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-garnet-800 sm:text-3xl">
            Comment ça marche
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/60 font-display text-base font-semibold text-garnet-800">
                {step.number}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-garnet-800">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-honey-900/70">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Produits en avant */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6">
        <Reveal className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Notre sélection
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-garnet-800 sm:text-3xl">
            Nos deux corbeilles
          </h2>
          <p className="mt-1.5 text-honey-900/70">
            La Classique, plus compacte, et la Premium, plus grande et plus
            généreuse.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          {products.map((product, i) => (
            <Reveal
              key={product.id}
              delay={i * 100}
              className={
                product.slug === "corbeille-premium"
                  ? "sm:col-span-7"
                  : "sm:col-span-5"
              }
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="ornament-divider py-1 text-gold-400">
        <StarOfDavidIcon className="h-3.5 w-3.5" />
      </div>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Vos questions
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-garnet-800 sm:text-3xl">
            Questions fréquentes
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Faq />
        </Reveal>
      </section>
    </div>
  );
}
