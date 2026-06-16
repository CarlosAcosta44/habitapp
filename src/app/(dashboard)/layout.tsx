import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  
  // Try to fetch profile for extra metadata using the public API view
  const { data: profile } = await supabase.from('perfiles_usuarios_api').select('*').eq('idusuario', user.id).single()
  
  return profile ? { ...user, ...profile } : user
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

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
            {user?.fotoperfil || user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.fotoperfil || user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-600">
                {user?.nombre?.[0] || user?.full_name?.[0] || 'U'}
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

