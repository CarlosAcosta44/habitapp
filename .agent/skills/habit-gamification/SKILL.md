---
name: habit-gamification
description: Sistema de gamificación de HabitApp — misiones, acumulación de puntos, ranking global y lógica de recompensas.
---

# Skill: habit-gamification

## Propósito

Gestiona el sistema de puntos, misiones y ranking de HabitApp. Los puntos se asignan automáticamente via trigger de base de datos al completar hábitos; las misiones son condiciones adicionales que generan recompensas extra; el ranking ordena a los usuarios por puntos totales.

---

## Flujo de Puntos

```
Usuario completa hábito
        │
        ▼
habit_records (INSERT)
        │
        ▼  ← trigger trg_asignar_puntos (automático en DB)
user_profiles.total_points += 10
user_points.total_points   += 10
        │
        ▼
Servicio verifica si se completó alguna misión
        │
        ▼ (si aplica)
notifications INSERT — "¡Completaste la misión X!"
```

> ⚠️ **El trigger de Supabase asigna los 10 puntos base automáticamente.** El código TypeScript NO debe sumar puntos — solo verificar misiones y crear notificaciones.

---

## Estructura de Carpetas

```
src/
└── services/
    ├── gamification.service.ts
    └── ranking.service.ts
└── repositories/
    └── gamification.repository.ts
└── app/(dashboard)/
    └── comunidad/
        └── ranking/
            └── page.tsx
```

---

## Repositorio de Gamificación

```typescript
// src/repositories/gamification.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { Mission, RankingEntry } from '@/types/domain/gamification.types'

export const gamificationRepository = {

  // Obtener todas las misiones activas
  async findActiveMissions(
    supabase: SupabaseClient<Database>
  ): Promise<Result<Mission[]>> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('is_active', true)

    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data)
  },

  // Puntos actuales de un usuario
  async getUserPoints(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<Result<number>> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('total_points')
      .eq('id', userId)
      .single()

    if (error) return fail(error.message, 'NOT_FOUND')
    return ok(data.total_points)
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

    if (error) return fail(error.message, 'DB_ERROR')

    return ok(
      data.map((u, i) => ({
        position: i + 1,
        user_id: u.id,
        full_name: u.full_name,
        avatar_url: u.avatar_url,
        total_points: u.total_points,
      }))
    )
  },

  // Posición del usuario en el ranking
  async getUserRankPosition(
    supabase: SupabaseClient<Database>,
    userId: string,
    userPoints: number
  ): Promise<Result<number>> {
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_points', userPoints)

    if (error) return fail(error.message, 'DB_ERROR')
    return ok((count ?? 0) + 1)
  },
}
```

---

## Servicio de Gamificación

```typescript
// src/services/gamification.service.ts
import { createClient } from '@/lib/supabase/server'
import { gamificationRepository } from '@/repositories/gamification.repository'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { Mission } from '@/types/domain/gamification.types'

export const gamificationService = {

  // Verificar si el usuario completó alguna misión tras completar un hábito
  // Llamar desde habit-record.service.ts después de un toggle exitoso
  async checkMissionsAfterCompletion(
    userId: string,
    completedToday: number,    // Total de hábitos completados hoy
    currentStreak: number      // Racha actual del hábito recién completado
  ): Promise<Result<Mission[]>> {
    const supabase = await createClient()

    const missionsResult = await gamificationRepository.findActiveMissions(supabase)
    if (!missionsResult.ok) return missionsResult

    const completedMissions: Mission[] = []

    for (const mission of missionsResult.data) {
      let conditionMet = false

      switch (mission.condition_type) {
        case 'streak_7':
          conditionMet = currentStreak >= 7
          break
        case 'streak_30':
          conditionMet = currentStreak >= 30
          break
        case 'complete_5_today':
          conditionMet = completedToday >= 5
          break
        case 'complete_10_today':
          conditionMet = completedToday >= 10
          break
        default:
          conditionMet = currentStreak >= mission.condition_value
      }

      if (conditionMet) {
        completedMissions.push(mission)
        // Los puntos extra se suman directamente en la DB
        await supabase
          .from('user_profiles')
          .update({ total_points: supabase.rpc('increment_points', { p_user_id: userId, p_amount: mission.reward_points }) })
      }
    }

    return ok(completedMissions)
  },

  // Obtener ranking global
  async getRanking(): Promise<Result<import('@/types/domain/gamification.types').RankingEntry[]>> {
    const supabase = await createClient()
    return gamificationRepository.getRanking(supabase)
  },

  // Posición del usuario en el ranking
  async getUserPosition(userId: string): Promise<Result<{ position: number; points: number }>> {
    const supabase = await createClient()

    const pointsResult = await gamificationRepository.getUserPoints(supabase, userId)
    if (!pointsResult.ok) return pointsResult

    const positionResult = await gamificationRepository.getUserRankPosition(
      supabase, userId, pointsResult.data
    )
    if (!positionResult.ok) return positionResult

    return ok({ position: positionResult.data, points: pointsResult.data })
  },
}
```

