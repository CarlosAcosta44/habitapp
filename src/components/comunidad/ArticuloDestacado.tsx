/**
 * @file src/components/comunidad/ArticuloDestacado.tsx
 * @description Card de artículo destacado con imagen de fondo,
 * categoría badge, título y tiempo estimado de lectura.
 */

import type { Articulo } from "@/modules/comunidad/types";

// Colores por categoría
const categoriaBadgeColors: Record<string, string> = {
  Nutrición:      "bg-red-500/90 text-white",
  "Actividad Física": "bg-emerald-500/90 text-white",
  Ejercicio:      "bg-blue-500/90 text-white",
  "Salud Mental": "bg-purple-500/90 text-white",
  Sueño:          "bg-indigo-500/90 text-white",
  default:        "bg-slate-500/90 text-white",
};

// Imágenes de fondo por categoría (gradientes como placeholder)
const categoriaGradient: Record<string, string> = {
  Nutrición:      "from-cyan-900 to-teal-800",
  "Actividad Física": "from-emerald-900 to-green-800",
  Ejercicio:      "from-blue-900 to-indigo-800",
  "Salud Mental": "from-purple-900 to-violet-800",
  Sueño:          "from-indigo-900 to-blue-800",
  default:        "from-slate-800 to-slate-700",
};

interface ArticuloDestacadoProps {
  articulo: Articulo;
}

export function ArticuloDestacado({ articulo }: ArticuloDestacadoProps) {
  const badgeColor = categoriaBadgeColors[articulo.categoria ?? ""] ?? categoriaBadgeColors.default;
  const gradient = categoriaGradient[articulo.categoria ?? ""] ?? categoriaGradient.default;

  // Estimar tiempo de lectura (200 palabras por minuto)
  const palabras = articulo.contenido.split(/\s+/).length;
  const minutos = Math.max(1, Math.ceil(palabras / 200));

  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] min-h-[280px]">
      {/* Fondo gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Contenido */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Badge categoría */}
        {articulo.categoria && (
          <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mb-3 ${badgeColor}`}>
            {articulo.categoria}
          </span>
        )}

        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-200 transition-colors">
          {articulo.titulo}
        </h3>
      </div>

      {/* Tiempo de lectura */}
      <div className="absolute top-4 right-4">
        <span className="text-xs text-slate-300 font-medium">
          Lectura de {minutos} min
        </span>
      </div>
    </div>
  );
}
