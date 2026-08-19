-- Schéma Supabase pour "Les Douceurs de Roch Hachana".
-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (Dashboard → SQL Editor → New query → coller ce fichier → Run).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  created_at timestamptz not null default now(),

  -- Client
  customer_name text not null,
  customer_phone text not null,
  customer_email text,

  -- Retrait / livraison
  delivery_method text not null check (delivery_method in ('retrait', 'livraison')),
  delivery_street text,
  delivery_postal_code text,
  delivery_complement text,
  pickup_notes text,

  -- Produits (tableau JSON : [{ productId, name, price, quantity }, ...])
  items jsonb not null,

  -- Montants (en euros)
  delivery_fee numeric not null default 0,
  total numeric not null,

  -- Paiement
  payment_method text not null check (payment_method in ('especes', 'revolut')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),

  -- Extra
  gift_message text,
  promo_code text
);

comment on table public.orders is 'Commandes de corbeilles cadeaux, enregistrées depuis le site (aucun paiement en ligne).';

-- Row Level Security : activée, sans policy publique. Seule la clé service_role
-- (utilisée uniquement côté serveur, jamais exposée au navigateur) peut lire
-- ou écrire dans cette table — elle contourne RLS. Personne d'autre n'y a accès.
alter table public.orders enable row level security;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
