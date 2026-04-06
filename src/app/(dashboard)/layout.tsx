import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  
  // Try to fetch profile for extra metadata
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  return profile || user
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
