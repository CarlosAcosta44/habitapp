import React from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight } from 'lucide-react';
import type { Reto } from '@/domain/reto.types';

interface ActiveChallengesWidgetProps {
  retos: Reto[];
}

export function ActiveChallengesWidget({ retos }: ActiveChallengesWidgetProps) {
  // Mostramos hasta 3 retos activos
  const displayRetos = retos.slice(0, 3);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(121,117,130,0.04),0_4px_12px_rgba(121,117,130,0.03)] border border-slate-200/80 dark:border-slate-800 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#572de4] dark:text-indigo-400" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Tus Retos Activos
          </h3>
        </div>
        <Link
          href="/retos"
          className="text-xs sm:text-sm font-bold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-0.5"
        >
          <span>Ver todos</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {displayRetos.length === 0 ? (
          <div className="py-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No tienes retos en curso.
            </p>
            <Link
              href="/retos"
              className="mt-2 inline-block text-xs font-bold text-[#572de4] dark:text-indigo-400 hover:underline"
            >
              Explorar desafíos ✨
            </Link>
          </div>
        ) : (
          displayRetos.map((reto, index) => {
            const defaultProgress = [35, 60, 20];
            const progressColors = ['bg-[#572de4]', 'bg-[#796cbd]', 'bg-emerald-500'];
            const progress = reto.progreso ?? defaultProgress[index % defaultProgress.length];
            const color = progressColors[index % progressColors.length];

            return (
              <Link
                key={reto.idreto}
                href="/retos"
                className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {reto.titulo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e6deff] dark:bg-indigo-950/80 text-[#1b065c] dark:text-indigo-200 text-[11px] font-bold flex-shrink-0">
                    {reto.puntos_recompensa ? `${reto.puntos_recompensa} pts` : 'Activo'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {reto.descripcion}
                </p>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {progress}%
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
