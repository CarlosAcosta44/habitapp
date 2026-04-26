/**
 * @file src/app/(dashboard)/perfil/page.tsx
 * @description Página de Perfil del usuario.
 * Header con avatar, stats, tabs (Actividad, Amigos, Logros)
 * y sidebar con rendimiento y próximo hito.
 */

import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import Link                from "next/link";
import { PerfilTabs }      from "@/components/perfil/PerfilTabs";
import { RegistroService } from "@/services/registro.service";
import { AddFriendForm }   from "@/components/perfil/AddFriendForm";

export const metadata = { title: "Perfil | HabitApp" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles_usuarios_api")
    .select("nombre, apellido, fotoperfil, puntostotales, nombrerol")
    .eq("idusuario", session.user.id)
    .single();

  const nombre  = perfil?.nombre ?? "Usuario";
  const apellido = perfil?.apellido ?? "";
  const puntos  = perfil?.puntostotales ?? 0;

  // ── 0. Cargar los registros para calcular estadísticas (Racha / Eficiencia) ──
  const registroService = new RegistroService();
  const historialResult = await registroService.getHistorialUsuario(session.user.id);
  const registrosReales = historialResult.success ? historialResult.data : [];

  // Calcular días activos del mes
  const hoyDate = new Date();
  const mesActual = hoyDate.getMonth();
  const añoActual = hoyDate.getFullYear();
  
  const diasCompletadosMes = new Set(
    registrosReales
      .filter(r => r.completado)
      .filter(r => {
        const rowDate = new Date(r.fecha + "T12:00:00Z"); // Fix TZ boundary
        return rowDate.getMonth() === mesActual && rowDate.getFullYear() === añoActual;
      })
      .map(r => r.fecha)
  );
  const diasActivosMensuales = diasCompletadosMes.size;
  const diasEnElMes = new Date(añoActual, mesActual + 1, 0).getDate();
  const eficienciaMensual = Math.round((diasActivosMensuales / diasEnElMes) * 100);

  // Calcular Racha Global (Días consecutivos con al menos un hábito completado)
  const todosLosDias = Array.from(new Set(registrosReales.filter(r => r.completado).map(r => r.fecha))).sort((a,b) => b.localeCompare(a));
  let rachaGlobal = 0;
  for (let i = 0; i < todosLosDias.length; i++) {
    const d = new Date(hoyDate);
    d.setDate(hoyDate.getDate() - i);
    const expected = d.toISOString().split("T")[0];
    if (todosLosDias[i] === expected) rachaGlobal++;
    else break;
  }

  // ── 1. Actividad de Puntos Secuencial ──
  const { data: historialPuntos } = await supabase
    .from("api_historial_puntos")
    .select("*")
    .eq("idusuario", session.user.id)
    .order("fecha", { ascending: false })
    .limit(5);

  const actividad = historialPuntos?.map((hp, idx) => ({
    id: hp.idhistorial,
    tipo: idx % 2 === 0 ? "habito" : "logro", 
    titulo: hp.motivo,
    desc: `Puntos obtenidos el ${hp.fecha}`,
    puntos: hp.puntos,
    label: "PUNTOS",
    icono: "⭐",
    color: "border-l-indigo-500 bg-indigo-600/5",
    extra: null
  })) || [];

  if (actividad.length === 0) {
    actividad.push({ id: "mock", tipo: "info", titulo: "¡Bienvenido a HabitApp!", desc: "Comienza a completar hábitos para ver tu progreso aquí.", puntos: 0, label: "", icono: "👋", color: "border-l-slate-500 bg-slate-600/5", extra: null });
  }

  // ── 2. Amigos ──
  const { data: misAmistades } = await supabase
    .from("api_amigos")
    .select("*")
    .eq("estado", "Aceptado")
    .or(`idusuario_solicitante.eq.${session.user.id},idusuario_receptor.eq.${session.user.id}`);

  const amigosIds = misAmistades?.map(a => a.idusuario_solicitante === session.user.id ? a.idusuario_receptor : a.idusuario_solicitante) || [];
  
  let amigosReales: any[] = [];
  if (amigosIds.length > 0) {
    const { data: perfilesAmigos } = await supabase
      .from("perfiles_usuarios_api")
      .select("idusuario, nombre, apellido, puntostotales")
      .in("idusuario", amigosIds)
      .order("puntostotales", { ascending: false });

    amigosReales = perfilesAmigos?.map((pa, idx) => ({
      id: pa.idusuario,
      nombre: pa.nombre,
      apellido: pa.apellido,
      puntos: pa.puntostotales,
      top: idx === 0 && pa.puntostotales > 0 // El que más puntos tiene recibe estrella
    })) || [];
  }
  const amigos = amigosReales;

  const { data: sugerenciasRaw } = await supabase
    .from("perfiles_usuarios_api")
    .select("idusuario, nombre, apellido")
    .neq("idusuario", session.user.id)
    .limit(40);

  const amigosExistentesSet = new Set(amigosIds);
  const sugerenciasAmigos = (sugerenciasRaw ?? [])
    .filter((user) => !amigosExistentesSet.has(user.idusuario))
    .slice(0, 12)
    .map((user) => ({
      id: user.idusuario,
      nombre: user.nombre,
      apellido: user.apellido,
    }));

  // ── 3. Logros Reales ──
  const { data: logrosGanados } = await supabase
    .from("api_usuario_logro")
    .select("*")
    .eq("idusuario", session.user.id);
    
  const idsGanados = logrosGanados?.map(l => l.idlogro) || [];

  let logrosReales: any[] = [];
  if (idsGanados.length > 0) {
    const { data: catalogoLogros } = await supabase
      .from("api_logros")
      .select("*")
      .in("idlogro", idsGanados);

    logrosReales = catalogoLogros?.map((lg) => {
      const meta = logrosGanados?.find(ul => ul.idlogro === lg.idlogro);
      return {
        id: lg.idlogro,
        nombre: lg.nombre,
        desc: lg.descripcion,
        fecha: meta?.fechaobtenido || "Recientemente",
        icono: lg.icono
      };
    }) || [];
  }
  const logros = logrosReales;
  const logroDestacado = logros.length > 0 ? logros[0] : null;

  // ── 4. Lógica de Próximo Objetivo ──
  let proximoObjetivo = { nombre: "Inicia tu camino", desc: "Consigue tus primeros puntos.", meta: 100, actual: puntos };
  if (puntos < 100) proximoObjetivo = { nombre: "Aspirante", desc: "Consigue tus primeros 100 puntos", meta: 100, actual: puntos };
  else if (puntos < 500) proximoObjetivo = { nombre: "Aplicado", desc: "Tu meta ahora son 500 puntos", meta: 500, actual: puntos };
  else if (puntos < 1500) proximoObjetivo = { nombre: "Constante", desc: "Alcanzar 1500 puntos es el reto", meta: 1500, actual: puntos };
  else proximoObjetivo = { nombre: "Mente de Acero", desc: "Llega a la increíble suma de 5000 puntos", meta: 5000, actual: puntos };
  
  const porcentajeObj = Math.min(100, Math.round((proximoObjetivo.actual / proximoObjetivo.meta) * 100));

  return (
    <div className="max-w-5xl mx-auto pb-12">

      {/* ── Header del perfil ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/30 ring-4 ring-indigo-500/10 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            {perfil?.fotoperfil ? (
              <img src={perfil.fotoperfil} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-slate-300 uppercase">
                {nombre.charAt(0)}{apellido.charAt(0)}
              </span>
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-3 border-[#080b14] flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-white">
            {nombre} {apellido}
          </h1>
          <p className="text-sm text-slate-400 italic mt-1">
            &ldquo;Construyendo el futuro, un hábito a la vez.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="px-4 py-1.5 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-indigo-400">
              {puntos.toLocaleString()} <span className="text-slate-500 text-xs uppercase tracking-wider">Puntos</span>
            </span>
            <span className="px-4 py-1.5 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-orange-400">
              {rachaGlobal} <span className="text-slate-500 text-xs uppercase tracking-wider">Racha</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Contenido con tabs + sidebar ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main content con tabs */}
        <div className="lg:col-span-2">
          <PerfilTabs tabs={["Actividad", "Amigos", "Logros"]}>

            {/* ─── Tab: Actividad ────────────────────────────────────────── */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Último Mes</h2>
              <div className="space-y-3">
                {actividad.map((item) => (
                  <div key={item.id} className={`p-4 rounded-2xl border-l-4 ${item.color} border border-slate-800/30`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg flex-shrink-0">
                        {item.icono}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-white">{item.titulo}</h3>
                          {item.puntos && (
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="text-base font-bold text-indigo-400">+{item.puntos}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        {item.extra && (
                          <p className={`text-xs mt-2 font-medium ${
                            item.tipo === "racha_rota" ? "text-red-400" : "text-emerald-400"
                          }`}>
                            {item.extra}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Tab: Amigos ───────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{amigos.length} Amigos</h2>
                  <p className="text-sm text-slate-400 italic">Tu red de apoyo para mejores hábitos.</p>
                </div>
              </div>

              <AddFriendForm suggestions={sugerenciasAmigos} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {amigos.map((amigo) => (
                  <div key={amigo.id} className={`p-4 rounded-2xl border transition-all hover:border-indigo-500/30 ${
                    amigo.top
                      ? "bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border-indigo-500/30"
                      : "bg-[#111827] border-slate-800/50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-slate-300">
                          {amigo.nombre.charAt(0)}{amigo.apellido.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{amigo.nombre}</p>
                        <p className="text-sm text-slate-400">{amigo.apellido}</p>
                        <p className="text-xs text-indigo-400 font-semibold">
                          {amigo.puntos.toLocaleString()} Pts
                        </p>
                      </div>
                      {amigo.top && (
                        <span className="ml-auto text-yellow-400">⭐</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button className="px-8 py-3 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors">
                  Ver más amigos
                </button>
              </div>
            </div>

            {/* ─── Tab: Logros ───────────────────────────────────────────── */}
            <div>
              {/* Logro destacado */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 mb-6">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {logroDestacado ? "Última Insignia" : "Aún sin insignias"}
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3">
                  {logroDestacado ? logroDestacado.nombre : "¡Comienza tu aventura!"}
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-md">
                  {logroDestacado ? logroDestacado.desc : "Completa retos y mantén rachas en tus hábitos para coleccionar insignias y subir de nivel."}
                </p>
                {logroDestacado && (
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">{logroDestacado.icono}</span>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Obtenido el</p>
                        <p className="text-sm text-white font-semibold">{logroDestacado.fecha}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-slate-300 hover:border-slate-700 transition-colors">
                      Compartir Logro
                    </button>
                  </div>
                )}
              </div>

              {/* Grid de logros */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {logros.map((logro) => (
                  <div key={logro.id} className="p-4 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer">
                    <span className="text-2xl">{logro.icono}</span>
                    <h3 className="text-sm font-bold text-indigo-400 mt-2">{logro.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{logro.desc}</p>
                    <p className="text-[10px] text-slate-600 mt-2">{logro.fecha}</p>
                  </div>
                ))}
              </div>

              {/* Próximo objetivo */}
              <div className="mt-6 p-6 rounded-2xl bg-[#111827] border border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Próximo objetivo: <span className="text-indigo-400 italic">{proximoObjetivo.nombre}</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {proximoObjetivo.desc}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{porcentajeObj}% Completado</p>
                    <p className="text-sm font-bold text-indigo-400">{proximoObjetivo.actual}/{proximoObjetivo.meta}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full`} style={{ width: `${porcentajeObj}%` }}></div>
                </div>
              </div>
            </div>

          </PerfilTabs>
        </div>

        {/* ── Sidebar derecho ──────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Rendimiento Mensual */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
            <h3 className="text-base font-bold text-white mb-3">Rendimiento Mensual</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Días activos vs meta</span>
              <span className="text-sm font-bold text-indigo-400">{diasActivosMensuales}/{diasEnElMes}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${eficienciaMensual}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Días Activos</p>
                <p className="text-xl font-extrabold text-white">{diasActivosMensuales}/{diasEnElMes}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Eficiencia</p>
                <p className="text-xl font-extrabold text-white">{eficienciaMensual}%</p>
              </div>
            </div>
          </div>

          {/* Próximo Hito */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20">
            <div className="flex items-start justify-between">
              <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-bold">Próximo Hito</p>
              <span className="text-2xl">🏅</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-2">{proximoObjetivo.nombre}</h3>
            <p className="text-xs text-slate-300 mt-1">
              Rumbo a los {proximoObjetivo.meta} puntos totales.
            </p>
          </div>

          {/* Círculo Social */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
            <h3 className="text-base font-bold text-white mb-3">Círculo Social</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {amigos.slice(0, 3).map((a, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[#111827] flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 font-medium">{a.nombre.charAt(0)}</span>
                  </div>
                ))}
                {amigos.length === 0 && <span className="text-xs text-slate-500">Aún no tienes amigos</span>}
              </div>
              {amigos.length > 0 && <span className="text-xs text-slate-400">{amigos.length} amigos en tu red</span>}
            </div>
            <Link 
              href="/ranking"
              className="block flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Ver Rankings
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
