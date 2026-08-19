'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return { error: errorData.message || 'Credenciales inválidas' }
    }

    const setCookies = res.headers.getSetCookie()
    const cookieStore = await cookies()

    // Parse simple Set-Cookie headers from backend and set them in Next.js
    for (const cookieStr of setCookies) {
      const parts = cookieStr.split(';')
      const [nameValue] = parts
      const [name, value] = nameValue.split('=')
      
      const options: any = { path: '/' }
      if (cookieStr.toLowerCase().includes('httponly')) options.httpOnly = true
      if (cookieStr.toLowerCase().includes('secure')) options.secure = true
      
      const maxAgeMatch = cookieStr.match(/Max-Age=(\d+)/i)
      if (maxAgeMatch) options.maxAge = parseInt(maxAgeMatch[1], 10)

      cookieStore.set(name.trim(), value.trim(), options)
    }

    const data = await res.json()
    if (data.user?.rol) {
      cookieStore.set('user_role', data.user.rol, { maxAge: 60 * 60 * 24 * 7, path: '/' })
    }
  } catch (error) {
    return { error: 'Error de conexión con el servidor.' }
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
  }).optional(),
})

export type RegisterActionState = {
  error?: string
}

export async function registerAction(
  _prev: RegisterActionState | null,
  formData: FormData
): Promise<RegisterActionState> {
  const parsed = RegisterSchema.safeParse({
    email:     formData.get('email'),
    password:  formData.get('password'),
    nombre:    formData.get('nombre'),
    apellido:  formData.get('apellido'),
    birthdate: formData.get('birthdate') || undefined,
    genero:    formData.get('genero') || undefined,
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

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre, apellido, fechanacimiento: birthdate, genero }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return { error: errorData.message || 'No se pudo crear la cuenta' }
    }
  } catch (error) {
    return { error: 'Error de conexión con el servidor.' }
  }

  redirect(
    '/login?message=' +
      encodeURIComponent('Registro exitoso. Confirma tu correo antes de iniciar sesión.')
  )
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`
      },
    })
  } catch (error) {
    console.error('Error durante logout:', error)
  }

  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  cookieStore.delete('user_role')

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPasswordAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  // To be implemented fully, for now just mock or call a not-yet-made endpoint
  return { success: 'Revisa tu correo para continuar con el restablecimiento de tu contraseña.' }
}

export async function updatePasswordAction(formData: FormData): Promise<{ error?: string } | void> {
  // To be implemented fully
  redirect('/habitos')
}

