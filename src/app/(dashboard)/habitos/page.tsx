/**
 * @file src/app/(dashboard)/habitos/page.tsx
 * @description Dashboard Diario de Hábitos — Pantalla principal.
 * Server Component: obtiene datos de forma paralela y limpia usando Clean Architecture.
 */

import { requireUserStrict as requireUser } from "@/lib/auth/require-user";
import { HabitoService } from "@/services/habito.service";
import { RegistroService } from "@/services/registro.service";
import { quoteService } from "@/services/quote.service";
import { ComunidadService } from "@/services/comunidad.service";
import { getLocalDateString } from "@/lib/date-utils";
import { DashboardInteractiveView } from "@/components/dashboard/DashboardInteractiveView";

export const metadata = { 
  title: "Dashboard Diario | HabitApp — Salud Mental & Hábitos",
  description: "Monitorea tus hábitos diarios, mantén tu racha activa y participa en retos de la comunidad."
};

const habitoService = new HabitoService();
const registroService = new RegistroService();
const comunidadService = new ComunidadService();

/**
 * Calcula la racha real del usuario en días consecutivos finalizando hoy o ayer.
 */
function calculateRealStreak(
  registros: { fecha: string; completado: boolean }[],
  todayStr: string
): number {
  const completedDates = new Set(
    registros.filter((r) => r.completado).map((r) => r.fecha)
  );

  if (completedDates.size === 0) return 0;

  const [year, month, day] = todayStr.split("-").map(Number);
  const todayDate = new Date(year, month - 1, day);
  const ayerDate = new Date(todayDate);
  ayerDate.setDate(todayDate.getDate() - 1);
  const ayerStr = getLocalDateString(ayerDate);

  const hasToday = completedDates.has(todayStr);
  const hasYesterday = completedDates.has(ayerStr);

  if (!hasToday && !hasYesterday) {
    return 0;
  }

  const currentCheck = hasToday ? new Date(todayDate) : ayerDate;
  let streak = 0;

  while (true) {
    const iso = getLocalDateString(currentCheck);
    if (completedDates.has(iso)) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default async function HabitosDashboardPage() {
  // ── 1. Verificar sesión ─────────────────────────────────────────────────────
  await requireUser();

  // ── 2. Obtener datos en paralelo para máxima velocidad ───────────────────────
  const [
    habitosResult,
    quoteResult,
    retosResult,
    historialResult,
    archivadosResult,
  ] = await Promise.all([
    habitoService.getDashboard(),
    quoteService.getDailyQuote(),
    comunidadService.getRetos(),
    registroService.getHistorialUsuario(),
    habitoService.getAll("Inactivo"),
  ]);

  const habitos = habitosResult.success && Array.isArray(habitosResult.data) ? habitosResult.data : [];
  const quote = quoteResult.success && quoteResult.data
    ? quoteResult.data
    : { phrase: "Transforma tus metas en hábitos y tus hábitos en realidad.", author: "HabitApp" };
  const retos = retosResult.success && Array.isArray(retosResult.data) ? retosResult.data : [];
  const registrosReales = historialResult.success && Array.isArray(historialResult.data) ? historialResult.data : [];
  const archivados = archivadosResult.success && Array.isArray(archivadosResult.data) ? archivadosResult.data : [];
  const totalArchivados = archivados.length;
  const allHabitos = [...habitos, ...archivados];

  // ── 3. Calcular rachas reales para cada hábito individual ────────────────────
  const rachasMap: Record<string, number> = {};
  await Promise.all(
    habitos.map(async (h) => {
      const id = h.idHabito || h.idhabito;
      if (id) {
        const rachaRes = await registroService.getRacha(id);
        rachasMap[id] = rachaRes.success && typeof rachaRes.data?.rachaActual === 'number'
          ? rachaRes.data.rachaActual
          : (h.rachaActual ?? 0);
      }
    })
  );

  // ── 4. Calcular racha global real del usuario ───────────────────────────────
  const hoyStr = getLocalDateString(new Date());
  const rachaGlobalReal = calculateRealStreak(registrosReales, hoyStr);

  // ── 5. Checks de la semana actual (Lunes a Domingo) ─────────────────────────
  const diasCompletados = new Set(
    registrosReales.filter((r) => r.completado).map((r) => r.fecha)
  );

  const now = new Date();
  const currentDay = now.getDay();
  const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distToMonday);

  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const semanaChecks = dayLabels.map((diaLabel, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = getLocalDateString(d);
    return {
      dia: diaLabel,
      activo: diasCompletados.has(iso),
      esHoy: iso === hoyStr,
    };
  });

  return (
    <DashboardInteractiveView
      quote={quote}
      initialHabitos={habitos}
      allHabitos={allHabitos}
      registros={registrosReales}
      retos={retos}
      totalArchivados={totalArchivados}
      rachasMap={rachasMap}
      rachaGlobalReal={rachaGlobalReal}
      semanaChecks={semanaChecks}
    />
  );
}