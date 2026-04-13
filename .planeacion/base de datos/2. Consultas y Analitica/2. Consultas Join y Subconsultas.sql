-- ====================================================
-- 2. CONSULTAS JOIN Y SUBCONSULTAS - HabitApp
-- Consultas que relacionan múltiples tablas para obtener datos enriquecidos.
-- ====================================================

-- 1. Obtener usuarios con su respectivo nombre de rol
SELECT u.nombre, u.apellido, r.nombrerol 
FROM gestion.usuarios u
JOIN gestion.roles r ON u.idrol = r.idrol;

-- 2. Listar hábitos con el nombre de su categoría
SELECT h.nombre AS habito, c.nombre AS categoria
FROM seguimiento.habitos h
JOIN seguimiento.categorias_habitos c ON h.idcategoria = c.idcategoria;

-- 3. Ver comentarios de foros con el nombre completo y foto del autor
SELECT c.contenido, u.nombre, u.apellido, u.fotoperfil
FROM comunidad.comentarios c
JOIN gestion.usuarios u ON c.idusuario = u.idusuario
ORDER BY c.fechapublicacion DESC;

-- 4. Listar artículos y los nombres de los administradores que los escribieron
SELECT a.titulo, u.nombre, u.apellido
FROM comunidad.articulos a
JOIN comunidad.administrador_articulo aa ON a.idarticulo = aa.idarticulo
JOIN gestion.administradores adm ON aa.idadministrador = adm.idadministrador
JOIN gestion.usuarios u ON adm.idusuario = u.idusuario;

-- 5. Usuarios asignados a un entrenador específico (con datos del entrenador)
SELECT u_cliente.nombre AS cliente, u_pro.nombre AS entrenador
FROM seguimiento.usuario_entrenador ue
JOIN gestion.usuarios u_cliente ON ue.idusuario = u_cliente.idusuario
JOIN seguimiento.entrenadores e ON ue.identrenador = e.identrenador
JOIN gestion.usuarios u_pro ON e.idusuario = u_pro.idusuario;

-- 6. Subconsulta: Listar hábitos que NO han tenido registros de cumplimiento hoy
SELECT nombre FROM seguimiento.habitos 
WHERE idhabito NOT IN (
    SELECT idhabito FROM seguimiento.registro_habitos WHERE fecha = CURRENT_DATE
);

-- 7. Usuarios que han completado al menos un hábito hoy
SELECT DISTINCT u.nombre, u.apellido
FROM gestion.usuarios u
JOIN seguimiento.registro_habitos r ON u.idusuario = r.idusuario
WHERE r.fecha = CURRENT_DATE AND r.completado = TRUE;

-- 8. Foros con su cantidad total de comentarios (Group By)
SELECT f.titulo, COUNT(c.idcomentario) AS total_comentarios
FROM comunidad.foros f
LEFT JOIN comunidad.comentarios c ON f.idforo = c.idforo
GROUP BY f.idforo, f.titulo;

-- 9. Listar rutinas asignadas a usuarios que siguen 'Activas'
SELECT r.tipo, u.nombre AS usuario, ur.fechainicio
FROM seguimiento.usuario_rutina ur
JOIN seguimiento.rutinas r ON ur.idrutina = r.idrutina
JOIN gestion.usuarios u ON ur.idusuario = u.idusuario
WHERE ur.estado = 'Activo';

-- 10. Subconsulta: Obtener el usuario con el puntaje más alto (Ranking Realtime)
SELECT nombre, apellido, puntostotales 
FROM gestion.usuarios 
WHERE puntostotales = (SELECT MAX(puntostotales) FROM gestion.usuarios);
