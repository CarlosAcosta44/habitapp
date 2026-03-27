---
name: habit-trainer
description: Módulo de entrenadores de HabitApp — rutinas, asignación a clientes, seguimiento de progreso y recomendaciones.
---

# Skill: habit-trainer

## Propósito

Gestiona el flujo del módulo de entrenadores: creación de rutinas, vinculación con clientes, visualización del progreso diario de clientes y envío de recomendaciones como notificaciones.

---

## Roles Involucrados

| Rol | Capacidades |
|---|---|
| `entrenador` | Crear rutinas, ver clientes, enviar recomendaciones |
| `usuario` | Vincular/desvincular entrenador, ver rutinas asignadas |
| `administrador` | Acceso total equivalente al entrenador |

---

## Estructura de Carpetas

```
src/
├── repositories/
│   └── trainer.repository.ts
├── services/
│   └── trainer.service.ts
├── actions/
│   └── trainer.actions.ts
└── app/(dashboard)/
    ├── entrenador/
    │   ├── page.tsx              ← Dashboard: lista de clientes
    │   └── clientes/[userId]/
    │       └── page.tsx          ← Progreso del cliente
    └── perfil/entrenador/
        └── page.tsx              ← Vincular entrenador (para usuarios)
```

---

## Repositorio de Entrenadores

```typescript
// src/repositories/trainer.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { Routine, RoutineHabit } from '@/types/domain/trainer.types'

export const trainerRepository = {

  // Lista de entrenadores disponibles (para que usuarios los contacten)
  async findAllTrainers(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url')
      .eq('role', 'entrenador')
    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data)
  },

  // Vincular usuario con entrenador
  async linkTrainer(supabase: SupabaseClient<Database>, userId: string, trainerId: string): Promise<Result<void>> {
    const { error } = await supabase
      .from('user_trainers')
      .insert({ user_id: userId, trainer_id: trainerId })
    if (error) return fail(error.message, 'LINK_ERROR')
    return ok(undefined)
  },

  // Desvincular
  async unlinkTrainer(supabase: SupabaseClient<Database>, userId: string, trainerId: string): Promise<Result<void>> {
    const { error } = await supabase
      .from('user_trainers')
      .delete()
      .eq('user_id', userId)
      .eq('trainer_id', trainerId)
    if (error) return fail(error.message, 'UNLINK_ERROR')
    return ok(undefined)
  },

  // Clientes de un entrenador
  async findClientsByTrainer(supabase: SupabaseClient<Database>, trainerId: string) {
    const { data, error } = await supabase
      .from('user_trainers')
      .select('user_profiles!user_id(id, full_name, avatar_url, total_points)')
      .eq('trainer_id', trainerId)
    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data.map(r => r.user_profiles))
  },

  // Rutinas del entrenador
  async findRoutinesByTrainer(supabase: SupabaseClient<Database>, trainerId: string): Promise<Result<Routine[]>> {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false })
    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data)
  },

  // Crear rutina
  async createRoutine(supabase: SupabaseClient<Database>, trainerId: string, payload: { name: string; description?: string }): Promise<Result<Routine>> {
    const { data, error } = await supabase
      .from('routines')
      .insert({ ...payload, trainer_id: trainerId })
      .select()
      .single()
    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok(data)
  },
}
```

---

## Servicio de Entrenadores