---

## Componentes de UI

### RankingCard

```typescript
// src/components/gamification/RankingCard.tsx
import type { RankingEntry } from '@/types/domain/gamification.types'

interface RankingCardProps {
  entry: RankingEntry
  isCurrentUser?: boolean
}

export function RankingCard({ entry, isCurrentUser }: RankingCardProps) {
  const medalEmoji = entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : entry.position === 3 ? '🥉' : null

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all
      ${isCurrentUser
        ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950 dark:border-indigo-700'
        : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
      }`}
    >
      {/* Posición */}
      <div className="w-10 text-center font-bold text-lg text-slate-400">
        {medalEmoji ?? `#${entry.position}`}
      </div>

      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
        {entry.avatar_url
          ? <img src={entry.avatar_url} alt={entry.full_name} className="h-full w-full object-cover" />
          : <span className="text-lg">👤</span>
        }
      </div>

      {/* Nombre */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
          {entry.full_name} {isCurrentUser && '(Tú)'}
        </p>
      </div>

      {/* Puntos */}
      <div className="text-right">
        <p className="font-bold text-amber-600 dark:text-amber-400">{entry.total_points.toLocaleString()}</p>
        <p className="text-xs text-slate-400">pts</p>
      </div>
    </div>
  )
}
```

---

## Página del Ranking (Server Component)

```typescript
// src/app/(dashboard)/comunidad/ranking/page.tsx
import { gamificationService } from '@/services/gamification.service'
import { getCurrentUser } from '@/lib/auth'
import { RankingCard } from '@/components/gamification/RankingCard'

export default async function RankingPage() {
  const user = await getCurrentUser()
  const [rankingResult, positionResult] = await Promise.all([
    gamificationService.getRanking(),
    gamificationService.getUserPosition(user.id),
  ])

  const ranking = rankingResult.ok ? rankingResult.data : []
  const myPosition = positionResult.ok ? positionResult.data : null

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* KPI personal */}
      {myPosition && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 p-6 text-white">
          <p className="text-sm opacity-80">Tu posición</p>
          <p className="text-5xl font-black">#{myPosition.position}</p>
          <p className="text-lg opacity-90">{myPosition.points.toLocaleString()} puntos</p>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-2">
        {ranking.map(entry => (
          <RankingCard
            key={entry.user_id}
            entry={entry}
            isCurrentUser={entry.user_id === user.id}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## Requerimientos Cubiertos

- RF-05.1 → Puntos automáticos por trigger al completar hábito (+10 base)
- RF-05.2 → Misiones con condiciones y recompensas de puntos
- RF-05.3 → Acumulación de puntos en `user_profiles.total_points`
- RF-05.4 → Ranking global ordenado por puntos
- RF-05.5 → Posición, nombre, avatar y puntos en el ranking
- RF-05.6 → Notificación al completar una misión (ver `habit-notifications`)

## Reglas Críticas

1. **Nunca sumar los 10 puntos base desde TypeScript** — el trigger lo hace. Solo sumar puntos de misiones.
2. **El ranking usa datos en tiempo real** de `user_profiles` — no caché propia.
3. **Verificar misiones solo tras un toggle exitoso** de `completed` (no `uncompleted`).
