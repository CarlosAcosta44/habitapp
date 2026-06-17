import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { UsuarioService } from '@/services/usuario.service'
import type { User, Role } from '@/types/domain/user.types'

async function getCurrentUser(): Promise<User> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  // Obtener perfil detallado desde el backend NestJS usando UsuarioService
  const usuarioService = new UsuarioService()
  const profileResult = await usuarioService.getPerfilMe()
  const profile = profileResult.success ? profileResult.data : null

  const domainUser: User = {
    id: user.id,
    email: user.email || '',
    role: (profile?.nombrerol as Role) || 'user',
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    nombre: profile?.nombre || undefined,
    apellido: profile?.apellido || undefined,
    nombrerol: profile?.nombrerol || undefined,
    fotoperfil: profile?.fotoperfil || undefined,
    full_name: user.user_metadata?.full_name || undefined,
    avatar_url: user.user_metadata?.avatar_url || undefined,
  }

  return domainUser
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  const avatarUrl = user.fotoperfil ?? user.avatar_url
  const displayInitial =
    user.nombre?.[0] ?? user.full_name?.[0] ?? 'U'

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="hidden md:block h-screen sticky top-0">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6">
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400 tracking-wide">HabitApp</span>
          <Link href="/perfil" className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-600">
                {displayInitial}
              </div>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-24 md:p-8">
          {children}
        </main>
      </div>

      <MobileNav user={user} />
    </div>
  )
}
