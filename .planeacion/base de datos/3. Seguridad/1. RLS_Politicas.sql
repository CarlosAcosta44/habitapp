-- ====================================================
-- CAPA DE SEGURIDAD - ROW LEVEL SECURITY (RLS)
-- HabitApp - Supabase
-- ====================================================

-- 1. Habilitar RLS en las tablas principales
ALTER TABLE gestion.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.habitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento.registro_habitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad.comentarios ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICA: Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Usuarios pueden gestionar su propio perfil" 
ON gestion.usuarios 
FOR ALL 
USING (auth.uid() = idusuario);

-- 3. POLÍTICA: Los usuarios pueden ver todos los roles (Lectura pública)
ALTER TABLE gestion.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles son visibles para todos" 
ON gestion.roles FOR SELECT USING (true);

-- 4. POLÍTICA: Los usuarios solo ven sus propios hábitos
CREATE POLICY "Usuarios gestionan sus propios habitos" 
ON seguimiento.habitos 
FOR ALL 
USING (auth.uid() = idusuario);

-- 5. POLÍTICA: Los usuarios ven sus propios registros de cumplimiento
CREATE POLICY "Usuarios gestionan sus propios registros" 
ON seguimiento.registro_habitos 
FOR ALL 
USING (auth.uid() = idusuario);

-- 6. POLÍTICA: Los comentarios son públicos para lectura
CREATE POLICY "Comentarios son visibles para todos" 
ON comunidad.comentarios FOR SELECT USING (true);

-- 7. POLÍTICA: Solo el autor puede editar/borrar su comentario
CREATE POLICY "Autores gestionan sus comentarios" 
ON comunidad.comentarios 
FOR ALL 
USING (auth.uid() = idusuario);

-- 8. POLÍTICA: Entrenadores pueden ver perfiles de sus usuarios asignados
CREATE POLICY "Entrenadores ven sus clientes" 
ON gestion.usuarios
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM seguimiento.usuario_entrenador ue
        JOIN seguimiento.entrenadores e ON ue.identrenador = e.identrenador
        WHERE ue.idusuario = gestion.usuarios.idusuario
        AND e.idusuario = auth.uid()
    )
);

-- 9. POLÍTICA: Notificaciones solo visibles para el dueño
ALTER TABLE gestion.notificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dueño ve sus notificaciones" 
ON gestion.notificaciones 
FOR SELECT 
USING (auth.uid() = idusuario);

-- 10. POLÍTICA: Categorías de hábitos (Lectura pública)
ALTER TABLE seguimiento.categorias_habitos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categorias visibles para todos" 
ON seguimiento.categorias_habitos FOR SELECT USING (true);
