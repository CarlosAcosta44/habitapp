/**
 * @file src/app/(dashboard)/ranking/page.tsx
 * @description Página de Ranking — Tabla de Líderes.
 * Podio visual del top 3 y tabla del 4to en adelante.
 */

import { createClient }      from "@/lib/supabase/server";
import { redirect }          from "next/navigation";
import { ReportesService }   from "@/modules/reportes/reportes.service";

export const metadata = { title: "Ranking | HabitApp" };

const reportesService = new ReportesService();

export default async function RankingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const rankingResult = await reportesService.getRanking(session.user.id);
  const ranking = rankingResult.success ? rankingResult.data : [];

  const top3   = ranking.slice(0, 3);
  const resto  = ranking.slice(3);
  const miPosicion = ranking.find((r) => r.esUsuarioActual);

  // Reordenar podio: [2do, 1ro, 3ro]
  const podio = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const podioSizes = ["h-28 w-28", "h-36 w-36", "h-24 w-24"];
  const podioBorders = ["border-blue-400", "border-pink-400", "border-indigo-400"];
  const podioRingColors = ["ring-blue-400/30", "ring-pink-400/30", "ring-indigo-400/30"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">
            Tabla de{" "}
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              líderes
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 italic max-w-md">
            El progreso no es un destino, es una historia que escribes cada día
            junto a tu comunidad.
          </p>
        </div>

        {/* Periodo toggle */}
        <div className="flex items-center bg-[#111827] rounded-xl border border-slate-800/50 p-1">
          {["DIARIO", "SEMANAL", "MENSUAL"].map((p, i) => (
            <button
              key={p}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all tracking-wider ${
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

      {/* ── Podio ─────────────────────────────────────────────────────────── */}
      {podio.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden pt-6 pb-10">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-violet-900/20 to-transparent rounded-2xl"></div>

          <div className="relative flex items-end justify-center gap-6 md:gap-12 px-4">
            {podio.map((user, i) => {
              const realPos = i === 0 ? 2 : i === 1 ? 1 : 3;
              const isFirst = realPos === 1;

              return (
                <div key={user.posicion} className={`flex flex-col items-center ${isFirst ? "mb-4" : "mb-0"}`}>
                  {/* Corona para 1er lugar */}
                  {isFirst && (
                    <div className="text-3xl mb-2">👑</div>
                  )}

                  {/* Avatar */}
                  <div className="relative">
                    <div className={`${podioSizes[i]} rounded-full overflow-hidden border-4 ${podioBorders[i]} ring-4 ${podioRingColors[i]} bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center`}>
                      {user.fotoPerfil ? (
                        <img src={user.fotoPerfil} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className={`font-bold text-slate-300 ${isFirst ? "text-3xl" : "text-2xl"}`}>
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </span>
                      )}
                    </div>
                    {/* Badge de posición */}
                    <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${
                      realPos === 1 ? "bg-pink-500" : realPos === 2 ? "bg-blue-500" : "bg-indigo-500"
                    }`}>
                      {realPos}
                    </div>
                    {/* Estrella para 2do y 3ro */}
                    {!isFirst && (
                      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <h3 className={`mt-3 font-bold text-white ${isFirst ? "text-xl" : "text-base"}`}>
                    {user.nombre} {user.apellido}
                  </h3>

                  {/* Puntos */}
                  <p className={`font-extrabold ${isFirst ? "text-2xl text-pink-400" : "text-lg text-slate-300"}`}>
                    {user.puntosTotales.toLocaleString()}
                    <span className="text-xs text-slate-500 font-medium ml-1">PTS</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tabla del resto ───────────────────────────────────────────────── */}
      <div>
        {/* Header tabla */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          <div className="col-span-1">Posición</div>
          <div className="col-span-7">Usuario</div>
          <div className="col-span-4 text-right">Puntaje Total</div>
        </div>

        {/* Filas */}
        <div className="space-y-2">
          {resto.map((user) => (
            <div
              key={user.posicion}
              className={`grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl border transition-all ${
                user.esUsuarioActual
                  ? "bg-indigo-600/10 border-indigo-500/30"
                  : "bg-[#111827] border-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div className="col-span-1">
                <span className={`text-lg font-bold ${user.esUsuarioActual ? "text-indigo-400" : "text-slate-500"}`}>
                  {user.posicion}
                </span>
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user.fotoPerfil ? (
                    <img src={user.fotoPerfil} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-slate-300">
                      {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {user.esUsuarioActual ? `Tú (${user.nombre} ${user.apellido.charAt(0)}.)` : `${user.nombre} ${user.apellido}`}
                  </p>
                  {user.esUsuarioActual && (
                    <p className="text-xs text-indigo-400 italic">¡Estás en el top 5%!</p>
                  )}
                  {user.habitoPrincipal && (
                    <p className="text-xs text-slate-500 italic">Hábito: {user.habitoPrincipal}</p>
                  )}
                </div>
              </div>
              <div className="col-span-4 text-right">
                <span className={`text-lg font-bold ${user.esUsuarioActual ? "text-indigo-400" : "text-slate-300"}`}>
                  {user.puntosTotales.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {/* Mostrar posición del usuario si no está en la tabla */}
          {miPosicion && miPosicion.posicion > 3 + resto.length && (
            <div className="grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30">
              <div className="col-span-1">
                <span className="text-lg font-bold text-indigo-400">{miPosicion.posicion}</span>
              </div>
              <div className="col-span-7 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {miPosicion.nombre.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Tú ({miPosicion.nombre} {miPosicion.apellido.charAt(0)}.)</p>
                  <p className="text-xs text-indigo-400 italic">¡Estás en el top 5%!</p>
                </div>
              </div>
              <div className="col-span-4 text-right">
                <span className="text-lg font-bold text-indigo-400">{miPosicion.puntosTotales.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Empty state */}
        {ranking.length === 0 && (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-700 mt-4">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-slate-400 font-medium">No hay datos de ranking aún</p>
            <p className="text-slate-500 text-sm mt-1">Completa hábitos para subir en el ranking</p>
          </div>
        )}
      </div>

    </div>
  );
}
