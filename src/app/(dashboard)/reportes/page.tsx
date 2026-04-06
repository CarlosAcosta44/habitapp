/**
 * @file src/app/(dashboard)/reportes/page.tsx
 * @description Página de Reportes — Análisis Editorial.
 * Muestra estadísticas globales, estado de ánimo, comparativa semanal
 * y progreso individual por hábito.
 */

import { createClient }       from "@/lib/supabase/server";
import { redirect }           from "next/navigation";
import { ReportesService }    from "@/modules/reportes/reportes.service";

export const metadata = { title: "Reportes | HabitApp" };

const reportesService = new ReportesService();

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const [statsResult, habitosResult] = await Promise.all([
    reportesService.getEstadisticas(session.user.id),
    reportesService.getHabitosReporte(session.user.id),
  ]);

  const stats   = statsResult.success   ? statsResult.data   : null;
  const habitos = habitosResult.success  ? habitosResult.data : [];

  // Datos mock para comparativa semanal (CSS chart)
  const diasSemana = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const saludData   = [20, 30, 35, 50, 65, 80, 75];
  const enfoqueData = [10, 15, 20, 25, 45, 60, 70];

  // Emojis de estado de ánimo (mock)
  const emojisAnimo = ["😊", "🔥", "😎", "🥰", "😊", "⚡", "😄", "😊", "💪", "😊", "🌿", "🏔️", "🍀", "🌊"];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Análisis Editorial
          </h1>
          <p className="text-sm text-slate-400 mt-1 italic">
            Tu progreso, narrado a través de los datos.
          </p>
        </div>

        {/* Periodo toggle */}
        <div className="flex items-center bg-[#111827] rounded-xl border border-slate-800/50 p-1">
          {["Diario", "Semanal", "Mensual"].map((p, i) => (
            <button
              key={p}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                i === 1
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid principal ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card de insights globales */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-600/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Global Insights
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Todos los hábitos
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Éxito %</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats?.exitoPorcentaje ?? 0}
                <span className="text-base text-slate-400 font-normal"> %</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Completados</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats?.completados ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Puntos</p>
              <p className="text-3xl font-extrabold text-pink-500">
                {(stats?.puntosTotales ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Racha</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats?.rachaActual ?? 0}
                <span className="ml-1 text-base">🔥</span>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-white dark:border-[#111827] flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
              <span className="ml-2 text-xs text-indigo-400 bg-indigo-600/20 px-2 py-0.5 rounded-full self-center font-medium">
                +12
              </span>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="text-slate-500">SALTADOS: <span className="font-semibold text-slate-400">{stats?.saltados ?? 0}</span></span>
              <span className="text-red-400">FALLADOS: <span className="font-semibold">{stats?.fallados ?? 0}</span></span>
            </div>
          </div>
        </div>

        {/* Estado de Ánimo */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Estado de Ánimo</h3>
            <span className="text-2xl">😊</span>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <span key={d} className="text-[10px] text-slate-500 font-medium">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {emojisAnimo.map((emoji, i) => (
                <span key={i} className="text-lg">{emoji}</span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &ldquo;Esta semana te has sentido un 15% más energizado que la anterior. Sigue así.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ── Comparativa Semanal ────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Comparativa Semanal</h2>
            <p className="text-xs text-slate-400 mt-0.5">Frecuencia de cumplimiento por categoría</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
              <span className="text-xs text-slate-400 font-medium">SALUD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400"></div>
              <span className="text-xs text-slate-400 font-medium">ENFOQUE</span>
            </div>
          </div>
        </div>

        {/* Chart placeholder con CSS */}
        <div className="relative h-48 mb-4">
          <svg viewBox="0 0 700 200" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((y) => (
              <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#1e293b" strokeWidth="1" />
            ))}
            {/* Salud line */}
            <polyline
              fill="none"
              stroke="#818cf8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={saludData.map((v, i) => `${i * 100 + 50},${200 - v * 2}`).join(" ")}
            />
            {/* Enfoque line */}
            <polyline
              fill="none"
              stroke="#f472b6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={enfoqueData.map((v, i) => `${i * 100 + 50},${200 - v * 2}`).join(" ")}
            />
          </svg>
        </div>

        <div className="grid grid-cols-7 text-center">
          {diasSemana.map((d) => (
            <span key={d} className="text-xs text-slate-500 font-medium">{d}</span>
          ))}
        </div>
      </div>

      {/* ── Hábitos individuales ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habitos.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-2xl border border-dashed border-slate-700">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-slate-400 font-medium">No hay datos de hábitos aún</p>
          </div>
        ) : (
          habitos.map((h) => (
            <div key={h.idHabito} className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${h.color}20` }}>
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: h.color }}></div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  h.porcentajeCambio.startsWith("+")
                    ? "text-emerald-400 bg-emerald-500/15"
                    : h.porcentajeCambio.startsWith("-")
                    ? "text-red-400 bg-red-500/15"
                    : "text-slate-400 bg-slate-700"
                }`}>
                  {h.porcentajeCambio}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{h.nombre}</h3>
              <p className="text-xs text-slate-400 mb-3">{h.descripcion}</p>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${h.progreso}%`, backgroundColor: h.color }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
