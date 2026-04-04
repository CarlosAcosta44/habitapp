/**
 * @file src/app/(dashboard)/comunidad/page.tsx
 * @description Página principal de la comunidad — lista de foros.
 */

import { createClient }      from "@/lib/supabase/server";
import { redirect }          from "next/navigation";
import { ComunidadService }  from "@/modules/comunidad/comunidad.service";
import { ForoCard }          from "@/components/comunidad/ForoCard";

export const metadata = { title: "Comunidad | HabitApp" };

const comunidadService = new ComunidadService();

export default async function ComunidadPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const forosResult = await comunidadService.getForos(session.user.id);
  const foros = forosResult.success ? forosResult.data : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Comunidad
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Conecta con otros usuarios y comparte tu progreso
        </p>
      </div>

      {/* Error */}
      {!forosResult.success && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            {forosResult.error}
          </p>
        </div>
      )}

      {/* Lista de foros */}
      <div className="space-y-4">
        {foros.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No hay foros disponibles
            </p>
          </div>
        ) : (
          foros.map((foro) => (
            <ForoCard key={foro.idForo} foro={foro} />
          ))
        )}
      </div>
    </div>
  );
}