-- ============================================================
-- COLCHONES & DESCANSO — Setup completo para Supabase
-- Pegar esto en: Supabase > SQL Editor > New Query
-- ============================================================

-- ─── 1. EXTENSIONES ───────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── 2. TABLAS ────────────────────────────────────────────

-- 2.1 Users (admin)
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Categories
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Products
CREATE TABLE IF NOT EXISTS products (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description       TEXT,
  price             DECIMAL(10,2) NOT NULL,
  stock             INTEGER,
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  category_id       TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  "order"    INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Store Settings (singleton)
CREATE TABLE IF NOT EXISTS store_settings (
  id              TEXT PRIMARY KEY DEFAULT 'default',
  business_name   TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  addresses       JSONB NOT NULL DEFAULT '[]'::JSONB,
  facebook_url    TEXT,
  instagram_url   TEXT,
  logo_url        TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 3. ÍNDICES ──────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(active, featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product_order ON product_images(product_id, "order");

-- ─── 4. TRIGGERS para updated_at ─────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
    CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_store_settings_updated_at') THEN
    CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- ============================================================
-- SEED DATA
-- ============================================================

-- ─── 5. ADMINISTRADOR ─────────────────────────────────────

-- Email:    admin@colchones.com
-- Password: Admin123!
--
-- Para cambiar la contraseña, genera un nuevo hash con:
--   node -e "require('bcryptjs').hash('TU_PASSWORD', 10).then(console.log)"
-- y reemplaza el valor debajo.

INSERT INTO users (id, email, password, name)
VALUES (
  'admin-001',
  'admin@colchones.com',
  '$2b$10$.UC2B1UPV44lhefvmVvR5enzp3iHvgEpQXUJ0d/I52P8Kb/kazqim',
  'Administrador'
) ON CONFLICT (email) DO NOTHING;

-- ─── 6. CATEGORÍAS ───────────────────────────────────────

INSERT INTO categories (id, name, slug, description, active) VALUES
  ('cat-001', 'Colchones',     'colchones',     'Colchones de espuma, resortes y ortopédicos', TRUE),
  ('cat-002', 'Camas',         'camas',         'Camas individuales, matrimoniales y queen', TRUE),
  ('cat-003', 'Roperos',       'roperos',       'Roperos de madera y melamina', TRUE),
  ('cat-004', 'Veladores',     'veladores',     'Veladores modernos y clásicos', TRUE),
  ('cat-005', 'Almohadas',     'almohadas',     'Almohadas viscoelásticas y de pluma', TRUE),
  ('cat-006', 'Respaldares',   'respaldares',   'Respaldares tapizados y de madera', TRUE),
  ('cat-007', 'Comedores',     'comedores',     'Juegos de comedor completos', TRUE),
  ('cat-008', 'Otros',         'otros',         'Otros productos para el hogar', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ─── 7. CONFIGURACIÓN DE TIENDA ──────────────────────────

INSERT INTO store_settings (id, business_name, whatsapp_number, addresses)
VALUES (
  'default',
  'Colchones & Descanso',
  '+59170000000',
  '[{"label": "Sucursal Central", "address": "Dirección de la tienda"}]'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Descomentar para verificar los datos insertados:
-- SELECT '✅ Tablas creadas' AS resultado;
-- SELECT COUNT(*) || ' usuarios' FROM users;
-- SELECT COUNT(*) || ' categorías' FROM categories;
-- SELECT COUNT(*) || ' configuración' FROM store_settings;
