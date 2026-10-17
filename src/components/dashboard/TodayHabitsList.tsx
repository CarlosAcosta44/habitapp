'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, Lock } from 'lucide-react';
import { HabitItemCard } from './HabitItemCard';
import { NewHabitModal } from '@/components/modals/NewHabitModal';

interface TodayHabitsListProps {
  readonly habitos: any[];
  readonly rachasMap: Record<string, number>;
  readonly selectedDate: string;
  readonly todayStr: string;
  readonly recordsMapByHabitId: Record<string, boolean>; // idHabito -> completado
  readonly completedDatesByHabitId?: Record<string, string[]>;
  readonly onToggleTodayHabit?: (idHabito: string, newCompleted: boolean) => void;
  readonly onProgressUpdate?: (idHabito: string, newProgress: number, isCompleted: boolean) => void;
  readonly onArchive?: (idHabito: string) => void;
  readonly onDelete?: (idHabito: string) => void;
}

function getTodayBadgeText(total: number, pendientes: number): string {
  if (total === 0) return '0 hábitos';
  if (pendientes === 0) return '¡Todo completado! 🎉';
  return `${pendientes} ${pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
}

export function TodayHabitsList({
  habitos,
  rachasMap,
  selectedDate,
  todayStr,
  recordsMapByHabitId,
  completedDatesByHabitId = {},
  onToggleTodayHabit,
  onProgressUpdate,
  onArchive,
  onDelete,
}: TodayHabitsListProps) {
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);

  const isToday = selectedDate === todayStr;
  const isPast = selectedDate < todayStr;
  const isFuture = selectedDate > todayStr;

  // En el día seleccionado, cuántos están completados
  const completadosEnFecha = habitos.filter((h) => {
    const id = h.idHabito || h.idhabito;
    if (isToday) {
      return h.registroHoy?.completado ?? false;
    }
    return recordsMapByHabitId[id] === true;
  }).length;

  const pendientesHoy = habitos.filter(
    (h) => !h.registroHoy?.completado
  ).length;

  // Formato legible de la fecha seleccionada
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const fechaLegible = dateObj.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {isToday ? 'Hábitos de hoy' : `Hábitos del ${fechaLegible}`}
            </h2>

            {/* Badge de Estado del Día */}
            {isToday ? (
              <span
                className={`
                  px-2.5 py-0.5 rounded-full text-xs font-bold
                  ${
                    pendientesHoy === 0 && habitos.length > 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-[#e6deff] text-[#1b065c] dark:bg-indigo-950/80 dark:text-indigo-200'
                  }
                `}
              >
                {getTodayBadgeText(habitos.length, pendientesHoy)}
              </span>
            ) : isPast ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Lock className="w-3 h-3 opacity-60" />
                Histórico ({completadosEnFecha}/{habitos.length} cumplidos)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Calendar className="w-3 h-3" />
                Programado
              </span>
            )}
          </div>

          <button
            onClick={() => setIsNewHabitModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#572de4]/10 hover:bg-[#572de4]/20 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-[#572de4] dark:text-indigo-300 font-bold text-xs transition-all active:scale-95"
            type="button"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar hábito</span>
          </button>
        </div>

        {/* Banner informativo cuando no es hoy */}
        {!isToday && (
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            {isPast ? (
              <>
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>
                  Estás visualizando un día anterior. Los registros pasados son de <strong>solo lectura</strong> para mantener la integridad de tu historial.
                </span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  Estás visualizando un día futuro. Los hábitos solo se pueden marcar cuando llegue el día correspondiente.
                </span>
              </>
            )}
          </div>
        )}

        {/* Lista de Hábitos */}
        <div className="flex flex-col gap-3">
          {habitos.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#e6deff] dark:bg-indigo-950/80 flex items-center justify-center text-[#572de4] dark:text-indigo-300 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No tienes hábitos activos aún
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Crea tu primer hábito para comenzar a construir tu rutina diaria y alcanzar tus metas.
              </p>
              <button
                onClick={() => setIsNewHabitModalOpen(true)}
                className="mt-4 px-4 py-2.5 rounded-2xl bg-[#572de4] hover:bg-[#4823c9] text-white text-xs font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                type="button"
              >
                <Plus className="w-4 h-4" />
                <span>Crear mi primer hábito</span>
              </button>
            </div>
          ) : (
            habitos.map((habito) => {
              const id = habito.idHabito || habito.idhabito;
              const isCompletedOnDate = isToday
                ? (habito.registroHoy?.completado ?? false)
                : (recordsMapByHabitId[id] === true);

              return (
                <HabitItemCard
                  key={id}
                  habito={habito}
                  rachaActual={rachasMap[id] ?? 0}
                  completedDates={completedDatesByHabitId[id] ?? []}
                  selectedDate={selectedDate}
                  isToday={isToday}
                  isPast={isPast}
                  isFuture={isFuture}
                  isCompletedOnSelectedDate={isCompletedOnDate}
                  onToggleComplete={onToggleTodayHabit}
                  onProgressUpdate={onProgressUpdate}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              );
            })
          )}
        </div>

        {/* Botón rápido "+ Añadir un nuevo hábito para tu rutina..." */}
        {habitos.length > 0 && (
          <button
            type="button"
            onClick={() => setIsNewHabitModalOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#161f33] transition-colors border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-[#572de4] dark:group-hover:text-indigo-300 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#e6deff] dark:group-hover:bg-indigo-950 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">
                Añadir un nuevo hábito para tu rutina...
              </span>
            </div>
            <span className="text-xs font-bold text-[#572de4] dark:text-indigo-400 group-hover:underline hidden sm:inline-block">
              Configurar hábito
            </span>
          </button>
        )}
      </div>

      <NewHabitModal
        isOpen={isNewHabitModalOpen}
        onClose={() => setIsNewHabitModalOpen(false)}
      />
    </>
  );
}
