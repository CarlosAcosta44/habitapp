/*====================================================
    RESTRICCIONES
    SistemaDeHabitos
====================================================*/

USE SistemaDeHabitos;
GO

/*====================================================
  RESTRICCIONES (CHECK / UNIQUE / DEFAULT)
====================================================*/

-- gestion.Rankings
-- Posicion y puntos no pueden ser negativos
ALTER TABLE gestion.Rankings
    ADD CONSTRAINT CHK_Rankings_posicion      CHECK (posicion >= 1),
        CONSTRAINT CHK_Rankings_puntos        CHECK (puntosTotales >= 0);
GO

-- gestion.Roles
-- nombreRol único (no pueden existir dos roles iguales)
ALTER TABLE gestion.Roles
    ADD CONSTRAINT UQ_Roles_nombreRol         UNIQUE (nombreRol);
GO

-- gestion.Usuarios
-- Correo único y formato básico válido
ALTER TABLE gestion.Usuarios
    ADD CONSTRAINT UQ_Usuarios_correo         UNIQUE (correo),
        CONSTRAINT CHK_Usuarios_correo        CHECK (correo LIKE '%@%.%');
GO

-- gestion.Administradores
-- estadoAdmin solo puede tener valores controlados
ALTER TABLE gestion.Administradores
    ADD CONSTRAINT CHK_Admin_estado           CHECK (estadoAdmin IN ('Activo','Inactivo','Suspendido'));
GO

-- seguimiento.Habitos
-- Puntos no negativos, fechaInicio no futura respecto a hoy
ALTER TABLE seguimiento.Habitos
    ADD CONSTRAINT CHK_Habitos_puntos         CHECK (puntos >= 0),
        CONSTRAINT CHK_Habitos_categoria      CHECK (categoria IN (
            'Ejercicio','Bienestar','Aprendizaje','Nutrición',
            'Salud','Productividad','Finanzas','Otro'
        ));
GO

-- seguimiento.Rutinas
-- Duración no negativa
ALTER TABLE seguimiento.Rutinas
    ADD CONSTRAINT CHK_Rutinas_duracion       CHECK (duracion >= 0);
GO

-- seguimiento.Recordatorios
-- Frecuencia solo valores válidos
ALTER TABLE seguimiento.Recordatorios
    ADD CONSTRAINT CHK_Recordatorios_frecuencia CHECK (frecuencia IN (
        'Diario','Semanal','Quincenal','Mensual'
    ));
GO

-- comunidad.Comentarios
-- Contenido no vacío
ALTER TABLE comunidad.Comentarios
    ADD CONSTRAINT CHK_Comentarios_contenido  CHECK (LEN(LTRIM(RTRIM(contenido))) > 0);
GO

-- comunidad.Foros
-- Título no vacío
ALTER TABLE comunidad.Foros
    ADD CONSTRAINT CHK_Foros_titulo           CHECK (LEN(LTRIM(RTRIM(titulo))) > 0);
GO

-- comunidad.Articulos
-- Título no vacío
ALTER TABLE comunidad.Articulos
    ADD CONSTRAINT CHK_Articulos_titulo       CHECK (LEN(LTRIM(RTRIM(titulo))) > 0);
GO



/*
=================================================================================
Prueba de restricciones
=================================================================================
*/


SELECT
    t.name          AS Tabla,
    cc.name         AS Restriccion,
    cc.definition   AS Condicion
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE t.is_ms_shipped = 0
ORDER BY t.name;



SELECT
    t.name          AS Tabla,
    i.name          AS Restriccion,
    COL_NAME(ic.object_id, ic.column_id) AS Columna
FROM sys.indexes i
JOIN sys.tables t  ON i.object_id = t.object_id
JOIN sys.index_columns ic ON i.object_id = ic.object_id
                          AND i.index_id = ic.index_id
WHERE i.is_unique_constraint = 1
  AND t.is_ms_shipped = 0
ORDER BY t.name;




SELECT
    t.name          AS Tabla,
    c.name          AS Restriccion,
    c.type_desc     AS Tipo
FROM sys.objects c
JOIN sys.tables  t ON c.parent_object_id = t.object_id
WHERE c.type IN ('C','UQ','F')   -- C=Check, UQ=Unique, F=ForeignKey
  AND t.is_ms_shipped = 0
ORDER BY t.name, c.type_desc;



/*
=================================================================================
Prueba de restricciones con errores
=================================================================================
*/


-- Debe dar ERROR (correo sin @)
INSERT INTO gestion.Usuarios (nombre, apellido, correo, contraseña, genero, idRanking, idRol)
VALUES ('Test', 'Error', 'correo-invalido', '123', 'Masculino', 1, 1);

-- Debe dar ERROR (puntos negativos)
INSERT INTO seguimiento.Habitos (nombre, descripcion, categoria, fechaInicio, estado, puntos, idUsuario)
VALUES ('Test', 'Test', 'Ejercicio', '2024-01-01', 'Activo', -50, 62);

-- Debe dar ERROR (estado inválido en Administradores)
INSERT INTO gestion.Administradores (estadoAdmin, idUsuario)
VALUES ('Bloqueado', 62);