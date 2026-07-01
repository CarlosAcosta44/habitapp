import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Activity, 
  BookOpen, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { getUsersAction } from '@/actions/admin.actions';

export default async function AdminDashboardPage() {
  const usersResult = await getUsersAction();
  const allUsers = usersResult.success ? (usersResult.data || []) : [];
  
  const totalUsers = allUsers.length;
  const totalCoaches = allUsers.filter((u: any) => u.nombrerol === 'Entrenador' || u.nombrerol === 'ENTRENADOR' || u.idrol?.toUpperCase() === 'ENTRENADOR').length;

  const stats = [
    { name: 'Usuarios Registrados', value: totalUsers.toString(), change: 'Total histórico', icon: Users, color: 'from-blue-500 to-indigo-500' },
    { name: 'Entrenadores Activos', value: totalCoaches.toString(), change: 'Verificados', icon: UserCheck, color: 'from-emerald-500 to-teal-500' },
    { name: 'Hábitos Registrados', value: 'N/A', change: 'En desarrollo', icon: Activity, color: 'from-purple-500 to-pink-500' },
    { name: 'Alertas de Moderación', value: 'N/A', change: 'En desarrollo', icon: ShieldAlert, color: 'from-rose-500 to-orange-500' },
  ];

  // Map the 5 most recently registered users (using created_at or similar if available, otherwise just first 5)
  const recentActivities = allUsers.slice(0, 5).map((user: any, index: number) => ({
    id: user.idusuario || index,
    user: `${user.nombre} ${user.apellido}`,
    action: `registrado con rol de ${user.nombrerol || 'Usuario'}`,
    time: 'Recientemente',
    type: user.nombrerol?.toUpperCase() === 'ENTRENADOR' ? 'role' : 'user'
  }));

  return (
    <div className="space-y-8">
      {/* Bienvenida y Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            Panel Administrativo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bienvenido de vuelta. Aquí tienes el estado actual y control operativo de HabitApp.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span>Última sincronización: Hace unos segundos</span>
        </div>
      </div>

      {/* Tarjetas Estadísticas (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden transition-all hover:scale-[1.02] duration-200"
            >
              {/* Degradado Decorativo de Fondo */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sección en Paralelo: Acciones Rápidas y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actividades Recientes (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Registro de Actividades Recientes
          </h3>

          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== recentActivities.length - 1 && (
                      <span 
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800/60" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-950 ${
                          activity.type === 'alert' 
                            ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-500' 
                            : activity.type === 'role'
                            ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-500'
                            : 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500'
                        }`}>
                          <div className="w-2.5 h-2.5 rounded-full bg-current" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <strong className="font-bold text-slate-900 dark:text-white">{activity.user}</strong>{' '}
                            {activity.action}
                          </p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-slate-400 dark:text-slate-500">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Acciones Rápidas (Ocupa 1 columna) */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Accesos Directos
            </h3>

            <div className="space-y-3">
              <Link 
                href="/admin/usuarios"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/50 dark:border-slate-800/50 font-semibold text-sm transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4.5 h-4.5" />
                  Gestionar Usuarios
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/admin/moderacion"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/50 dark:border-slate-800/50 font-semibold text-sm transition-all group"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5" />
                  Moderar Comunidad
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center items-center text-center mt-6">
                <BookOpen className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Artículos Educativos</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Próximamente podrás redactar y programar artículos formativos directamente aquí.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-6">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
              HabitApp v1.0.0 · Módulo Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
