import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { UsuarioService } from '@/services/usuario.service';
import type { User, Role } from '@/types/domain/user.types';
import { ShieldAlert, ArrowLeft, LogOut, Users } from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';

async function getCurrentAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');

  // Obtener perfil detallado desde el backend NestJS usando UsuarioService
  const usuarioService = new UsuarioService();
  const profileResult = await usuarioService.getPerfilMe();
  const profile = profileResult.success ? profileResult.data : null;

  // Si no es admin, devolvemos null para gatillar la pantalla de Acceso Denegado 403
  if (profile?.nombrerol !== 'admin') {
    return null;
  }

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
  };

  return domainUser;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAdminUser();

  // Pantalla 403: Acceso Denegado si el usuario no posee rol 'admin'
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4 overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="glass-morphism rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative z-10 border border-rose-500/20 shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-500 mb-6 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-3 text-white tracking-tight">Acceso Restringido</h1>
          <p className="text-rose-400 font-semibold mb-2 uppercase tracking-widest text-xs">Error 403: Forbidden</p>
          <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
            Esta área del sistema está reservada exclusivamente para administradores. Tu usuario actual no posee los privilegios necesarios.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link 
              href="/habitos" 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a HabitApp
            </Link>
            <form action={logoutAction} className="w-full sm:w-auto">
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-slate-700/50"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = user.fotoperfil ?? user.avatar_url;
  const displayInitial = user.nombre?.[0] ?? user.full_name?.[0] ?? 'A';

  return (
    <div className="flex bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Sidebar fijo en escritorio */}
      <div className="hidden md:block h-screen sticky top-0">
        <AdminSidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
        {/* Header móvil */}
        <header className="md:hidden sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6">
          <span className="font-bold text-lg text-rose-500 tracking-wide">HabitAdmin</span>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-rose-500 bg-rose-500/10">
                {displayInitial}
              </div>
            )}
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto p-4 pb-24 md:p-8">
          {children}
        </main>
      </div>

      {/* Menu / navegación específica de administración móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            href="/admin"
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 dark:text-slate-400 focus:outline-none"
          >
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span className="text-[10px] mt-1 font-medium text-rose-500">Panel</span>
          </Link>
          <Link
            href="/admin/usuarios"
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 dark:text-slate-400 focus:outline-none"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Usuarios</span>
          </Link>
          <Link
            href="/habitos"
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 dark:text-slate-400 focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Volver</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
