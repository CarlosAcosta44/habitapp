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
    -- 1. LIMPIEZA PREVIA (Opcional - solo tablas de datos, no roles/categorias)
    DELETE FROM gestion.notificaciones;
    DELETE FROM comunidad.reacciones;
    DELETE FROM comunidad.comentarios;
    DELETE FROM comunidad.usuario_foro;
    DELETE FROM comunidad.foro_administrador;
    DELETE FROM comunidad.articulos;
    DELETE FROM comunidad.foros;
    DELETE FROM seguimiento.registro_habitos;
    DELETE FROM seguimiento.recordatorios;
    DELETE FROM seguimiento.habitos;
    DELETE FROM seguimiento.usuario_rutina;
    DELETE FROM seguimiento.rutinas;
    DELETE FROM seguimiento.seguimientos;
    DELETE FROM seguimiento.usuario_entrenador;
    DELETE FROM seguimiento.entrenadores;
    DELETE FROM seguimiento.perfil_salud;
    DELETE FROM gestion.historial_puntos;
    DELETE FROM gestion.usuarios WHERE idusuario NOT IN (SELECT id FROM auth.users); -- Solo huérfanos

    -- 2. GENERACIÓN DE 25 USUARIOS EN AUTH Y GESTION
    FOR i IN 1..25 LOOP
        v_user_id := gen_random_uuid();
        
        -- Insertar en Auth (Simulado para entorno local/SQL Editor)
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
        VALUES (
            v_user_id, 
            LOWER(v_nombres[i]) || i || '@habitapp.test', 
            'no-password-for-synthetic-data', 
            NOW(), 
            jsonb_build_object('nombre', v_nombres[i], 'apellido', v_apellidos[i]),
            'authenticated', 'authenticated'
        );

        -- El trigger gestion.crear_perfil_usuario debería activarse solo.
        -- Si no está activo/creado aún, lo forzamos:
        INSERT INTO gestion.usuarios (idusuario, nombre, apellido, idrol, puntostotales)
        VALUES (
            v_user_id, 
            v_nombres[i], 
            v_apellidos[i], 
            (SELECT idrol FROM gestion.roles WHERE nombrerol = CASE 
                WHEN i <= 2 THEN 'Administrador' 
                WHEN i <= 7 THEN 'Entrenador' 
                ELSE 'Usuario' END),
            (RANDOM() * 500)::INT
        ) ON CONFLICT (idusuario) DO UPDATE SET puntostotales = EXCLUDED.puntostotales;

        -- Guardar IDs de referencia
        IF i = 1 THEN v_admin_id := (SELECT idadministrador FROM gestion.administradores WHERE idusuario = v_user_id LIMIT 1); 
           IF v_admin_id IS NULL THEN 
              v_admin_id := gen_random_uuid();
              INSERT INTO gestion.administradores (idadministrador, idusuario, estadoadmin) VALUES (v_admin_id, v_user_id, 'Activo');
           END IF;
        END IF;
        
        IF i > 2 AND i <= 7 THEN
            INSERT INTO seguimiento.entrenadores (identrenador, idusuario, especialidad, experiencia)
            VALUES (gen_random_uuid(), v_user_id, ARRAY_GET(ARRAY['Fuerza', 'Yoga', 'Nutrición', 'Crossfit'], (RANDOM()*3+1)::INT), (RANDOM()*10+1)::INT);
        END IF;
    END LOOP;

    -- 3. HÁBITOS Y REGISTROS (30 DÍAS)
    FOR v_user_id IN (SELECT idusuario FROM gestion.usuarios WHERE idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario')) LOOP
        -- Crear 3 hábitos por usuario
        FOR j IN 1..3 LOOP
            v_cat_id := (SELECT idcategoria FROM seguimiento.categorias_habitos ORDER BY RANDOM() LIMIT 1);
            v_habito_id := gen_random_uuid();
            
            INSERT INTO seguimiento.habitos (idhabito, nombre, idusuario, idcategoria, puntos)
            VALUES (v_habito_id, 'Hábito ' || j || ' de ' || v_user_id, (RANDOM()*20+5)::INT, v_user_id, v_cat_id);

            -- Crear registros para los últimos 30 días
            FOR k IN 0..30 LOOP
                INSERT INTO seguimiento.registro_habitos (idhabito, idusuario, fecha, completado, puntos_ganados)
                VALUES (v_habito_id, v_user_id, CURRENT_DATE - k, (RANDOM() > 0.3), (RANDOM()*10)::INT)
                ON CONFLICT DO NOTHING;
            END LOOP;
        END LOOP;
        
        -- Perfil de salud
        INSERT INTO seguimiento.perfil_salud (peso, altura, nivelactividad, idusuario)
        VALUES (RANDOM()*40+50, RANDOM()*0.5+1.5, 'Activo', v_user_id);
    END LOOP;

    -- 4. COMUNIDAD (FOROS, ARTICULOS, COMENTARIOS)
    FOR i IN 1..5 LOOP
        v_foro_id := gen_random_uuid();
        INSERT INTO comunidad.foros (idforo, titulo, descripcion, categoria)
        VALUES (v_foro_id, 'Foro de Discusión ' || i, 'Hablemos sobre salud y bienestar ' || i, 'General');
        
        -- 5 Comentarios por foro
        FOR j IN 1..5 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios ORDER BY RANDOM() LIMIT 1);
            INSERT INTO comunidad.comentarios (idcomentario, contenido, idforo, idusuario)
            VALUES (gen_random_uuid(), 'Me gusta mucho este foro ' || i || '-' || j, v_foro_id, v_user_id);
        END LOOP;
    END LOOP;

    FOR i IN 1..10 LOOP
        v_articulo_id := gen_random_uuid();
        INSERT INTO comunidad.articulos (idarticulo, titulo, contenido, categoria)
        VALUES (v_articulo_id, 'Artículo Educativo ' || i, 'Contenido extenso sobre salud número ' || i, 'Salud');
        
        -- Reacciones aleatorias
        FOR j IN 1..5 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios ORDER BY RANDOM() LIMIT 1);
            INSERT INTO comunidad.reacciones (tipo, idusuario, idarticulo)
            VALUES ('Me motiva', v_user_id, v_articulo_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

    -- 5. ENTRENADORES Y RUTINAS
    FOR v_coach_id IN (SELECT identrenador FROM seguimiento.entrenadores) LOOP
        -- Asignar 2 usuarios a cada coach
        FOR i IN 1..2 LOOP
            v_user_id := (SELECT idusuario FROM gestion.usuarios WHERE idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Usuario') ORDER BY RANDOM() LIMIT 1);
            INSERT INTO seguimiento.usuario_entrenador (idusuario, identrenador) VALUES (v_user_id, v_coach_id) ON CONFLICT DO NOTHING;
            
            -- Crear una rutina
            v_habito_id := gen_random_uuid(); -- Reutilizar variable para ID de rutina
            INSERT INTO seguimiento.rutinas (idrutina, tipo, nivel, identrenador)
            VALUES (v_habito_id, 'Rutina Coach', 'Intermedio', v_coach_id);
            
            INSERT INTO seguimiento.usuario_rutina (idusuario, idrutina) VALUES (v_user_id, v_habito_id) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;

END $$;
