---
name: habit-streak-stats
description: Cálculo de rachas (streaks), heatmap de 90 días y estadísticas de cumplimiento de hábitos en HabitApp.
---

# Skill: habit-streak-stats

## Propósito

Define la lógica de cálculo de rachas (días consecutivos), generación del heatmap de los últimos 90 días, tasa de cumplimiento de los últimos 30 días y el dashboard de KPIs globales del usuario.

---

## Conceptos Clave

| Concepto | Definición |
|---|---|
| **Racha actual** | Número de días consecutivos hasta hoy en que se completó el hábito |
| **Racha máxima** | La racha más larga conocida en el historial completo |
| **Tasa 30 días** | `(días completados en 30 días / 30) * 100` |
| **Heatmap** | Grid de 90 días donde cada celda tiene intensidad según % completado ese día |

---

## Servicio de Rachas

```typescript
// src/services/streak.service.ts
import { createClient } from '@/lib/supabase/server'
import { habitRecordRepository } from '@/repositories/habit-record.repository'
import { ok, fail, type Result } from '@/types/common/result.types'

export interface StreakInfo {
  current_streak: number
  longest_streak: number
  completion_rate_30d: number   // Porcentaje 0–100
}

export interface HeatmapCell {
  date: string        // 'YYYY-MM-DD'
  completed: number   // Cantidad de hábitos completados ese día
  total: number       // Total de hábitos activos ese día
  level: 0 | 1 | 2 | 3 | 4   // Intensidad para el heatmap
}

export const streakService = {

  // Calcular racha actual y máxima para un hábito específico
  async getHabitStreak(
    userId: string,
    habitId: string
  ): Promise<Result<StreakInfo>> {
    const supabase = await createClient()

    // Obtener todos los registros ordenados por fecha DESC (más reciente primero)
    const { data, error } = await supabase
      .from('habit_records')
      .select('completed_date')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .order('completed_date', { ascending: false })

    if (error) return fail(error.message, 'DB_ERROR')

    const dates = data.map(r => r.completed_date)
    const currentStreak = calculateCurrentStreak(dates)
    const longestStreak = calculateLongestStreak(dates)
    const rate30d = calculateCompletionRate(dates, 30)

    return ok({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      completion_rate_30d: rate30d,
    })
  },

  // Datos del heatmap — 90 días para un usuario (todos sus hábitos)
  async getHeatmapData(
    userId: string
  ): Promise<Result<HeatmapCell[]>> {
    const supabase = await createClient()

    const today = new Date()
    const from = new Date(today)
    from.setDate(from.getDate() - 89)   // 90 días incluyendo hoy

    const fromStr = from.toISOString().split('T')[0]
    const toStr = today.toISOString().split('T')[0]

    // Registros del periodo
    const { data: records, error: recordsError } = await supabase
      .from('habit_records')
      .select('completed_date')
      .eq('user_id', userId)
      .gte('completed_date', fromStr)
      .lte('completed_date', toStr)

    if (recordsError) return fail(recordsError.message, 'DB_ERROR')

    // Total de hábitos activos en el periodo (para calcular el porcentaje)
    const { count: totalHabits } = await supabase
      .from('habits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)

    const total = totalHabits ?? 1

    // Agrupar registros por fecha
    const completedByDate: Record<string, number> = {}
    records.forEach(r => {
      completedByDate[r.completed_date] = (completedByDate[r.completed_date] || 0) + 1
    })

    // Generar las 90 celdas del heatmap
    const cells: HeatmapCell[] = []
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const completed = completedByDate[dateStr] ?? 0
      const percentage = total > 0 ? completed / total : 0

      cells.push({
        date: dateStr,
        completed,
        total,
        level: getHeatmapLevel(percentage),
      })
    }

    return ok(cells)
  },

  // KPIs globales del dashboard
  async getDashboardKPIs(userId: string): Promise<Result<{
    active_habits: number
    completed_today: number
    daily_rate: number
    current_best_streak: number
  }>> {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const [activeHabits, completedToday] = await Promise.all([
      supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true),
      supabase
        .from('habit_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed_date', today),
    ])

    const active = activeHabits.count ?? 0
    const completed = completedToday.count ?? 0
    const dailyRate = active > 0 ? Math.round((completed / active) * 100) : 0

    return ok({
      active_habits: active,
      completed_today: completed,
      daily_rate: dailyRate,
      current_best_streak: 0,  // Se calcula separado si se necesita
    })
  },
}
```

