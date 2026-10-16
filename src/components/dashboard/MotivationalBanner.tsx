'use client';

import React, { useState, useEffect } from 'react';
import type { DailyQuote } from '@/domain/quote.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLocalDateString } from '@/lib/date-utils';

interface DayItem {
  name: string;
  number: number;
  dateStr: string;
  isToday: boolean;
  hasActivity: boolean;
}

interface MotivationalBannerProps {
  quote: DailyQuote;
  completados: number;
  total: number;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  diasConRegistro?: string[]; // array de YYYY-MM-DD
}

export function MotivationalBanner({
  quote,
  completados,
  total,
  selectedDate,
  onSelectDate,
  diasConRegistro = [],
}: MotivationalBannerProps) {
  const [timeInfo, setTimeInfo] = useState<{
    image: string;
    greeting: string;
    sub: string;
  }>({
    image: '/images/Mañana.jpg',
    greeting: 'Calma Matutina',
    sub: 'Inicia tu día con serenidad',
  });

  const [weekDays, setWeekDays] = useState<DayItem[]>([]);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  useEffect(() => {
    // Determinar imagen según hora del día
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeInfo({
        image: '/images/Mañana.jpg',
        greeting: 'Calma Matutina',
        sub: 'Inicia tu día con serenidad',
      });
    } else if (hour >= 12 && hour < 19) {
      setTimeInfo({
        image: '/images/Tarde.jpg',
        greeting: 'Enfoque de Tarde',
        sub: 'Mantén tu energía y constancia',
      });
    } else {
      setTimeInfo({
        image: '/images/Noche.jpg',
        greeting: 'Serenidad Nocturna',
        sub: 'Descansa y reflexiona sobre tus logros',
      });
    }

    // Calcular días de la semana actual con offset
    const now = new Date();
    const todayStr = getLocalDateString(now);

    // Obtener el lunes de la semana actual + weekOffset
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday + weekOffset * 7);

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const days: DayItem[] = [];

    const activeSet = new Set(diasConRegistro);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = getLocalDateString(d);
      days.push({
        name: dayNames[i],
        number: d.getDate(),
        dateStr: iso,
        isToday: iso === todayStr,
        hasActivity: activeSet.has(iso) || (iso === todayStr && completados > 0),
      });
    }

    setWeekDays(days);
  }, [weekOffset, diasConRegistro, completados]);

  const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-6 transition-all">
      {/* ── Fondo Paisaje Completo que abarca toda la tarjeta ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={timeInfo.greeting}
        className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 pointer-events-none"
        src={timeInfo.image}
      />
      {/* Capa de gradiente oscuro suave SOLO en la parte superior para legibilidad de la frase */}
      <div className="absolute top-0 inset-x-0 h-3/5 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none" />

      {/* ── Contenido Superior: Tag y Frase Motivacional ── */}
      <div className="relative z-10 p-5 md:p-8 flex flex-col justify-between text-white min-h-[170px] md:min-h-[200px]">
        {/* Tag de la franja horaria */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-white border border-white/25 shadow-sm">
            {timeInfo.greeting}
          </span>
          <span className="text-xs text-white/90 font-medium hidden sm:inline-block drop-shadow-sm">
            {timeInfo.sub}
          </span>
        </div>

        {/* Frase Motivacional Diaria */}
        <div className="w-full max-w-2xl mx-auto text-center px-4 my-auto py-2">
          <blockquote className="font-semibold text-lg sm:text-2xl md:text-[25px] text-white tracking-tight leading-snug drop-shadow-md italic">
            &ldquo;{quote.phrase}&rdquo;
          </blockquote>
          <p className="mt-2 text-xs sm:text-sm text-indigo-200 font-bold uppercase tracking-wider drop-shadow-sm">
            — {quote.author}
          </p>
        </div>
      </div>

      {/* ── Tira Inferior: Progreso + Selector Semanal en Blanco Limpio / Dark Sleek ── */}
      <div className="relative z-10 px-5 py-4 bg-white/95 dark:bg-[#111827]/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-5 transition-colors shadow-sm">
        {/* Progreso del día */}
        <div className="flex items-center gap-4 w-full lg:w-auto lg:min-w-[280px]">
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {completados} de {total} hábitos completados
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#572de4]/10 text-[#572de4] dark:bg-white/15 dark:text-white font-bold text-xs border border-[#572de4]/20 dark:border-white/10 shadow-sm">
                {porcentaje}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/15 overflow-hidden">
              <div
                className="h-full bg-[#572de4] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(87,45,228,0.5)]"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        </div>

        {/* Selector Semanal (Lun - Dom) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 w-full lg:w-auto justify-between sm:justify-end overflow-x-auto py-1">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Semana anterior"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {weekDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            const isCurrentToday = day.isToday;

            return (
              <div
                key={day.dateStr}
                onClick={() => onSelectDate(day.dateStr)}
                className={`
                  flex flex-col items-center justify-center w-11 sm:w-12 h-14 rounded-2xl
                  cursor-pointer transition-all duration-200 select-none
                  ${
                    isSelected
                      ? 'bg-[#572de4] text-white shadow-[0_4px_14px_rgba(87,45,228,0.4)] scale-105'
                      : isCurrentToday
                      ? 'bg-[#572de4]/15 dark:bg-[#572de4]/30 text-[#572de4] dark:text-indigo-300 font-bold border border-[#572de4]/30'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60'
                  }
                `}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {day.name}
                </span>
                <span className="text-[15px] font-bold leading-tight mt-0.5">
                  {day.number}
                </span>
                {/* Dot indicator de actividad o racha */}
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected
                      ? 'bg-white'
                      : day.hasActivity
                      ? 'bg-[#572de4] dark:bg-indigo-400'
                      : 'bg-slate-400/50 dark:bg-slate-600'
                  }`}
                />
              </div>
            );
          })}

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors backdrop-blur-sm"
            title="Semana siguiente"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
