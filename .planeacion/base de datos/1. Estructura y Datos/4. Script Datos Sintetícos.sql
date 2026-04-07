/*====================================================
  1. USUARIOS Y ROLES (GESTION)
====================================================*/
-- 4 Usuarios en auth.users (Contraseña: HabitApp123!)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, last_sign_in_at, confirmation_token, is_sso_user, deleted_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@sistema.com', '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.', NOW(), '{"nombre": "Laura", "apellido": "Admin"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), '', FALSE, NULL),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'coach@sistema.com', '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.', NOW(), '{"nombre": "Carlos", "apellido": "Entrenador"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), '', FALSE, NULL),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ana@sistema.com', '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.', NOW(), '{"nombre": "Ana", "apellido": "User"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), '', FALSE, NULL),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pipe@sistema.com', '$2a$10$6zMI5PifvQshYBGtyXt.beTX/ZNkStL/Mo2LK.bGYuYVdSdzSUJD.', NOW(), '{"nombre": "Pipe", "apellido": "User"}', '{"provider": "email", "providers": ["email"]}', NOW(), NOW(), NOW(), '', FALSE, NULL);

-- Insertar Identidades vinculadas (Obligatorio para Login)
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@sistema.com","email_verified":true}', 'email', NOW(), NOW(), NOW(), '11111111-1111-1111-1111-111111111111'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '{"sub":"22222222-2222-2222-2222-222222222222","email":"coach@sistema.com","email_verified":true}', 'email', NOW(), NOW(), NOW(), '22222222-2222-2222-2222-222222222222'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '{"sub":"33333333-3333-3333-3333-333333333333","email":"ana@sistema.com","email_verified":true}', 'email', NOW(), NOW(), NOW(), '33333333-3333-3333-3333-333333333333'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '{"sub":"44444444-4444-4444-4444-444444444444","email":"pipe@sistema.com","email_verified":true}', 'email', NOW(), NOW(), NOW(), '44444444-4444-4444-4444-444444444444');

-- Actualizar datos adicionales y roles
UPDATE gestion.usuarios SET 
    idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Administrador'),
    genero = 'Femenino',
    fechanacimiento = '1990-05-15',
    telefono = '3001234567'
WHERE idusuario = '11111111-1111-1111-1111-111111111111';

UPDATE gestion.usuarios SET 
    idrol = (SELECT idrol FROM gestion.roles WHERE nombrerol = 'Entrenador'),
    genero = 'Masculino',
    fechanacimiento = '1985-10-20',
    telefono = '3007654321'
WHERE idusuario = '22222222-2222-2222-2222-222222222222';

UPDATE gestion.usuarios SET 
    genero = 'Femenino',
    fechanacimiento = '1995-03-12',
    telefono = '3109876543'
WHERE idusuario = '33333333-3333-3333-3333-333333333333';

UPDATE gestion.usuarios SET 
    genero = 'Masculino',
    fechanacimiento = '2000-08-25',
    telefono = '3201112222'
WHERE idusuario = '44444444-4444-4444-4444-444444444444';

-- Perfil Administrador (Usando UUID real)
INSERT INTO gestion.administradores (idadministrador, estadoadmin, idusuario) 
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Activo', '11111111-1111-1111-1111-111111111111');

-- Perfil Entrenador (Usando UUID real)
INSERT INTO seguimiento.entrenadores (identrenador, especialidad, certificacion, experiencia, idusuario) 
VALUES ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Nutrición y Fuerza', 'NSCA-CPT', 8, '22222222-2222-2222-2222-222222222222');

/*====================================================
  2. SEGUIMIENTO Y SALUD
====================================================*/
-- Perfil de Salud
INSERT INTO seguimiento.perfil_salud (idperfil, peso, altura, nivelactividad, objetivo, idusuario)
VALUES ('99999999-9999-9999-9999-999999999999', 62.5, 1.65, 'Moderado', 'Mejorar resistencia', '33333333-3333-3333-3333-333333333333');

-- Relación Usuario-Entrenador
INSERT INTO seguimiento.usuario_entrenador (idusuario, identrenador)
VALUES ('33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- Rutinas
INSERT INTO seguimiento.rutinas (idrutina, tipo, descripcion, duracion, nivel, identrenador)
VALUES ('77777777-7777-7777-7777-777777777777', 'Full Body', 'Pesas para todo el cuerpo', 60, 'Principiante', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- Asignación de Rutina
INSERT INTO seguimiento.usuario_rutina (idusuario, idrutina, estado)
VALUES ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Activo');

-- Seguimientos
INSERT INTO seguimiento.seguimientos (idseguimiento, progreso, observaciones, identrenador, idusuario)
VALUES ('55555555-5555-5555-5555-555555555555', 'Excelente técnica', 'Mejora constante', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333');

/*====================================================
  3. HÁBITOS Y CUMPLIMIENTO
====================================================*/
-- Hábito para Pipe
INSERT INTO seguimiento.habitos (idhabito, nombre, puntos, idusuario, idcategoria)
VALUES ('88888888-8888-8888-8888-888888888888', 'Meditación 10min', 15, '44444444-4444-4444-4444-444444444444', 
(SELECT idcategoria FROM seguimiento.categorias_habitos WHERE nombre = 'Salud Mental'));

-- Registro (Suma puntos a Pipe automáticamente)
INSERT INTO seguimiento.registro_habitos (idregistro, completado, observacion, idhabito, idusuario)
VALUES ('44444444-0000-0000-0000-444444444444', TRUE, 'Relajado', '88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444');

-- Recordatorio
INSERT INTO seguimiento.recordatorios (idrecordatorio, mensaje, hora, frecuencia, idhabito)
VALUES ('33333333-0000-0000-0000-333333333333', 'Hora de meditar', '08:00:00', 'Diario', '88888888-8888-8888-8888-888888888888');

/*====================================================
  4. COMUNIDAD Y CONTENIDO
====================================================*/
-- Foro
INSERT INTO comunidad.foros (idforo, titulo, descripcion, categoria)
VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Reto 30 días', 'Progreso diario', 'Motivación');

-- Administrador del Foro
INSERT INTO comunidad.foro_administrador (idforo, idadministrador)
VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Usuario se une al foro
INSERT INTO comunidad.usuario_foro (idusuario, idforo)
VALUES ('33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff');

-- Artículo
INSERT INTO comunidad.articulos (idarticulo, titulo, contenido, categoria)
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Importancia del Agua', 'Contenido del artículo...', 'Nutrición');

-- Admin escribe artículo
INSERT INTO comunidad.administrador_articulo (idadministrador, idarticulo)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

-- Comentario
INSERT INTO comunidad.comentarios (idcomentario, contenido, idforo, idusuario)
VALUES ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', '¿Cómo empiezo?', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444');

-- Respuesta anidada (Admin responde a Pipe)
INSERT INTO comunidad.comentarios (idcomentario, contenido, idcomentario_padre, idforo, idusuario)
VALUES ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', '¡Hoy mismo, Pipe!', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111');

-- Reacción de Ana al artículo
INSERT INTO comunidad.reacciones (idreaccion, tipo, idusuario, idarticulo)
VALUES ('66666666-6666-6666-6666-666666666666', 'Me motiva', '33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

/*====================================================
  5. NOTIFICACIONES
====================================================*/
INSERT INTO gestion.notificaciones (idnotificacion, mensaje, tipo, idusuario)
VALUES ('12341234-1234-1234-1234-123412341234', 'Coach Carlos te asignó una rutina', 'Entrenador', '33333333-3333-3333-3333-333333333333');