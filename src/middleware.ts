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
