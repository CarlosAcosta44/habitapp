---
name: habit-admin
description: Panel de administración de HabitApp — gestión de usuarios, moderación de contenido y configuración general de la plataforma.
---

# Skill: habit-admin

## Propósito

Define el módulo de administración accesible únicamente para usuarios con rol `administrador`. Cubre: gestión de usuarios (activar, desactivar, cambiar rol), moderación de contenido comunitario (eliminar hilos, comentarios, artículos inapropiados) y visualización de métricas globales del sistema.

---

## Estructura de Carpetas

```
src/
└── app/
    └── admin/
        ├── layout.tsx           ← Protección de rol administrador
        ├── page.tsx             ← Dashboard de métricas globales
        ├── usuarios/
        │   └── page.tsx         ← Lista y gestión de usuarios
        └── moderacion/
            └── page.tsx         ← Contenido reportado / moderación
```

---

## Protección de Rutas de Admin

```typescript
// src/app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Redirigir si no es admin
  if (profile?.role !== 'administrador') redirect('/dashboard/habitos')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-bold text-red-600">⚠️ Panel de Administración</span>
          <a href="/admin" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</a>
          <a href="/admin/usuarios" className="text-sm text-slate-600 hover:text-slate-900">Usuarios</a>
          <a href="/admin/moderacion" className="text-sm text-slate-600 hover:text-slate-900">Moderación</a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
```

---

## Repositorio Admin

```typescript
// src/repositories/admin.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { UserProfile } from '@/types/domain/user.types'
import type { UserRole } from '@/types/domain/user.types'

// IMPORTANTE: Las operaciones de admin usan el cliente estándar server.
// La RLS permite al admin acceder a todos los perfiles gracias a políticas especiales.

export const adminRepository = {

  // Listar todos los usuarios (con paginación)
  async findAllUsers(
    supabase: SupabaseClient<Database>,
    page: number = 1,
    pageSize: number = 20
  ): Promise<Result<{ users: UserProfile[]; total: number }>> {
    const from = (page - 1) * pageSize
    const to   = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) return fail(error.message, 'DB_ERROR')
    return ok({ users: data, total: count ?? 0 })
  },

  // Cambiar el rol de un usuario
  async changeUserRole(
    supabase: SupabaseClient<Database>,
    targetUserId: string,
    newRole: UserRole
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId)

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(undefined)
  },

  // Eliminar un hilo de foro (moderación)
  async deleteThread(
    supabase: SupabaseClient<Database>,
    threadId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('forum_threads')
      .delete()
      .eq('id', threadId)

    if (error) return fail(error.message, 'DELETE_ERROR')
    return ok(undefined)
  },

  // Eliminar un comentario (moderación)
  async deleteComment(
    supabase: SupabaseClient<Database>,
    commentId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('forum_comments')
      .delete()
      .eq('id', commentId)

    if (error) return fail(error.message, 'DELETE_ERROR')
    return ok(undefined)
  },

  // Métricas globales para el dashboard del admin
  async getGlobalMetrics(supabase: SupabaseClient<Database>): Promise<Result<{
    total_users: number
    total_habits: number
    total_records_today: number
    total_threads: number
  }>> {
    const today = new Date().toISOString().split('T')[0]

    const [users, habits, records, threads] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('habits').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('habit_records').select('*', { count: 'exact', head: true }).eq('completed_date', today),
      supabase.from('forum_threads').select('*', { count: 'exact', head: true }),
    ])

    return ok({
      total_users:         users.count   ?? 0,
      total_habits:        habits.count  ?? 0,
      total_records_today: records.count ?? 0,
      total_threads:       threads.count ?? 0,
    })
  },
}
```

---

## Servicio Admin

