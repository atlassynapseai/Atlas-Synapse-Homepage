-- SQL Migrations for Atlas Synapse
-- Run these scripts in Supabase SQL Editor

-- ============================================
-- Core Tables (run immediately)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  skool_id VARCHAR,
  skool_enrollment_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR NOT NULL,
  access_level VARCHAR DEFAULT 'standard',
  enrolled_date TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, product_name)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_products ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own products" ON user_products;
CREATE POLICY "Users can view their own products"
  ON user_products FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own products" ON user_products;
CREATE POLICY "Users can insert their own products"
  ON user_products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products" ON user_products;
CREATE POLICY "Users can update their own products"
  ON user_products FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON user_products;
CREATE POLICY "Users can delete their own products"
  ON user_products FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- AUTOMATIC USER PROFILE CREATION
-- ============================================
-- When a new auth user is created, automatically create their profile
-- This function runs with SECURITY DEFINER so it bypasses RLS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUTURE: skool.com Integration
-- ============================================
-- Uncomment and run these when integrating skool.com

-- CREATE TABLE IF NOT EXISTS skool_enrollments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   skool_user_id VARCHAR NOT NULL,
--   skool_community_id VARCHAR NOT NULL,
--   enrolled_at TIMESTAMP DEFAULT NOW(),
--   unenrolled_at TIMESTAMP,
--   is_active BOOLEAN DEFAULT true,
--   UNIQUE(user_id, skool_user_id)
-- );
--
-- -- Trigger to update user.skool_enrollment_active when enrollment changes
-- CREATE OR REPLACE FUNCTION update_skool_enrollment_status()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE users
--   SET skool_enrollment_active = NEW.is_active,
--       skool_id = NEW.skool_user_id
--   WHERE id = NEW.user_id;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- DROP TRIGGER IF EXISTS update_skool_enrollment_status_trigger ON skool_enrollments;
-- CREATE TRIGGER update_skool_enrollment_status_trigger
--   AFTER INSERT OR UPDATE ON skool_enrollments
--   FOR EACH ROW
--   EXECUTE FUNCTION update_skool_enrollment_status();

-- ============================================
-- Product Access Tracking
-- ============================================
-- For tracking which products each user can access

-- Insert default products for new users
-- CREATE OR REPLACE FUNCTION create_default_user_products()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO user_products (user_id, product_name, access_level)
--   VALUES
--     (NEW.id, 'homepage', 'standard'),
--     (NEW.id, 'aegis-prime', 'standard'),
--     (NEW.id, 'product-3', 'standard'),
--     (NEW.id, 'product-4', 'standard')
--   ON CONFLICT (user_id, product_name) DO NOTHING;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- DROP TRIGGER IF EXISTS create_default_user_products_trigger ON users;
-- CREATE TRIGGER create_default_user_products_trigger
--   AFTER INSERT ON users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_default_user_products();
