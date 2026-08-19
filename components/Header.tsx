"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { SHOP_NAME } from "@/lib/config";
import { StarOfDavidIcon } from "./Icons";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
];

export default function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gold-300/50 bg-cream-100/95 backdrop-blur supports-[backdrop-filter]:bg-cream-100/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 font-display text-base font-semibold tracking-tight text-garnet-800 sm:text-xl"
        >
          <StarOfDavidIcon className="h-5 w-5 shrink-0 text-gold-500" />
          <span className="max-w-[48vw] truncate sm:max-w-none">
            {SHOP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                "text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-garnet-700 " +
                (pathname === link.href
                  ? "text-garnet-700"
                  : "text-honey-900/60")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/panier"
          aria-label="Voir le panier"
          className="relative inline-flex items-center justify-center rounded-full bg-garnet-900 p-2.5 text-cream-50 shadow-sm transition hover:bg-garnet-800 active:scale-95"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
          >
            <path
              d="M3 4h2l1.2 12.2a2 2 0 0 0 2 1.8h8.4a2 2 0 0 0 2-1.7L20 8H6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="21" r="1.3" fill="currentColor" />
            <circle cx="17.5" cy="21" r="1.3" fill="currentColor" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-cream-50">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Nav mobile secondaire */}
      <nav className="flex items-center gap-5 border-t border-gold-200/40 px-4 py-2 sm:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              "text-xs font-semibold uppercase tracking-[0.12em] transition " +
              (pathname === link.href
                ? "text-garnet-700"
                : "text-honey-900/60")
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
