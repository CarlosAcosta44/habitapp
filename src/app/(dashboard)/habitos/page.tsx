// Página principal del dashboard — Mis Hábitos
// Esta es una página placeholder para la Fase 2.
// La implementación completa (lista de hábitos, toggle, rachas) se realiza en la Fase 3.

/**
 * @file src/app/(dashboard)/habitos/page.tsx
 * @description Página principal de hábitos — Dashboard diario.
 * Server Component: obtiene datos directamente sin useEffect.
 *
 * Consume:
 * - HabitoService.getDashboard()   → Fase 4
 * - RegistroService.getRacha()     → Fase 4
 */

import Link                from "next/link";
import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import { HabitoService }   from "@/modules/habitos/habito.service";
import { RegistroService } from "@/modules/registros/registro.service";
import { HabitCard }       from "@/components/habitos/HabitCard";
import { DailyProgress }   from "@/components/registros/DailyProgress";

export const metadata = { title: "Mis Hábitos | HabitApp" };

const habitoService  = new HabitoService();
const registroService = new RegistroService();

export default async function HabitosPage() {
  // ── Verificar sesión ────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const usuarioId = session.user.id;

  // ── Obtener hábitos con progreso del día ────────────────────────────────────
  const habitosResult = await habitoService.getDashboard(usuarioId);
  const habitos = habitosResult.success ? habitosResult.data : [];

  // ── Calcular rachas en paralelo ─────────────────────────────────────────────
  const rachasMap: Record<string, number> = {};
  await Promise.all(
    habitos.map(async (h) => {
      const rachaResult = await registroService.getRacha(h.idHabito, usuarioId);
      rachasMap[h.idHabito] = rachaResult.success
        ? rachaResult.data.rachaActual
        : 0;
    })
  );

  // ── Métricas del día ────────────────────────────────────────────────────────
  const completados = habitos.filter((h) => h.registroHoy?.completado).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mis Hábitos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              day:     "numeric",
              month:   "long",
            })}
          </p>
        </div>

        <Link
          href="/dashboard/habitos/nueva"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          + Nuevo hábito
        </Link>
      </div>

      {/* Barra de progreso diario */}
      <DailyProgress
        completados={completados}
        total={habitos.length}
      />

      {/* Error si falla el servicio */}
      {!habitosResult.success && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            {habitosResult.error}
          </p>
        </div>
      )}

      {/* Lista de hábitos */}
      <section>
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Hábitos de hoy ({habitos.length})
        </h2>

        <div className="space-y-3">
          {habitos.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-4xl mb-3">🌱</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No tienes hábitos activos
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                ¡Crea tu primer hábito para empezar!
              </p>
              <Link
                href="/dashboard/habitos/nueva"
                className="inline-block mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 transition-colors"
              >
                Crear hábito ✨
              </Link>
            </div>
          ) : (
            habitos.map((habito) => (
              <HabitCard
                key={habito.idHabito}
                habito={habito}
                rachaActual={rachasMap[habito.idHabito] ?? 0}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}