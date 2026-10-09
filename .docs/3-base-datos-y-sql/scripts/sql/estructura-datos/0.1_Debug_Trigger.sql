CREATE TABLE IF NOT EXISTS public.trigger_logs (
  id serial PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  error_msg text,
  error_detail text,
  user_id uuid
);

CREATE OR REPLACE FUNCTION gestion.crear_perfil_usuario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gestion, public
AS $$
DECLARE
  v_idrol UUID;
  v_err_message text;
  v_err_detail text;
BEGIN
  -- Obtener el rol "Usuario" por defecto
  SELECT idrol INTO v_idrol
  FROM gestion.roles
  WHERE nombrerol = 'Usuario'
  LIMIT 1;

  BEGIN
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
      COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'nombre'), ''),
        NULLIF(TRIM(split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1)), ''),
        'Usuario'
      ),
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
      COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
      NULL,       -- password_hash
      0           -- puntostotales
    )
    ON CONFLICT (idusuario) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_err_message = MESSAGE_TEXT,
                            v_err_detail = PG_EXCEPTION_DETAIL;
    INSERT INTO public.trigger_logs (error_msg, error_detail, user_id) 
    VALUES (v_err_message, v_err_detail, NEW.id);
    
    -- Volvemos a lanzar la excepcion para que falle como antes, 
    -- pero ahora ya quedo guardado en public.trigger_logs! (Wait, si lanzamos la excepcion se hace rollback del log!)
    -- Mejor NO lanzamos la excepcion, dejamos que auth.users se inserte, asi podemos ver el log.
  END;

  RETURN NEW;
END;
$$;
