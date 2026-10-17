import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']
const PROTECTED_PREFIX = ['/habitos', '/comunidad', '/perfil', '/admin', '/entrenador']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const user = !!token

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
    url.pathname = '/habitos'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
