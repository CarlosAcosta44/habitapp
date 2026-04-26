/**
 * @file src/components/comunidad/ForoComunidadCard.tsx
 * @description Card de foro para la vista de comunidad con icono, nombre,
 * descripción, badge de estado y conteo de miembros.
 */

import type { ForoConMetricas } from "@/types/domain/comunidad.types";

// Íconos y colores por categoría
const categoriaConfig: Record<string, { icono: string; color: string }> = {
  Motivación:    { icono: "⚡", color: "from-yellow-400 to-orange-500" },
  Ejercicio:     { icono: "🏃", color: "from-blue-400 to-cyan-500" },
  Nutrición:     { icono: "🥗", color: "from-green-400 to-emerald-500" },
  "Salud Mental":{ icono: "🧠", color: "from-purple-400 to-pink-500" },
  Sueño:         { icono: "😴", color: "from-indigo-400 to-blue-500" },
  Hidratación:   { icono: "💧", color: "from-cyan-400 to-blue-400" },
  default:       { icono: "💬", color: "from-indigo-500 to-violet-500" },
};

interface ForoComunidadCardProps {
  foro: ForoConMetricas;
}

export function ForoComunidadCard({ foro }: ForoComunidadCardProps) {
  const config = categoriaConfig[foro.categoria ?? ""] ?? categoriaConfig.default;

  return (
    <div className="group p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5 relative overflow-hidden">
      {/* Badge activo */}
      {foro.estado === "Abierto" && foro.totalComentarios > 0 && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg uppercase tracking-wider">
            Activo ahora
          </span>
        </div>
      )}

      {/* Icono */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-xl mb-4 shadow-lg`}>
        {config.icono}
      </div>

      {/* Info */}
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
        {foro.titulo}
      </h3>
      {foro.descripcion && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {foro.descripcion}
        </p>
      )}

      {/* Miembros */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" />
        </svg>
        <span className="text-slate-500 dark:text-slate-400">{foro.totalSuscriptores.toLocaleString()} miembros</span>
      </div>
    </div>
  );
}
