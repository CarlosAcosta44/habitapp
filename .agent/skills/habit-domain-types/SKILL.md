---
name: habit-domain-types
description: Tipos TypeScript del dominio de HabitApp — entidades, DTOs, enums, Result<T> y contratos de la capa de negocio.
---

# Skill: habit-domain-types

## Propósito

Define todos los tipos, interfaces y DTOs que se usan a través de las capas del sistema. Es la fuente de verdad de los contratos entre capas (UI → Actions → Services → Repositories). Ninguna capa inventa sus propios tipos — todos se importan desde aquí.

---

## Ubicación de los Tipos

```
src/
└── types/
    ├── database.types.ts    ← Generado automáticamente por Supabase CLI
    ├── domain/
    │   ├── user.types.ts
    │   ├── habit.types.ts
    │   ├── record.types.ts
    │   ├── gamification.types.ts
    │   ├── community.types.ts
    │   └── trainer.types.ts
    └── common/
        ├── result.types.ts   ← Patrón Result<T>
        └── pagination.types.ts
```

---

## Patrón Result\<T\>

Toda operación de servicio o repositorio que puede fallar devuelve un `Result<T>` en lugar de lanzar excepciones. Esto hace el manejo de errores explícito y predecible.

```typescript
// src/types/common/result.types.ts

export type Success<T> = {
  ok: true
  data: T
}

export type Failure = {
  ok: false
  error: string
  code?: string
}

export type Result<T> = Success<T> | Failure

// Helpers
export const ok = <T>(data: T): Success<T> => ({ ok: true, data })
export const fail = (error: string, code?: string): Failure => ({ ok: false, error, code })
```

**Uso:**
```typescript
const result = await habitService.toggleHabit(habitId, userId)
if (!result.ok) {
  return { error: result.error }
}
// result.data está disponible aquí con tipado correcto
```

---

## Enums

```typescript
// src/types/domain/user.types.ts

export type UserRole = 'usuario' | 'entrenador' | 'administrador'

export type HabitFrequency = 'diaria' | 'semanal' | 'personalizada'

export type HabitCategory =
  | 'ejercicio'
  | 'nutricion'
  | 'sueno'
  | 'hidratacion'
  | 'salud_mental'
  | 'otro'
```

---

## Entidad: UserProfile

```typescript
// src/types/domain/user.types.ts

export interface UserProfile {
  id: string                    // UUID — igual al auth.users.id
  full_name: string
  avatar_url: string | null
  timezone: string              // Ej: 'America/Bogota'
  role: UserRole
  total_points: number
  created_at: string
  updated_at: string
}
```

---

## Entidad: Habit

```typescript
// src/types/domain/habit.types.ts

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: string                  // Emoji o nombre de ícono
  color: string                 // Hex color ej: '#6366f1'
  frequency: HabitFrequency
  category_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCategory {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
}

// DTO para crear un hábito
export interface CreateHabitDTO {
  name: string
  description?: string
  icon: string
  color: string
  frequency: HabitFrequency
  category_id?: string
}

// DTO para actualizar un hábito
export interface UpdateHabitDTO {
  name?: string
  description?: string
  icon?: string
  color?: string
  frequency?: HabitFrequency
  category_id?: string
  is_active?: boolean
}

// Hábito con su estado en el día actual (para la vista diaria)
export interface HabitWithDailyStatus extends Habit {
  is_completed_today: boolean
  record_id: string | null      // ID del registro si completado
  current_streak: number
}
```

---

## Entidad: HabitRecord

```typescript
// src/types/domain/record.types.ts

export interface HabitRecord {
  id: string
  habit_id: string
  user_id: string
  completed_date: string        // Formato: 'YYYY-MM-DD'
  note: string | null
  created_at: string
}

export interface CreateRecordDTO {
  habit_id: string
  completed_date: string
  note?: string
}

// Para el heatmap — 90 días de registros
export interface DailyCompletionSummary {
  date: string                  // 'YYYY-MM-DD'
  count: number                 // Cantidad de hábitos completados ese día
  total: number                 // Total de hábitos activos ese día
  percentage: number            // count / total * 100
}
```

---

## Entidad: Gamificación

```typescript
// src/types/domain/gamification.types.ts

export interface Mission {
  id: string
  title: string
  description: string
  condition_type: string        // Ej: 'streak_7', 'complete_10_habits'
  condition_value: number
  reward_points: number
  is_active: boolean
}

export interface UserPoints {
  user_id: string
  total_points: number
  updated_at: string
}

export interface RankingEntry {
  position: number
  user_id: string
  full_name: string
  avatar_url: string | null
  total_points: number
}
```

---

## Entidad: Comunidad

```typescript
// src/types/domain/community.types.ts

export interface ForumThread {
  id: string
  user_id: string
  title: string
  content: string
  category: string
  created_at: string
  updated_at: string
  comment_count: number
  author_name: string
  author_avatar: string | null
}

export interface ForumComment {
  id: string
  thread_id: string
  user_id: string
  content: string
  created_at: string
  author_name: string
  author_avatar: string | null
  like_count: number
}

export interface Article {
  id: string
  author_id: string
  title: string
  content: string
  category: string
  is_published: boolean
  created_at: string
  updated_at: string
  author_name: string
}
```

---

## Tipos del Trainer

```typescript
// src/types/domain/trainer.types.ts

export interface Routine {
  id: string
  trainer_id: string
  name: string
  description: string | null
  created_at: string
}

export interface RoutineHabit {
  id: string
  routine_id: string
  habit_name: string
  habit_icon: string
  frequency: HabitFrequency
  order_index: number
}

export interface UserTrainerRelation {
  user_id: string
  trainer_id: string
  assigned_at: string
  trainer_name: string
  trainer_avatar: string | null
}
```

---

## Reglas de la Capa de Tipos

1. **Nunca usar `any`** — si el tipo de Supabase no es suficiente, extender con interfaces propias.
2. **Siempre usar `Result<T>`** en servicios y repositorios que pueden fallar.
3. **DTOs son inmutables** — solo tienen los campos que se permiten recibir desde el exterior.
4. **`database.types.ts` se regenera automáticamente** con `npx supabase gen types typescript --local > src/types/database.types.ts` — nunca editar manualmente.
5. Importar `Database` de `database.types.ts` en los clientes de Supabase para tipado automático de queries.
