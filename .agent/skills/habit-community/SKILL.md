---
name: habit-community
description: Módulo de comunidad de HabitApp — foros, comentarios, reacciones y artículos educativos con sus repositorios, servicios y componentes.
---

# Skill: habit-community

## Propósito

Implementa el módulo de comunidad de HabitApp: hilos de foro por categoría, comentarios con reacciones (likes), artículos educativos publicables por entrenadores o administradores, y búsqueda por palabra clave.

---

## Estructura de Carpetas

```
src/
├── repositories/
│   └── community.repository.ts
├── services/
│   └── community.service.ts
├── actions/
│   └── community.actions.ts
└── app/(dashboard)/
    └── comunidad/
        ├── foros/
        │   ├── page.tsx              ← Lista de hilos
        │   ├── nuevo/
        │   │   └── page.tsx          ← Crear hilo
        │   └── [id]/
        │       └── page.tsx          ← Detalle del hilo con comentarios
        ├── articulos/
        │   ├── page.tsx              ← Lista de artículos
        │   └── [id]/
        │       └── page.tsx          ← Lectura de artículo
        └── ranking/
            └── page.tsx              ← Ranking (ver habit-gamification)
```

---

## Categorías de Foro

```typescript
// src/types/domain/community.types.ts
export const FORUM_CATEGORIES = [
  'ejercicio',
  'nutricion',
  'sueno',
  'salud_mental',
  'motivacion',
  'general',
] as const

export type ForumCategory = typeof FORUM_CATEGORIES[number]
```

---

## Repositorio de Comunidad

```typescript
// src/repositories/community.repository.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { ok, fail, type Result } from '@/types/common/result.types'
import type { ForumThread, ForumComment, Article } from '@/types/domain/community.types'

export const communityRepository = {

  // ── Foros ──────────────────────────────────────────────

  async findThreads(
    supabase: SupabaseClient<Database>,
    category?: string
  ): Promise<Result<ForumThread[]>> {
    let query = supabase
      .from('forum_threads')
      .select(`
        *,
        user_profiles!inner(full_name, avatar_url),
        forum_comments(count)
      `)
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) return fail(error.message, 'DB_ERROR')

    return ok(data.map(t => ({
      ...t,
      author_name: t.user_profiles.full_name,
      author_avatar: t.user_profiles.avatar_url,
      comment_count: t.forum_comments[0]?.count ?? 0,
    })))
  },

  async findThreadById(
    supabase: SupabaseClient<Database>,
    threadId: string
  ): Promise<Result<ForumThread>> {
    const { data, error } = await supabase
      .from('forum_threads')
      .select(`*, user_profiles!inner(full_name, avatar_url)`)
      .eq('id', threadId)
      .single()

    if (error) return fail(error.message, 'NOT_FOUND')
    return ok({
      ...data,
      author_name: data.user_profiles.full_name,
      author_avatar: data.user_profiles.avatar_url,
      comment_count: 0,
    })
  },

  async createThread(
    supabase: SupabaseClient<Database>,
    userId: string,
    payload: { title: string; content: string; category: string }
  ): Promise<Result<ForumThread>> {
    const { data, error } = await supabase
      .from('forum_threads')
      .insert({ ...payload, user_id: userId })
      .select(`*, user_profiles!inner(full_name, avatar_url)`)
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok({ ...data, author_name: data.user_profiles.full_name, author_avatar: data.user_profiles.avatar_url, comment_count: 0 })
  },

  // ── Comentarios ────────────────────────────────────────

  async findCommentsByThread(
    supabase: SupabaseClient<Database>,
    threadId: string
  ): Promise<Result<ForumComment[]>> {
    const { data, error } = await supabase
      .from('forum_comments')
      .select(`*, user_profiles!inner(full_name, avatar_url)`)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data.map(c => ({
      ...c,
      author_name: c.user_profiles.full_name,
      author_avatar: c.user_profiles.avatar_url,
    })))
  },

  async createComment(
    supabase: SupabaseClient<Database>,
    userId: string,
    payload: { thread_id: string; content: string }
  ): Promise<Result<ForumComment>> {
    const { data, error } = await supabase
      .from('forum_comments')
      .insert({ ...payload, user_id: userId })
      .select(`*, user_profiles!inner(full_name, avatar_url)`)
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok({ ...data, author_name: data.user_profiles.full_name, author_avatar: data.user_profiles.avatar_url })
  },

  async likeComment(
    supabase: SupabaseClient<Database>,
    commentId: string
  ): Promise<Result<void>> {
    const { error } = await supabase.rpc('increment_comment_likes', { p_comment_id: commentId })
    if (error) return fail(error.message, 'RPC_ERROR')
    return ok(undefined)
  },

  // ── Artículos ──────────────────────────────────────────

  async findPublishedArticles(
    supabase: SupabaseClient<Database>,
    search?: string,
    category?: string
  ): Promise<Result<Article[]>> {
    let query = supabase
      .from('articles')
      .select(`*, user_profiles!inner(full_name)`)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (search)   query = query.ilike('title', `%${search}%`)

    const { data, error } = await query
    if (error) return fail(error.message, 'DB_ERROR')
    return ok(data.map(a => ({ ...a, author_name: a.user_profiles.full_name })))
  },

  async createArticle(
    supabase: SupabaseClient<Database>,
    authorId: string,
    payload: { title: string; content: string; category: string }
  ): Promise<Result<Article>> {
    const { data, error } = await supabase
      .from('articles')
      .insert({ ...payload, author_id: authorId, is_published: false })
      .select()
      .single()

    if (error) return fail(error.message, 'CREATE_ERROR')
    return ok({ ...data, author_name: '' })
  },

  async publishArticle(
    supabase: SupabaseClient<Database>,
    articleId: string,
    authorId: string
  ): Promise<Result<void>> {
    const { error } = await supabase
      .from('articles')
      .update({ is_published: true, updated_at: new Date().toISOString() })
      .eq('id', articleId)
      .eq('author_id', authorId)

    if (error) return fail(error.message, 'UPDATE_ERROR')
    return ok(undefined)
  },
}
```

