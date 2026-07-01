import { requireUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, BookOpen, Activity } from "lucide-react";

export const metadata = { title: "Dashboard de Entrenador | HabitApp" };

export default async function EntrenadorDashboard() {
  const user = await requireUser();
  if (user?.role?.toUpperCase() !== "TRAINER" && (user as any)?.nombrerol?.toUpperCase() !== "TRAINER" && (user as any)?.nombrerol?.toUpperCase() !== "ENTRENADOR" && user.role?.toUpperCase() !== "ADMIN") {
    redirect("/habitos");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Portal del <span className="text-indigo-500">Entrenador</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 italic">
            Gestiona a tus clientes, asigna rutinas y supervisa su progreso.
          </p>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Clientes Activos</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rutinas Creadas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tasa de Cumplimiento</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">85%</p>
          </div>
        </div>
      </div>

      {/* ── Tabs / Contenido principal ────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No tienes clientes asignados aún
          </h2>
          <p className="text-slate-500 max-w-sm mb-6">
            Comparte tu enlace de entrenador para que los usuarios puedan unirse a tu equipo y recibir tus rutinas.
          </p>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
            Copiar Enlace de Invitación
          </button>
        </div>
      </div>
    </div>
  );
}
