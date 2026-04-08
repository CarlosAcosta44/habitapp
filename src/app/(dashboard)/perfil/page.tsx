/**
 * @file src/app/(dashboard)/perfil/page.tsx
 * @description Página de Perfil del usuario.
 * Header con avatar, stats, tabs (Actividad, Amigos, Logros)
 * y sidebar con rendimiento y próximo hito.
 */

import { createClient }    from "@/lib/supabase/server";
import { redirect }        from "next/navigation";
import { PerfilTabs }      from "@/components/perfil/PerfilTabs";

export const metadata = { title: "Perfil | HabitApp" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // Obtener datos del perfil y rol desde la vista pública
  const { data: perfil } = await supabase
    .from("perfiles_usuarios_api")
    .select("nombre, apellido, fotoperfil, puntostotales, nombrerol")
    .eq("idusuario", session.user.id)
    .single();

  const nombre  = perfil?.nombre ?? "Usuario";
  const apellido = perfil?.apellido ?? "";
  const puntos  = perfil?.puntostotales ?? 0;

  // Mock de actividad reciente
  const actividad = [
    { id: "1", tipo: "reto",       titulo: "Reto: Guerrero Matutino",      desc: "Completaste 15 sesiones de entrenamiento antes de las 8 AM.", puntos: 112, label: "PUNTOS", icono: "🏃", color: "border-l-indigo-500 bg-indigo-600/5", extra: "📈 Racha aumentada a 12 días" },
    { id: "2", tipo: "habito",     titulo: "Hábito: Lectura Diaria",       desc: "30 minutos registrados hoy. ¡Mantén el ritmo!", puntos: 62, label: "PUNTOS", icono: "📖", color: "border-l-violet-500 bg-violet-600/5", extra: null },
    { id: "3", tipo: "racha_rota", titulo: "Racha de Meditación Rota",     desc: "Perdiste tu racha de 8 días de enfoque consciente.", puntos: null, label: null, icono: "🧘", color: "border-l-red-400 bg-red-600/5", extra: "¡No te rindas! Reinicia hoy para recuperar tu bono." },
    { id: "4", tipo: "logro",      titulo: "Logro Compartido",             desc: "Felicitaste a Elena M. por su racha de 50 días.", puntos: 15, label: "BONO SOCIAL", icono: "🎉", color: "border-l-pink-400 bg-pink-600/5", extra: null },
  ];

  // Mock amigos
  const amigos = [
    { id: "1", nombre: "Samuel", apellido: "Lores",     puntos: 1890 },
    { id: "2", nombre: "Maicol", apellido: "Rodriguez", puntos: 4120 },
    { id: "3", nombre: "Elena",  apellido: "Vizcarra",  puntos: 2780 },
    { id: "4", nombre: "Lucia",  apellido: "Mendez",    puntos: 1200 },
    { id: "5", nombre: "Roberto",apellido: "Garcia",    puntos: 890 },
    { id: "6", nombre: "Sofia",  apellido: "Castro",    puntos: 5600, top: true },
  ];

  // Mock logros
  const logros = [
    { id: "1", nombre: "Sueño Profundo",    desc: "7 días durmiendo +8h",       fecha: "05 Sept, 2023", icono: "🌙" },
    { id: "2", nombre: "Ratón de Biblioteca",desc: "Leído 500 páginas este mes", fecha: "28 Agosto, 2023",icono: "📚" },
    { id: "3", nombre: "Corazón de Oro",     desc: "Ayudaste a 10 amigos",       fecha: "15 Agosto, 2023",icono: "❤️" },
    { id: "4", nombre: "Energía Pura",       desc: "Sprint de 5km completado",   fecha: "02 Agosto, 2023",icono: "⚡" },
  ];

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
              <span className="text-4xl font-bold text-slate-300">
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
              24 <span className="text-slate-500 text-xs uppercase tracking-wider">Racha</span>
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-indigo-400 hover:border-indigo-500/30 transition-colors">
                  👤+ Añadir Amigo
                </button>
              </div>

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
                  Insignia Legendaria
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-3">¡El mejor corredor!</h2>
                <p className="text-sm text-slate-300 mt-2 max-w-md">
                  Has completado 30 sesiones de running consecutivas sin fallar un solo kilómetro. Eres la definición de constancia.
                </p>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">🏆</span>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Obtenido el</p>
                      <p className="text-sm text-white font-semibold">12 Octubre, 2023</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-[#111827] border border-slate-800/50 text-sm font-semibold text-slate-300 hover:border-slate-700 transition-colors">
                    Compartir Logro
                  </button>
                </div>
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
                      Próximo objetivo: <span className="text-indigo-400 italic">Maestro Zen</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Te faltan 4 sesiones de meditación para desbloquear tu próxima insignia dorada.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">80% Completado</p>
                    <p className="text-sm font-bold text-indigo-400">4/5 días</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
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
              <span className="text-sm text-slate-400">Meta de Puntos</span>
              <span className="text-sm font-bold text-indigo-400">82%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full w-[82%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Días Activos</p>
                <p className="text-xl font-extrabold text-white">22/30</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Eficiencia</p>
                <p className="text-xl font-extrabold text-white">94%</p>
              </div>
            </div>
          </div>

          {/* Próximo Hito */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-indigo-500/20">
            <div className="flex items-start justify-between">
              <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-bold">Próximo Hito</p>
              <span className="text-2xl">🏅</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-2">Mente de Acero</h3>
            <p className="text-xs text-slate-300 mt-1">
              Completa 30 días de hábitos sin fallar uno solo.
            </p>
          </div>

          {/* Círculo Social */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800/50">
            <h3 className="text-base font-bold text-white mb-3">Círculo Social</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[#111827] flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 font-medium">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">3 amigos activos hoy</span>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              Ver Rankings
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
