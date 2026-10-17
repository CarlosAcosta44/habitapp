'use client';

import React, { useState } from 'react';
import { Archive, ChevronRight } from 'lucide-react';
import { ArchivedHabitsModal } from '@/components/modals/ArchivedHabitsModal';

interface ArchivedHabitsWidgetProps {
  readonly totalArchivados?: number;
  readonly onHabitReactivated?: (idHabito: string) => void;
  readonly onHabitDeleted?: (idHabito: string) => void;
}

export function ArchivedHabitsWidget({
  totalArchivados = 0,
  onHabitReactivated,
  onHabitDeleted,
}: ArchivedHabitsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#161f33] transition-all duration-200 shadow-[0_1px_3px_rgba(121,117,130,0.04),0_4px_12px_rgba(121,117,130,0.03)] hover:shadow-[0_6px_20px_rgba(112,78,253,0.08)] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-[#572de4] group-hover:bg-[#e6deff] dark:group-hover:bg-indigo-950/80 transition-colors">
            <Archive className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#572de4] dark:group-hover:text-indigo-300 transition-colors">
              Hábitos archivados
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {totalArchivados === 1 ? '1 hábito guardado' : `${totalArchivados} hábitos guardados`}
            </span>
          </div>
        </div>
        <div className="text-slate-400 group-hover:text-[#572de4] dark:group-hover:text-indigo-400 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      <ArchivedHabitsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReactivate={onHabitReactivated}
        onDelete={onHabitDeleted}
      />
    </>
  );
}
