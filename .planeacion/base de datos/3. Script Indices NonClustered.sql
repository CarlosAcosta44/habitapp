/*====================================================
  ÍNDICES NONCLUSTERED
====================================================*/


USE SistemaDeHabitos;
GO

-- ─────────────────────────────────────────────────
-- gestion.Usuarios
-- Búsquedas frecuentes por correo (login) y por rol
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Usuarios_correo
    ON gestion.Usuarios (correo);
GO

CREATE NONCLUSTERED INDEX IX_Usuarios_idRol
    ON gestion.Usuarios (idRol);
GO

CREATE NONCLUSTERED INDEX IX_Usuarios_idRanking
    ON gestion.Usuarios (idRanking);
GO

-- ─────────────────────────────────────────────────
-- gestion.Administradores
-- Filtrar por estado frecuentemente (activos, suspendidos)
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Administradores_estado
    ON gestion.Administradores (estadoAdmin);
GO

-- ─────────────────────────────────────────────────
-- seguimiento.Habitos
-- Consultas por usuario, estado y categoría son muy frecuentes
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Habitos_idUsuario
    ON seguimiento.Habitos (idUsuario);
GO

CREATE NONCLUSTERED INDEX IX_Habitos_estado
    ON seguimiento.Habitos (estado);
GO

CREATE NONCLUSTERED INDEX IX_Habitos_categoria
    ON seguimiento.Habitos (categoria);
GO

-- Índice compuesto: buscar hábitos activos de un usuario específico
CREATE NONCLUSTERED INDEX IX_Habitos_Usuario_Estado
    ON seguimiento.Habitos (idUsuario, estado)
    INCLUDE (nombre, puntos, fechaInicio);
GO

-- ─────────────────────────────────────────────────
-- seguimiento.Recordatorios
-- Buscar recordatorios por hábito
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Recordatorios_idHabito
    ON seguimiento.Recordatorios (idHabito);
GO

-- ─────────────────────────────────────────────────
-- seguimiento.Rutinas
-- Buscar rutinas por entrenador y por tipo
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Rutinas_idEntrenador
    ON seguimiento.Rutinas (idEntrenador);
GO

CREATE NONCLUSTERED INDEX IX_Rutinas_tipo
    ON seguimiento.Rutinas (tipo);
GO

-- ─────────────────────────────────────────────────
-- seguimiento.Seguimientos
-- Consultas por usuario, entrenador y fecha
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Seguimientos_idUsuario
    ON seguimiento.Seguimientos (idUsuario);
GO

CREATE NONCLUSTERED INDEX IX_Seguimientos_idEntrenador
    ON seguimiento.Seguimientos (idEntrenador);
GO

-- Índice compuesto: historial cronológico por usuario
CREATE NONCLUSTERED INDEX IX_Seguimientos_Usuario_Fecha
    ON seguimiento.Seguimientos (idUsuario, fecha DESC)
    INCLUDE (progreso, observaciones);
GO

-- ─────────────────────────────────────────────────
-- comunidad.Comentarios
-- Buscar comentarios por foro y ordenar por fecha
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Comentarios_idForo
    ON comunidad.Comentarios (idForo);
GO

CREATE NONCLUSTERED INDEX IX_Comentarios_Foro_Fecha
    ON comunidad.Comentarios (idForo, fechaPublicacion DESC);
GO

-- ─────────────────────────────────────────────────
-- comunidad.Foros
-- Buscar foros por fecha de creación (más recientes)
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Foros_fechaCreacion
    ON comunidad.Foros (fechaCreacion DESC);
GO

-- ─────────────────────────────────────────────────
-- comunidad.Articulos
-- Buscar artículos por fecha de publicación
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Articulos_fechaPublicacion
    ON comunidad.Articulos (fechaPublicacion DESC);
GO

-- ─────────────────────────────────────────────────
-- gestion.Rankings
-- Consultas de tabla de posiciones ordenadas
-- ─────────────────────────────────────────────────
CREATE NONCLUSTERED INDEX IX_Rankings_posicion
    ON gestion.Rankings (posicion ASC)
    INCLUDE (puntosTotales);
GO

/*====================================================
  VERIFICACIÓN: listar todos los índices creados
====================================================*/
SELECT
    t.name          AS Tabla,
    i.name          AS Indice,
    i.type_desc     AS Tipo,
    i.is_unique     AS EsUnico
FROM sys.indexes i
JOIN sys.tables  t ON i.object_id = t.object_id
WHERE i.type_desc = 'NONCLUSTERED'
  AND t.is_ms_shipped = 0
ORDER BY t.name, i.name;
GO