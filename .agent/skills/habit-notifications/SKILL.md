---
name: habit-notifications
description: Sistema de notificaciones internas de HabitApp — tipos de notificación, cuándo crearlas, repositorio, servicio y componente de bandeja de entrada.
---

# Skill: habit-notifications

## Propósito

Gestiona las notificaciones internas del sistema (in-app): recordatorios de hábitos pendientes, completación de misiones, cambio de posición en el ranking y mensajes de entrenadores. No cubre push notifications del navegador — solo notificaciones almacenadas en la tabla `notifications` de Supabase.

---

## Tipos de Notificación

```typescript
// src/types/domain/notification.types.ts

export type NotificationType =
  | 'mission_completed'    // El usuario completó una misión
  | 'ranking_up'           // El usuario subió de posición en el ranking
  | 'trainer_message'      // Un entrenador le envió una recomendación
  | 'habit_reminder'       // Recordatorio de hábito pendiente

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
}

export interface CreateNotificationDTO {
  user_id: string
  title: string
  message: string
  type: NotificationType
}
```

---

## Estructura de Carpetas

```
src/
├── repositories/
│   └── notification.repository.ts
├── services/
│   └── notification.service.ts
├── actions/
│   └── notification.actions.ts
└── components/
    └── notifications/
        ├── NotificationBell.tsx     ← Ícono con badge de no leídas (Client)
        └── NotificationList.tsx     ← Lista de notificaciones
```

---

## Repositorio de Notificaciones

```typescript
// src/repositories/notification.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { Notification, CreateNotificationDTO } from '@/types/domain/notification.types'

export const notificationRepository = {

  // Obtener notificaciones del usuario (últimas 30, más recientes primero)
  async findByUser(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<Result<Notification[]>> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data)
  },

  // Contar no leídas (para el badge del bell icon)
  async countUnread(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<Result<number>> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) return fail(error.message, 'DB_ERROR')
    return ok(count ?? 0)
  },

  // Crear una notificación
  async create(
    supabase: SupabaseClient<Database>,
    dto: CreateNotificationDTO
  ): Promise<Result<Notification>> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(dto)
      .select()
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok(data)
  },

  // Marcar una notificación como leída
  async markAsRead(
    supabase: SupabaseClient<Database>,
    notificationId: string,
    userId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)   // Seguridad: solo el dueño puede marcarla

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(undefined)
  },

  // Marcar todas como leídas
  async markAllAsRead(
    supabase: SupabaseClient<Database>,
    userId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(undefined)
  },
}
```

---

## Servicio de Notificaciones

```typescript
// src/services/notification.service.ts
import { createClient } from '@/lib/supabase/server'
import { notificationRepository } from '@/repositories/notification.repository'
import { ok, type Result } from '@/types/common/result.types'
import type { Notification, NotificationType } from '@/types/domain/notification.types'

export const notificationService = {

  // Obtener notificaciones del usuario
  async getNotifications(userId: string): Promise<Result<Notification[]>> {
    const supabase = await createClient()
    return notificationRepository.findByUser(supabase, userId)
  },

  // Contar no leídas
  async getUnreadCount(userId: string): Promise<Result<number>> {
    const supabase = await createClient()
    return notificationRepository.countUnread(supabase, userId)
  },

  // Crear notificación — método centralizado para todo el sistema
  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<Result<Notification>> {
    const supabase = await createClient()
    return notificationRepository.create(supabase, { user_id: userId, type, title, message })
  },

  // Helpers semánticos para cada tipo de evento

  async notifyMissionCompleted(
    userId: string,
    missionTitle: string,
    rewardPoints: number
  ): Promise<Result<Notification>> {
    return this.notify(
      userId,
      'mission_completed',
      '🏆 ¡Misión completada!',
      `Completaste la misión "${missionTitle}" y ganaste ${rewardPoints} puntos.`
    )
  },

  async notifyRankingUp(
    userId: string,
    newPosition: number
  ): Promise<Result<Notification>> {
    return this.notify(
      userId,
      'ranking_up',
      '📈 ¡Subiste en el ranking!',
      `Ahora estás en la posición #${newPosition} del ranking global.`
    )
  },

  async notifyTrainerMessage(
    userId: string,
    trainerName: string,
    message: string
  ): Promise<Result<Notification>> {
    return this.notify(
      userId,
      'trainer_message',
      `💬 Mensaje de ${trainerName}`,
      message
    )
  },

  // Marcar como leída
  async markAsRead(userId: string, notificationId: string): Promise<Result<void>> {
    const supabase = await createClient()
    return notificationRepository.markAsRead(supabase, notificationId, userId)
  },

  async markAllAsRead(userId: string): Promise<Result<void>> {
    const supabase = await createClient()
    return notificationRepository.markAllAsRead(supabase, userId)
  },
}
```

---

## Server Actions de Notificaciones

```typescript
// src/actions/notification.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { notificationService } from '@/services/notification.service'

export async function markNotificationReadAction(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await notificationService.markAsRead(user.id, notificationId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function markAllReadAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await notificationService.markAllAsRead(user.id)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/', 'layout')
  return { ok: true }
}
```

---

## Componente: NotificationBell

```typescript
// src/components/notifications/NotificationBell.tsx
import { notificationService } from '@/services/notification.service'
import { getCurrentUser } from '@/lib/auth'

// Server Component — se incluye en el Topbar del dashboard
export async function NotificationBell() {
  const user = await getCurrentUser()
  const result = await notificationService.getUnreadCount(user.id)
  const unread = result.ok ? result.data : 0

  return (
    <a
      href="/dashboard/notificaciones"
      id="notification-bell"
      aria-label={`Notificaciones${unread > 0 ? ` — ${unread} sin leer` : ''}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      🔔
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </a>
  )
}
```

---

## Cuándo Crear Notificaciones

| Evento | Tipo | Quién lo crea |
|---|---|---|
| Misión completada | `mission_completed` | `gamification.service.ts` tras verificar misiones |
| Subida de posición en ranking | `ranking_up` | `gamification.service.ts` al comparar posición anterior vs nueva |
| Mensaje de entrenador | `trainer_message` | `trainer.service.ts` al enviar recomendación |
| Recordatorio de hábito | `habit_reminder` | Fuera del scope MVP — requiere cron job o Edge Function |

---

## Requerimientos Cubiertos

- RF-08.2 → Notificación al usuario cuando complete una misión y gane puntos
- RF-08.3 → Notificación cuando un entrenador le envíe una recomendación
- RF-08.4 → Preferencias de tipos de notificación (a implementar en perfil)

## Reglas Críticas

1. **Nunca crear notificaciones desde componentes de UI** — solo desde servicios.
2. **Siempre verificar `user_id`** al marcar como leída — nunca confiar en el cliente.
3. **Los recordatorios de hábitos** (RF-08.1) requieren un cron job o Supabase Edge Function — no se implementan en el MVP con Server Actions.
