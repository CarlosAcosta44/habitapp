/**
 * @file src/components/registros/DailyProgress.tsx
 * @description Barra de progreso diario de hábitos.
 * Muestra cuántos hábitos completó el usuario hoy.
 */

interface DailyProgressProps {
  completados: number;
  total:       number;
}

export function DailyProgress({ completados, total }: DailyProgressProps) {
  const porcentaje = total === 0
    ? 0
    : Math.round((completados / total) * 100);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Progreso de hoy
        </h2>
        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {porcentaje}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {completados} de {total} hábitos completados
      </p>
    </div>
  );
}