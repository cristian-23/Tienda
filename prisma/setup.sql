-- ============================================================
-- Tienda Multi-tenant — Datos de Semilla (Seeder)
-- Pegar esto en: Supabase > SQL Editor > New Query
-- IMPORTANTE: Ejecutar esto DESPUÉS de hacer `npx prisma db push`
-- ============================================================

-- ─── 1. INQUILINOS (TENANTS) ─────────────────────────────

INSERT INTO tenants (id, name, subdomain, created_at, updated_at) VALUES
  ('tenant-colchones', 'Colchones & Descanso', 'colchones', NOW(), NOW()),
  ('tenant-muebles', 'Muebles de Melamina', 'muebles', NOW(), NOW())
ON CONFLICT (subdomain) DO NOTHING;

-- ─── 2. ADMINISTRADORES ──────────────────────────────────

-- Password para ambos: Admin123!
INSERT INTO users (id, email, password, name, tenant_id, created_at, updated_at) VALUES
  ('admin-colchones', 'admin@colchones.com', '$2b$10$.UC2B1UPV44lhefvmVvR5enzp3iHvgEpQXUJ0d/I52P8Kb/kazqim', 'Admin Colchones', 'tenant-colchones', NOW(), NOW()),
  ('admin-muebles', 'admin@muebles.com', '$2b$10$.UC2B1UPV44lhefvmVvR5enzp3iHvgEpQXUJ0d/I52P8Kb/kazqim', 'Admin Muebles', 'tenant-muebles', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ─── 3. CATEGORÍAS ───────────────────────────────────────

-- Categorías Colchones
INSERT INTO categories (id, name, slug, description, active, tenant_id, created_at, updated_at) VALUES
  ('cat-c1', 'Colchones', 'colchones', 'Colchones de espuma, resortes y ortopédicos', TRUE, 'tenant-colchones', NOW(), NOW()),
  ('cat-c2', 'Camas', 'camas', 'Camas individuales, matrimoniales y queen', TRUE, 'tenant-colchones', NOW(), NOW()),
  ('cat-c3', 'Almohadas', 'almohadas', 'Almohadas viscoelásticas y de pluma', TRUE, 'tenant-colchones', NOW(), NOW())
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Categorías Muebles
INSERT INTO categories (id, name, slug, description, active, tenant_id, created_at, updated_at) VALUES
  ('cat-m1', 'Roperos', 'roperos', 'Roperos empotrados y modulares', TRUE, 'tenant-muebles', NOW(), NOW()),
  ('cat-m2', 'Escritorios', 'escritorios', 'Escritorios para oficina y hogar', TRUE, 'tenant-muebles', NOW(), NOW()),
  ('cat-m3', 'Cómodas', 'comodas', 'Cómodas de melamina con cajoneras', TRUE, 'tenant-muebles', NOW(), NOW()),
  ('cat-m4', 'Muebles de TV', 'muebles-de-tv', 'Paneles y estantes para TV', TRUE, 'tenant-muebles', NOW(), NOW()),
  ('cat-m5', 'Estantes', 'estantes', 'Libreros y repisas', TRUE, 'tenant-muebles', NOW(), NOW())
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- ─── 4. CONFIGURACIÓN DE TIENDA ──────────────────────────

-- Configuración Colchones
INSERT INTO store_settings (id, business_name, whatsapp_number, addresses, hero_title, hero_subtitle, tenant_id, updated_at) VALUES
  ('set-colchones', 'Colchones & Descanso', '+59170000000', '[{"label": "Sucursal Central", "address": "Dirección de la tienda"}]'::JSONB, 'Colchones & Descanso', 'Los mejores productos para tu hogar. Calidad, confort y estilo a tu alcance.', 'tenant-colchones', NOW())
ON CONFLICT (tenant_id) DO NOTHING;

-- Configuración Muebles
INSERT INTO store_settings (id, business_name, whatsapp_number, addresses, hero_title, hero_subtitle, tenant_id, updated_at) VALUES
  ('set-muebles', 'Muebles de Melamina', '+59170000000', '[{"label": "Taller Central", "address": "Dirección del taller"}]'::JSONB, 'Muebles de Melamina a Medida', 'Diseñamos y fabricamos roperos, escritorios, paneles y más. Calidad garantizada.', 'tenant-muebles', NOW())
ON CONFLICT (tenant_id) DO NOTHING;