---

## Funciones Utilitarias de Rachas

```typescript
// src/lib/streak-utils.ts

/**
 * Calcula la racha actual (días consecutivos hasta HOY).
 * Las fechas deben estar en formato 'YYYY-MM-DD', ordenadas descendente.
 */
export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let checkDate = new Date(today)

  for (const dateStr of dates) {
    const date = new Date(dateStr + 'T00:00:00')

    // Si la fecha esperada coincide, sumar a la racha
    if (date.getTime() === checkDate.getTime()) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
    // Si el primer registro es de ayer (no hoy), también válido
    else if (streak === 0 && date.getTime() === checkDate.getTime() - 86400000) {
      streak++
      checkDate.setDate(checkDate.getDate() - 2)
    }
    else {
      break   // Brecha encontrada — la racha termina
    }
  }

  return streak
}

/**
 * Calcula la racha más larga en toda la historia.
 */
export function calculateLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  // Ordenar ascendente para procesar cronológicamente
  const sorted = [...dates].sort()

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00')
    const curr = new Date(sorted[i] + 'T00:00:00')
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000

    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

/**
 * Calcula el porcentaje de días completados en los últimos N días.
 */
export function calculateCompletionRate(dates: string[], days: number): number {
  const today = new Date()
  const from = new Date(today)
  from.setDate(from.getDate() - days + 1)

  const fromStr = from.toISOString().split('T')[0]
  const recentDates = dates.filter(d => d >= fromStr)

  return Math.round((recentDates.length / days) * 100)
}

/**
 * Convierte un porcentaje de completitud en un nivel de heatmap (0–4).
 */
export function getHeatmapLevel(percentage: number): 0 | 1 | 2 | 3 | 4 {
  if (percentage === 0)    return 0
  if (percentage <= 0.25)  return 1
  if (percentage <= 0.50)  return 2
  if (percentage <= 0.75)  return 3
  return 4
}
```

---

## Componente: Heatmap Visual

```typescript
// src/components/stats/HabitHeatmap.tsx
import type { HeatmapCell } from '@/services/streak.service'

const LEVEL_COLORS = [
  'bg-slate-100 dark:bg-slate-800',           // 0 — sin datos
  'bg-green-200 dark:bg-green-900',           // 1 — ≤25%
  'bg-green-300 dark:bg-green-700',           // 2 — ≤50%
  'bg-green-400 dark:bg-green-600',           // 3 — ≤75%
  'bg-green-500 dark:bg-green-500',           // 4 — >75%
]

interface HabitHeatmapProps {
  cells: HeatmapCell[]
}

export function HabitHeatmap({ cells }: HabitHeatmapProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Actividad — últimos 90 días
      </h3>
      <div className="flex flex-wrap gap-1">
        {cells.map(cell => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.completed}/${cell.total} hábitos`}
            className={`h-3.5 w-3.5 rounded-sm cursor-default transition-opacity hover:opacity-75 ${LEVEL_COLORS[cell.level]}`}
          />
        ))}
      </div>
      {/* Leyenda */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span>Menos</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>Más</span>
      </div>
    </div>
  )
}
```

---

## Requerimientos Cubiertos

- RF-04.1 → Racha actual de días consecutivos por hábito
- RF-04.2 → Racha más larga histórica por hábito
- RF-04.3 → Heatmap de cumplimiento de los últimos 90 días
- RF-04.4 → Tasa de cumplimiento (%) en los últimos 30 días
- RF-04.5 → KPIs globales: hábitos activos, completados hoy, tasa del día

---

## Reglas del Cálculo de Rachas

1. **La racha se rompe si se salta UN día** — incluso si se completa al día siguiente.
2. **La zona horaria del usuario** debe usarse para determinar la "fecha de hoy" — usar `user_profiles.timezone` con `Intl.DateTimeFormat` para obtener la fecha local correcta.
3. **El trigger de la DB** asigna puntos automáticamente — el servicio de rachas no asigna puntos.
4. **El heatmap es de solo lectura** — no permite interacción de edición.
