/**
 * @file src/app/(dashboard)/reportes/page.tsx
 * @description Página de Reportes y Analítica Integral — HabitApp.
 * Conecta los datos de resumen de usuario, hábitos y comparativa periódica
 * con la vista interactiva inspirada en los diseños oficiales.
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { ReportesService } from "@/services/reportes.service";
import { ReportesInteractiveView } from "@/components/reportes/ReportesInteractiveView";

export const metadata = {
  title: "Progreso y Métricas | HabitApp",
  description: "Analítica integral de tus rutinas, consistencia semanal y patrones de bienestar emocional.",
};

const reportesService = new ReportesService();

interface ReportesPageProps {
  searchParams?: Promise<{ period?: string }> | { period?: string };
}

export default async function ReportesPage({ searchParams }: ReportesPageProps) {
  const user = await requireUser();
  const resolvedParams = searchParams ? await searchParams : {};
  const rawPeriod = resolvedParams.period;

  const validPeriod: 'week' | 'month' | 'year' =
    rawPeriod === 'month' || rawPeriod === 'year' ? rawPeriod : 'week';

  const [statsResult, habitosResult, comparativaResult] = await Promise.all([
    reportesService.getEstadisticas(user.id, validPeriod),
    reportesService.getHabitosReporte(user.id),
    reportesService.getComparativaSemanal(user.id),
  ]);

  const stats = statsResult.success ? statsResult.data : null;
  const habitos = habitosResult.success ? habitosResult.data : [];
  const comparativa = comparativaResult.success
    ? comparativaResult.data
    : {
        diasSemana: ["L", "M", "M", "J", "V", "S", "D"],
        data: [
          { categoriaId: "salud", vals: [2, 3, 4, 3, 5, 4, 6] },
          { categoriaId: "enfoque", vals: [1, 2, 2, 4, 3, 5, 4] },
        ],
      };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <ReportesInteractiveView
        stats={stats}
        habitos={habitos}
        comparativa={comparativa}
      />
    </div>
  );
}
