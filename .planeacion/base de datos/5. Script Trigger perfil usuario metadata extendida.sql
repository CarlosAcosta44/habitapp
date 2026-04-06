/*====================================================
  ACTUALIZACIÓN: trigger crear_perfil_usuario
  
  Ejecutar en Supabase (SQL Editor) después del script 1.
  
  Motivo: signUp() debe enviar en user_metadata las claves
  `nombre`, `apellido`, y opcionalmente `fechanacimiento`, `genero`, `telefono`
  (mismas claves que raw_user_meta_data en auth.users).
  
  Valores válidos para genero (CHECK en gestion.usuarios):
  'Masculino', 'Femenino', 'Otro'
====================================================*/

CREATE OR REPLACE FUNCTION gestion.crear_perfil_usuario()
RETURNS TRIGGER AS $$
DECLARE
  v_genero VARCHAR(20);
BEGIN
  v_genero := NEW.raw_user_meta_data->>'genero';
  IF v_genero IS NOT NULL AND v_genero NOT IN ('Masculino', 'Femenino', 'Otro') THEN
    v_genero := NULL;
  END IF;

  INSERT INTO gestion.usuarios (
    idusuario,
    nombre,
    apellido,
    telefono,
    genero,
    fechanacimiento,
    idrol
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'nombre'), ''), 'Sin nombre'),
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'apellido'), ''), 'Sin apellido'),
    NULLIF(trim(NEW.raw_user_meta_data->>'telefono'), ''),
    v_genero,
    CASE
      WHEN (NEW.raw_user_meta_data->>'fechanacimiento') ~ '^\d{4}-\d{2}-\d{2}$'
      THEN (NEW.raw_user_meta_data->>'fechanacimiento')::date
      ELSE NULL
    END,
    (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
