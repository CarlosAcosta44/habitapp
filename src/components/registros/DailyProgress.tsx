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
  const progressDegrees = Math.max(0, Math.min(100, porcentaje)) * 3.6;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className="relative grid h-44 w-44 place-items-center rounded-full"
          style={{
            background: `conic-gradient(rgb(99 102 241) ${progressDegrees}deg, var(--progress-track, rgb(226 232 240)) 0deg)`,
          }}
        >
          <div className="grid h-36 w-36 place-items-center rounded-full bg-white dark:bg-slate-900">
            <p className="text-4xl font-black text-slate-900 dark:text-slate-100">{porcentaje}%</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              logrado
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-slate-100">
          Tu progreso de hoy
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {completados} de {total} habitos completados. Vas muy bien, manten el ritmo.
        </p>
      </div>
    </div>
  );
}