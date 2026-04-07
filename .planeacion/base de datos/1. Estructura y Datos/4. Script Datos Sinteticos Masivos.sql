-- ====================================================
-- SCRIPT DE DATOS SINTÉTICOS MASIVOS (HabitApp)
-- Genera: 25 Usuarios, Habitos, Registros (30 días), Comunidad y Entrenadores.
-- Ejecutar en el SQL Editor de Supabase.
-- ====================================================

DO $$
DECLARE
    v_user_id UUID;
    v_coach_id UUID;
    v_admin_id UUID;
    v_cat_id UUID;
    v_habito_id UUID;
    v_foro_id UUID;
    v_articulo_id UUID;
    v_comentario_id UUID;
    i INT;
    j INT;
    k INT;
    v_nombres TEXT[] := ARRAY['Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Diego', 'Lucia', 'Carlos', 'Elena', 'Jose', 'Carmen', 'Javier', 'Isabel', 'Ricardo', 'Rosa', 'Fernando', 'Beatriz', 'Hugo', 'Victoria', 'Gabriel', 'Valentina', 'Mateo', 'Camila', 'Sebastian'];
    v_apellidos TEXT[] := ARRAY['Garcia', 'Rodriguez', 'Lopez', 'Martinez', 'Gonzalez', 'Hernandez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Ortiz', 'Guzman', 'Silva', 'Reyes', 'Ruiz', 'Vargas', 'Castillo', 'Jimenez', 'Castro'];
