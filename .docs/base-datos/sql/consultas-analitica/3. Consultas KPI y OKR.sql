-- ====================================================
-- 3. CONSULTAS KPI Y OKR - HabitApp
-- Métricas de negocio, gamificación y desempeño.
-- ====================================================

-- 1. KPI: Tasa de cumplimiento diaria global (% de hábitos completados hoy)
SELECT 
    (COUNT(*) FILTER (WHERE completado = TRUE) * 100.0 / NULLIF(COUNT(*), 0)) AS tasa_cumplimiento_hoy
FROM seguimiento.registro_habitos 
WHERE fecha = CURRENT_DATE;

-- 2. Promedio de puntos acumulados por usuario (Puntos totales / Usuarios activos)
SELECT AVG(puntostotales) as promedio_puntos_usuario 
FROM gestion.usuarios WHERE estado = 'Activo';

-- 3. OKR: Top 10 usuarios más constantes (Basado en total de puntos)
SELECT nombre, apellido, puntostotales 
FROM gestion.usuarios 
ORDER BY puntostotales DESC LIMIT 10;

-- 4. KPI: Categorías de hábitos con mayor adopción (Hábitos por categoría)
SELECT c.nombre, COUNT(h.idhabito) as total_habitos
FROM seguimiento.categorias_habitos c
LEFT JOIN seguimiento.habitos h ON c.idcategoria = h.idcategoria
GROUP BY c.idcategoria, c.nombre
ORDER BY total_habitos DESC;

-- 5. Engagement: Foros con mayor interacción (Comentarios + Suscriptores)
SELECT 
    f.titulo, 
    COUNT(DISTINCT c.idcomentario) as comentarios,
    COUNT(DISTINCT uf.idusuario) as miembros
FROM comunidad.foros f
LEFT JOIN comunidad.comentarios c ON f.idforo = c.idforo
LEFT JOIN comunidad.usuario_foro uf ON f.idforo = uf.idforo
GROUP BY f.idforo, f.titulo
ORDER BY (comentarios + miembros) DESC;

-- 6. Retención: % de usuarios que han interactuado en los últimos 7 días
SELECT 
    (COUNT(DISTINCT idusuario) * 100.0 / (SELECT COUNT(*) FROM gestion.usuarios)) as porcentaje_retencion_semanal
FROM seguimiento.registro_habitos
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days';

-- 7. Crecimiento: Cantidad de nuevos hábitos creados este mes
SELECT COUNT(*) as habitos_nuevos_mes 
FROM seguimiento.habitos 
WHERE fechainicio >= date_trunc('month', CURRENT_DATE);

-- 8. Gamificación: Distribución de reacciones por tipo
SELECT tipo, COUNT(*) as cantidad
FROM comunidad.reacciones
GROUP BY tipo;

-- 9. Desempeño Entrenadores: Promedio de usuarios por entrenador
SELECT AVG(conteo) FROM (
    SELECT COUNT(idusuario) as conteo 
    FROM seguimiento.usuario_entrenador 
    GROUP BY identrenador
) as sub;

-- 10. KPI Salud: Evolución promedio del peso de los usuarios en el último trimestre
-- (Solo usuarios con más de un registro de peso)
SELECT 
    date_trunc('month', fecha) as mes, 
    AVG(peso) as peso_promedio
FROM seguimiento.perfil_salud
WHERE fecha >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY mes
ORDER BY mes;
