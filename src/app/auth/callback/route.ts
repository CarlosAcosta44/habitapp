import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Si la ruta incluyera 'next', lo usaremos para saber a dónde redirigir.
  // Si es un reseteo de password, vendremos hacia aquí y queremos ir a /update-password.
  const next = searchParams.get('next') ?? '/habitos'

  if (code) {
    const supabase = await createClient()
    
    // Intercambia el código que viene en la URL por una sesión segura de Supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Sesión exitosa: llevamos al usuario a la página de actualización de contraseña
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si algo falló (link muy viejo o sin código)
  return NextResponse.redirect(`${origin}/login?error=El enlace ha expirado o es inválido`)
}
