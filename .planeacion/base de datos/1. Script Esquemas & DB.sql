/*====================================================
  CREAR BASE DE DATOS
====================================================*/
CREATE DATABASE SistemaDeHabitos;
GO

USE SistemaDeHabitos;
GO

/*====================================================
  CREAR ESQUEMAS
====================================================*/
CREATE SCHEMA gestion;
GO

CREATE SCHEMA comunidad;
GO

CREATE SCHEMA seguimiento;
GO

/*====================================================
  GESTION
====================================================*/

CREATE TABLE gestion.Rankings (
    idRanking INT PRIMARY KEY IDENTITY(1,1),
    posicion INT,
    puntosTotales INT
);

CREATE TABLE gestion.Roles (
    idRol INT PRIMARY KEY IDENTITY(1,1),
    nombreRol VARCHAR(45),
    descripcion VARCHAR(100),
    permisos VARCHAR(100)
);

CREATE TABLE gestion.Usuarios (
    idUsuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(45),
    apellido VARCHAR(20),
    correo VARCHAR(100),
    contraseña VARCHAR(100),
    genero VARCHAR(20) CHECK (genero IN ('Masculino','Femenino','Otro')),
    idRanking INT,
    idRol INT,
    FOREIGN KEY (idRanking) REFERENCES gestion.Rankings(idRanking),
    FOREIGN KEY (idRol) REFERENCES gestion.Roles(idRol)
);

CREATE TABLE gestion.Administradores (
    idAdministrador INT PRIMARY KEY IDENTITY(1,1),
    estadoAdmin VARCHAR(20),
    idUsuario INT UNIQUE,
    FOREIGN KEY (idUsuario) REFERENCES gestion.Usuarios(idUsuario)
);

/*====================================================
  COMUNIDAD
====================================================*/

CREATE TABLE comunidad.Foros (
    idForo INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(45),
    descripcion VARCHAR(200),
    fechaCreacion DATE
);

CREATE TABLE comunidad.Comentarios (
    idComentario INT PRIMARY KEY IDENTITY(1,1),
    contenido VARCHAR(500),
    fechaPublicacion DATE,
    idForo INT,
    FOREIGN KEY (idForo) REFERENCES comunidad.Foros(idForo)
);

CREATE TABLE comunidad.Articulos (
    idArticulo INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(45),
    contenido VARCHAR(1000),
    fechaPublicacion DATE
);

/* Tablas intermedias comunidad */

CREATE TABLE comunidad.Foro_Administrador (
    idForo INT,
    idAdministrador INT,
    PRIMARY KEY (idForo, idAdministrador),
    FOREIGN KEY (idForo) REFERENCES comunidad.Foros(idForo),
    FOREIGN KEY (idAdministrador) REFERENCES gestion.Administradores(idAdministrador)
);

CREATE TABLE comunidad.Administrador_Articulo (
    idAdministrador INT,
    idArticulo INT,
    PRIMARY KEY (idAdministrador, idArticulo),
    FOREIGN KEY (idAdministrador) REFERENCES gestion.Administradores(idAdministrador),
    FOREIGN KEY (idArticulo) REFERENCES comunidad.Articulos(idArticulo)
);

CREATE TABLE comunidad.Usuario_Foro (
    idUsuario INT,
    idForo INT,
    PRIMARY KEY (idUsuario, idForo),
    FOREIGN KEY (idUsuario) REFERENCES gestion.Usuarios(idUsuario),
    FOREIGN KEY (idForo) REFERENCES comunidad.Foros(idForo)
);

/*====================================================
  SEGUIMIENTO
====================================================*/

CREATE TABLE seguimiento.Entrenadores (
    idEntrenador INT PRIMARY KEY IDENTITY(1,1),
    especialidad VARCHAR(45)
);

/* RELACION MUCHOS A MUCHOS */
CREATE TABLE gestion.Usuario_Entrenador (
    idUsuario INT,
    idEntrenador INT,
    PRIMARY KEY (idUsuario, idEntrenador),
    FOREIGN KEY (idUsuario) REFERENCES gestion.Usuarios(idUsuario),
    FOREIGN KEY (idEntrenador) REFERENCES seguimiento.Entrenadores(idEntrenador)
);

CREATE TABLE seguimiento.Habitos (
    idHabito INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(45),
    descripcion VARCHAR(200),
    categoria VARCHAR(45),
    fechaInicio DATE,
    estado VARCHAR(20) CHECK (estado IN ('Activo','Inactivo','Completado')),
    puntos INT,
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES gestion.Usuarios(idUsuario)
);

CREATE TABLE seguimiento.Recordatorios (
    idRecordatorio INT PRIMARY KEY IDENTITY(1,1),
    mensaje VARCHAR(100),
    frecuencia VARCHAR(45),
    idHabito INT,
    FOREIGN KEY (idHabito) REFERENCES seguimiento.Habitos(idHabito)
);

CREATE TABLE seguimiento.Rutinas (
    idRutina INT PRIMARY KEY IDENTITY(1,1),
    tipo VARCHAR(30),
    descripcion VARCHAR(500),
    duracion INT,
    objetivo VARCHAR(200),
    idEntrenador INT,
    FOREIGN KEY (idEntrenador) REFERENCES seguimiento.Entrenadores(idEntrenador)
);

CREATE TABLE seguimiento.Seguimientos (
    idSeguimiento INT PRIMARY KEY IDENTITY(1,1),
    fecha DATE,
    progreso VARCHAR(100),
    observaciones VARCHAR(200),
    idEntrenador INT,
    idUsuario INT,
    FOREIGN KEY (idEntrenador) REFERENCES seguimiento.Entrenadores(idEntrenador),
    FOREIGN KEY (idUsuario) REFERENCES gestion.Usuarios(idUsuario)
);


/*====================================================
  VERIFICACIÓN FINAL DE SCHEMAS
====================================================*/

SELECT name AS Schema_Name, schema_id
FROM sys.schemas
WHERE name IN ('gestion', 'comunidad', 'seguimiento')
ORDER BY name;


/*====================================================
  VERIFICACIÓN FINAL DE OBJETOS POR SCHEMA
====================================================*/

SELECT
    s.name  AS Schema_Name,
    o.name  AS Objeto,
    o.type_desc AS Tipo
FROM sys.objects o
JOIN sys.schemas s ON o.schema_id = s.schema_id
WHERE s.name IN ('gestion', 'comunidad', 'seguimiento')
  AND o.type IN ('U')  -- U = tablas de usuario
ORDER BY s.name, o.name;