---

## Servicio de Comunidad

```typescript
// src/services/community.service.ts
import { createClient } from '@/lib/supabase/server'
import { communityRepository } from '@/repositories/community.repository'
import { fail, ok, type Result } from '@/types/common/result.types'
import type { ForumThread, ForumComment, Article } from '@/types/domain/community.types'

export const communityService = {

  async getThreads(category?: string): Promise<Result<ForumThread[]>> {
    const supabase = await createClient()
    return communityRepository.findThreads(supabase, category)
  },

  async getThreadWithComments(
    threadId: string
  ): Promise<Result<{ thread: ForumThread; comments: ForumComment[] }>> {
    const supabase = await createClient()
    const [threadResult, commentsResult] = await Promise.all([
      communityRepository.findThreadById(supabase, threadId),
      communityRepository.findCommentsByThread(supabase, threadId),
    ])
    if (!threadResult.ok) return threadResult
    if (!commentsResult.ok) return commentsResult
    return ok({ thread: threadResult.data, comments: commentsResult.data })
  },

  async createThread(
    userId: string,
    payload: { title: string; content: string; category: string }
  ): Promise<Result<ForumThread>> {
    if (!payload.title.trim()) return fail('El título es requerido', 'VALIDATION_ERROR')
    if (!payload.content.trim()) return fail('El contenido es requerido', 'VALIDATION_ERROR')

    const supabase = await createClient()
    return communityRepository.createThread(supabase, userId, payload)
  },

  async addComment(
    userId: string,
    threadId: string,
    content: string
  ): Promise<Result<ForumComment>> {
    if (!content.trim()) return fail('El comentario no puede estar vacío', 'VALIDATION_ERROR')

    const supabase = await createClient()
    return communityRepository.createComment(supabase, userId, { thread_id: threadId, content: content.trim() })
  },

  async getPublishedArticles(
    search?: string,
    category?: string
  ): Promise<Result<Article[]>> {
    const supabase = await createClient()
    return communityRepository.findPublishedArticles(supabase, search, category)
  },

  // Solo entrenadores y administradores pueden publicar artículos
  async publishArticle(
    userId: string,
    articleId: string,
    userRole: string
  ): Promise<Result<void>> {
    if (!['entrenador', 'administrador'].includes(userRole)) {
      return fail('Solo entrenadores y administradores pueden publicar artículos', 'UNAUTHORIZED')
    }
    const supabase = await createClient()
    return communityRepository.publishArticle(supabase, articleId, userId)
  },
}
```

---

## Server Actions de Comunidad

```typescript
// src/actions/community.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { communityService } from '@/services/community.service'

const threadSchema = z.object({
  title:    z.string().min(5, 'Mínimo 5 caracteres').max(150),
  content:  z.string().min(10, 'Mínimo 10 caracteres').max(5000),
  category: z.enum(['ejercicio', 'nutricion', 'sueno', 'salud_mental', 'motivacion', 'general']),
})

export async function createThreadAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const parsed = threadSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: 'Datos inválidos', fieldErrors: parsed.error.flatten().fieldErrors }

  const result = await communityService.createThread(user.id, parsed.data)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath('/dashboard/comunidad/foros')
  return { ok: true, data: result.data }
}

export async function addCommentAction(threadId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const content = formData.get('content') as string
  const result = await communityService.addComment(user.id, threadId, content)
  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath(`/dashboard/comunidad/foros/${threadId}`)
  return { ok: true }
}
```

---

## Función SQL para likes (RPC)

```sql
-- Agregar en Supabase como función SQL
CREATE OR REPLACE FUNCTION increment_comment_likes(p_comment_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_comments
  SET like_count = like_count + 1
  WHERE id = p_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Requerimientos Cubiertos

- RF-07.1 → Creación de hilos de foro por categoría
- RF-07.2 → Publicación de comentarios en hilos
- RF-07.3 → Reacciones (likes) a comentarios
- RF-07.4 → Artículos educativos por entrenador/admin
- RF-07.5 → Artículos visibles para todos los usuarios registrados
- RF-07.6 → Artículos por categoría y búsqueda por palabra clave

## Reglas Críticas

1. **Los artículos se crean en borrador** (`is_published: false`) y se publican explícitamente — nunca publicar automáticamente.
2. **Solo entrenadores y administradores** pueden crear y publicar artículos — verificar rol en el servicio.
3. **Los likes de comentarios usan una función RPC de Supabase** para evitar race conditions con incrementos concurrentes.
4. **La búsqueda de artículos usa `ilike`** (case-insensitive) — no hace falta full-text search para MVP.
