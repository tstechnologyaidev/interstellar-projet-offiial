-- Supabase schema for Interstellar Project

-- 1️⃣ Announcements (news)
create table public.news (
  id          uuid    primary key default gen_random_uuid(),
  title       text    not null,
  content     text    not null,
  image_url   text,
  posted_at   timestamptz default now(),
  author_name text,
  is_pinned   boolean default false
);

-- 2️⃣ Ranks & Perks (ranks)
create table public.ranks (
  id            uuid    primary key default gen_random_uuid(),
  name          text    not null unique,
  description   text,
  perk_list     jsonb,
  min_experience integer default 0,
  icon_url      text
);

-- 3️⃣ Team Members (team)
create table public.team (
  id           uuid    primary key default gen_random_uuid(),
  mc_username  text    not null unique,
  display_name text    not null,
  role         text,
  avatar_url   text,
  joined_at    timestamptz default now(),
  rank_id      uuid references public.ranks(id)
);

-- 4️⃣ Site Settings (singleton)
create table public.settings (
  id               smallint primary key check (id = 1),
  site_name        text    not null default 'My Minecraft Server',
  tagline          text,
  theme            text    default 'dark',
  maintenance_mode boolean default false,
  maintenance_msg   text    default 'Site under maintenance'
);
insert into public.settings (id) values (1) on conflict do nothing;

-- 5️⃣ Simple Users Table (Minecraft usernames only)
create table public.users (
  mc_username   text primary key,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now(),
  last_seen     timestamptz
);

-- Optional foreign key from news to users
alter table public.news add column author_mc text references public.users(mc_username);
