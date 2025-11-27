-- SQL to create courses and purchases tables (Postgres / Supabase)
create extension if not exists "pgcrypto";

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  price_cents integer default 0,
  currency text default 'usd',
  is_free boolean default false
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null references courses(id),
  stripe_payment_intent text,
  stripe_checkout_session text,
  purchased_at timestamptz default now(),
  expires_at timestamptz,
  metadata jsonb
);