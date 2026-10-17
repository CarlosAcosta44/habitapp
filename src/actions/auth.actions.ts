'use server'

/**
 * @file src/actions/auth.actions.ts
 * @description Server Actions de autenticación — usa el backend NestJS (Custom Auth).
 */

import { revalidatePath }  from 'next/cache'
import { cookies } from 'next/headers'
import { redirect }         from 'next/navigation'
import { z }                from 'zod'
import { apiClient }        from '@/lib/api/client'
import { AuthService }      from '@/services/auth.service'
import { HabitoService }    from '@/services/habito.service'

const authService = new AuthService()
import {
  ONBOARDING_HABIT_PRESETS,
  ONBOARDING_PRESET_IDS,
} from '@/lib/onboarding-habits'

export type RegisterActionState = {
  error?: string
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

async function crearHabitosOnboarding(presetIds: string[], token: string): Promise<void> {
  const validIds = presetIds.filter(id => ONBOARDING_PRESET_IDS.has(id))
  if (validIds.length === 0) return

  try {
    // Inject the token explicitly because apiClient inside HabitoService might not 
    // read the newly set cookie in the same Server Action request cycle.
    const customHeaders = { Authorization: `Bearer ${token}` }
    
    // HabitoService uses apiClient internally, we will patch HabitoService later if needed,
    // but for now let's just make raw API calls to be safe.
    const catsResult = await apiClient.get<any[]>('/habitos/categorias', { headers: customHeaders })
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
      if (!idCategoria) continue

      await apiClient.post('/habitos', {
        nombre:       preset.nombre,
        descripcion:  `Hábito inicial — ${preset.categoria}`,
        fechaInicio:  hoy,
        puntos:       preset.puntos,
        idCategoria,
        metaDiaria:   1,
        unidadMedida: 'vez',
      }, { headers: customHeaders })
    }
  } catch (error) {
    console.warn('[Onboarding] Error al crear hábitos iniciales:', error)
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = await authService.login({ email, password })

  if (!result.success) {
    return { error: result.error || 'Correo o contraseña inválidos.' }
  }

  const { access_token, user } = result.data
  if (access_token) {
    const cookieStore = await cookies()
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    if (user?.idrol) {
       cookieStore.set('user_role', user.idrol.toString(), { path: '/' })
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
    const msg = Object.values(first).flat()[0]
    return { error: msg }
  }

  if (habitIdsRaw.length === 0) {
    return { error: 'Elige al menos un hábito para empezar' }
  }

  const { email, password, nombre, apellido, birthdate, genero } = parsed.data

  const payload: any = { email, password, nombre, apellido, genero }
  if (birthdate && /^\\d{4}-\\d{2}-\\d{2}$/.test(birthdate)) {
    payload.fechanacimiento = birthdate
  }

  const result = await authService.register(payload)

  if (!result.success) {
    return { error: result.error || 'Error al registrar usuario.' }
  }

  const { access_token, user } = result.data

  if (access_token) {
    const cookieStore = await cookies()
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    
    if (user?.idrol) {
       cookieStore.set('user_role', user.idrol.toString(), { path: '/' })
    }

    await crearHabitosOnboarding(habitIdsRaw, access_token)
  }

  revalidatePath('/', 'layout')
  redirect('/habitos')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  
  if (token) {
    await authService.logout()
  }
  
  cookieStore.delete('access_token')
  cookieStore.delete('user_role')
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPasswordAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  const email = formData.get('email') as string
  const result = await authService.resetPassword(email)

  if (!result.success) {
    return { error: result.error || 'No fue posible solicitar el restablecimiento.' }
  }

  return { success: 'Revisa tu correo para continuar con el restablecimiento de contraseña.' }
}

export async function updatePasswordAction(formData: FormData): Promise<{ error?: string } | void> {
  const password = formData.get('password') as string
  // NOTE: In the new architecture, the frontend must capture the reset token from the URL 
  // and pass it to this action. Assuming we handle it in the component for now, or we get it from a hidden input.
  const token = formData.get('token') as string
  
  if (!token) return { error: 'Token de recuperación no encontrado.' }

  const result = await authService.updatePassword(token, password)

  if (!result.success) {
    return { error: result.error || 'No fue posible actualizar la contraseña.' }
  }

  redirect('/login')
}
