import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import type { User, Role } from '@/types/domain/user.types'

async function getCurrentUser(): Promise<User> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  
  // Try to fetch profile for extra metadata using the public API view
  const { data: profile } = await supabase.from('perfiles_usuarios_api').select('*').eq('idusuario', user.id).single()
  
  const mappedUser: User = {
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

  return mappedUser
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
        <header className="md:hidden h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6">
          <span className="font-bold text-indigo-600">HabitApp</span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
