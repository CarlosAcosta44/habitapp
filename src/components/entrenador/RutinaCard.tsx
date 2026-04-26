/**
 * @file src/components/entrenador/RutinaCard.tsx
 * @description Tarjeta que muestra una rutina con sus usuarios asignados.
 */

import type { RutinaConUsuarios } from "@/types/domain/entrenador.types";

const nivelColor = {
  Principiante: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Intermedio:   "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Avanzado:     "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
} as const;

interface RutinaCardProps {
  rutina: RutinaConUsuarios;
}

export function RutinaCard({ rutina }: RutinaCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-3">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {rutina.tipo}
          </h3>
          {rutina.objetivo && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              🎯 {rutina.objetivo}
            </p>
          )}
        </div>

        {/* Nivel badge */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${nivelColor[rutina.nivel]}`}>
          {rutina.nivel}
        </span>
      </div>

      {/* Descripción */}
      {rutina.descripcion && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {rutina.descripcion}
        </p>
      )}

      {/* Duración */}
      {rutina.duracion && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ⏱ {rutina.duracion} minutos
        </p>
      )}

      {/* Usuarios asignados */}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          Usuarios asignados ({rutina.usuariosAsignados.length})
        </p>
        {rutina.usuariosAsignados.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sin usuarios asignados aún
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {rutina.usuariosAsignados.map((u) => (
              <span
                key={u.idUsuario}
                className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full"
              >
                {u.nombre} {u.apellido}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}