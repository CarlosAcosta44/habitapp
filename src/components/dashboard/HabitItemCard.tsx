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
  Clock,
  X
} from 'lucide-react';
import { marcarCompletadoAction, desmarcarCompletadoAction } from '@/actions/registro.actions';
import { HabitDetailModal } from '@/components/modals/HabitDetailModal';
import { getLocalDateString } from '@/lib/date-utils';

interface HabitItemCardProps {
  readonly habito: any;
  readonly rachaActual?: number;
  readonly completedDates?: string[];
  readonly selectedDate: string;
  readonly isToday: boolean;
  readonly isPast: boolean;
  readonly isFuture: boolean;
  readonly isCompletedOnSelectedDate: boolean;
  readonly onToggleComplete?: (idHabito: string, newCompleted: boolean) => void;
  readonly onProgressUpdate?: (idHabito: string, newProgress: number, isCompleted: boolean) => void;
  readonly onArchive?: (idHabito: string) => void;
  readonly onDelete?: (idHabito: string) => void;
}

function getCategoryVisuals(catName: string) {
  const catLower = catName.toLowerCase();
  if (catLower.includes('agua') || catLower.includes('hidrat')) {
    return { Icon: Droplets, iconBg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300' };
  }
  if (catLower.includes('ejercicio') || catLower.includes('deporte') || catLower.includes('fitness')) {
    return { Icon: Dumbbell, iconBg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300' };
  }
  if (catLower.includes('aliment') || catLower.includes('nutri') || catLower.includes('comida')) {
    return { Icon: Utensils, iconBg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-300' };
  }
  if (catLower.includes('mente') || catLower.includes('medita') || catLower.includes('paz')) {
    return { Icon: Heart, iconBg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300' };
  }
  if (catLower.includes('lectura') || catLower.includes('estudio') || catLower.includes('libro')) {
    return { Icon: BookOpen, iconBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300' };
  }
  if (catLower.includes('sueño') || catLower.includes('descanso') || catLower.includes('dormir')) {
    return { Icon: Moon, iconBg: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300' };
  }
  return { Icon: Sparkles, iconBg: 'bg-[#e6deff] dark:bg-indigo-950/70 text-[#572de4] dark:text-indigo-300' };
}

interface HabitStatusActionProps {
  readonly isToday: boolean;
  readonly isPast: boolean;
  readonly isCompleted: boolean;
  readonly isPending: boolean;
  readonly selectedDate: string;
  readonly onToggle: (e: React.MouseEvent) => void;
}

function HabitStatusAction({
  isToday,
  isPast,
  isCompleted,
  isPending,
  selectedDate,
  onToggle,
}: HabitStatusActionProps) {
  if (isToday) {
    const todayBtnClass = isCompleted
      ? 'bg-[#572de4] text-white shadow-[0_4px_14px_rgba(87,45,228,0.35)] scale-105 hover:scale-100'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#572de4] hover:bg-slate-200 dark:hover:bg-slate-700 ring-1 ring-slate-200/80 dark:ring-slate-700';

    return (
      <button
        onClick={onToggle}
        disabled={isPending}
        title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}
        type="button"
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${todayBtnClass}`}
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Check className={`w-5 h-5 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-60'}`} />
        )}
      </button>
    );
  }

  if (isPast) {
    const pastCircleClass = isCompleted
      ? 'bg-emerald-500 text-white shadow-sm'
      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800/60';

    return (
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center cursor-not-allowed ${pastCircleClass}`}
        title={
          isCompleted
            ? `Completado el ${selectedDate} (Histórico)`
            : `No completado el ${selectedDate} (Histórico)`
        }
      >
        {isCompleted ? (
          <Check className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <X className="w-5 h-5 stroke-[2.5]" />
        )}
      </div>
    );
  }

  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 opacity-60 cursor-not-allowed"
      title={`Hábito programado para el ${selectedDate}. Solo se puede marcar el día correspondiente.`}
    >
      <Clock className="w-4 h-4" />
    </div>
  );
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

  const { Icon: CategoryIcon, iconBg } = getCategoryVisuals(categoriaNombre);

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

  const isCompleted = isToday ? completadoHoy : isCompletedOnSelectedDate;
  
  let progresoActual = 0;
  if (isToday) {
    progresoActual = progresoHoy;
  } else if (isCompleted) {
    progresoActual = metaDiaria;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        formData.set('progresoActual', nextProg.toString());
        await marcarCompletadoAction(null, formData);
      } else {
        await desmarcarCompletadoAction(null, formData);
      }
    });
  };

  const progressLabel = isCompleted
    ? `${metaDiaria}/${metaDiaria} hecho`
    : `${progresoActual}/${metaDiaria} ${unidadMedida}`;

  return (
    <>
      <div
        className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#161f33] transition-all duration-200 border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(121,117,130,0.04),0_4px_12px_rgba(121,117,130,0.03)] hover:shadow-[0_6px_20px_rgba(112,78,253,0.08)]"
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1 text-left cursor-pointer"
        >
          {/* Icono de Categoría */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${iconBg}`}
          >
            <CategoryIcon className="w-6 h-6" />
          </div>

          {/* Información del Hábito */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-base sm:text-lg font-bold truncate leading-tight ${
                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {nombre}
              </span>

              {/* Racha Badge */}
              {rachaActual > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdbd0] dark:bg-amber-950/80 text-[#9b340a] dark:text-amber-300 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {rachaActual}d racha
                </span>
              )}

              {/* Meta / Progreso */}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {progressLabel}
              </span>

              {/* Badge indicativo si no es hoy */}
              {isPast && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Completado</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 stroke-[3]" />
                      <span>No completado</span>
                    </>
                  )}
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
        </button>

        {/* Botón de Completar (Check) o Indicador de Estado */}
        <div className="flex items-center ml-3 flex-shrink-0">
          <HabitStatusAction
            isToday={isToday}
            isPast={isPast}
            isCompleted={isCompleted}
            isPending={isPending}
            selectedDate={selectedDate}
            onToggle={handleToggle}
          />
        </div>
      </div>

      <HabitDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habito={{
          ...habito,
          registroHoy: {
            ...habito.registroHoy,
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
