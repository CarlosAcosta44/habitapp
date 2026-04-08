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
import { CalendarDays, Target, Trophy, Zap } from "lucide-react";

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
  const porcentaje = habitos.length === 0 ? 0 : Math.round((completados / habitos.length) * 100);
  const rachaMaxima = Math.max(0, ...Object.values(rachasMap));
  const nombreUsuario =
    session.user.user_metadata?.full_name?.split(" ")?.[0] ||
    session.user.email?.split("@")[0] ||
    "Campeon";
  const diasSemana = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-indigo-200/40 dark:border-indigo-900 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/80">
              Panel diario
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-black">
              Hola, {nombreUsuario} 👋
            </h1>
            <p className="mt-2 text-sm md:text-base text-indigo-100/90">
              Construyamos habitos solidos, un check a la vez.
            </p>
          </div>

          <Link
            href="/habitos/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-white"
          >
            <Zap className="h-4 w-4" />
            Nuevo habito
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-2 text-indigo-100">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm capitalize">
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-5">
        <DailyProgress completados={completados} total={habitos.length} />

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Esta semana</h2>
          <div className="grid grid-cols-7 gap-2">
            {diasSemana.map((dia, index) => {
              const activo = index < Math.min(completados, 7);
              return (
                <div
                  key={dia}
                  className={`rounded-xl border px-2 py-2 text-center ${
                    activo
                      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">{dia}</p>
                  <div className={`mx-auto mt-2 h-6 w-6 rounded-full ${activo ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Habitos activos</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{habitos.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Completados</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{completados}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Racha top</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{rachaMaxima}d</p>
            </div>
          </div>
        </div>
      </section>

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Tus habitos
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            <Target className="h-3.5 w-3.5" />
            {porcentaje}% logrado
          </div>
        </div>

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
                href="/habitos/nueva"
                className="inline-block mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 transition-colors"
              >
                Crear hábito ✨
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {habitos.map((habito) => (
                <HabitCard
                  key={habito.idHabito}
                  habito={habito}
                  rachaActual={rachasMap[habito.idHabito] ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}