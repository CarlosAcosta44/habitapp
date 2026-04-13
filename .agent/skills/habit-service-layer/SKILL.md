---
name: habit-service-layer
description: Capa de servicios de HabitApp — lógica de negocio, validaciones, toggle de hábitos, cálculo de rachas y reglas de dominio.
---

# Skill: habit-service-layer

## Propósito

Los servicios contienen **toda la lógica de negocio** del sistema. Coordinan repositorios, aplican reglas de dominio, validan condiciones de negocio y devuelven `Result<T>`. Las Server Actions los llaman directamente y nunca acceden a los repositorios por su cuenta.

---

## Arquitectura de Capas

```
Server Action
  └── Service ← ESTE SKILL (lógica de negocio)
        └── Repository (queries a Supabase)
```

---

## Estructura de Carpetas

```
src/
└── services/
    ├── habit.service.ts
    ├── habit-record.service.ts
    ├── user-profile.service.ts
    ├── gamification.service.ts
    ├── streak.service.ts
    └── community.service.ts
```

---

## Servicio de Hábitos

```typescript
// src/services/habit.service.ts
import { createClient } from '@/lib/supabase/server'
import { habitRepository } from '@/repositories/habit.repository'
import { fail, ok, type Result } from '@/types/common/result.types'
import type { Habit, HabitWithDailyStatus, CreateHabitDTO, UpdateHabitDTO } from '@/types/domain/habit.types'

export const habitService = {

  // Obtener hábitos activos del día con su estado de cumplimiento
  async getDailyHabits(userId: string): Promise<Result<HabitWithDailyStatus[]>> {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const result = await habitRepository.findActiveWithDailyStatus(supabase, userId, today)
    if (!result.ok) return result

    return ok(result.data)
  },

  // Crear un hábito con validaciones de negocio
  async createHabit(userId: string, dto: CreateHabitDTO): Promise<Result<Habit>> {
    // Validación: nombre no vacío
    if (!dto.name.trim()) {
      return fail('El nombre del hábito es requerido', 'VALIDATION_ERROR')
    }

    // Validación: máximo 20 hábitos activos
    const supabase = await createClient()
    const { data: existing, error } = await supabase
      .from('habits')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) return fail(error.message, 'DB_ERROR')
    if ((existing?.length ?? 0) >= 20) {
      return fail('Has alcanzado el límite de 20 hábitos activos', 'LIMIT_EXCEEDED')
    }

    return habitRepository.create(supabase, userId, {
      ...dto,
      name: dto.name.trim(),
    })
  },

  // Actualizar un hábito
  async updateHabit(
    userId: string,
    habitId: string,
    dto: UpdateHabitDTO
  ): Promise<Result<Habit>> {
    const supabase = await createClient()

    // Verificar que el hábito pertenece al usuario
    const existing = await habitRepository.findById(supabase, habitId, userId)
    if (!existing.ok) return fail('Hábito no encontrado', 'NOT_FOUND')

    // Regla: no editar un hábito archivado
    if (!existing.data.is_active) {
      return fail('No se puede editar un hábito archivado', 'BUSINESS_RULE')
    }

    return habitRepository.update(supabase, habitId, userId, dto)
  },

  // Archivar un hábito (desactivar, mantiene registros históricos)
  async archiveHabit(userId: string, habitId: string): Promise<Result<void>> {
    const supabase = await createClient()
    return habitRepository.archive(supabase, habitId, userId)
  },

  // Eliminar un hábito (solo si no tiene registros)
  async deleteHabit(userId: string, habitId: string): Promise<Result<void>> {
    const supabase = await createClient()

    // Verificar que no tenga registros asociados
    const { count } = await supabase
      .from('habit_records')
      .select('*', { count: 'exact', head: true })
      .eq('habit_id', habitId)
      .eq('user_id', userId)

    if ((count ?? 0) > 0) {
      return fail(
        'Este hábito tiene historial de registros. Usa "Archivar" para desactivarlo.',
        'HAS_RECORDS'
      )
    }

    return habitRepository.delete(supabase, habitId, userId)
  },
}
```

---

