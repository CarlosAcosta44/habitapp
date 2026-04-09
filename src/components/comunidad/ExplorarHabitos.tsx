/**
 * @file src/components/comunidad/ExplorarHabitos.tsx
 * @description Sección de hábitos populares/tendencias en la comunidad.
 * Muestra cards de hábitos con icono, nombre, frecuencia y avatares.
 */

import { TrendingUp, Users } from "lucide-react";

const habitosMock = [
  { id: "1", nombre: "Caminar", frecuencia: "30 min / día", icono: "🏃", color: "from-blue-500 to-cyan-400", bg: "bg-blue-500/10", avatares: 12 },
  { id: "2", nombre: "Nadar", frecuencia: "45 min / sesión", icono: "🏊", color: "from-orange-400 to-rose-400", bg: "bg-orange-500/10", avatares: 8 },
  { id: "3", nombre: "Leer", frecuencia: "20 páginas / día", icono: "📖", color: "from-indigo-500 to-violet-400", bg: "bg-indigo-500/10", avatares: 15 },
];

export function ExplorarHabitos() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 tracking-[0.2em] uppercase">
              TENDENCIAS
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explorar Hábitos</h2>
          </div>
        </div>
        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold transition-colors flex items-center gap-1 group">
          Ver todos 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitosMock.map((habito) => (
          <div
            key={habito.id}
            className="group relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${habito.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

            {/* Icono */}
            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${habito.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {habito.icono}
            </div>

            {/* Info */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {habito.nombre}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic font-medium">{habito.frecuencia}</p>
            </div>

            {/* Participantes */}
            <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center"
                  >
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                {habito.avatares}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
