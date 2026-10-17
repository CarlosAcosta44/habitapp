import React from 'react';
import { Flame, Check } from 'lucide-react';

interface StreakWidgetProps {
  rachaActual: number;
  diasSemana: {
    dia: string;
    activo: boolean;
    esHoy: boolean;
  }[];
}

function getDayCircleClass(activo: boolean, esHoy: boolean): string {
  if (activo) {
    return 'bg-[#572de4] text-white shadow-[0_2px_8px_rgba(87,45,228,0.3)]';
  }
  if (esHoy) {
    return 'bg-[#e6deff] dark:bg-indigo-950 text-[#572de4] ring-2 ring-[#572de4]/30';
  }
  return 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-400';
}

export function StreakWidget({ rachaActual, diasSemana }: StreakWidgetProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(121,117,130,0.04),0_4px_12px_rgba(121,117,130,0.03)] border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Racha actual
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdbd0] dark:bg-amber-950/80 text-[#9b340a] dark:text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 fill-current" />
          {rachaActual} {rachaActual === 1 ? 'día de racha' : 'días de racha'}
        </span>
      </div>

      {/* Week Day Checks */}
      <div className="w-full flex items-center justify-between gap-1 px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        {diasSemana.map((d) => (
          <div key={d.dia} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <span
              className={`text-[11px] font-bold ${
                d.esHoy ? 'text-[#572de4] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {d.dia}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${getDayCircleClass(d.activo, d.esHoy)}`}
            >
              {d.activo ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
