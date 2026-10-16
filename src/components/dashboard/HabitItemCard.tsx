'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { 
  Check, 
  Flame, 
  Dumbbell, 
  Droplets, 
  Utensils, 
  Moon, 
  BookOpen, 
  Heart, 
  Sparkles,
  Loader2,
  Lock,
  Clock
} from 'lucide-react';
import { marcarCompletadoAction, desmarcarCompletadoAction } from '@/actions/registro.actions';
import { HabitDetailModal } from '@/components/modals/HabitDetailModal';
import { getLocalDateString } from '@/lib/date-utils';

interface HabitItemCardProps {
  habito: any;
  rachaActual?: number;
  completedDates?: string[];
  selectedDate: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCompletedOnSelectedDate: boolean;
  onToggleComplete?: (idHabito: string, newCompleted: boolean) => void;
  onProgressUpdate?: (idHabito: string, newProgress: number, isCompleted: boolean) => void;
  onArchive?: (idHabito: string) => void;
  onDelete?: (idHabito: string) => void;
}

export function HabitItemCard({
  habito,
  rachaActual = 0,
  completedDates = [],
  selectedDate,
  isToday,
  isPast,
  isFuture,
  isCompletedOnSelectedDate,
  onToggleComplete,
  onProgressUpdate,
  onArchive,
  onDelete,
}: HabitItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const idHabito = habito.idHabito || habito.idhabito;
  const nombre = habito.nombre;
  const descripcion = habito.descripcion;
  const metaDiaria = habito.metaDiaria ?? habito.meta_diaria ?? 1;
  const unidadMedida = habito.unidadMedida ?? habito.unidad_medida ?? 'veces';

  const categoriaNombre = 
    habito.categoria?.nombre || 
    habito.categorias_habitos?.nombre || 
    'General';

  const catLower = categoriaNombre.toLowerCase();
  
  // Icono y colores según categoría
  let CategoryIcon = Sparkles;
  let iconBg = 'bg-[#e6deff] dark:bg-indigo-950/70 text-[#572de4] dark:text-indigo-300';

  if (catLower.includes('agua') || catLower.includes('hidrat')) {
    CategoryIcon = Droplets;
    iconBg = 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300';
  } else if (catLower.includes('ejercicio') || catLower.includes('deporte') || catLower.includes('fitness')) {
    CategoryIcon = Dumbbell;
    iconBg = 'bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300';
  } else if (catLower.includes('aliment') || catLower.includes('nutri') || catLower.includes('comida')) {
    CategoryIcon = Utensils;
    iconBg = 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300';
  } else if (catLower.includes('mente') || catLower.includes('medita') || catLower.includes('paz')) {
    CategoryIcon = Heart;
    iconBg = 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300';
  } else if (catLower.includes('lectura') || catLower.includes('estudio') || catLower.includes('libro')) {
    CategoryIcon = BookOpen;
    iconBg = 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300';
  } else if (catLower.includes('sueño') || catLower.includes('descanso') || catLower.includes('dormir')) {
    CategoryIcon = Moon;
    iconBg = 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300';
  }

  // Estado local para cuando estamos en Hoy
  const [completadoHoy, setCompletadoHoy] = useState(
    habito.registroHoy?.completado ?? false
  );
  const [progresoHoy, setProgresoHoy] = useState(
    habito.registroHoy?.progresoActual ?? (habito.registroHoy?.completado ? metaDiaria : 0)
  );

  useEffect(() => {
    const isComp = habito.registroHoy?.completado ?? false;
    const prog = habito.registroHoy?.progresoActual ?? (isComp ? metaDiaria : 0);
    setCompletadoHoy(isComp);
    setProgresoHoy(prog);
  }, [habito.registroHoy?.completado, habito.registroHoy?.progresoActual, metaDiaria]);

  // Si estamos en hoy, usamos el estado local de hoy; de lo contrario, el registro histórico del día seleccionado
  const isCompleted = isToday ? completadoHoy : isCompletedOnSelectedDate;
  const progresoActual = isToday ? progresoHoy : (isCompleted ? metaDiaria : 0);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Solo se permite marcar si es HOY
    if (!isToday) return;

    const nextState = !completadoHoy;
    const nextProg = nextState ? metaDiaria : 0;
    setCompletadoHoy(nextState);
    setProgresoHoy(nextProg);

    if (onToggleComplete) {
      onToggleComplete(idHabito, nextState);
    }
    if (onProgressUpdate) {
      onProgressUpdate(idHabito, nextProg, nextState);
    }

    startTransition(async () => {
      const todayDateStr = getLocalDateString(new Date());
      const formData = new FormData();
      formData.set('idHabito', idHabito);
      formData.set('fecha', todayDateStr);

      if (nextState) {
        formData.set('observacion', 'Completado desde el dashboard');
        const res = await marcarCompletadoAction(null, formData);
        if (!res.success) {
          setCompletadoHoy(false);
          setProgresoHoy(0);
          if (onToggleComplete) onToggleComplete(idHabito, false);
          if (onProgressUpdate) onProgressUpdate(idHabito, 0, false);
        }
      } else {
        const res = await desmarcarCompletadoAction(null, formData);
        if (!res.success) {
          setCompletadoHoy(true);
          setProgresoHoy(metaDiaria);
          if (onToggleComplete) onToggleComplete(idHabito, true);
          if (onProgressUpdate) onProgressUpdate(idHabito, metaDiaria, true);
        }
      }
    });
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`
          group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl
          bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#161f33]
          transition-all duration-200 cursor-pointer
          border border-slate-200/80 dark:border-slate-800
          shadow-[0_1px_3px_rgba(121,117,130,0.04),0_4px_12px_rgba(121,117,130,0.03)]
          hover:shadow-[0_6px_20px_rgba(112,78,253,0.08)]
        `}
      >
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Icono de Categoría */}
          <div
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
              group-hover:scale-105 transition-transform ${iconBg}
            `}
          >
            <CategoryIcon className="w-6 h-6" />
          </div>

          {/* Información del Hábito */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`
                  text-base sm:text-lg font-bold truncate leading-tight
                  ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}
                `}
              >
                {nombre}
              </span>

              {/* Racha Badge (Solo se muestra si es mayor a 0) */}
              {rachaActual > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdbd0] dark:bg-amber-950/80 text-[#9b340a] dark:text-amber-300 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {rachaActual}d racha
                </span>
              )}

              {/* Meta / Progreso */}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isCompleted ? `${metaDiaria}/${metaDiaria} hecho` : `${progresoActual}/${metaDiaria} ${unidadMedida}`}
              </span>

              {/* Badge indicativo si no es hoy */}
              {isPast && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {isCompleted ? 'Completado' : 'No completado'}
                </span>
              )}
              {isFuture && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  Programado
                </span>
              )}
            </div>

            {descripcion && (
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                {descripcion}
              </span>
            )}
          </div>
        </div>

        {/* Botón de Completar (Check) o Indicador de Estado */}
        <div className="flex items-center ml-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isToday ? (
            /* Botón interactivo para el día de HOY */
            <button
              onClick={handleToggle}
              disabled={isPending}
              title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
              type="button"
              className={`
                w-11 h-11 rounded-full flex items-center justify-center
                transition-all duration-200
                ${
                  isCompleted
                    ? 'bg-[#572de4] text-white shadow-[0_4px_14px_rgba(87,45,228,0.35)] scale-105 hover:scale-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#572de4] hover:bg-slate-200 dark:hover:bg-slate-700 ring-1 ring-slate-200/80 dark:ring-slate-700'
                }
              `}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className={`w-5 h-5 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-60'}`} />
              )}
            </button>
          ) : isPast ? (
            /* Indicador deshabilitado / Solo Lectura para DÍAS PASADOS */
            <div
              className={`
                w-11 h-11 rounded-full flex items-center justify-center opacity-75 cursor-not-allowed
                ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700'
                }
              `}
              title={
                isCompleted
                  ? `Completado el ${selectedDate} (Histórico - solo lectura)`
                  : `No completado el ${selectedDate} (Histórico - solo lectura)`
              }
            >
              {isCompleted ? (
                <Check className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <Lock className="w-4 h-4 opacity-50" />
              )}
            </div>
          ) : (
            /* Indicador para DÍAS FUTUROS */
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 opacity-60 cursor-not-allowed"
              title={`Hábito programado para el ${selectedDate}. Solo se puede marcar el día correspondiente.`}
            >
              <Clock className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <HabitDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habito={{
          ...habito,
          registroHoy: {
            ...(habito.registroHoy || {}),
            progresoActual: progresoHoy,
            completado: completadoHoy,
          },
        }}
        rachaActual={rachaActual}
        completedDates={completedDates}
        onProgressUpdate={(id, newProgress, isComp) => {
          setProgresoHoy(newProgress);
          setCompletadoHoy(isComp);
          if (onProgressUpdate) onProgressUpdate(id, newProgress, isComp);
        }}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </>
  );
}
