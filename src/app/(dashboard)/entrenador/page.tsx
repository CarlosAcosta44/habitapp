/**
 * @file src/app/(dashboard)/entrenador/page.tsx
 * @description Panel principal del entrenador.
 * Muestra sus rutinas con usuarios asignados.
 */

import { createClient }      from "@/lib/supabase/server";
import { redirect }          from "next/navigation";
import { EntrenadorService } from "@/modules/entrenador/entrenador.service";
import { RutinaCard }        from "@/components/entrenador/RutinaCard";
import { RutinaForm }        from "@/components/entrenador/RutinaForm";

export const metadata = { title: "Panel Entrenador | HabitApp" };

const entrenadorService = new EntrenadorService();

export default async function EntrenadorPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // Obtener perfil del entrenador
  const perfilResult = await entrenadorService.getPerfilByUsuario(session.user.id);
  if (!perfilResult.success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 p-6 text-center">
          <p className="text-2xl mb-2">🏋️</p>
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            No tienes perfil de entrenador
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Contacta al administrador para activar tu perfil
          </p>
        </div>
      </div>
    );
  }

  const perfil = perfilResult.data;

  // Obtener rutinas con usuarios
  const rutinasResult = await entrenadorService.getMisRutinas(perfil.idEntrenador);
  const rutinas = rutinasResult.success ? rutinasResult.data : [];

  // Obtener usuarios asignados
  const usuariosResult = await entrenadorService.getMisUsuarios(perfil.idEntrenador);
  const usuarios = usuariosResult.success ? usuariosResult.data : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Panel de Entrenador
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {perfil.usuario.nombre} {perfil.usuario.apellido}
          {perfil.especialidad && ` · ${perfil.especialidad}`}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 p-5">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Mis usuarios
          </p>
          <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
            {usuarios.length}
          </p>
        </div>
        <div className="rounded-2xl bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 p-5">
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
            Mis rutinas
          </p>
          <p className="text-3xl font-bold text-violet-700 dark:text-violet-300 mt-1">
            {rutinas.length}
          </p>
        </div>
      </div>

      {/* Grid: Rutinas + Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Lista de rutinas */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Mis Rutinas
          </h2>
          {rutinas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-400">No tienes rutinas creadas</p>
            </div>
          ) : (
            rutinas.map((rutina) => (
              <RutinaCard key={rutina.idRutina} rutina={rutina} />
            ))
          )}
        </section>

        {/* Formulario nueva rutina */}
        <section>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Crear Nueva Rutina
          </h2>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">
            <RutinaForm />
          </div>
        </section>
      </div>
    </div>
  );
}