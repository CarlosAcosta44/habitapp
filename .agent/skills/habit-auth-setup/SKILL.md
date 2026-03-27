---
name: habit-auth-setup
description: Configuración completa de autenticación en HabitApp usando Supabase Auth con Next.js App Router — login, registro, sesión, middleware de rutas y protección por rol.
---

# Skill: habit-auth-setup

## Propósito

Este skill guía la implementación del módulo de autenticación de HabitApp. Cubre el flujo completo: registro, login, logout, recuperación de contraseña, manejo de sesión con cookies y protección de rutas mediante middleware de Next.js.

---

## Stack de Autenticación

| Tecnología | Rol |
|---|---|
| **Supabase Auth** | Proveedor de identidad (email + password) |
| **@supabase/ssr** | Manejo de sesión en server/client con cookies |
| **Next.js Middleware** | Protección de rutas por autenticación y rol |
| **Server Actions** | Lógica de login/registro sin exponer endpoints |

---

## Estructura de Carpetas

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          ← Cliente para componentes del lado del cliente
│       ├── server.ts          ← Cliente para Server Components y Server Actions
│       └── middleware.ts      ← Cliente para el middleware de Next.js
├── middleware.ts              ← Middleware raíz (protección de rutas)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx         ← Layout público (redirige si ya autenticado)
│   └── (dashboard)/
│       └── layout.tsx         ← Layout protegido (redirige si NO autenticado)
└── actions/
    └── auth.actions.ts        ← Server Actions de login, registro, logout
```

---

## Instalación de Dependencias

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # NUNCA exponer al cliente
```

---

## Implementación de Clientes Supabase

### `lib/supabase/server.ts` — Para Server Components y Actions

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar en Server Components (solo se puede leer)
          }
        },
      },
    }
  )
}
```

### `lib/supabase/client.ts` — Para Client Components

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `lib/supabase/middleware.ts` — Para el Middleware

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return { supabaseResponse, user }
}
```

---

## Middleware de Rutas (`middleware.ts`)

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']
const PROTECTED_PREFIX = ['/dashboard', '/habitos', '/comunidad', '/admin']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
  const isProtectedRoute = PROTECTED_PREFIX.some(p => pathname.startsWith(p))

  // Si no está autenticado e intenta acceder a ruta protegida → login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si ya está autenticado e intenta ir a login/register → dashboard
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/habitos'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## Server Actions de Autenticación (`actions/auth.actions.ts`)

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/habitos')
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=Revisa tu email para confirmar tu cuenta')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
```

---

## Obtener el Usuario Actual (Server Component)

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}
```

---

## Reglas Críticas de Seguridad

1. **Nunca usar `getSession()`** en el servidor para validar — siempre usar `getUser()` que verifica con Supabase.
2. **`SUPABASE_SERVICE_ROLE_KEY` nunca en el cliente** — solo en Server Actions o API Routes con `NEXT_PUBLIC_` prefix ausente.
3. **Todas las Server Actions de escritura deben verificar la sesión** antes de ejecutar.
4. **El Trigger de Supabase** `trg_crear_perfil` crea el `user_profile` automáticamente al hacer `signUp` — no hacerlo manualmente desde el código.

---

## Roles del Sistema

Los roles se almacenan en `user_profiles.role` (enum: `'usuario' | 'entrenador' | 'administrador'`).

```typescript
// Verificar rol en Server Component o Action
const profile = await supabase
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.data?.role !== 'administrador') {
  redirect('/dashboard/habitos')
}
```

---

## Casos de Uso Cubiertos

- RF-01.1 → Registro con email y contraseña
- RF-01.2 → Login y logout con Supabase Auth
- RF-01.3 → Creación automática de perfil (trigger en DB)
- RF-01.5 → Roles: usuario, entrenador, administrador
- RF-01.6 → Protección de rutas del dashboard con middleware
- RNF-01.3 → Server Actions validan sesión en cada escritura
- RNF-01.5 → `SERVICE_ROLE_KEY` nunca expuesta al cliente
