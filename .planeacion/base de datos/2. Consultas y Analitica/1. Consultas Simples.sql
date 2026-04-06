-- ====================================================
-- 1. CONSULTAS SIMPLES - HabitApp
-- Estas consultas extraen información básica de una sola tabla.
-- ====================================================

-- 1. Listar todos los usuarios activos
SELECT * FROM gestion.usuarios WHERE estado = 'Activo';

-- 2. Obtener todos los hábitos de un usuario específico
-- Reemplazar 'ID_USUARIO_AQUÍ' por un UUID real
SELECT * FROM seguimiento.habitos WHERE idusuario = 'ID_USUARIO_AQUÍ';

-- 3. Listar todos los foros que están abiertos
SELECT * FROM comunidad.foros WHERE estado = 'Abierto';

-- 4. Ver notificaciones pendientes (no leídas) de un usuario
SELECT * FROM gestion.notificaciones WHERE idusuario = 'ID_USUARIO_AQUÍ' AND leida = FALSE;

-- 5. Listar artículos publicados recientemente
SELECT * FROM comunidad.articulos WHERE estado = 'Publicado' ORDER BY fechapublicacion DESC;

-- 6. Ver todas las categorías de hábitos disponibles
SELECT * FROM seguimiento.categorias_habitos;

-- 7. Consultar el perfil de salud más reciente de un usuario
SELECT * FROM seguimiento.perfil_salud WHERE idusuario = 'ID_USUARIO_AQUÍ' ORDER BY fecha DESC LIMIT 1;

-- 8. Listar roles definidos en el sistema
SELECT * FROM gestion.roles;

-- 9. Consultar los registros de cumplimiento de hoy
SELECT * FROM seguimiento.registro_habitos WHERE fecha = CURRENT_DATE;

-- 10. Listar rutinas de nivel 'Intermedio'
SELECT * FROM seguimiento.rutinas WHERE nivel = 'Intermedio';