```typescript
// src/services/trainer.service.ts
import { createClient } from '@/lib/supabase/server'
import { trainerRepository } from '@/repositories/trainer.repository'
import { notificationService } from '@/services/notification.service'
import { fail, ok, type Result } from '@/types/common/result.types'

export const trainerService = {

  async getAvailableTrainers() {
    const supabase = await createClient()
    return trainerRepository.findAllTrainers(supabase)
  },

  async linkTrainer(userId: string, trainerId: string): Promise<Result<void>> {
    const supabase = await createClient()
    // Verificar que trainerId pertenece a un entrenador real
    const { data } = await supabase
      .from('user_profiles').select('role').eq('id', trainerId).single()
    if (data?.role !== 'entrenador') return fail('El usuario no es un entrenador', 'INVALID_TRAINER')
    return trainerRepository.linkTrainer(supabase, userId, trainerId)
  },

  async unlinkTrainer(userId: string, trainerId: string): Promise<Result<void>> {
    const supabase = await createClient()
    return trainerRepository.unlinkTrainer(supabase, userId, trainerId)
  },

  async getMyClients(trainerId: string) {
    const supabase = await createClient()
    return trainerRepository.findClientsByTrainer(supabase, trainerId)
  },

  // Progreso del día del cliente — requiere verificar vínculo primero
  async getClientProgress(trainerId: string, clientId: string): Promise<Result<{ habits_today: number; completed_today: number; daily_rate: number }>> {
    const supabase = await createClient()
    const { data: rel } = await supabase
      .from('user_trainers').select('user_id').eq('user_id', clientId).eq('trainer_id', trainerId).single()
    if (!rel) return fail('Este usuario no es tu cliente', 'UNAUTHORIZED')

    const today = new Date().toISOString().split('T')[0]
    const [activeResult, completedResult] = await Promise.all([
      supabase.from('habits').select('*', { count: 'exact', head: true }).eq('user_id', clientId).eq('is_active', true),
      supabase.from('habit_records').select('*', { count: 'exact', head: true }).eq('user_id', clientId).eq('completed_date', today),
    ])
    const total = activeResult.count ?? 0
    const done  = completedResult.count ?? 0
    return ok({ habits_today: total, completed_today: done, daily_rate: total > 0 ? Math.round((done / total) * 100) : 0 })
  },

  // Enviar recomendación como notificación al cliente
  async sendRecommendation(trainerId: string, clientId: string, message: string): Promise<Result<void>> {
    if (!message.trim()) return fail('El mensaje no puede estar vacío', 'VALIDATION_ERROR')
    const supabase = await createClient()
    const { data: rel } = await supabase
      .from('user_trainers').select('user_id').eq('user_id', clientId).eq('trainer_id', trainerId).single()
    if (!rel) return fail('Este usuario no es tu cliente', 'UNAUTHORIZED')

    const { data: trainer } = await supabase.from('user_profiles').select('full_name').eq('id', trainerId).single()
    const result = await notificationService.notifyTrainerMessage(clientId, trainer?.full_name ?? 'Tu entrenador', message)
    return result.ok ? ok(undefined) : result
  },

  async createRoutine(trainerId: string, name: string, description?: string) {
    if (!name.trim()) return fail('El nombre es requerido', 'VALIDATION_ERROR')
    const supabase = await createClient()
    return trainerRepository.createRoutine(supabase, trainerId, { name, description })
  },
}
```

---

## Server Actions de Entrenadores

```typescript
// src/actions/trainer.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { trainerService } from '@/services/trainer.service'

// Helper: verificar que el usuario tiene rol entrenador/administrador
async function requireTrainerRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, error: 'No autenticado' as string }
  const { data: p } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if (!['entrenador', 'administrador'].includes(p?.role ?? '')) return { user: null, error: 'No autorizado' as string }
  return { user, error: null as null }
}

export async function linkTrainerAction(trainerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }
  const result = await trainerService.linkTrainer(user.id, trainerId)
  if (!result.ok) return { ok: false, error: result.error }
  revalidatePath('/dashboard/perfil/entrenador')
  return { ok: true }
}

export async function unlinkTrainerAction(trainerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }
  const result = await trainerService.unlinkTrainer(user.id, trainerId)
  if (!result.ok) return { ok: false, error: result.error }
  revalidatePath('/dashboard/perfil/entrenador')
  return { ok: true }
}

export async function sendRecommendationAction(clientId: string, formData: FormData) {
  const { user, error } = await requireTrainerRole()
  if (!user) return { ok: false, error }
  const message = formData.get('message') as string
  const result = await trainerService.sendRecommendation(user.id, clientId, message)
  return result.ok ? { ok: true } : { ok: false, error: result.error }
}

export async function createRoutineAction(formData: FormData) {
  const { user, error } = await requireTrainerRole()
  if (!user) return { ok: false, error }
  const name = formData.get('name') as string
  const description = formData.get('description') as string | undefined
  const result = await trainerService.createRoutine(user.id, name, description)
  if (!result.ok) return { ok: false, error: result.error }
  revalidatePath('/dashboard/entrenador/rutinas')
  return { ok: true, data: result.data }
}
```

---

## Protección de Ruta en Middleware

```typescript
// Añadir en src/middleware.ts
if (pathname.startsWith('/dashboard/entrenador')) {
  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user!.id).single()
  if (!['entrenador', 'administrador'].includes(profile?.role ?? '')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/habitos'
    return NextResponse.redirect(url)
  }
}
```

---

## Requerimientos Cubiertos

- RF-06.1 → Entrenador crea rutinas personalizadas
- RF-06.2 → Entrenador asigna rutinas a clientes
- RF-06.3 → Entrenador ve el progreso diario de sus clientes
- RF-06.4 → Entrenador envía recomendaciones (via notificaciones)
- RF-06.5 → Usuario vincula/desvincula entrenador desde su perfil
- RF-06.6 → Directorio de entrenadores disponibles

## Reglas Críticas

1. **Verificar siempre la relación `user_trainers`** antes de que el entrenador acceda a datos del cliente.
2. **Las recomendaciones son notificaciones internas** — no mensajes de chat en tiempo real (MVP).
3. **El middleware bloquea `/dashboard/entrenador/**`** para usuarios regulares.
4. **`requireTrainerRole()`** se llama en cada action exclusiva de entrenadores.
