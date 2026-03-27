---
name: supabase-habit-schema
description: Schema SQL completo de HabitApp — tablas, enums, RLS, triggers y cómo regenerar los tipos TypeScript desde Supabase.
---

# Skill: supabase-habit-schema

## Propósito

Define el schema completo de la base de datos PostgreSQL en Supabase: todas las tablas, relaciones, Row Level Security (RLS), triggers de automatización y el proceso para mantener los tipos TypeScript sincronizados con el schema.

---

## Tablas del Sistema

| Tabla | Módulo | Descripción |
|---|---|---|
| `user_profiles` | Gestión | Extiende `auth.users` con nombre, avatar, rol y zona horaria |
| `habit_categories` | Seguimiento | Categorías personalizadas por usuario |
| `habits` | Seguimiento | Hábitos del usuario |
| `habit_records` | Seguimiento | Registro diario de cumplimiento |
| `missions` | Gamificación | Definición de misiones con condición y recompensa |
| `user_points` | Gamificación | Acumulado de puntos por usuario |
| `routines` | Entrenadores | Rutinas creadas por entrenadores |
| `routine_habits` | Entrenadores | Hábitos que componen una rutina |
| `user_trainers` | Entrenadores | Relación usuario–entrenador |
| `forum_threads` | Comunidad | Hilos de foro |
| `forum_comments` | Comunidad | Comentarios en hilos |
| `articles` | Comunidad | Artículos educativos |
| `notifications` | Gestión | Notificaciones internas por usuario |

---

## Enums SQL

```sql
-- Roles del sistema
CREATE TYPE user_role AS ENUM ('usuario', 'entrenador', 'administrador');

-- Frecuencia de hábito
CREATE TYPE habit_frequency AS ENUM ('diaria', 'semanal', 'personalizada');
```

---

## Schema SQL Completo

### Módulo de Gestión

```sql
-- Perfil del usuario (se crea automáticamente via trigger)
CREATE TABLE user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL DEFAULT '',
  avatar_url   TEXT,
  timezone     TEXT NOT NULL DEFAULT 'America/Bogota',
  role         user_role NOT NULL DEFAULT 'usuario',
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL,           -- 'mission', 'ranking', 'trainer', 'reminder'
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

### Módulo de Seguimiento

```sql
-- Categorías de hábitos (personalizadas por usuario)
CREATE TABLE habit_categories (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name    TEXT NOT NULL,
  icon    TEXT NOT NULL DEFAULT '📁',
  color   TEXT NOT NULL DEFAULT '#6366f1'
);
CREATE INDEX idx_habit_categories_user_id ON habit_categories(user_id);

-- Hábitos
CREATE TABLE habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES habit_categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT NOT NULL DEFAULT '⭐',
  color       TEXT NOT NULL DEFAULT '#6366f1',
  frequency   habit_frequency NOT NULL DEFAULT 'diaria',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_habits_user_id ON habits(user_id);

-- Registros diarios de cumplimiento
CREATE TABLE habit_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id       UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)   -- Un registro por hábito por día
);
CREATE INDEX idx_habit_records_user_id ON habit_records(user_id);
CREATE INDEX idx_habit_records_date ON habit_records(completed_date);
CREATE INDEX idx_habit_records_user_date ON habit_records(user_id, completed_date);
```

### Módulo de Gamificación

```sql
-- Misiones
CREATE TABLE missions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  condition_type   TEXT NOT NULL,    -- 'streak_7', 'complete_10_habits', etc.
  condition_value  INTEGER NOT NULL,
  reward_points    INTEGER NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE
);

-- Puntos por usuario (se actualiza via trigger)
CREATE TABLE user_points (
  user_id      UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Módulo de Entrenadores

```sql
-- Rutinas
CREATE TABLE routines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id  UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hábitos dentro de una rutina
CREATE TABLE routine_habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id  UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  habit_name  TEXT NOT NULL,
  habit_icon  TEXT NOT NULL DEFAULT '⭐',
  frequency   habit_frequency NOT NULL DEFAULT 'diaria',
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Relación usuario–entrenador
CREATE TABLE user_trainers (
  user_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, trainer_id)
);
```

### Módulo de Comunidad

```sql
-- Hilos de foro
CREATE TABLE forum_threads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  category   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comentarios
CREATE TABLE forum_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_forum_comments_thread_id ON forum_comments(thread_id);

-- Artículos educativos
CREATE TABLE articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Triggers de Automatización

### Trigger 1: Crear perfil al registrarse

```sql
-- Función
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER trg_crear_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Trigger 2: Asignar puntos al completar hábito

```sql
-- Función
CREATE OR REPLACE FUNCTION handle_habit_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Sumar 10 puntos al usuario
  UPDATE user_profiles
  SET total_points = total_points + 10,
      updated_at = NOW()
  WHERE id = NEW.user_id;

  -- También actualizar user_points
  INSERT INTO user_points (user_id, total_points)
  VALUES (NEW.user_id, 10)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + 10,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER trg_asignar_puntos
  AFTER INSERT ON habit_records
  FOR EACH ROW EXECUTE FUNCTION handle_habit_completion();
```

---

## Row Level Security (RLS)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits           ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_records    ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- Políticas de user_profiles
CREATE POLICY "Usuario puede ver su propio perfil"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuario puede actualizar su propio perfil"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de habits
CREATE POLICY "Usuario puede ver sus propios hábitos"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario puede crear hábitos"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario puede actualizar sus hábitos"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario puede eliminar sus hábitos (sin registros)"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas de habit_records
CREATE POLICY "Usuario puede ver sus propios registros"
  ON habit_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuario puede insertar registros"
  ON habit_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario puede eliminar sus registros"
  ON habit_records FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Regenerar Tipos TypeScript

Cada vez que cambie el schema, regenerar los tipos:

```bash
# Con Supabase CLI local
npx supabase gen types typescript --local > src/types/database.types.ts

# Con proyecto remoto
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```

> ⚠️ **Nunca editar `database.types.ts` manualmente** — se sobreescribe en cada regeneración.

---

## Reglas Críticas

1. **Toda tabla tiene RLS habilitado** — sin excepciones.
2. **Índices obligatorios** en `user_id` y `date` en todas las tablas de seguimiento (RNF-02.3).
3. **`UNIQUE(habit_id, completed_date)`** en `habit_records` — impide duplicados el mismo día.
4. **Los triggers se ejecutan en la base de datos** — no replicar su lógica en el código TypeScript.
5. **El entrenador accede a los datos de sus clientes** mediante la relación `user_trainers` + políticas RLS especiales.
