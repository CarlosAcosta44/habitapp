import { requireUserStrict } from '@/lib/auth/require-user'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import type { User, Role } from '@/domain/user.types'

async function getCurrentUser(): Promise<User> {
  const user = await requireUserStrict()

  const finalRole = user.nombrerol || 'Usuario'

  const domainUser: User = {
    id: user.id,
    email: user.email || '',
    role: 'user', // Basic role type casting for generic UI usage
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nombre: user.nombre,
    apellido: user.apellido,
    nombrerol: finalRole,
    fotoperfil: (user as any).fotoperfil,
    full_name: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
    avatar_url: (user as any).fotoperfil,
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
    <div className="flex bg-[#f8f9fc] dark:bg-[#0b0e17] min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      {/* Floating Sidebar (Desktop) */}
      <div className="hidden md:block sticky top-0 h-screen p-4 z-30">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col min-h-screen min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-habitapp.png" alt="HabitApp" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">HabitApp</span>
          </div>
          <div className="flex items-center gap-2.5">
            <NotificationBell />
            <Link href="/perfil" className="w-9 h-9 rounded-full overflow-hidden bg-[#e6deff] dark:bg-indigo-950 flex items-center justify-center font-bold text-sm text-[#1b065c] dark:text-indigo-200">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{displayInitial}</span>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 pb-28 md:p-6 md:pb-8 min-w-0">
          {children}
        </main>
      </div>

      <MobileNav user={user} />
    </div>
  )
}
