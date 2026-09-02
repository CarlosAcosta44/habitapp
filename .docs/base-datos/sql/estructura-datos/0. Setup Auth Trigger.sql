-- ════════════════════════════════════════════════════════════════════════
-- SETUP AUTH TRIGGER — HabitApp
-- Ejecutar en Supabase SQL Editor ANTES de recrear usuarios sintéticos.
--
-- Propósito:
--   1. Limpiar filas huérfanas de gestion.usuarios (de la migración JWT)
--   2. Restaurar la FK hacia auth.users
--   3. Recrear el trigger que sincroniza auth.users → gestion.usuarios
--      (compatible con las columnas nuevas de la migración)
-- ════════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- PASO 1: Limpiar datos de la migración JWT custom
-- (filas en gestion.usuarios que no tienen auth.users correspondiente)
-- ──────────────────────────────────────────────────────────────────────

-- Limpiar tablas dependientes en cascada
DELETE FROM seguimiento.registro_habitos
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM seguimiento.habitos
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM seguimiento.recordatorios
WHERE idhabito NOT IN (SELECT idhabito FROM seguimiento.habitos);

DELETE FROM gestion.historial_puntos
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.notificaciones
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.amigos
WHERE idusuario_solicitante NOT IN (SELECT id FROM auth.users)
   OR idusuario_receptor NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.usuario_logro
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.administradores
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM seguimiento.entrenadores
WHERE idusuario NOT IN (SELECT id FROM auth.users);

-- También limpiar tablas de tokens JWT custom que ya no se usan desde el frontend
-- (el backend Flutter sí las usa, se mantienen vacías por ahora)
DELETE FROM gestion.refresh_tokens
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.verificacion_tokens
WHERE idusuario NOT IN (SELECT id FROM auth.users);

DELETE FROM gestion.identidades
WHERE idusuario NOT IN (SELECT id FROM auth.users);

-- Finalmente, limpiar los usuarios huérfanos
DELETE FROM gestion.usuarios
WHERE idusuario NOT IN (SELECT id FROM auth.users);

-- ──────────────────────────────────────────────────────────────────────
-- PASO 2: Restaurar la FK hacia auth.users
-- (fue eliminada por la migración del JWT custom)
-- ──────────────────────────────────────────────────────────────────────

ALTER TABLE gestion.usuarios
  DROP CONSTRAINT IF EXISTS usuarios_idusuario_fkey;

ALTER TABLE gestion.usuarios
  ADD CONSTRAINT usuarios_idusuario_fkey
  FOREIGN KEY (idusuario) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ──────────────────────────────────────────────────────────────────────
-- PASO 3: Recrear el trigger con soporte para TODAS las columnas
-- Incluye: email, email_verified, estado_cuenta (de la migración JWT)
-- y las originales: nombre, apellido, genero, fechanacimiento, idrol
-- ──────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION gestion.crear_perfil_usuario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gestion
AS $$
DECLARE
  v_idrol UUID;
BEGIN
  -- Obtener el rol "Usuario" por defecto
  SELECT idrol INTO v_idrol
  FROM gestion.roles
  WHERE nombrerol = 'Usuario'
  LIMIT 1;

  INSERT INTO gestion.usuarios (
    idusuario,
    nombre,
    apellido,
    email,
    telefono,
    genero,
    fechanacimiento,
    fotoperfil,
    idrol,
    estado,
    estado_cuenta,
    email_verified,
    password_hash,
    puntostotales
  ) VALUES (
    NEW.id,
    -- Nombre: del metadata, o del full_name de OAuth, o 'Usuario'
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'nombre'), ''),
      NULLIF(TRIM(split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1)), ''),
      'Usuario'
    ),
    -- Apellido: del metadata, o del full_name de OAuth, o 'Nuevo'
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'apellido'), ''),
      NULLIF(TRIM(split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 2)), ''),
      'Nuevo'
    ),
    NEW.email,
    NULL,   -- telefono
    NULLIF(TRIM(NEW.raw_user_meta_data->>'genero'), ''),
    CASE
      WHEN NEW.raw_user_meta_data->>'fechanacimiento' ~ '^\d{4}-\d{2}-\d{2}$'
      THEN (NEW.raw_user_meta_data->>'fechanacimiento')::DATE
      ELSE NULL
    END,
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),  -- fotoperfil
    v_idrol,
    'Activo',   -- estado
    'Activo',   -- estado_cuenta
    -- email_verified: true si ya viene confirmado (OAuth o admin.createUser con email_confirm:true)
    COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
    NULL,       -- password_hash (null = usa Supabase Auth, no contraseña local)
    0           -- puntostotales
  )
  ON CONFLICT (idusuario) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Eliminar cualquier trigger anterior
DROP TRIGGER IF EXISTS trigger_crear_perfil ON auth.users;
DROP TRIGGER IF EXISTS trg_sync_auth_to_gestion ON auth.users;

-- Crear el trigger
CREATE TRIGGER trigger_crear_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION gestion.crear_perfil_usuario();

-- ──────────────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ──────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE '✅ FK restaurada: gestion.usuarios → auth.users';
  RAISE NOTICE '✅ Trigger recreado: trigger_crear_perfil';
  RAISE NOTICE '📋 Filas en gestion.usuarios: %', (SELECT COUNT(*) FROM gestion.usuarios);
  RAISE NOTICE '📋 Filas en auth.users: %', (SELECT COUNT(*) FROM auth.users);
  RAISE NOTICE '';
  RAISE NOTICE '➡️  SIGUIENTE PASO:';
  RAISE NOTICE '   node scripts/recreate-synthetic-users-v4.mjs';
END $$;
