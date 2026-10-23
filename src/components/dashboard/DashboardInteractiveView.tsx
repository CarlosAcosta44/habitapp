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
  readonly quote: DailyQuote;
  readonly initialHabitos: any[];
  readonly allHabitos?: any[];
  readonly registros: any[];
  readonly retos: Reto[];
  readonly totalArchivados: number;
  readonly rachasMap: Record<string, number>;
  readonly rachaGlobalReal: number;
  readonly semanaChecks: {
    readonly dia: string;
    readonly activo: boolean;
    readonly esHoy: boolean;
  }[];
}

function filterHabitosForSelectedDate(
  selectedDate: string,
  todayStr: string,
  habitos: any[],
  allHabitosList: any[],
  registros: any[]
): any[] {
  const [y, m, d] = selectedDate.split('-').map(Number);
  const selDateObj = new Date(y, m - 1, d);
  const jsDay = selDateObj.getDay();
  // HabitApp convención: 1 = Lunes, ..., 7 = Domingo
  const habitDayOfWeek = jsDay === 0 ? 7 : jsDay;

  const isToday = selectedDate === todayStr;
  const isFuture = selectedDate > todayStr;
  const isPast = selectedDate < todayStr;

  if (isToday) {
    return habitos.filter((h) => {
      const days = h.diasSemana ?? h.dias_semana;
      if (Array.isArray(days) && days.length > 0) {
        return days.includes(habitDayOfWeek);
      }
      return true;
    });
  }

  const pool = allHabitosList && allHabitosList.length > 0 ? allHabitosList : habitos;
  const seenIds = new Set<string>();
  const list: any[] = [];

  const findRecord = (habitId: string) => {
    return registros.find((r) => {
      const id = r.idHabito || r.idhabito || r.id_habito;
      const regFecha = typeof r.fecha === 'string' ? r.fecha.slice(0, 10) : r.fecha;
      return id === habitId && regFecha === selectedDate;
    });
  };

  // 1. Hábitos del pool
  for (const h of pool) {
    const id = h.idHabito || h.idhabito;
    if (!id || seenIds.has(id)) continue;

    const fInicio = (h.fechaInicio || h.fechainicio || '').slice(0, 10);
    const fFin = (h.fechaFin || h.fechafin || '').slice(0, 10);
    const estado = (h.estado ?? 'Activo').toLowerCase();
    const record = findRecord(id);
    const days = h.diasSemana ?? h.dias_semana;
    const matchesDayOfWeek = !Array.isArray(days) || days.length === 0 || days.includes(habitDayOfWeek);

    if (isFuture) {
      // DÍAS SIGUIENTES / FUTUROS:
      // Los hábitos archivados, inactivos o eliminados NUNCA deben aparecer en días futuros.
      // Solo hábitos ACTIVOS que correspondan al día de la semana y periodo de vigencia.
      const isActive = estado === 'activo';
      const existedOnDate = !fInicio || fInicio <= selectedDate;
      const notExpired = !fFin || fFin >= selectedDate;

      if (isActive && existedOnDate && notExpired && matchesDayOfWeek) {
        seenIds.add(id);
        list.push({
          ...h,
          registroHoy: {
            completado: false,
            progresoActual: 0,
          },
        });
      }
    } else if (isPast) {
      // DÍAS PASADOS:
      // Preservamos el historial de lo que se hizo o estaba programado:
      // - Si hay registro en esa fecha histórica: se muestra siempre con su estado real.
      // - Si no hay registro pero el hábito existía en esa fecha y no estaba vencido:
      //   se muestra como pendiente histórico si tocaba ese día de la semana.
      const fCreacion = (h.createdAt || h.created_at || '').slice(0, 10);
      const effectiveStart = fInicio || fCreacion;
      const existedOnDate =
        record !== undefined ||
        (effectiveStart
          ? effectiveStart <= selectedDate
          : !fInicio || fInicio <= selectedDate);
      const notExpired = !fFin || fFin >= selectedDate;

      if (record) {
        seenIds.add(id);
        list.push({
          ...h,
          registroHoy: {
            idRegistro: record.idRegistro || record.idregistro,
            completado: Boolean(record.completado),
            progresoActual: record.progresoActual || 0,
            puntosGanados: record.puntosGanados,
            observacion: record.observacion,
          },
        });
      } else if (existedOnDate && notExpired && matchesDayOfWeek) {
        seenIds.add(id);
        list.push({
          ...h,
          registroHoy: {
            completado: false,
            progresoActual: 0,
          },
        });
      }
    }
  }

  // 2. Si hay algún registro histórico de un hábito que ya no esté en el pool (respaldo de integridad para días pasados)
  if (isPast) {
    for (const r of registros) {
      const regFecha = typeof r.fecha === 'string' ? r.fecha.slice(0, 10) : r.fecha;
      if (regFecha === selectedDate) {
        const id = r.idHabito || r.idhabito || r.id_habito;
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          list.push({
            idHabito: id,
            idhabito: id,
            nombre: r.habito?.nombre || 'Hábito en historial',
            descripcion: r.observacion || '',
            puntos: r.habito?.puntos || r.puntosGanados || 10,
            estado: 'Inactivo',
            metaDiaria: r.progresoActual || 1,
            unidadMedida: 'veces',
            registroHoy: {
              idRegistro: r.idRegistro || r.idregistro,
              completado: Boolean(r.completado),
              progresoActual: r.progresoActual || 0,
              puntosGanados: r.puntosGanados,
              observacion: r.observacion,
            },
          });
        }
      }
    }
  }

  return list;
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

  // Lista local completa de hábitos (activos, archivados e inactivos)
  const [allHabitosList, setAllHabitosList] = useState<any[]>(allHabitos || []);

  useEffect(() => {
    setAllHabitosList(allHabitos || []);
  }, [allHabitos]);

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
              ...h.registroHoy,
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
              ...h.registroHoy,
              progresoActual: newProgress,
              completado: isCompleted,
            },
          };
        }
        return h;
      })
    );
  };

  // Callback cuando se archiva un hábito:
  // Se remueve de los hábitos activos de hoy, pero se PRESERVA en allHabitosList para el historial
  const handleHabitArchived = (idHabito: string) => {
    setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== idHabito));
    setAllHabitosList((prev) =>
      prev.map((h) =>
        (h.idHabito || h.idhabito) === idHabito ? { ...h, estado: 'Archivado' } : h
      )
    );
    setTotalArchivadosCount((prev) => prev + 1);
  };

  // Callback cuando se elimina un hábito:
  // Se remueve de los hábitos activos, pero se PRESERVA como 'Inactivo' en allHabitosList
  // para que los días anteriores conserven su historial intacto
  const handleHabitDeleted = (idHabito: string) => {
    setHabitos((prev) => prev.filter((h) => (h.idHabito || h.idhabito) !== idHabito));
    setAllHabitosList((prev) =>
      prev.map((h) =>
        (h.idHabito || h.idhabito) === idHabito ? { ...h, estado: 'Inactivo' } : h
      )
    );
  };

  // Callback cuando se reactiva un hábito desde el modal de archivados
  const handleHabitReactivated = (_idHabito: string) => {
    setTotalArchivadosCount((prev) => Math.max(0, prev - 1));
  };

  // Mapa de idHabito -> completado para el día seleccionado
  const recordsMapByHabitId = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const r of registros) {
      const regFecha = typeof r.fecha === 'string' ? r.fecha.slice(0, 10) : r.fecha;
      if (regFecha === selectedDate && r.completado) {
        const id = r.idHabito || r.idhabito || r.id_habito;
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
        const id = r.idHabito || r.idhabito || r.id_habito;
        const regFecha = typeof r.fecha === 'string' ? r.fecha.slice(0, 10) : r.fecha;
        if (id && regFecha) {
          if (!map[id]) map[id] = [];
          map[id].push(regFecha);
        }
      }
    }
    return map;
  }, [registros]);

  // Hábitos que se deben mostrar en la fecha seleccionada:
  // - Si es hoy: muestra los hábitos activos actuales.
  // - Si es un día pasado: muestra el historial completo de hábitos que estuvieron vigentes ese día
  //   (incluyendo hábitos archivados o borrados) con su estado de completitud real de esa fecha.
  const displayedHabitos = useMemo(
    () => filterHabitosForSelectedDate(selectedDate, todayStr, habitos, allHabitosList, registros),
    [selectedDate, todayStr, habitos, allHabitosList, registros]
  );

  // Lista de todas las fechas con algún hábito completado para los dots del calendario
  const diasConRegistro = useMemo(() => {
    const dates = new Set<string>();
    for (const r of registros) {
      if (r.completado && r.fecha) {
        const regFecha = typeof r.fecha === 'string' ? r.fecha.slice(0, 10) : r.fecha;
        if (regFecha) dates.add(regFecha);
      }
    }
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
        {/* Columna Principal: Lista de Hábitos del Día Seleccionado y Contenedor de Hábitos Archivados */}
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

          {/* Contenedor de Hábitos Archivados (debajo de los hábitos) */}
          <ArchivedHabitsWidget
            totalArchivados={totalArchivadosCount}
            onHabitReactivated={handleHabitReactivated}
            onHabitDeleted={handleHabitDeleted}
          />
        </div>

        {/* Columna Lateral (Widgets) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ActiveChallengesWidget retos={retos} />
          <StreakWidget
            rachaActual={rachaGlobalReal}
            diasSemana={semanaChecks}
          />
        </div>
      </div>
    </div>
  );
}
