---
name: habit-repository-pattern
description: Patrón de repositorios de HabitApp — capa de acceso a datos con Supabase, encapsulando todas las queries y devolviendo Result<T>.
---

# Skill: habit-repository-pattern

## Propósito

Los repositorios son la única capa que habla directamente con Supabase. Encapsulan todas las queries, manejan errores de base de datos y devuelven `Result<T>` tipados. **Ningún componente, Server Action o servicio hace queries directas a Supabase.**

---

## Arquitectura de Capas

```
UI / Page
  └── Server Action
        └── Service          ← Lógica de negocio
              └── Repository ← Solo queries a Supabase  ← ESTE SKILL
                    └── Supabase Client
```

---

## Estructura de Carpetas

```
src/
└── repositories/
    ├── habit.repository.ts
    ├── habit-record.repository.ts
    ├── user-profile.repository.ts
    ├── gamification.repository.ts
    ├── community.repository.ts
    └── trainer.repository.ts
```

---

## Contrato Base del Repositorio

Todos los repositorios siguen el mismo patrón: reciben el cliente de Supabase como dependencia y devuelven `Result<T>`.

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
```

---

## Repositorio de Hábitos

```typescript
// src/repositories/habit.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type {
  Habit,
  HabitWithDailyStatus,
  CreateHabitDTO,
  UpdateHabitDTO
} from '@/types/domain/habit.types'

export const habitRepository = {

  // Obtener todos los hábitos activos del usuario con estado del día actual
  async findActiveWithDailyStatus(
    supabase: SupabaseClient<Database>,
    userId: string,
    today: string    // 'YYYY-MM-DD'
  ): Promise<Result<HabitWithDailyStatus[]>> {
    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        habit_records!left(id, completed_date)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('habit_records.completed_date', today)
      .order('created_at', { ascending: true })

    if (error) return fail(error.message, 'DB_ERROR')

    const habits: HabitWithDailyStatus[] = data.map(h => ({
      ...h,
      is_completed_today: h.habit_records.length > 0,
      record_id: h.habit_records[0]?.id ?? null,
      current_streak: 0  // El servicio calcula esto
    }))

    return ok(habits)
  },

  // Obtener un hábito por ID (verificando que pertenece al usuario)
  async findById(
    supabase: SupabaseClient<Database>,
    habitId: string,
    userId: string
  ): Promise<Result<Habit>> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', userId)
      .single()

    if (error) return fail(error.message, 'NOT_FOUND')
    return ok(data)
  },

  // Crear un hábito
  async create(
    supabase: SupabaseClient<Database>,
    userId: string,
    dto: CreateHabitDTO
  ): Promise<Result<Habit>> {
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...dto, user_id: userId })
      .select()
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok(data)
  },

  // Actualizar un hábito
  async update(
    supabase: SupabaseClient<Database>,
    habitId: string,
    userId: string,
    dto: UpdateHabitDTO
  ): Promise<Result<Habit>> {
    const { data, error } = await supabase
      .from('habits')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', habitId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(data)
  },

  // Archivar (desactivar) un hábito
  async archive(
    supabase: SupabaseClient<Database>,
    habitId: string,
    userId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', habitId)
      .eq('user_id', userId)

    if (error) return fail(error.message, 'ARCHIVE_ERROR')
    return ok(undefined)
  },

  // Eliminar un hábito (solo si no tiene registros)
  async delete(
    supabase: SupabaseClient<Database>,
    habitId: string,
    userId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId)

    if (error) return fail(error.message, 'DELETE_ERROR')
    return ok(undefined)
  },
}
```

---

## Repositorio de Registros Diarios

```typescript
// src/repositories/habit-record.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { HabitRecord, CreateRecordDTO, DailyCompletionSummary } from '@/types/domain/record.types'

export const habitRecordRepository = {

  // Marcar hábito como completado (toggle ON)
  async create(
    supabase: SupabaseClient<Database>,
    userId: string,
    dto: CreateRecordDTO
  ): Promise<Result<HabitRecord>> {
    const { data, error } = await supabase
      .from('habit_records')
      .insert({ ...dto, user_id: userId })
      .select()
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok(data)
  },

  // Desmarcar hábito (toggle OFF) — eliminar el registro del día
  async deleteByHabitAndDate(
    supabase: SupabaseClient<Database>,
    habitId: string,
    userId: string,
    date: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('habit_records')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('completed_date', date)

    if (error) return fail(error.message, 'DELETE_ERROR')
    return ok(undefined)
  },

  // Obtener registros de los últimos N días (para heatmap y rachas)
  async findLastNDays(
    supabase: SupabaseClient<Database>,
    userId: string,
    habitId: string,
    days: number
  ): Promise<Result<HabitRecord[]>> {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const { data, error } = await supabase
      .from('habit_records')
      .select('*')
      .eq('user_id', userId)
      .eq('habit_id', habitId)
      .gte('completed_date', fromDate.toISOString().split('T')[0])
      .order('completed_date', { ascending: false })

    if (error) return fail(error.message, 'QUERY_ERROR')
    return ok(data)
  },

  // Resumen diario de todos los hábitos del usuario (para el heatmap global)
  async getDailyCompletionSummary(
    supabase: SupabaseClient<Database>,
    userId: string,
    fromDate: string,
    toDate: string
  ): Promise<Result<DailyCompletionSummary[]>> {
    const { data, error } = await supabase
      .from('habit_records')
      .select('completed_date')
      .eq('user_id', userId)
      .gte('completed_date', fromDate)
      .lte('completed_date', toDate)

    if (error) return fail(error.message, 'QUERY_ERROR')

    // Agrupar por fecha
    const grouped = data.reduce<Record<string, number>>((acc, r) => {
      acc[r.completed_date] = (acc[r.completed_date] || 0) + 1
      return acc
    }, {})

    const summary = Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
      total: 0,   // El servicio complementa esto con los hábitos activos
      percentage: 0
    }))

    return ok(summary)
  },
}
```

---

## Repositorio de Perfil de Usuario

```typescript
// src/repositories/user-profile.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { UserProfile, RankingEntry } from '@/types/domain/user.types'

export const userProfileRepository = {

  async findById(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<Result<UserProfile>> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return fail(error.message, 'NOT_FOUND')
    return ok(data)
  },

  async update(
    supabase: SupabaseClient<Database>,
    userId: string,
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'timezone'>>
  ): Promise<Result<UserProfile>> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(data)
  },

  // Ranking global — top 50 por puntos
  async getRanking(
    supabase: SupabaseClient<Database>
  ): Promise<Result<RankingEntry[]>> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url, total_points')
      .order('total_points', { ascending: false })
      .limit(50)

    if (error) return fail(error.message, 'QUERY_ERROR')

    const ranking: RankingEntry[] = data.map((u, i) => ({
      position: i + 1,
      user_id: u.id,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      total_points: u.total_points,
    }))

    return ok(ranking)
  },
}
```

---

## Reglas del Patrón Repositorio

1. **Un repositorio por tabla principal** — no mezclar queries de tablas no relacionadas.
2. **Solo SQL/queries aquí** — ninguna lógica de negocio (eso va en los servicios).
3. **Siempre verificar `user_id`** en las queries — nunca devolver datos de otro usuario aunque RLS lo permita por política.
4. **Devolver siempre `Result<T>`** — nunca lanzar excepciones ni retornar `null`.
5. **El cliente Supabase se inyecta** como parámetro — el repositorio no lo crea internamente.
6. **Usar `.single()`** cuando se espera exactamente un resultado — si no existe, Supabase retorna error que `fail()` captura.
