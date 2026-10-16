'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { DailyQuote } from '@/domain/quote.types';
import type { Reto } from '@/domain/reto.types';
import { getLocalDateString } from '@/lib/date-utils';

import { MotivationalBanner } from './MotivationalBanner';
import { TodayHabitsList } from './TodayHabitsList';
import { ActiveChallengesWidget } from './ActiveChallengesWidget';
import { StreakWidget } from './StreakWidget';
import { ArchivedHabitsWidget } from './ArchivedHabitsWidget';

interface DashboardInteractiveViewProps {
  quote: DailyQuote;
  initialHabitos: any[];
  allHabitos?: any[];
  registros: {
    idhabito?: string;
    idHabito?: string;
    fecha: string;
    completado: boolean;
  }[];
  retos: Reto[];
  totalArchivados: number;
  rachasMap: Record<string, number>;
  rachaGlobalReal: number;
  semanaChecks: {
    dia: string;
    activo: boolean;
    esHoy: boolean;
  }[];
}

export function DashboardInteractiveView({
  quote,
  initialHabitos,
  allHabitos = [],
  registros,
  retos,
  totalArchivados,
  rachasMap,
  rachaGlobalReal,
  semanaChecks,
}: DashboardInteractiveViewProps) {
  // Fecha de HOY en la zona horaria local real (YYYY-MM-DD)
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  // Día seleccionado por el usuario (por defecto: hoy)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Estado local de los hábitos de hoy para feedback instantáneo al togglear
  const [habitos, setHabitos] = useState(initialHabitos);

  // Sincronizar habitos cuando el server revalida
  useEffect(() => {
    setHabitos(initialHabitos);
  }, [initialHabitos]);

  // Contador local de hábitos archivados
  const [totalArchivadosCount, setTotalArchivadosCount] = useState(totalArchivados);

  useEffect(() => {
    setTotalArchivadosCount(totalArchivados);
  }, [totalArchivados]);

  // Callback cuando se marca/desmarca un hábito hoy
  const handleToggleTodayHabit = (idHabito: string, newCompleted: boolean) => {
    setHabitos((prev) =>
      prev.map((h) => {
        const id = h.idHabito || h.idhabito;
        if (id === idHabito) {
          const meta = h.metaDiaria ?? h.meta_diaria ?? 1;
          return {
            ...h,
            registroHoy: {
              ...(h.registroHoy || {}),
              progresoActual: newCompleted ? meta : 0,
              completado: newCompleted,
            },
          };
        }
        return h;
      })
    );
  };

  // Callback cuando se incrementa o decrementa el progreso numérico
  const handleProgressUpdate = (idHabito: string, newProgress: number, isCompleted: boolean) => {
    setHabitos((prev) =>
      prev.map((h) => {
        const id = h.idHabito || h.idhabito;
        if (id === idHabito) {
          return {
            ...h,
            registroHoy: {
              ...(h.registroHoy || {}),
              progresoActual: newProgress,
              completado: isCompleted,
            },
          };
        }
        return h;
      })
    );
  };

  // Callback cuando se archiva un hábito
  const handleHabitArchived = (idHabito: string) => {
    setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== idHabito));
    setTotalArchivadosCount((prev) => prev + 1);
  };

  // Callback cuando se elimina un hábito
  const handleHabitDeleted = (idHabito: string) => {
    setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== idHabito));
  };

  // Callback cuando se reactiva un hábito desde el modal de archivados
  const handleHabitReactivated = (_idHabito: string) => {
    setTotalArchivadosCount((prev) => Math.max(0, prev - 1));
  };

  // Mapa de idHabito -> completado para el día seleccionado
  const recordsMapByHabitId = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const r of registros) {
      if (r.fecha === selectedDate && r.completado) {
        const id = r.idHabito || r.idhabito;
        if (id) {
          map[id] = true;
        }
      }
    }
    return map;
  }, [registros, selectedDate]);

  // Mapa de idHabito -> array de fechas (ISO) completadas para mostrar historial real
  const completedDatesByHabitId = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of registros) {
      if (r.completado && r.fecha) {
        const id = r.idHabito || r.idhabito;
        if (id) {
          if (!map[id]) map[id] = [];
          map[id].push(r.fecha);
        }
      }
    }
    return map;
  }, [registros]);

  // Hábitos que se deben mostrar en la fecha seleccionada
  // (En días pasados se preservan los hábitos que tuvieron registros completados ese día)
  const displayedHabitos = useMemo(() => {
    if (selectedDate === todayStr) {
      return habitos;
    }
    const pool = (allHabitos && allHabitos.length > 0) ? allHabitos : habitos;
    const seenIds = new Set<string>();
    const list: any[] = [];

    // Primero los que tuvieron registro ese día
    for (const h of pool) {
      const id = h.idHabito || h.idhabito;
      if (id && recordsMapByHabitId[id]) {
        seenIds.add(id);
        list.push(h);
      }
    }

    // Luego los activos actuales
    for (const h of habitos) {
      const id = h.idHabito || h.idhabito;
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        list.push(h);
      }
    }

    return list;
  }, [selectedDate, todayStr, habitos, allHabitos, recordsMapByHabitId]);

  // Lista de todas las fechas con algún hábito completado para los dots del calendario
  const diasConRegistro = useMemo(() => {
    const dates = new Set(
      registros.filter((r) => r.completado).map((r) => r.fecha)
    );
    // Si hoy hay algún hábito completado en el estado local, agregamos hoy
    if (habitos.some((h) => h.registroHoy?.completado)) {
      dates.add(todayStr);
    }
    return Array.from(dates);
  }, [registros, habitos, todayStr]);

  // Cantidad de completados en la fecha seleccionada
  const completadosEnFecha = useMemo(() => {
    if (selectedDate === todayStr) {
      return habitos.filter((h) => h.registroHoy?.completado).length;
    }
    return displayedHabitos.filter((h) => {
      const id = h.idHabito || h.idhabito;
      return recordsMapByHabitId[id] === true;
    }).length;
  }, [selectedDate, todayStr, habitos, displayedHabitos, recordsMapByHabitId]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      {/* ── Banner Principal con Paisaje Adaptativo + Frase + Progreso + Selector Semanal ── */}
      <MotivationalBanner
        quote={quote}
        completados={completadosEnFecha}
        total={displayedHabitos.length}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        diasConRegistro={diasConRegistro}
      />

      {/* ── Cuadrícula Principal: Hábitos a la izquierda, Widgets a la derecha (en móvil retos fluye debajo) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Principal: Lista de Hábitos del Día Seleccionado */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TodayHabitsList
            habitos={displayedHabitos}
            rachasMap={rachasMap}
            selectedDate={selectedDate}
            todayStr={todayStr}
            recordsMapByHabitId={recordsMapByHabitId}
            completedDatesByHabitId={completedDatesByHabitId}
            onToggleTodayHabit={handleToggleTodayHabit}
            onProgressUpdate={handleProgressUpdate}
            onArchive={handleHabitArchived}
            onDelete={handleHabitDeleted}
          />
        </div>

        {/* Columna Lateral (Widgets) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ActiveChallengesWidget retos={retos} />
          <StreakWidget
            rachaActual={rachaGlobalReal}
            diasSemana={semanaChecks}
          />
          <ArchivedHabitsWidget
            totalArchivados={totalArchivadosCount}
            onHabitReactivated={handleHabitReactivated}
            onHabitDeleted={handleHabitDeleted}
          />
        </div>
      </div>
    </div>
  );
}
