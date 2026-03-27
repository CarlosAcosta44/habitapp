---
name: habit-ui-components
description: Componentes de interfaz de HabitApp — paleta de colores, HabitCard, formularios, layout del dashboard y patrones de diseño con TailwindCSS.
---

# Skill: habit-ui-components

## Propósito

Define el sistema de diseño visual de HabitApp: paleta de colores, componentes reutilizables (HabitCard, ProgressBar, Navbar, etc.), estructura del layout del dashboard y patrones de uso de TailwindCSS en el proyecto.

---

## Paleta de Colores y Tokens de Diseño

```css
/* src/app/globals.css — Tema de HabitApp */
:root {
  /* Colores primarios */
  --color-primary:     #6366f1;   /* Índigo */
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;

  /* Colores de acento */
  --color-success:  #22c55e;      /* Verde — hábito completado */
  --color-warning:  #f59e0b;      /* Ámbar — racha en riesgo */
  --color-danger:   #ef4444;      /* Rojo — hábito fallado / acción destructiva */
  --color-info:     #3b82f6;      /* Azul — información */

  /* Superficies (modo claro) */
  --surface-base:   #f8fafc;
  --surface-card:   #ffffff;
  --surface-muted:  #f1f5f9;

  /* Textos */
  --text-primary:   #0f172a;
  --text-secondary: #64748b;
  --text-muted:     #94a3b8;
}

/* Modo oscuro */
.dark {
  --surface-base:   #0f172a;
  --surface-card:   #1e293b;
  --surface-muted:  #334155;
  --text-primary:   #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted:     #475569;
}
```

---

## Estructura del Layout del Dashboard

```
src/app/(dashboard)/
├── layout.tsx            ← Layout con sidebar + topbar
├── habitos/
│   ├── page.tsx          ← Vista diaria (Server Component)
│   └── [id]/
│       └── page.tsx      ← Detalle del hábito
├── reportes/
│   └── page.tsx
└── perfil/
    └── page.tsx
```

### `(dashboard)/layout.tsx`

```typescript
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## Componente: HabitCard

El componente central del sistema. Muestra un hábito con su estado del día y permite togglearlo.

```typescript
// src/components/habits/HabitCard.tsx
'use client'

import { useTransition } from 'react'
import { toggleHabitAction } from '@/actions/habit-record.actions'
import type { HabitWithDailyStatus } from '@/types/domain/habit.types'

interface HabitCardProps {
  habit: HabitWithDailyStatus
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleHabitAction(habit.id)
    })
  }

  return (
    <div
      className={`
        relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
        ${habit.is_completed_today
          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
          : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
        }
        hover:shadow-md
      `}
    >
      {/* Ícono del hábito */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0"
        style={{ backgroundColor: habit.color + '20', border: `2px solid ${habit.color}` }}
      >
        {habit.icon}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${habit.is_completed_today ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {habit.name}
        </p>
        {habit.current_streak > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            🔥 {habit.current_streak} días seguidos
          </p>
        )}
      </div>

      {/* Botón de toggle */}
      <button
        id={`toggle-habit-${habit.id}`}
        onClick={handleToggle}
        disabled={isPending}
        aria-label={habit.is_completed_today ? 'Desmarcar hábito' : 'Marcar como completado'}
        className={`
          h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all
          ${habit.is_completed_today
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {habit.is_completed_today ? '✓' : ''}
      </button>
    </div>
  )
}
```

---

## Componente: ProgressBar Diario

```typescript
// src/components/habits/DailyProgress.tsx
interface DailyProgressProps {
  completed: number
  total: number
}

export function DailyProgress({ completed, total }: DailyProgressProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Progreso de hoy
        </h2>
        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {percentage}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {completed} de {total} hábitos completados
      </p>
    </div>
  )
}
```

---

## Componente: StreakBadge

```typescript
// src/components/habits/StreakBadge.tsx
interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  if (streak === 0) return null

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold ${sizes[size]}`}>
      🔥 {streak}
    </span>
  )
}
```

---

## Patrones de Páginas

### Página principal del dashboard (Server Component)

```typescript
// src/app/(dashboard)/habitos/page.tsx
import { habitService } from '@/services/habit.service'
import { habitRecordService } from '@/services/habit-record.service'
import { getCurrentUser } from '@/lib/auth'
import { HabitCard } from '@/components/habits/HabitCard'
import { DailyProgress } from '@/components/habits/DailyProgress'

export default async function HabitosPage() {
  const user = await getCurrentUser()

  const [habitsResult, rateResult] = await Promise.all([
    habitService.getDailyHabits(user.id),
    habitRecordService.getDailyCompletionRate(user.id),
  ])

  const habits = habitsResult.ok ? habitsResult.data : []
  const rate = rateResult.ok ? rateResult.data : 0
  const completed = habits.filter(h => h.is_completed_today).length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* KPI del día */}
      <DailyProgress completed={completed} total={habits.length} />

      {/* Lista de hábitos */}
      <section>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Mis hábitos de hoy
        </h1>
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
          {habits.length === 0 && (
            <p className="text-center text-slate-400 py-12">
              No tienes hábitos activos. ¡Crea tu primer hábito! ✨
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
```

---

## Convenciones de Componentes

| Tipo | Directiva | Ubicación |
|---|---|---|
| Server Component | *(ninguna)* | `app/` |
| Client Component | `'use client'` | `components/` |
| Mixin de diseño | *(className)* | Inline con Tailwind |
| Formulario | `useActionState` | `components/forms/` |
| Interactivo (toggle) | `useTransition` | `components/habits/` |

## Reglas de UI

1. **Todos los botones interactivos tienen `id` único y descriptivo** (ej: `toggle-habit-${id}`).
2. **Todos los elementos interactivos tienen `aria-label`** para accesibilidad.
3. **Los colores personalizables de hábitos** se aplican inline con `style={{ backgroundColor: color }}`.
4. **Usar Server Components para páginas** y Client Components solo donde haya interactividad.
5. **No usar `loading.tsx` con Suspense** para el toggle — usar `useTransition` con UI local.
