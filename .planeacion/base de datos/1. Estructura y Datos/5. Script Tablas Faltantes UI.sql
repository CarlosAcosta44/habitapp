/*====================================================
  SISTEMA DE HÁBITOS SALUDABLES - EXTENSIÓN UI
  Script SQL 5 - Tablas Faltantes para Módulo Dashboard
  
  Estas tablas fueron añadidas para soportar los mocks
  y diseños del Dashboard Principal (Amigos, Logros, Retos).
====================================================*/

-- ====================================================
-- ESQUEMA: GESTION (Amistades y Logros)
-- ====================================================

-- 1. Gestión de Amistades / Red de Apoyo
CREATE TABLE gestion.amigos (
    idamistad UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idusuario_solicitante UUID NOT NULL,
    idusuario_receptor    UUID NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aceptado', 'Rechazado', 'Bloqueado')),
    fechasolicitud DATE NOT NULL DEFAULT CURRENT_DATE,
    fecharespuesta DATE,
    FOREIGN KEY (idusuario_solicitante) REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idusuario_receptor) REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
    -- Seguro para no auto-agregarse
    CHECK (idusuario_solicitante <> idusuario_receptor)
);

-- Asegurar que solo haya una relación única (independiente de quién invitó a quién)
CREATE UNIQUE INDEX unique_amistad_relacion 
ON gestion.amigos (
    LEAST(idusuario_solicitante, idusuario_receptor), 
    GREATEST(idusuario_solicitante, idusuario_receptor)
);

-- 2. Catálogo de Logros e Insignias del Sistema
CREATE TABLE gestion.logros (
    idlogro UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300) NOT NULL,
    icono VARCHAR(20) NOT NULL, -- Ej: '🌙', '📚', '⚡'
    puntos_recompensa INT DEFAULT 0,
    -- Puede ser un logro estático o de un evento específico
    tipo VARCHAR(50) DEFAULT 'General'
);

-- 3. Logros Obtenidos por los Usuarios
CREATE TABLE gestion.usuario_logro (
    idusuario UUID NOT NULL,
    idlogro UUID NOT NULL,
    fechaobtenido DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (idusuario, idlogro),
    FOREIGN KEY (idusuario) REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idlogro) REFERENCES gestion.logros(idlogro) ON DELETE CASCADE
);

-- ====================================================
-- ESQUEMA: COMUNIDAD (Retos Globales/Comunitarios)
-- ====================================================

-- 1. Catálogo de Retos Grupales
CREATE TABLE comunidad.retos (
    idreto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    insignia_recompensa UUID, -- Puede otorgar un logro al finalizar
    puntos_recompensa INT DEFAULT 0,
    fechainicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fechafin DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Borrador', 'Activo', 'Finalizado')),
    FOREIGN KEY (insignia_recompensa) REFERENCES gestion.logros(idlogro) ON DELETE SET NULL
);

-- 2. Tareas que conforman un reto específico (Ej: "Beber agua", "Correr 5km")
CREATE TABLE comunidad.reto_tareas (
    idtarea UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    metrica_objetivo INT NOT NULL, -- Ej: 2000 (ml), 10000 (pasos)
    unidad_medida VARCHAR(20) NOT NULL, -- Ej: 'ml', 'pasos', 'minutos', 'veces'
    icono VARCHAR(20), -- Ej: 'Droplet', 'Footprints' (referencia a la UI)
    idreto UUID NOT NULL,
    FOREIGN KEY (idreto) REFERENCES comunidad.retos(idreto) ON DELETE CASCADE
);

-- 3. Participación de Usuarios en Retos
CREATE TABLE comunidad.usuario_reto (
    idusuario UUID NOT NULL,
    idreto UUID NOT NULL,
    fechainscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'En Curso' CHECK (estado IN ('En Curso', 'Completado', 'Abandonado')),
    PRIMARY KEY (idusuario, idreto),
    FOREIGN KEY (idusuario) REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idreto) REFERENCES comunidad.retos(idreto) ON DELETE CASCADE
);

-- 4. Progreso de los Usuarios en las Tareas de los Retos
CREATE TABLE comunidad.usuario_tarea_progreso (
    idusuario UUID NOT NULL,
    idtarea UUID NOT NULL,
    valor_actual INT NOT NULL DEFAULT 0,
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idusuario, idtarea),
    FOREIGN KEY (idusuario) REFERENCES gestion.usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idtarea) REFERENCES comunidad.reto_tareas(idtarea) ON DELETE CASCADE
);

