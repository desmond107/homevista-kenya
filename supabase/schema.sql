-- ============================================================
-- HomeVista Kenya — Supabase Schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- ─── Tables ──────────────────────────────────────────────────

-- Profiles extend auth.users (auto-created via trigger on signup)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT        NOT NULL DEFAULT '',
  avatar              TEXT        NOT NULL DEFAULT '',
  role                TEXT        NOT NULL DEFAULT 'viewer'
                                  CHECK (role IN ('viewer', 'admin', 'lister')),
  phone               TEXT,
  company             TEXT,
  is_premium          BOOLEAN     NOT NULL DEFAULT false,
  is_verified_lister  BOOLEAN     NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.properties (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT        NOT NULL,
  description         TEXT        NOT NULL DEFAULT '',
  price               BIGINT      NOT NULL DEFAULT 0,
  price_type          TEXT        NOT NULL DEFAULT 'sale'
                                  CHECK (price_type IN ('sale', 'rent', 'monthly')),
  category            TEXT        NOT NULL DEFAULT 'apartment'
                                  CHECK (category IN ('apartment', 'house', 'villa', 'commercial', 'land')),
  listing_type        TEXT        NOT NULL DEFAULT 'buy'
                                  CHECK (listing_type IN ('buy', 'rent', 'sell', 'lease')),
  location            TEXT        NOT NULL DEFAULT '',
  address             TEXT        NOT NULL DEFAULT '',
  bedrooms            INT,
  bathrooms           INT,
  area                INT         NOT NULL DEFAULT 0,
  images              TEXT[]      NOT NULL DEFAULT '{}',
  features            TEXT[]      NOT NULL DEFAULT '{}',
  owner_name          TEXT        NOT NULL DEFAULT '',
  owner_phone         TEXT        NOT NULL DEFAULT '',
  owner_email         TEXT        NOT NULL DEFAULT '',
  user_id             UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_approved         BOOLEAN     NOT NULL DEFAULT false,
  is_featured         BOOLEAN     NOT NULL DEFAULT false,
  is_lister_verified  BOOLEAN     NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.adverts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  image_url   TEXT        NOT NULL DEFAULT '',
  link_url    TEXT        NOT NULL DEFAULT '',
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.realtors (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  company      TEXT        NOT NULL DEFAULT '',
  email        TEXT        NOT NULL DEFAULT '',
  phone        TEXT        NOT NULL DEFAULT '',
  avatar       TEXT        NOT NULL DEFAULT '',
  properties   INT         NOT NULL DEFAULT 0,
  is_verified  BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  description  TEXT        NOT NULL DEFAULT '',
  icon         TEXT        NOT NULL DEFAULT 'building',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id  UUID        NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  amount       INT         NOT NULL DEFAULT 0,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'completed', 'failed')),
  mpesa_ref    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name             TEXT        NOT NULL DEFAULT '',
  id_number             TEXT        NOT NULL DEFAULT '',
  location              TEXT        NOT NULL DEFAULT '',
  id_document           TEXT        NOT NULL DEFAULT '',
  profile_photo         TEXT        NOT NULL DEFAULT '',
  proof_document        TEXT        NOT NULL DEFAULT '',
  property_certificate  TEXT        NOT NULL DEFAULT '',
  status                TEXT        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_method        TEXT        NOT NULL DEFAULT 'mpesa'
                                    CHECK (payment_method IN ('mpesa', 'visa', 'mastercard')),
  amount                INT         NOT NULL DEFAULT 0,
  accepted_terms        BOOLEAN     NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Trigger: auto-create profile on signup ──────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar, role, is_premium, is_verified_lister)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar',
      'https://ui-avatars.com/api/?name=' ||
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)) ||
        '&background=f59e0b&color=fff'
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'),
    false,
    false
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Helper: admin check ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- ─── Row Level Security ───────────────────────────────────────

ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adverts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

-- properties (approved ones are public; owners/admins see all)
CREATE POLICY "props_select" ON public.properties FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id OR is_admin());
CREATE POLICY "props_insert" ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "props_update" ON public.properties FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "props_delete" ON public.properties FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- adverts
CREATE POLICY "adverts_select_all"  ON public.adverts FOR SELECT USING (true);
CREATE POLICY "adverts_admin_write" ON public.adverts FOR ALL USING (is_admin());

-- realtors
CREATE POLICY "realtors_select_all"  ON public.realtors FOR SELECT USING (true);
CREATE POLICY "realtors_admin_write" ON public.realtors FOR ALL USING (is_admin());

-- categories
CREATE POLICY "cats_select_all"  ON public.categories FOR SELECT USING (true);
CREATE POLICY "cats_admin_write" ON public.categories FOR ALL USING (is_admin());

-- payments (users see only their own; admins see all)
CREATE POLICY "payments_own_select"  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "payments_own_insert"  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- verification requests
CREATE POLICY "verif_select" ON public.verification_requests FOR SELECT
  USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "verif_insert" ON public.verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "verif_update" ON public.verification_requests FOR UPDATE
  USING (is_admin());

-- ─── Seed Data ───────────────────────────────────────────────
-- (No user-dependent seed — properties require a real user_id)
-- Run seed.sql separately after creating your admin account.

INSERT INTO public.realtors (name, company, email, phone, avatar, properties, is_verified) VALUES
  ('Kenya Homes Ltd',          'Kenya Homes Ltd',             'info@kenyahomes.co.ke',      '+254 700 111 222', 'https://ui-avatars.com/api/?name=Kenya+Homes&background=0ea5e9&color=fff',        45, true),
  ('Prime Properties',         'Prime Properties Kenya',      'info@primeproperties.co.ke', '+254 700 333 444', 'https://ui-avatars.com/api/?name=Prime+Properties&background=8b5cf6&color=fff',  32, true),
  ('Nairobi Realtors',         'Nairobi Realtors Association','info@nairobirealtors.co.ke', '+254 700 555 666', 'https://ui-avatars.com/api/?name=Nairobi+Realtors&background=10b981&color=fff', 78, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.categories (name, description, icon) VALUES
  ('Boutique Agencies',    'Small premium real estate companies with curated listings', 'building'),
  ('Corporate Firms',      'National and regional property companies',                  'office'),
  ('Independent Realtors', 'Solo professionals and verified property owners',           'user')
ON CONFLICT DO NOTHING;

INSERT INTO public.adverts (title, image_url, link_url, is_active) VALUES
  ('Premium Listings - Get Featured!', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600', '/premium', true),
  ('Home Loans Available',             'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', '/loans',   true)
ON CONFLICT DO NOTHING;
