import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold-300/60 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-garnet-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-200 shadow backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-6">
        <h3 className="font-display text-xl font-semibold text-garnet-800">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-honey-900/70">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-gold-200/50 pt-4">
          <p className="font-display text-xl font-bold text-garnet-800">
            {formatPrice(product.price)}
          </p>
          <span className="text-xs font-semibold uppercase tracking-wide text-garnet-600 transition group-hover:translate-x-0.5 group-hover:text-gold-600">
            Découvrir →
          </span>
        </div>
      </div>
    </Link>
  );
}
