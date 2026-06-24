/**
 * @file src/app/(dashboard)/notificaciones/page.tsx
 * @description Página de la bandeja de entrada de notificaciones.
 * @layer Presentation & Pages (Capa 1)
 */

import { Metadata } from 'next';
import { NotificationList } from '@/components/notifications/NotificationList';
import { Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bandeja de Notificaciones — HabitApp',
  description: 'Revisa tus misiones, recomendaciones de entrenadores y recordatorios de hábitos en HabitApp.',
};

export default function NotificacionesDashboardPage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3 tracking-tight italic">
          <Bell className="w-8 h-8 text-indigo-500" />
          Bandeja de Entrada
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Entérate de las recomendaciones de tu entrenador, las misiones completadas y las alertas del sistema.
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 backdrop-blur-md p-6 sm:p-8 shadow-xl">
        <NotificationList />
      </div>
    </div>
  );
}
