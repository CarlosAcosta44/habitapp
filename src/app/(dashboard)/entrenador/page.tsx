import { requireUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, BookOpen, Activity } from "lucide-react";
import { getCoachClientsAction, getCoachRoutinesAction } from "@/actions/coach.actions";
import { CoachDashboardClient } from "@/components/coach/CoachDashboardClient";

export const metadata = { title: "Dashboard de Entrenador | HabitApp" };

export default async function EntrenadorDashboard() {
  const user = await requireUser();
  const { UsuarioService } = await import('@/services/usuario.service');
  const usuarioService = new UsuarioService();
  const profileResult = await usuarioService.getPerfilMe();
  const profile = profileResult.success ? profileResult.data : null;
  
  const isTrainerOrAdmin = profile?.nombrerol?.toUpperCase() === "ENTRENADOR" || profile?.nombrerol?.toUpperCase() === "ADMINISTRADOR";
  
  if (!isTrainerOrAdmin) {
    redirect("/habitos");
  }

  // Fetch real data
  const [clientsResult, routinesResult] = await Promise.all([
    getCoachClientsAction(),
    getCoachRoutinesAction(),
  ]);

  const clients = clientsResult.success ? (clientsResult.data || []) : [];
  const routines = routinesResult.success ? (routinesResult.data || []) : [];

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
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{clients.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rutinas Creadas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{routines.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tasa de Cumplimiento</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">N/A</p>
          </div>
        </div>
      </div>

      {/* ── Tabs / Contenido principal ────────────────────────────────────── */}
      <CoachDashboardClient initialClients={clients} initialRoutines={routines} />
    </div>
  );
}
