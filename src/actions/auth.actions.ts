'use server'

/**
 * @file src/actions/auth.actions.ts
 * @description Server Actions de autenticación — usa Supabase Auth como fuente de verdad.
 * El trigger `trigger_crear_perfil` en la BD sincroniza auth.users → gestion.usuarios.
 *
 * IMPORTANTE: Este archivo es exclusivo del frontend web (Next.js).
 * La app móvil (Flutter) usa los endpoints JWT del backend NestJS.
 */

import { revalidatePath }  from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect }         from 'next/navigation'
import { z }                from 'zod'
import { createClient }     from '@/lib/supabase/server'
import { HabitoService }    from '@/services/habito.service'
import {
  ONBOARDING_HABIT_PRESETS,
  ONBOARDING_PRESET_IDS,
} from '@/lib/onboarding-habits'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AuthErrorLike = {
  message?: string
  code?: string
  status?: number
}

export type RegisterActionState = {
  error?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Traduce errores de Supabase Auth al español para mostrarlos en la UI.
 */
function traducirErrorAuth(
  error: AuthErrorLike,
  contexto: 'login' | 'register' | 'reset' | 'updatePassword'
): string {
  const msg  = (error.message ?? '').toLowerCase()
  const code = (error.code   ?? '').toLowerCase()

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials'))
    return 'Correo o contraseña inválidos.'
  if (code === 'email_not_confirmed'  || msg.includes('email not confirmed'))
    return 'Debes confirmar tu correo antes de iniciar sesión.'
  if (msg.includes('user already registered'))
    return 'Este correo ya está registrado.'
  if (msg.includes('password should be at least'))
    return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('unable to validate email address'))
    return 'El correo electrónico no es válido.'
  if (msg.includes('signup is disabled'))
    return 'El registro de usuarios está deshabilitado temporalmente.'
  if (msg.includes('email rate limit exceeded') || msg.includes('over_email_send_rate_limit'))
    return 'Se alcanzó el límite de envíos. Intenta nuevamente en unos minutos.'

  if (contexto === 'login')           return 'No fue posible iniciar sesión. Verifica tus datos.'
  if (contexto === 'register')        return 'No fue posible crear la cuenta. Intenta nuevamente.'
  if (contexto === 'reset')           return 'No fue posible enviar el correo de recuperación.'
  return 'No fue posible actualizar la contraseña. Intenta nuevamente.'
}