BEGIN
    -- 1. LIMPIEZA PREVIA (Siguiendo jerarquía de llaves foráneas)
    -- Relaciones de Comunidad
    DELETE FROM comunidad.reacciones;
    DELETE FROM comunidad.comentarios;
    DELETE FROM comunidad.usuario_foro;
    DELETE FROM comunidad.foro_administrador;
    DELETE FROM comunidad.administrador_articulo;
    DELETE FROM comunidad.foros;
    DELETE FROM comunidad.articulos;

    -- Relaciones de Seguimiento
    DELETE FROM seguimiento.recordatorios;
    DELETE FROM seguimiento.registro_habitos;
    DELETE FROM seguimiento.habitos;
    DELETE FROM seguimiento.usuario_rutina;
    DELETE FROM seguimiento.rutinas;
    DELETE FROM seguimiento.seguimientos;
    DELETE FROM seguimiento.usuario_entrenador;
    DELETE FROM seguimiento.entrenadores;
    DELETE FROM seguimiento.perfil_salud;

    -- Gestión (Usuarios y sus datos)
    DELETE FROM gestion.notificaciones;
    DELETE FROM gestion.historial_puntos;
    DELETE FROM gestion.administradores;
    
    -- Borrar usuarios que no pertenezcan a auth.users (pero limpiar perfiles sintéticos previos si es necesario)
    -- Nota: En Supabase no podemos borrar auth.users fácilmente por SQL, 
    -- así que limpiamos gestion.usuarios para los IDs que vamos a insertar/reemplazar.
    DELETE FROM gestion.usuarios WHERE idusuario IN (SELECT idusuario FROM gestion.usuarios);

    -- 2. GENERACIÓN DE 25 USUARIOS EN AUTH Y GESTION
    FOR i IN 1..25 LOOP
        v_user_id := gen_random_uuid();
        
        -- Verificar si el usuario ya existe por correo para evitar duplicados
        SELECT id INTO v_user_id FROM auth.users WHERE email = LOWER(v_nombres[i]) || i || '@habitapp.test';

        IF v_user_id IS NULL THEN
            v_user_id := gen_random_uuid();
            -- Insertar nuevo usuario en Auth
            INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at, last_sign_in_at, confirmation_token, is_sso_user, deleted_at)
            VALUES (
                v_user_id, 
                '00000000-0000-0000-0000-000000000000',
                LOWER(v_nombres[i]) || i || '@habitapp.test', 
                '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.', 
                NOW(), 
                jsonb_build_object('nombre', v_nombres[i], 'apellido', v_apellidos[i]),
                '{"provider": "email", "providers": ["email"]}',
                'authenticated', 'authenticated', NOW(), NOW(), NOW(), '', FALSE, NULL
            );
        ELSE
            -- Actualizar usuario existente (Password y Metadatos)
            UPDATE auth.users SET 
                encrypted_password = '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.',
                raw_user_meta_data = jsonb_build_object('nombre', v_nombres[i], 'apellido', v_apellidos[i]),
                raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
                email_confirmed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_user_id;
        END IF;

        -- NUEVO: Insertar Identidad (Obligatorio para Login en nuevas versiones de Supabase)
        IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
            INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
            VALUES (
                gen_random_uuid(),
                v_user_id,
                jsonb_build_object('sub', v_user_id, 'email', LOWER(v_nombres[i]) || i || '@habitapp.test', 'email_verified', true),
                'email',
                NOW(),
                NOW(),
                NOW(),
                v_user_id::text
            );
        END IF;

        -- Insertar datos extendidos en gestion.usuarios
        INSERT INTO gestion.usuarios (idusuario, nombre, apellido, idrol, puntostotales, genero, fechanacimiento, telefono)
        VALUES (
            v_user_id, 
            v_nombres[i], 
            v_apellidos[i], 
            (SELECT idrol FROM gestion.roles WHERE nombrerol = CASE 
                WHEN i <= 2 THEN 'Administrador' 
                WHEN i <= 7 THEN 'Entrenador' 
                ELSE 'Usuario' END),
            (RANDOM() * 500)::INT,
            (ARRAY['Masculino', 'Femenino', 'Otro'])[((RANDOM()*2)+1)::INT],
            (CURRENT_DATE - (INTERVAL '1 day' * (RANDOM()*10000 + 6500)::INT)), -- Entre 18 y 45 años
            '300' || (RANDOM()*8999999 + 1000000)::INT
        ) ON CONFLICT (idusuario) DO UPDATE SET puntostotales = EXCLUDED.puntostotales;

        -- Guardar IDs de referencia
        IF i = 1 THEN 
           v_admin_id := gen_random_uuid();
           INSERT INTO gestion.administradores (idadministrador, idusuario, estadoadmin) VALUES (v_admin_id, v_user_id, 'Activo');
        END IF;
        
        IF i > 2 AND i <= 7 THEN
            v_coach_id := gen_random_uuid();
            INSERT INTO seguimiento.entrenadores (identrenador, idusuario, especialidad, experiencia)
            VALUES (v_coach_id, v_user_id, (ARRAY['Fuerza', 'Yoga', 'Nutrición', 'Crossfit'])[((RANDOM()*3)+1)::INT], (RANDOM()*10+1)::INT);
        END IF;

        -- Notificación de bienvenida
        INSERT INTO gestion.notificaciones (mensaje, tipo, idusuario)
        VALUES ('¡Bienvenido a HabitApp! Comienza tu primer capítulo hoy.', 'Sistema', v_user_id);
    END LOOP;

    -- 3. HÁBITOS, REGISTROS Y RECORDATORIOS
    FOR v_user_id IN (SELECT idusuario FROM gestion.usuarios WHERE idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario')) LOOP
        -- Crear 3 hábitos por usuario
        FOR j IN 1..3 LOOP
            v_cat_id := (SELECT idcategoria FROM seguimiento.categorias_habitos ORDER BY RANDOM() LIMIT 1);
            v_habito_id := gen_random_uuid();
            
            INSERT INTO seguimiento.habitos (idhabito, nombre, idusuario, idcategoria, puntos)
            VALUES (v_habito_id, 'Hábito ' || j || ' de ' || (SELECT nombre FROM gestion.usuarios WHERE idusuario = v_user_id), v_user_id, v_cat_id, (RANDOM()*20+5)::INT);

            -- Recordatorio para cada hábito
            INSERT INTO seguimiento.recordatorios (mensaje, hora, frecuencia, idhabito)
            VALUES ('Es hora de: ' || (SELECT nombre FROM seguimiento.habitos WHERE idhabito = v_habito_id), '08:00:00'::TIME + (INTERVAL '1 hour' * j), 'Diario', v_habito_id);

            -- Crear registros para los últimos 30 días
            FOR k IN 0..30 LOOP
                INSERT INTO seguimiento.registro_habitos (idhabito, idusuario, fecha, completado, puntos_ganados)
                VALUES (v_habito_id, v_user_id, CURRENT_DATE - k, (RANDOM() > 0.3), 0) -- Puntos se calculan por trigger si está activo
                ON CONFLICT (idhabito, idusuario, fecha) DO NOTHING;
            END LOOP;
        END LOOP;
        
        -- Perfil de salud
        INSERT INTO seguimiento.perfil_salud (peso, altura, nivelactividad, idusuario)
        VALUES (RANDOM()*40+50, RANDOM()*0.5+1.5, (ARRAY['Sedentario', 'Moderado', 'Activo', 'Muy Activo'])[((RANDOM()*3)+1)::INT], v_user_id);
    END LOOP;

    -- 4. COMUNIDAD (FOROS, ARTICULOS, COMENTARIOS, SUSCRIPCIONES)
    FOR i IN 1..5 LOOP
        v_foro_id := gen_random_uuid();
        INSERT INTO comunidad.foros (idforo, titulo, descripcion, categoria)
        VALUES (v_foro_id, 'Foro de Discusión ' || i, 'Hablemos sobre salud y bienestar ' || i, 'General');
        
        -- Relacionar admin con el foro
        v_admin_id := (SELECT idadministrador FROM gestion.administradores LIMIT 1);
        INSERT INTO comunidad.foro_administrador (idforo, idadministrador) VALUES (v_foro_id, v_admin_id);

        -- 5 Usuarios se suscriben al foro y comentan
        FOR j IN 1..5 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios WHERE idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario') ORDER BY RANDOM() LIMIT 1);
            
            INSERT INTO comunidad.usuario_foro (idusuario, idforo) VALUES (v_user_id, v_foro_id) ON CONFLICT DO NOTHING;
            
            INSERT INTO comunidad.comentarios (idcomentario, contenido, idforo, idusuario)
            VALUES (gen_random_uuid(), 'Participando en el foro ' || i || '. ¡Excelente tema!', v_foro_id, v_user_id);
        END LOOP;
    END LOOP;

    FOR i IN 1..10 LOOP
        v_articulo_id := gen_random_uuid();
        INSERT INTO comunidad.articulos (idarticulo, titulo, contenido, categoria)
        VALUES (v_articulo_id, 'Artículo Educativo ' || i, 'Contenido extenso sobre salud número ' || i || '. El bienestar es integral.', 'Salud');
        
        -- Admin escribe artículo
        v_admin_id := (SELECT idadministrador FROM gestion.administradores LIMIT 1);
        INSERT INTO comunidad.administrador_articulo (idadministrador, idarticulo) VALUES (v_admin_id, v_articulo_id);

        -- Reacciones aleatorias
        FOR j IN 1..5 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios ORDER BY RANDOM() LIMIT 1);
            INSERT INTO comunidad.reacciones (tipo, idusuario, idarticulo)
            VALUES ((ARRAY['Me gusta', 'Me motiva', 'Util'])[((RANDOM()*2)+1)::INT], v_user_id, v_articulo_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    -- 5. ENTRENADORES Y RUTINAS
    FOR v_coach_id IN (SELECT identrenador FROM seguimiento.entrenadores) LOOP
        -- Asignar 3 usuarios a cada coach
        FOR i IN 1..3 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios WHERE idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario') ORDER BY RANDOM() LIMIT 1);
            INSERT INTO seguimiento.usuario_entrenador (idusuario, identrenador) VALUES (v_user_id, v_coach_id) ON CONFLICT DO NOTHING;
            
            -- Crear una rutina
            v_habito_id := gen_random_uuid(); -- Reutilizar variable para ID de rutina
            INSERT INTO seguimiento.rutinas (idrutina, tipo, nivel, identrenador, descripcion)
            VALUES (v_habito_id, 'Plan Personalizado', (ARRAY['Principiante', 'Intermedio', 'Avanzado'])[((RANDOM()*2)+1)::INT], v_coach_id, 'Rutina enfocada en objetivos específicos.');
            
            INSERT INTO seguimiento.usuario_rutina (idusuario, idrutina) VALUES (v_user_id, v_habito_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    -- 6. HISTORIAL DE PUNTOS (Poblar con datos base)
    INSERT INTO gestion.historial_puntos (puntos, motivo, idusuario, fecha)
    SELECT puntostotales, 'Puntos iniciales de perfil sintético', idusuario, CURRENT_DATE
    FROM gestion.usuarios WHERE puntostotales > 0;

END $$;
