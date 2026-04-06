/**
 * @file src/components/comunidad/ExplorarHabitos.tsx
 * @description Sección de hábitos populares/tendencias en la comunidad.
 * Muestra cards de hábitos con icono, nombre, frecuencia y avatares.
 */

const habitosMock = [
  { id: "1", nombre: "Caminar", frecuencia: "30 min / día", icono: "🏃", color: "from-blue-500 to-cyan-400", avatares: 12 },
  { id: "2", nombre: "Nadar", frecuencia: "45 min / sesión", icono: "🏊", color: "from-orange-400 to-rose-400", avatares: 8 },
  { id: "3", nombre: "Leer", frecuencia: "20 páginas / día", icono: "📖", color: "from-indigo-500 to-violet-400", avatares: 15 },
];

export function ExplorarHabitos() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-1">
            TENDENCIAS
          </p>
          <h2 className="text-xl font-bold text-white">Explorar Hábitos</h2>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Ver todos →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habitosMock.map((habito) => (
          <div
            key={habito.id}
            className="group relative p-5 rounded-2xl bg-[#111827] border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5"
          >
            {/* Icono */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${habito.color} flex items-center justify-center text-xl mb-4 shadow-lg`}>
              {habito.icono}
            </div>

            {/* Info */}
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              {habito.nombre}
            </h3>
            <p className="text-sm text-slate-400">{habito.frecuencia}</p>

            {/* Participantes */}
            <div className="flex items-center mt-4">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[#111827] flex items-center justify-center"
                  >
                    <span className="text-[10px] text-slate-300 font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="ml-2 text-xs text-indigo-400 bg-indigo-600/20 px-2 py-0.5 rounded-full font-medium">
                +{habito.avatares}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