## Servicio de Toggle (Completar/Descompletar Hábito)

Este es el servicio más importante del sistema — el núcleo del seguimiento diario.

```typescript
// src/services/habit-record.service.ts
import { createClient } from '@/lib/supabase/server'
import { habitRepository } from '@/repositories/habit.repository'
import { habitRecordRepository } from '@/repositories/habit-record.repository'
import { fail, ok, type Result } from '@/types/common/result.types'
import type { HabitRecord } from '@/types/domain/record.types'

export const habitRecordService = {

  // Toggle: si no está completado → completar; si está completado → descompletar
  async toggle(
    userId: string,
    habitId: string
  ): Promise<Result<{ action: 'completed' | 'uncompleted'; record?: HabitRecord }>> {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Verificar que el hábito existe y pertenece al usuario
    const habitResult = await habitRepository.findById(supabase, habitId, userId)
    if (!habitResult.ok) return fail('Hábito no encontrado', 'NOT_FOUND')

    // Regla: no registrar hábitos archivados (RF-03.5)
    if (!habitResult.data.is_active) {
      return fail('No se puede registrar un hábito archivado', 'ARCHIVED')
    }

    // Verificar si ya existe registro hoy
    const { data: existing } = await supabase
      .from('habit_records')
      .select('id')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('completed_date', today)
      .single()

    if (existing) {
      // Ya completado → desmarcar (eliminar el registro)
      const result = await habitRecordRepository.deleteByHabitAndDate(
        supabase, habitId, userId, today
      )
      if (!result.ok) return result
      return ok({ action: 'uncompleted' })
    } else {
      // No completado → marcar como completado
      // (el trigger trg_asignar_puntos suma +10 pts automáticamente)
      const result = await habitRecordRepository.create(supabase, userId, {
        habit_id: habitId,
        completed_date: today,
      })
      if (!result.ok) return result
      return ok({ action: 'completed', record: result.data })
    }
  },

  // Calcular porcentaje de completitud del día actual (RF-03.4)
  async getDailyCompletionRate(userId: string): Promise<Result<number>> {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const [totalResult, completedResult] = await Promise.all([
      supabase.from('habits').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('is_active', true),
      supabase.from('habit_records').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('completed_date', today),
    ])

    const total = totalResult.count ?? 0
    const completed = completedResult.count ?? 0

    if (total === 0) return ok(0)
    return ok(Math.round((completed / total) * 100))
  },
}
```

---

## Servicio de Perfil

```typescript
// src/services/user-profile.service.ts
import { createClient } from '@/lib/supabase/server'
import { userProfileRepository } from '@/repositories/user-profile.repository'
import { fail, ok, type Result } from '@/types/common/result.types'
import type { UserProfile } from '@/types/domain/user.types'

export const userProfileService = {

  async getProfile(userId: string): Promise<Result<UserProfile>> {
    const supabase = await createClient()
    return userProfileRepository.findById(supabase, userId)
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'timezone'>>
  ): Promise<Result<UserProfile>> {
    // Validar nombre si se provee
    if (updates.full_name !== undefined && !updates.full_name.trim()) {
      return fail('El nombre no puede estar vacío', 'VALIDATION_ERROR')
    }

    const supabase = await createClient()
    return userProfileRepository.update(supabase, userId, updates)
  },

  async getRanking(): Promise<Result<import('@/types/domain/user.types').RankingEntry[]>> {
    const supabase = await createClient()
    return userProfileRepository.getRanking(supabase)
  },
}
```

---

## Reglas de los Servicios

1. **Un servicio por dominio** (habits, records, profile, community, etc.)
2. **Siempre crear el cliente Supabase dentro del servicio** con `await createClient()` — nunca recibir del cliente.
3. **Las validaciones de negocio van aquí** — las validaciones de formato van en Zod (Server Actions).
4. **No hacer más de una query secuencial sin justificarlo** — usar `Promise.all` para queries paralelas.
5. **Documentar las reglas de negocio con referencias a los RFs** (ej: `// RF-03.5`).
6. **Los servicios no llaman a otros servicios directamente** — si necesitan datos cruzados, acceden al repositorio correcto.
