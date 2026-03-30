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

  // En la vida real mandaría correo, aquí redirijo y le informo si usaran confirmación de correo.
  // Por ahora lo simplificamos y si es exitoso redirigimos de vuelta a login o dashboard si confirmación está deshabilitada.
  redirect('/login?message=Registro exitoso. Revisa tu email para confirmar o inicia sesión directamente.')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