function parseHabitPresetIds(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

/**
 * Crea los hábitos de onboarding en el backend NestJS usando el token
 * de sesión activo de Supabase. Se llama solo cuando el registro es inmediato
 * (sin confirmación de email).
 */
async function crearHabitosOnboarding(
  presetIds: string[]
): Promise<void> {
  const validIds = presetIds.filter(id => ONBOARDING_PRESET_IDS.has(id))
  if (validIds.length === 0) return

  try {
    const habitoService = new HabitoService()

    const catsResult = await habitoService.getCategorias()
    if (!catsResult.success) {
      console.warn('[Onboarding] No se pudieron obtener categorías:', catsResult.error)
      return
    }

    const categoriaPorNombre = new Map(
      catsResult.data.map((c: any) => [c.nombre, c.idCategoria])
    )

    const hoy = new Date().toISOString().split('T')[0]

    for (const id of validIds) {
      const preset = ONBOARDING_HABIT_PRESETS.find(p => p.id === id)
      if (!preset) continue

      const idCategoria = categoriaPorNombre.get(preset.categoria)
      if (!idCategoria) {
        console.warn(`[Onboarding] Categoría "${preset.categoria}" no encontrada`)
        continue
      }

      await habitoService.create({
        nombre:       preset.nombre,
        descripcion:  `Hábito inicial — ${preset.categoria}`,
        fechaInicio:  hoy,
        puntos:       preset.puntos,
        idCategoria,
        metaDiaria:   1,
        unidadMedida: 'vez',
      })
    }
  } catch (error) {
    // No bloqueamos el registro si falla la creación de hábitos iniciales
    console.warn('[Onboarding] Error al crear hábitos iniciales:', error)
  }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email:    formData.get('email')    as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'login') }
  }

  // Si el usuario tenía hábitos pendientes de onboarding (registró sin sesión inmediata),
  // los creamos ahora en el primer login.
  const meta = signInData.user?.user_metadata as Record<string, unknown> | undefined
  if (meta?.starter_habits && typeof meta.starter_habits === 'string' && meta.starter_habits.length > 2) {
    const ids = parseHabitPresetIds(meta.starter_habits)
    if (ids.length > 0) {
      await crearHabitosOnboarding(ids)
      await supabase.auth.updateUser({ data: { starter_habits: '' } })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/habitos')
}

const RegisterSchema = z.object({
  email:              z.string().email('Correo inválido'),
  password:           z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre:             z.string().trim().min(1, 'El nombre es obligatorio').max(45),
  apellido:           z.string().trim().min(1, 'Los apellidos son obligatorios').max(45),
  birthdate:          z.string().optional(),
  genero:             z.enum(['Masculino', 'Femenino'], {
    message: 'Selecciona una opción de género',
  }),
  habit_presets_json: z.string().min(2),
})

/**
 * Registro completo de usuario. Flujo:
 * 1. Validar campos con Zod
 * 2. Crear usuario en Supabase Auth con metadata (nombre, apellido, genero, etc.)
 * 3. El trigger de la BD crea automáticamente el perfil en gestion.usuarios
 * 4. Si hay sesión inmediata (sin verificación de email): crear hábitos y redirigir
 * 5. Si requiere confirmación de email: redirigir a login con mensaje
 */
export async function registerAction(
  _prev: RegisterActionState | null,
  formData: FormData
): Promise<RegisterActionState> {
  const habitIdsRaw = parseHabitPresetIds(
    String(formData.get('habit_presets_json') ?? '[]')
  )

  const parsed = RegisterSchema.safeParse({
    email:              formData.get('email'),
    password:           formData.get('password'),
    nombre:             formData.get('nombre'),
    apellido:           formData.get('apellido'),
    birthdate:          formData.get('birthdate') || undefined,
    genero:             formData.get('genero'),
    habit_presets_json: formData.get('habit_presets_json'),
  })

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg =
      first.nombre?.[0]             ??
      first.apellido?.[0]           ??
      first.email?.[0]              ??
      first.password?.[0]           ??
      first.genero?.[0]             ??
      'Revisa los datos del formulario'
    return { error: msg }
  }

  if (habitIdsRaw.length === 0) {
    return { error: 'Elige al menos un hábito para empezar' }
  }

  const { email, password, nombre, apellido, birthdate, genero } = parsed.data

  const supabase = await createClient()

  const userMetadata: Record<string, string> = { nombre, apellido, genero, starter_habits: JSON.stringify(habitIdsRaw) }
  if (birthdate && /^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    userMetadata.fechanacimiento = birthdate
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userMetadata },
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'register') }
  }

  // Caso 1: Sesión inmediata (confirmación de email desactivada en Supabase)
  // El trigger ya creó el perfil en gestion.usuarios.
  // Creamos los hábitos de onboarding y redirigimos.
  if (data.session && data.user?.id) {
    await crearHabitosOnboarding(habitIdsRaw)
    await supabase.auth.updateUser({ data: { starter_habits: '' } })
    revalidatePath('/', 'layout')
    redirect('/habitos')
  }

  // Caso 2: Requiere confirmación de email.
  // Los hábitos se crearán en el primer loginAction (usando starter_habits del metadata).
  redirect(
    '/login?message=' +
      encodeURIComponent(
        '¡Cuenta creada! Confirma tu correo electrónico para iniciar sesión.'
      )
  )
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  cookieStore.delete('user_role')
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPasswordAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  const supabase  = await createClient()
  const email     = formData.get('email') as string

  const headersList = await headers()
  const host        = headersList.get('host')
  const protocol    = host?.startsWith('localhost') ? 'http' : 'https'
  const origin      = `${protocol}://${host}`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'reset') }
  }

  return { success: 'Revisa tu correo para continuar con el restablecimiento de contraseña.' }
}

export async function updatePasswordAction(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: traducirErrorAuth(error, 'updatePassword') }
  }

  redirect('/habitos')
}
