-- ====================================================
-- GRANT DE PERMISOS DE ESQUEMA
-- HabitApp - Supabase / Postgres
-- 
-- PROBLEMA: Los schemas gestion, seguimiento y comunidad
-- no son accesibles via API REST de Supabase porque el rol
-- 'anon' y 'authenticated' no tienen USAGE sobre ellos.
--
-- SOLUCIÓN: Ejecutar este script en el SQL Editor de Supabase
-- DESPUÉS de haber ejecutado el Script 1 (Esquemas & DB).
-- ====================================================

-- ─── 1. GRANT USAGE en los schemas personalizados ───────────────────────────
GRANT USAGE ON SCHEMA gestion    TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA seguimiento TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA comunidad  TO anon, authenticated, service_role;

-- ─── 2. GRANT SELECT/INSERT/UPDATE/DELETE en tablas de gestion ──────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA gestion     TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA seguimiento  TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA comunidad   TO anon, authenticated;

-- service_role tiene acceso total (ignora RLS)
GRANT ALL ON ALL TABLES IN SCHEMA gestion     TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA seguimiento  TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA comunidad   TO service_role;

-- ─── 3. GRANT en secuencias (necesario para INSERT con DEFAULT gen_random_uuid) ─
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA gestion     TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA seguimiento  TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA comunidad   TO anon, authenticated, service_role;

-- ─── 4. GRANT en funciones (para RLS helpers como es_admin(), es_entrenador()) ─
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA gestion     TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA seguimiento  TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA comunidad   TO anon, authenticated, service_role;

-- ─── 5. Para tablas futuras creadas después de este script ──────────────────
ALTER DEFAULT PRIVILEGES IN SCHEMA gestion
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA seguimiento
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA comunidad
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

-- ─── 6. Exponer schemas a la API REST de Supabase ───────────────────────────
-- Esto se configura en el Dashboard de Supabase:
-- Settings → API → "Exposed schemas": agregar gestion, seguimiento, comunidad
--
-- O bien con el siguiente comando (requiere permisos de superusuario):
-- ALTER ROLE authenticator SET pgrst.db_schemas = 'public,gestion,seguimiento,comunidad';
-- SELECT pg_reload_conf();
