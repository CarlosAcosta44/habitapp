/**
 * @file src/app/(dashboard)/reportes/page.tsx
 * @description Página de Reportes y Analítica Integral — HabitApp.
 * Conecta los datos de resumen de usuario, hábitos y comparativa periódica
 * con la vista interactiva inspirada en los diseños oficiales.
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { ReportesService } from "@/services/reportes.service";
import { HabitoService } from "@/services/habito.service";
import { ReportesInteractiveView } from "@/components/reportes/ReportesInteractiveView";

export const metadata = {
  title: "Progreso y Métricas | HabitApp",
  description: "Analítica integral de tus rutinas, consistencia semanal y patrones de bienestar emocional.",
};

const reportesService = new ReportesService();
const habitoService = new HabitoService();

interface ReportesPageProps {
  searchParams?: Promise<{ period?: string }> | { period?: string };
}

const DEFAULT_COLORS = ['#2563EB', '#7C3AED', '#059669', '#EA580C', '#EC4899', '#0284C7'];

export default async function ReportesPage({ searchParams }: ReportesPageProps) {
  const user = await requireUser();
  const resolvedParams = searchParams ? await searchParams : {};
  const rawPeriod = resolvedParams.period;

  const validPeriod: 'week' | 'month' | 'year' =
    rawPeriod === 'month' || rawPeriod === 'year' ? rawPeriod : 'week';

  const [statsResult, habitosResult, comparativaResult, activeHabitsResult] = await Promise.all([
    reportesService.getEstadisticas(user.id, validPeriod),
    reportesService.getHabitosReporte(user.id),
    reportesService.getComparativaSemanal(user.id),
    habitoService.getAll("Activo"),
  ]);

  const stats = statsResult.success ? statsResult.data : null;

  // Fallback a los hábitos activos del usuario en caso de que el reporte de 30 días venga vacío o falle
  const fallbackHabitos =
    activeHabitsResult.success && Array.isArray(activeHabitsResult.data)
      ? activeHabitsResult.data.map((h: any, idx: number) => ({
          idHabito: h.idHabito || h.idhabito,
          nombre: h.nombre,
          descripcion:
            h.descripcion ||
            (h.metaDiaria ? `Meta: ${h.metaDiaria} al día` : 'Hábito activo'),
          progreso: typeof h.progreso === 'number' ? h.progreso : 0,
          porcentajeCambio: `${typeof h.progreso === 'number' ? h.progreso : 0}%`,
          color: h.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        }))
      : [];

  const habitos =
    habitosResult.success && Array.isArray(habitosResult.data) && habitosResult.data.length > 0
      ? habitosResult.data
      : fallbackHabitos;

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
    <ReportesInteractiveView
      stats={stats}
      habitos={habitos}
      comparativa={comparativa}
    />
  );
}
