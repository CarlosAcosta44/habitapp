/**
 * @file src/components/registros/MarcarCompletadoBtn.tsx
 * @description Botón para marcar/desmarcar un hábito como completado hoy.
 * Usa useTransition para feedback inmediato sin bloquear la UI.
 *
 * @directive "use client" — necesita interactividad
 */

"use client";

import { useTransition } from "react";
import { 
  marcarCompletadoAction, 
  desmarcarCompletadoAction,
  avanzarProgresoAction
} from "@/actions/registro.actions";

interface MarcarCompletadoBtnProps {
  idHabito:    string;
  completado:  boolean;
  progresoActual: number;
  metaDiaria:  number;
  fecha:       string;   // "YYYY-MM-DD"
}

export function MarcarCompletadoBtn({
  idHabito,
  completado,
  progresoActual,
  metaDiaria,
  fecha,
}: MarcarCompletadoBtnProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation(); // Evitar que se abra el modal flotante si lo envolveremos luego en HabitCard

    startTransition(async () => {
      const formData = new FormData();
      formData.set("idHabito", idHabito);
      formData.set("fecha",    fecha);

      if (completado) {
        // Deshacemos todo
        await desmarcarCompletadoAction(null, formData);
      } else {
        // Avanzar el progreso (Fraccional)
        // Por regla de negocio añadimos 25% si es meta > 1 (o mínimo 1)
        let cantidad = 1;
        if (metaDiaria > 1) {
           cantidad = Math.max(1, Math.ceil(metaDiaria / 4));
        }

        formData.set("cantidadAsumar", cantidad.toString());
        formData.set("metaDiaria", metaDiaria.toString());
        await avanzarProgresoAction(null, formData);
      }
    });
  }

  return (
    <button
      id={`toggle-habito-${idHabito}`}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={completado ? "Desmarcar hábito" : "Marcar como completado"}
      className={`
        h-9 w-9 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 flex-shrink-0
        ${completado
          ? "bg-green-500 border-green-500 text-white"
          : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
        }
        ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {isPending  ? "⏳" : completado ? "✓" : ""}
    </button>
  );
}