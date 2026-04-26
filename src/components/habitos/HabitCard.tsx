"use client";

/**
 * @file src/components/habitos/HabitCard.tsx
 * @description Tarjeta de hábito con progreso del día y racha.
 * Consume HabitoConProgreso de la Fase 3.
 */

import { useState } from "react";
import { StreakBadge }         from "@/components/habitos/StreakBadge";
import { MarcarCompletadoBtn } from "@/components/registros/MarcarCompletadoBtn";
import { HabitDetailModal }    from "@/components/modals/HabitDetailModal";
import type { HabitoConProgreso } from "@/types/domain/habito.types";
import { Droplets, Dumbbell, Flame, Leaf, MoonStar, Sparkles } from "lucide-react";

interface HabitCardProps {
  habito:    HabitoConProgreso;
  rachaActual: number;
}

export function HabitCard({ habito, rachaActual }: HabitCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const completado = habito.registroHoy?.completado ?? false;
  const progresoActual = habito.registroHoy?.progresoActual ?? 0;
  const metaDiaria = habito.metaDiaria;
  
  const hoy        = new Date().toISOString().split("T")[0];
  const nombreCategoria = habito.categoria.nombre.toLowerCase();
  const categoryIcon =
    nombreCategoria.includes("agua") ? Droplets :
    nombreCategoria.includes("ejercicio") ? Dumbbell :
    nombreCategoria.includes("sue") ? MoonStar :
    nombreCategoria.includes("plant") ? Leaf :
    Sparkles;

  // Barra de progreso fraccional
  const progressPercent = Math.min(100, Math.round((progresoActual / metaDiaria) * 100));

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`
          cursor-pointer
          relative p-4 rounded-3xl border transition-all duration-200 hover:shadow-md
        ${completado
          ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800"
          : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
            {(() => {
              const Icon = categoryIcon;
              return <Icon className="h-5 w-5" />;
            })()}
          </div>
          <div className="min-w-0">
            <p
              className={`
                font-bold truncate text-lg leading-tight
                ${completado
                  ? "text-slate-500 dark:text-slate-300 line-through"
                  : "text-slate-900 dark:text-slate-100"
                }
              `}
            >
              {habito.nombre}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">
              {habito.categoria.nombre}
            </p>
          </div>
        </div>

        <MarcarCompletadoBtn
          idHabito={habito.idHabito}
          completado={completado}
          progresoActual={progresoActual}
          metaDiaria={metaDiaria}
          fecha={hoy}
        />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 font-semibold">
            <Flame className="h-3 w-3" />
            {(progresoActual > 0 && progresoActual < metaDiaria) ? `${progresoActual}/${metaDiaria} ${habito.unidadMedida}` : `+${habito.puntos} pts`}
          </span>
          <StreakBadge streak={rachaActual} size="sm" />
        </div>

        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              completado ? "bg-indigo-500" : "bg-indigo-300 dark:bg-indigo-700"
            }`}
            style={{ width: `${Math.max(15, progressPercent)}%` }} // Base min width so they see it
          />
        </div>

        {habito.registroHoy?.observacion && (
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            📝 {habito.registroHoy.observacion}
          </p>
        )}
      </div>
    </div>
    
    <HabitDetailModal 
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       habito={habito}
       rachaActual={rachaActual}
    />
    </>
  );
}