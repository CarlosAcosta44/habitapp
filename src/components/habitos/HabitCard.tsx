/**
 * @file src/components/habitos/HabitCard.tsx
 * @description Tarjeta de hábito con progreso del día y racha.
 * Consume HabitoConProgreso de la Fase 3.
 */

import { StreakBadge }         from "@/components/habitos/StreakBadge";
import { MarcarCompletadoBtn } from "@/components/registros/MarcarCompletadoBtn";
import type { HabitoConProgreso } from "@/modules/habitos/types";

interface HabitCardProps {
  habito:    HabitoConProgreso;
  rachaActual: number;
}

export function HabitCard({ habito, rachaActual }: HabitCardProps) {
  const completado = habito.registroHoy?.completado ?? false;
  const hoy        = new Date().toISOString().split("T")[0];

  return (
    <div
      className={`
        relative flex items-center gap-4 p-4 rounded-2xl border
        transition-all duration-200 hover:shadow-md
        ${completado
          ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
          : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
        }
      `}
    >
      {/* Categoría badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 text-center leading-tight px-1">
          {habito.categoria.nombre.slice(0, 3).toUpperCase()}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            font-semibold truncate
            ${completado
              ? "line-through text-slate-400"
              : "text-slate-900 dark:text-slate-100"
            }
          `}
        >
          {habito.nombre}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {/* Puntos */}
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            +{habito.puntos} pts
          </span>

          {/* Racha */}
          <StreakBadge streak={rachaActual} size="sm" />
        </div>

        {/* Observación del día si existe */}
        {habito.registroHoy?.observacion && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
            📝 {habito.registroHoy.observacion}
          </p>
        )}
      </div>

      {/* Botón marcar */}
      <MarcarCompletadoBtn
        idHabito={habito.idHabito}
        completado={completado}
        fecha={hoy}
      />
    </div>
  );
}