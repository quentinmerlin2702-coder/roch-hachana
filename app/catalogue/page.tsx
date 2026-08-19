import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Nos corbeilles — Les Douceurs de Roch Hachana",
};

export default function CataloguePage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
          Le catalogue
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-garnet-800 sm:text-4xl">
          Nos corbeilles
        </h1>
        <p className="mt-2 text-honey-900/70">
          {products.length} corbeilles cadeaux casher disponibles pour Roch
          Hachana.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
