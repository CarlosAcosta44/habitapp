'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Trophy,
  Sparkles,
  Download,
  Calendar,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Droplet,
  Zap,
  Target,
} from 'lucide-react';
import type { BackendUserSummary, ComparativaGraphed } from '@/services/reportes.service';
import type { HabitoReporte } from '@/domain/reportes.types';

interface ReportesInteractiveViewProps {
  stats: BackendUserSummary | null;
  habitos: HabitoReporte[];
  comparativa: ComparativaGraphed;
}

export function ReportesInteractiveView({
  stats,
  habitos,
  comparativa: _comparativa,
}: ReportesInteractiveViewProps) {
  const [, setHoveredDay] = useState<number | null>(null);

  // Valores calculados con fallback elegante si el usuario es nuevo
  const cumplimiento = stats?.cumplimiento_global ?? stats?.tasa_diaria ?? 84;
  const totalEsperado = stats?.total_esperado ?? 50;
  const totalCumplido = stats?.total_cumplido ?? Math.round((cumplimiento / 100) * totalEsperado);
  const rachaActual = stats?.racha_actual ?? 12;
  const rachaMaxima = stats?.racha_maxima ?? 28;
  const puntosTotales = stats?.puntos_totales ?? 1420;

  // Volumen semanal: [L, M, X, J, V, S, D]
  const volumen = stats?.volumen_semanal && stats.volumen_semanal.length === 7
    ? stats.volumen_semanal
    : [6, 5, 9, 7, 6, 4, 5];
  const maxVolumen = Math.max(...volumen, 1);
  const peakDayIndex = volumen.indexOf(maxVolumen);
  const diasAbrev = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Consistencia del mes (Heatmap 30 días)
  const heatmapData = stats?.consistencia_mes && stats.consistencia_mes.length > 0
    ? stats.consistencia_mes
    : Array.from({ length: 30 }, (_, i) => ({
        fecha: `Día ${i + 1}`,
        activos: (i % 7 === 5 || i % 7 === 6) ? (i % 2 === 0 ? 2 : 0) : ((i * 3 + 2) % 6) + 4,
      }));

  // Más constante y oportunidad de mejora
  const masConstante = stats?.mas_constante ?? {
    nombre: habitos[0]?.nombre || 'Beber 2L de Agua',
    rate: 96,
  };
  const oportunidadMejora = stats?.oportunidad_mejora ?? {
    nombre: habitos[1]?.nombre || 'Meditación 10 min',
    rate: 45,
  };

  const handleDownloadPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Helper para escala de color en heatmap
  const getIntensityClass = (activos: number) => {
    if (activos === 0) return 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60';
    if (activos <= 2) return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300';
    if (activos <= 5) return 'bg-blue-200 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200';
    if (activos <= 7) return 'bg-blue-400 dark:bg-blue-600 text-white font-bold';
    return 'bg-blue-600 text-white font-extrabold shadow-sm';
  };

  return (
    <div className="w-full space-y-8 pb-16">
      {/* ── 1. Header con Título y Descarga (Diseño Oficial) ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Panel de Rendimiento
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-400">Actualizado recientemente</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Progreso y Métricas
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Analítica integral de tus rutinas, consistencia semanal y cumplimiento general.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Indicador de período activo (Diseño Oficial Figma: Últimos 30 días) */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Últimos 30 días</span>
          </div>

          {/* Botón Descargar Reporte (PDF) */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Descargar reporte (PDF)</span>
          </button>
        </div>
      </header>

      {/* ── 2. Grid de 4 KPIs Superiores Equilibrados ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cumplimiento Global con Anillo Circular */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cumplimiento Global
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              +6%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {cumplimiento}%
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {totalCumplido} de {totalEsperado} hábitos
              </p>
            </div>
            {/* Anillo visual SVG */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-blue-600"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${cumplimiento}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[10px] text-blue-600 font-extrabold">
                {cumplimiento}%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Racha Actual */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Racha Actual
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30">
              <Flame className="w-3 h-3" aria-hidden="true" />
              Activa hoy
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {rachaActual}{' '}
                <span className="text-base font-semibold text-slate-400">días</span>
              </span>
              <p className="text-xs text-slate-400 mt-1">Manteniendo ritmo</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* KPI 3: Racha Máxima */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Racha Máxima
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30">
              <Trophy className="w-3 h-3" aria-hidden="true" />
              Récord
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {rachaMaxima}{' '}
                <span className="text-base font-semibold text-slate-400">días</span>
              </span>
              <p className="text-xs text-slate-400 mt-1">Marca histórica</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* KPI 4: Consistencia Mensual */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Puntos Acumulados
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              Nivel Pro
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <div>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {puntosTotales.toLocaleString()}
              </span>
              <p className="text-xs text-slate-400 mt-1">+85% de constancia global</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Estructura Analítica Principal (2 Columnas) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 Cols): Volumen Semanal y Consistencia del Mes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gráfico de Volumen Semanal */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Volumen Semanal
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hábitos completados cada día de la semana actual
                  </p>
                </div>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                Meta diaria: 7 hábitos
              </span>
            </div>

            {/* Barras de Lunes a Domingo */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-48 px-2">
                {volumen.map((val, idx) => {
                  const isPeak = idx === peakDayIndex;
                  const heightPercent = Math.round((val / maxVolumen) * 100);

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDay(idx)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    >
                      <span
                        className={`text-xs font-bold transition-transform group-hover:-translate-y-1 ${
                          isPeak
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {val}
                      </span>
                      <div
                        style={{ height: `${Math.max(12, heightPercent)}%` }}
                        className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                          isPeak
                            ? 'bg-blue-600 shadow-lg shadow-blue-500/30 group-hover:bg-blue-500'
                            : 'bg-blue-100 dark:bg-blue-950/80 group-hover:bg-blue-300 dark:group-hover:bg-blue-800'
                        }`}
                      />
                      <span
                        className={`text-xs pt-1 font-semibold ${
                          isPeak
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {diasAbrev[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie del Gráfico de Volumen */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>
                  Total semanal:{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {volumen.reduce((a, b) => a + b, 0)} completados
                  </strong>
                </span>
              </div>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {diasNombres[peakDayIndex]}: mayor productividad
              </span>
            </div>
          </div>

          {/* Gráfico de Consistencia del Mes (Heatmap 30 días) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Consistencia del Mes
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Frecuencia y disciplina diaria registrada en el ciclo
                  </p>
                </div>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                24 de 30 días activos
              </span>
            </div>

            <div className="space-y-2">
              {/* Encabezado de Días */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Matriz interactiva de días */}
              <div className="grid grid-cols-7 gap-2">
                {heatmapData.map((d, index) => {
                  const dayNum = index + 1;
                  return (
                    <div
                      key={index}
                      title={`Día ${dayNum}: ${d.activos} hábitos cumplidos`}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold cursor-pointer transition-transform duration-200 hover:scale-105 ${getIntensityClass(
                        d.activos,
                      )}`}
                    >
                      <span>{dayNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leyenda Inferior */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <span className="font-medium">80% tasa de efectividad mensual</span>
              <div className="flex items-center gap-1.5">
                <span>Menos</span>
                <span className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-blue-100 dark:bg-blue-950 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-blue-200 dark:bg-blue-900 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-blue-400 dark:bg-blue-600 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block" />
                <span>Más</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 Cols): Destacados, Hábitos y Estado de Ánimo */}
        <div className="lg:col-span-5 space-y-6">
          {/* Destacados de Constancia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Destacados de Constancia
              </h2>
              <span className="text-xs text-slate-400">Rendimiento clave</span>
            </div>

            {/* Card Más Constante */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30">
                  Más Constante
                </span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {masConstante.rate}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Droplet className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {masConstante.nombre}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Racha activa destacada en el período
                  </p>
                </div>
              </div>
            </div>

            {/* Card Oportunidad de Mejora */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30">
                  Mayor Desafío
                </span>
                <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                  {oportunidadMejora.rate}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertCircle className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {oportunidadMejora.nombre}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Requiere reforzar recordatorios horarios
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Motivacional Inteligente */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/10 space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Consejo de Hábitos
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-blue-50">
              {stats?.insight ||
                'Mantener el hábito más difícil a primera hora de la mañana reduce la fricción mental en un 35%. ¡Sigue construyendo tu disciplina!'}
            </p>
          </div>

          {/* Desglose de Hábitos Activos */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Desglose por Hábito
              </h2>
              <span className="text-xs text-slate-400">{habitos.length} monitoreados</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {habitos.length === 0 ? (
                <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs text-slate-400 italic">
                    Aún no tienes hábitos activos para monitorear.
                  </p>
                  <a
                    href="/habitos/nueva"
                    className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Crear mi primer hábito
                  </a>
                </div>
              ) : (
                habitos.map((h) => (
                  <div
                    key={h.idHabito}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: h.color || '#2563EB' }}
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                            {h.nombre}
                          </span>
                          {h.descripcion && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              {h.descripcion}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
                        {h.progreso}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 shadow-xs"
                        style={{
                          width: `${Math.min(100, Math.max(4, h.progreso))}%`,
                          backgroundColor: h.color || '#2563EB',
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
