/**
 * @file src/components/comunidad/ArticuloDestacado.tsx
 * @description Card de artículo destacado estilo ForoCard:
 * fondo sólido, badge de categoría, título, extracto y tiempo de lectura.
 */

import type { Articulo } from "@/types/domain/comunidad.types";

// Colores del badge por categoría
const categoriaBadgeColors: Record<string, string> = {
  Nutrición:          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Actividad Física": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Ejercicio:          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Salud Mental":     "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Sueño:              "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Salud:              "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  default:            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

// Ícono por categoría
const categoriaIcono: Record<string, string> = {
  Nutrición:          "🥗",
  "Actividad Física": "🏃",
  Ejercicio:          "💪",
  "Salud Mental":     "🧘",
  Sueño:              "🌙",
  Salud:              "❤️",
  default:            "✨",
};

interface ArticuloDestacadoProps {
  articulo: Articulo;
}

export function ArticuloDestacado({ articulo }: ArticuloDestacadoProps) {
  const badgeColor =
    categoriaBadgeColors[articulo.categoria ?? ""] ?? categoriaBadgeColors.default;
  const icono =
    categoriaIcono[articulo.categoria ?? ""] ?? categoriaIcono.default;

  // Estimar tiempo de lectura (200 palabras por minuto)
  const palabras = articulo.contenido.split(/\s+/).length;
  const minutos = Math.max(1, Math.ceil(palabras / 200));

  // Extracto corto del contenido
  const extracto =
    articulo.contenido.slice(0, 110).trim() +
    (articulo.contenido.length > 110 ? "…" : "");

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-3 hover:shadow-md transition-shadow cursor-pointer">

      {/* Header: ícono + categoría + tiempo */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icono}</span>
          {articulo.categoria && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
              {articulo.categoria}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
          📖 {minutos} min
        </span>
      </div>

      {/* Título */}
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
        {articulo.titulo}
      </h3>

      {/* Extracto */}
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
        {extracto}
      </p>
    </div>
  );
}
