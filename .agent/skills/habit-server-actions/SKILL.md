---
name: habit-server-actions
description: Server Actions de Next.js para HabitApp — mutaciones de datos, validación con Zod, manejo de errores y revalidación de caché.
---

# Skill: habit-server-actions

## Propósito

Las Server Actions son el "controlador" entre el cliente (formularios, botones) y la capa de servicios. Validan la entrada con Zod, verifican la sesión del usuario, llaman al servicio correspondiente y devuelven el resultado al cliente.

---

## Arquitectura de Capas

```
UI (formulario / botón)
  └── Server Action ← ESTE SKILL (validación + sesión + orquestación)
        └── Service (lógica de negocio)
              └── Repository (queries)
```

---

## Estructura de Carpetas

```
src/
└── actions/
    ├── auth.actions.ts
    ├── habit.actions.ts
    ├── habit-record.actions.ts
    ├── profile.actions.ts
    └── community.actions.ts
```

---

## Instalación de Dependencias

```bash
npm install zod
```

---

## Patrón de Action — Estructura Estándar

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// 1. Schema Zod para validar la entrada
const schema = z.object({ ... })

// 2. Tipo de retorno estandarizado
type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function miAction(formData: FormData): Promise<ActionResult> {
  // 3. Verificar sesión
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  // 4. Validar con Zod
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  // 5. Llamar al servicio
  const result = await miServicio.miMetodo(user.id, parsed.data)
  if (!result.ok) return { ok: false, error: result.error }

  // 6. Revalidar caché de Next.js
  revalidatePath('/dashboard/habitos')

  return { ok: true, data: result.data }
}
```

---

## Actions de Hábitos

```typescript
// src/actions/habit.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { habitService } from '@/services/habit.service'

// Schemas de validación
const createHabitSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional(),
  icon: z.string().min(1, 'El ícono es requerido'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hexadecimal inválido'),
  frequency: z.enum(['diaria', 'semanal', 'personalizada']),
  category_id: z.string().uuid().optional(),
})

const updateHabitSchema = createHabitSchema.partial().extend({
  is_active: z.boolean().optional(),
})

// Crear hábito
export async function createHabitAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const parsed = createHabitSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const result = await habitService.createHabit(user.id, parsed.data)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/habitos')
  return { ok: true, data: result.data }
}

// Actualizar hábito
export async function updateHabitAction(habitId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const parsed = updateHabitSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Datos inválidos',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const result = await habitService.updateHabit(user.id, habitId, parsed.data)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/habitos')
  return { ok: true, data: result.data }
}

// Archivar hábito
export async function archiveHabitAction(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await habitService.archiveHabit(user.id, habitId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/habitos')
  return { ok: true }
}

// Eliminar hábito
export async function deleteHabitAction(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await habitService.deleteHabit(user.id, habitId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/habitos')
  return { ok: true }
}
```

---

## Action de Toggle (Completar Hábito)

```typescript
// src/actions/habit-record.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { habitRecordService } from '@/services/habit-record.service'

// Toggle optimista — se llama al hacer click en el checkbox del hábito
export async function toggleHabitAction(habitId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await habitRecordService.toggle(user.id, habitId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/habitos')
  return { ok: true, data: result.data }
}
```

---

## Uso desde Componentes Cliente

### Con `useTransition` para feedback instantáneo

```typescript
'use client'

import { useTransition } from 'react'
import { toggleHabitAction } from '@/actions/habit-record.actions'

function HabitToggle({ habitId, isCompleted }: { habitId: string; isCompleted: boolean }) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleHabitAction(habitId)
      if (!result.ok) {
        // Mostrar error toast
        console.error(result.error)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isCompleted ? 'Desmarcar hábito' : 'Marcar hábito como completado'}
    >
      {isPending ? '...' : isCompleted ? '✅' : '⬜'}
    </button>
  )
}
```

### Con `useActionState` para formularios

```typescript
'use client'

import { useActionState } from 'react'
import { createHabitAction } from '@/actions/habit.actions'

function CreateHabitForm() {
  const [state, action, isPending] = useActionState(createHabitAction, null)

  return (
    <form action={action}>
      <input name="name" required />
      {state?.fieldErrors?.name && (
        <p className="text-red-500">{state.fieldErrors.name[0]}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear Hábito'}
      </button>
      {state && !state.ok && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  )
}
```

---

## Reglas de las Server Actions

1. **Siempre verificar sesión** al inicio de cada action — nunca confiar en el cliente.
2. **Siempre validar con Zod** antes de llamar al servicio.
3. **Nunca tener lógica de negocio** en la action — delegarla al servicio.
4. **Siempre llamar `revalidatePath`** después de mutaciones exitosas para actualizar el Server Component.
5. **Devolver siempre `{ ok: boolean, error?: string }`** — nunca lanzar errores no capturados.
6. **Nunca llamar a repositorios directamente** — solo llamar servicios.
