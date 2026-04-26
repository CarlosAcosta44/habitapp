'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { HabitoService } from '@/services/habito.service'
import {
  ONBOARDING_HABIT_PRESETS,
  ONBOARDING_PRESET_IDS,
} from '@/lib/onboarding-habits'

type AuthErrorLike = {
  message?: string
  code?: string
  status?: number
}

function traducirErrorAuth(
  error: AuthErrorLike,
  contexto: 'login' | 'register' | 'reset' | 'updatePassword'
): string {
  const msg = (error.message ?? '').toLowerCase()
  const code = (error.code ?? '').toLowerCase()

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Correo o contraseña inválidos.'
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión.'
  }
  if (msg.includes('user already registered')) {
    return 'Este correo ya está registrado.'
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña es demasiado corta.'
  }
  if (msg.includes('unable to validate email address')) {
    return 'El correo electrónico no es válido.'
  }
  if (msg.includes('signup is disabled')) {
    return 'El registro de usuarios está deshabilitado temporalmente.'
  }
  if (msg.includes('email rate limit exceeded') || msg.includes('over_email_send_rate_limit')) {
    return 'Se alcanzó el límite de envíos. Intenta nuevamente en unos minutos.'
  }

  if (contexto === 'login') return 'No fue posible iniciar sesión. Verifica tus datos e inténtalo de nuevo.'
  if (contexto === 'register') return 'No fue posible crear la cuenta. Intenta nuevamente.'
  if (contexto === 'reset') return 'No fue posible enviar el correo de recuperación. Intenta nuevamente.'
  return 'No fue posible actualizar la contraseña. Intenta nuevamente.'
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'login') }
  }

  const userId = signInData.user?.id
  const meta     = signInData.user?.user_metadata as Record<string, unknown> | undefined
  if (userId && meta?.starter_habits) {
    await aplicarHabitosPendientesDesdeMetadata(userId, meta.starter_habits)
    await supabase.auth.updateUser({
      data: { starter_habits: '' },
    })
  }

  if (userId) {
    const { data: userData } = await supabase
      .schema('gestion')
      .from('usuarios')
      .select('idrol, roles(nombrerol)')
      .eq('idusuario', userId)
      .single()

    const rol = (userData as any)?.roles?.nombrerol
    if (rol) {
      const cookieStore = await cookies()
      cookieStore.set('user_role', rol, { maxAge: 60 * 60 * 24 * 7, path: '/' })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/habitos')
}

const RegisterSchema = z.object({
  email:     z.string().email('Correo inválido'),
  password:  z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre:    z.string().trim().min(1, 'El nombre es obligatorio').max(45),
  apellido:  z.string().trim().min(1, 'Los apellidos son obligatorios').max(45),
  birthdate: z.string().optional(),
  genero:    z.enum(['Masculino', 'Femenino'], {
    message: 'Selecciona una opción de género'
  }),
  habit_presets_json: z.string().min(2),
})

function parseHabitPresetIds(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

async function crearHabitosOnboarding(
  usuarioId: string,
  presetIds: string[]
): Promise<void> {
  const validIds = presetIds.filter((id) => ONBOARDING_PRESET_IDS.has(id))
  if (validIds.length === 0) return

  try {
    const habitoService = new HabitoService()
    
    // Evitar duplicados si el usuario ya tiene hábitos (idempotencia)
    const existentes = await habitoService.getByUsuario(usuarioId)
    if (existentes.success && existentes.data.length > 0) {
      console.log(`[Onboarding] El usuario ${usuarioId} ya tiene hábitos. Saltando creación.`)
      return
    }

    const catsResult = await habitoService.getCategorias()
    if (!catsResult.success) {
      console.error('[Onboarding] Error al obtener categorías:', catsResult.error)
      return
    }

    const categoriaPorNombre = new Map(
      catsResult.data.map((c) => [c.nombre, c.idCategoria])
    )

    const hoy = new Date().toISOString().split('T')[0]

    for (const id of validIds) {
      const preset = ONBOARDING_HABIT_PRESETS.find((p) => p.id === id)
      if (!preset) continue
      
      const idCategoria = categoriaPorNombre.get(preset.categoria)
      if (!idCategoria) {
        console.warn(`[Onboarding] Categoría "${preset.categoria}" no encontrada para el hábito "${preset.nombre}"`)
        continue
      }

      await habitoService.create({
        nombre:       preset.nombre,
        descripcion:  `Hábito inicial de ${preset.categoria}`,
        fechaInicio:  hoy,
        fechaFin:     null,
        puntos:       preset.puntos,
        idUsuario:    usuarioId,
        idCategoria,
        estado:       'Activo',
        metaDiaria:   1,
        unidadMedida: 'vez',
      })
    }
    console.log(`[Onboarding] ${validIds.length} hábitos creados exitosamente para ${usuarioId}`)
  } catch (error) {
    console.error('[Onboarding] Error fatal durante la creación de hábitos:', error)
  }
}

/** Si el registro guardó hábitos en user_metadata y aún no hay hábitos en BD, los crea (p. ej. tras confirmar email). */
async function aplicarHabitosPendientesDesdeMetadata(
  usuarioId: string,
  starterHabitsRaw: unknown
): Promise<void> {
  if (typeof starterHabitsRaw !== 'string' || starterHabitsRaw.length < 3) return
  const ids = parseHabitPresetIds(starterHabitsRaw)
  if (ids.length === 0) return
  await crearHabitosOnboarding(usuarioId, ids)
}

export type RegisterActionState = {
  error?: string
}

/**
 * Registro completo (paso 1 + paso 2). Las claves `nombre` y `apellido` deben
 * coincidir con el trigger en PostgreSQL (raw_user_meta_data).
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
      first.nombre?.[0] ??
      first.apellido?.[0] ??
      first.email?.[0] ??
      first.password?.[0] ??
      first.genero?.[0] ??
      'Revisa los datos del formulario'
    return { error: msg }
  }

  const { email, password, nombre, apellido, birthdate, genero } = parsed.data

  if (habitIdsRaw.length === 0) {
    return { error: 'Elige al menos un hábito para empezar' }
  }

  const supabase = await createClient()

  const userMetadata: Record<string, string> = {
    nombre,
    apellido,
    genero,
    starter_habits: JSON.stringify(habitIdsRaw),
  }
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

  const userId = data.user?.id
  if (data.session && userId) {
    await crearHabitosOnboarding(userId, habitIdsRaw)
    await supabase.auth.updateUser({ data: { starter_habits: '' } })

    const { data: userData } = await supabase
      .schema('gestion')
      .from('usuarios')
      .select('idrol, roles(nombrerol)')
      .eq('idusuario', userId)
      .single()

    const rol = (userData as any)?.roles?.nombrerol
    if (rol) {
      const cookieStore = await cookies()
      cookieStore.set('user_role', rol, { maxAge: 60 * 60 * 24 * 7, path: '/' })
    }

    revalidatePath('/', 'layout')
    redirect('/habitos')
  }

  redirect(
    '/login?message=' +
      encodeURIComponent(
        'Registro exitoso. Confirma tu correo si es necesario; al iniciar sesión se crearán los hábitos que elegiste.'
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

export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Dirigimos al callback primero para capturar e intercambiar el código por la sesión.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'reset') }
  }

  return { success: 'Revisa tu correo para continuar con el restablecimiento de tu contraseña.' }
}

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: traducirErrorAuth(error, 'updatePassword') }
  }

  redirect('/habitos')
}