/*====================================================
  POLÍTICAS RLS (Seguridad Básica)
  Nota: Estas políticas están orientadas a lectura. 
  La inserción/actualización se manejará desde el cliente o servidor autenticado.
====================================================*/

ALTER TABLE gestion.amigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.logros ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestion.usuario_logro ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.retos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.reto_tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.usuario_reto ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.usuario_tarea_progreso ENABLE ROW LEVEL SECURITY;

-- 1. Amistades: los usuarios solo pueden ver relaciones públicas aceptadas o las propias
CREATE POLICY "Amistades: lectura permitida" ON gestion.amigos FOR SELECT USING (true);
CREATE POLICY "Amistades: modificación por dueños" ON gestion.amigos FOR ALL USING (auth.uid() = idusuario_solicitante OR auth.uid() = idusuario_receptor);

-- 2. Logros: catálogo y progreso totalmente público
CREATE POLICY "Logros: lectura publica total" ON gestion.logros FOR SELECT USING (true);
CREATE POLICY "Usuario Logros: lectura publica" ON gestion.usuario_logro FOR SELECT USING (true);

-- 3. Retos Comunitarios: catálogo de retos públicos
CREATE POLICY "Retos: lectura publica" ON comunidad.retos FOR SELECT USING (true);
CREATE POLICY "Reto Tareas: lectura publica" ON comunidad.reto_tareas FOR SELECT USING (true);
CREATE POLICY "Usuario Reto: lectura publica" ON comunidad.usuario_reto FOR SELECT USING (true);

-- 4. Progreso de Tareas de Reto
CREATE POLICY "Usuario Tarea Progreso: propios dueños" ON comunidad.usuario_tarea_progreso FOR ALL USING (auth.uid() = idusuario);
CREATE POLICY "Usuario Tarea Progreso: lectura publica" ON comunidad.usuario_tarea_progreso FOR SELECT USING (true);

/*====================================================
  DATOS INERCIALES / MOCKS INICIALES
  (Coinciden con los de tu Perfil/Dashboard de UI)
====================================================*/

-- Logros en duro de la UI
INSERT INTO gestion.logros (nombre, descripcion, icono, puntos_recompensa)
VALUES 
    ('Sueño Profundo', '7 días durmiendo +8h', '🌙', 50),
    ('Ratón de Biblioteca', 'Leído 500 páginas este mes', '📚', 80),
    ('Corazón de Oro', 'Ayudaste a 10 amigos', '❤️', 100),
    ('Energía Pura', 'Sprint de 5km completado', '⚡', 75);

-- Reto principal de la UI
INSERT INTO comunidad.retos (titulo, descripcion, puntos_recompensa)
VALUES ('¡Mejores corredores!', 'Únete a 142 corredores esta semana y cumple las 4 tareas diarias. Mantén una racha y consigue increíbles insignias.', 200);

-- Extraer el ID del nuevo Reto para inyectar sus tareas simuladas:
DO $$
DECLARE
    v_idreto UUID;
BEGIN
    SELECT idreto INTO v_idreto FROM comunidad.retos WHERE titulo = '¡Mejores corredores!' LIMIT 1;
    
    INSERT INTO comunidad.reto_tareas (nombre, metrica_objetivo, unidad_medida, icono, idreto)
    VALUES 
        ('Beber agua', 2000, 'ml', 'Droplet', v_idreto),
        ('Correr', 10000, 'pasos', 'Footprints', v_idreto),
        ('Tomar el sol', 4, 'veces', 'Flower2', v_idreto),
        ('Meditar', 30, 'minutos', 'Wind', v_idreto);
END $$;

/*====================================================
  VISTAS API PÚBLICAS
  Para que Next.js (Frontend) pueda consumirlas sin
  tener esquema gestion explícito.
====================================================*/

CREATE OR REPLACE VIEW public.api_amigos AS SELECT * FROM gestion.amigos;
CREATE OR REPLACE VIEW public.api_logros AS SELECT * FROM gestion.logros;
CREATE OR REPLACE VIEW public.api_usuario_logro AS SELECT * FROM gestion.usuario_logro;
CREATE OR REPLACE VIEW public.api_historial_puntos AS SELECT * FROM gestion.historial_puntos;

GRANT SELECT ON public.api_amigos TO anon, authenticated;
GRANT SELECT ON public.api_logros TO anon, authenticated;
GRANT SELECT ON public.api_usuario_logro TO anon, authenticated;
GRANT SELECT ON public.api_historial_puntos TO anon, authenticated;
