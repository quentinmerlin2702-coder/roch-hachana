import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import { FeatherIcon, StarOfDavidIcon } from "@/components/Icons";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} — Les Douceurs de Roch Hachana` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-5 text-sm text-honey-900/60">
        <Link href="/catalogue" className="hover:text-garnet-700">
          Catalogue
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-garnet-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-cream-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-garnet-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-200 shadow backdrop-blur-sm">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/60 bg-gold-50 px-3 py-1 text-xs font-semibold text-garnet-700">
              <StarOfDavidIcon className="h-3.5 w-3.5" />
              Casher
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-garnet-800 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 font-display text-2xl font-bold text-garnet-800">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-base leading-relaxed text-honey-900/80">
            {product.description}
          </p>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-garnet-800">
              Ce que contient cette corbeille
            </h2>
            <ul className="flex flex-col gap-2">
              {product.contents.map((item) => {
                const isSignature = item.toLowerCase().includes("calligraphié");
                return (
                  <li
                    key={item}
                    className={
                      "flex items-start gap-2.5 text-sm " +
                      (isSignature
                        ? "font-semibold text-garnet-800"
                        : "text-honey-900/80")
                    }
                  >
                    <span className="mt-0.5 shrink-0 text-gold-600">
                      {isSignature ? (
                        <FeatherIcon className="h-4 w-4" />
                      ) : (
                        <svg viewBox="0 0 8 8" className="h-2 w-2 fill-current">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                      )}
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-2 border-t border-gold-200/50 pt-5">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
