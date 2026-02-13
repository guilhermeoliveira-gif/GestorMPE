-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies Table
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Users Table (Profiles)
create table public.users (
  id uuid primary key references auth.users(id),
  email text unique not null,
  full_name text,
  company_id uuid references public.companies(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Roles Table
create table public.user_roles (
  user_id uuid primary key references public.users(id),
  role text not null default 'SALES' check (role in ('ADMIN', 'SALES', 'FINANCE', 'FISCAL')),
  created_at timestamptz default now()
);

-- Helper Function for RLS
create or replace function public.get_user_role(p_user_id uuid)
returns text
language plpgsql
security definer
as $$
declare
    user_role text;
begin
    select role into user_role from public.user_roles where user_id = p_user_id;
    return user_role;
end;
$$;

-- RLS Policies Examples

-- Clients Table
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) not null,
  nome_completo text not null,
  cpf_cnpj text unique,
  endereco text,
  telefone text,
  email text,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

alter table public.clientes enable row level security;

create policy "Enable access for Admin and Sales of same company" on public.clientes
for all
using (
  (get_user_role(auth.uid()) = 'ADMIN' or get_user_role(auth.uid()) = 'SALES')
  and
  company_id = (select company_id from public.users where id = auth.uid())
);

-- Products, Orders (Pedidos), Items, Financial Accounts would follow similar structure
-- as defined in the prompt requirements.