```typescript
// src/services/admin.service.ts
import { createClient } from '@/lib/supabase/server'
import { adminRepository } from '@/repositories/admin.repository'
import { fail, type Result } from '@/types/common/result.types'
import type { UserRole } from '@/types/domain/user.types'

// Helper interno — verificar que quien llama es administrador
async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>, callerId: string): Promise<boolean> {
  const { data } = await supabase.from('user_profiles').select('role').eq('id', callerId).single()
  return data?.role === 'administrador'
}

export const adminService = {

  async getAllUsers(callerId: string, page?: number) {
    const supabase = await createClient()
    if (!await verifyAdmin(supabase, callerId)) return fail('No autorizado', 'UNAUTHORIZED')
    return adminRepository.findAllUsers(supabase, page)
  },

  async changeUserRole(callerId: string, targetUserId: string, newRole: UserRole): Promise<Result<void>> {
    const supabase = await createClient()
    if (!await verifyAdmin(supabase, callerId)) return fail('No autorizado', 'UNAUTHORIZED')

    // El administrador no puede cambiar su propio rol
    if (callerId === targetUserId) return fail('No puedes cambiar tu propio rol', 'BUSINESS_RULE')

    return adminRepository.changeUserRole(supabase, targetUserId, newRole)
  },

  async deleteThread(callerId: string, threadId: string): Promise<Result<void>> {
    const supabase = await createClient()
    if (!await verifyAdmin(supabase, callerId)) return fail('No autorizado', 'UNAUTHORIZED')
    return adminRepository.deleteThread(supabase, threadId)
  },

  async deleteComment(callerId: string, commentId: string): Promise<Result<void>> {
    const supabase = await createClient()
    if (!await verifyAdmin(supabase, callerId)) return fail('No autorizado', 'UNAUTHORIZED')
    return adminRepository.deleteComment(supabase, commentId)
  },

  async getMetrics(callerId: string) {
    const supabase = await createClient()
    if (!await verifyAdmin(supabase, callerId)) return fail('No autorizado', 'UNAUTHORIZED')
    return adminRepository.getGlobalMetrics(supabase)
  },
}
```

---

## Server Actions Admin

```typescript
// src/actions/admin.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { adminService } from '@/services/admin.service'
import type { UserRole } from '@/types/domain/user.types'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function changeUserRoleAction(targetUserId: string, newRole: UserRole) {
  const user = await getAdminUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await adminService.changeUserRole(user.id, targetUserId, newRole)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/admin/usuarios')
  return { ok: true }
}

export async function deleteThreadAction(threadId: string) {
  const user = await getAdminUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await adminService.deleteThread(user.id, threadId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/admin/moderacion')
  revalidatePath('/dashboard/comunidad/foros')
  return { ok: true }
}

export async function deleteCommentAction(commentId: string) {
  const user = await getAdminUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const result = await adminService.deleteComment(user.id, commentId)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/admin/moderacion')
  return { ok: true }
}
```

---

## Políticas RLS Adicionales para Admin

```sql
-- Administrador puede ver todos los perfiles
CREATE POLICY "Admin puede ver todos los perfiles"
  ON user_profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'administrador'
    )
  );

-- Administrador puede actualizar cualquier perfil (cambio de rol)
CREATE POLICY "Admin puede actualizar perfiles"
  ON user_profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'administrador'
    )
  );

-- Administrador puede eliminar hilos y comentarios
CREATE POLICY "Admin puede eliminar hilos"
  ON forum_threads FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'administrador'
    )
  );
```

---

## Requerimientos Cubiertos

- RF-01.7 → Administrador gestiona usuarios (activar, desactivar, cambiar rol)
- RF-07.4 → Administrador puede publicar artículos educativos
- CU-37 → Eliminación de usuario o publicación inapropiada

## Reglas Críticas

1. **La doble verificación de rol** ocurre en dos niveles: Layout Server Component (redirige la UI) + Servicio (verifica antes de ejecutar) — nunca depender solo del layout.
2. **El admin no puede cambiar su propio rol** — regla de negocio para evitar bloqueos del sistema.
3. **Las políticas RLS de admin** deben existir en Supabase — sin ellas, el cliente server tampoco puede acceder a datos de otros usuarios.
4. **No implementar "desactivar usuario"** directamente desde la app — requiere llamar a `supabase.auth.admin.deleteUser()` con `SERVICE_ROLE_KEY`, solo desde una Edge Function segura.
