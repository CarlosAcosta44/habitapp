'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  X,
  Share2,
  Dumbbell,
  Zap,
  Utensils,
  Moon,
  Smile,
  Droplets,
  Clock,
  Flame,
  Trophy,
  CheckCircle2,
  CalendarCheck,
  Calendar as CalendarIcon,
  Quote,
  Bell,
  Trash2,
  Archive,
  Edit,
  Plus,
  Minus,
  Check,
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { updateHabitoAction, deleteHabitoAction, archivarHabitoAction } from '@/actions/habito.actions';
import { avanzarProgresoAction, desmarcarCompletadoAction } from '@/actions/registro.actions';
import { getLocalDateString } from '@/lib/date-utils';

interface HabitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  habito: any;
  rachaActual?: number;
  completedDates?: string[];
  onProgressUpdate?: (idHabito: string, newProgress: number, isCompleted: boolean) => void;
  onArchive?: (idHabito: string) => void;
  onDelete?: (idHabito: string) => void;
}

const DIAS_SEMANA = [
  { num: 1, label: 'L', name: 'Lunes' },
  { num: 2, label: 'M', name: 'Martes' },
  { num: 3, label: 'M', name: 'Miércoles' },
  { num: 4, label: 'J', name: 'Jueves' },
  { num: 5, label: 'V', name: 'Viernes' },
  { num: 6, label: 'S', name: 'Sábado' },
  { num: 7, label: 'D', name: 'Domingo' },
];

function extractHabitDays(habito: any): number[] {
  if (Array.isArray(habito.diasSemana) && habito.diasSemana.length > 0) {
    return habito.diasSemana;
  }
  if (Array.isArray(habito.dias_semana) && habito.dias_semana.length > 0) {
    return habito.dias_semana;
  }
  return [1, 2, 3, 4, 5, 6, 7];
}

function determineFrequencyPreset(days: number[]): 'todos' | 'laborales' | 'personalizado' {
  if (days.length === 7) return 'todos';
  if (days.length === 5 && [1, 2, 3, 4, 5].every((d: number) => days.includes(d))) {
    return 'laborales';
  }
  return 'personalizado';
}

function extractHabitReminders(habito: any): string[] {
  if (!Array.isArray(habito.recordatorios)) return [];
  return habito.recordatorios
    .map((r: any) => {
      if (typeof r === 'string') return r.slice(0, 5);
      if (r && typeof r.hora === 'string') return r.hora.slice(0, 5);
      return '';
    })
    .filter(Boolean);
}

function formatSingleReminderTime(r: any): string {
  if (typeof r === 'string') return r.slice(0, 5);
  if (r && typeof r.hora === 'string') return r.hora.slice(0, 5);
  return '08:00';
}

function formatRecordatoriosLabel(recordatorios: any): string {
  if (!Array.isArray(recordatorios) || recordatorios.length === 0) {
    return 'Sin recordatorios programados';
  }
  const formatted = recordatorios
    .map((r: any) => formatSingleReminderTime(r))
    .filter(Boolean)
    .join(', ');
  return `Recordatorios: ${formatted}`;
}

export function HabitDetailModal({
  isOpen,
  onClose,
  habito,
  rachaActual = 0,
  completedDates = [],
  onProgressUpdate,
  onArchive,
  onDelete,
}: HabitDetailModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Mode: 'view' (Detalle y métricas) o 'edit' (Edición de campos)
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editMetaDiaria, setEditMetaDiaria] = useState<number | string>(1);
  const [editUnidadMedida, setEditUnidadMedida] = useState('veces');
  const [editEstado, setEditEstado] = useState<'Activo' | 'Inactivo'>('Activo');
  const [editSelectedDays, setEditSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [editFrequencyPreset, setEditFrequencyPreset] = useState<'todos' | 'laborales' | 'personalizado'>('todos');
  const [editReminders, setEditReminders] = useState<string[]>([]);

  // UI feedback
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Optimistic local state for immediate visual responsiveness
  const metaDiaria = habito?.metaDiaria ?? habito?.meta_diaria ?? 1;
  const unidadMedida = habito?.unidadMedida ?? habito?.unidad_medida ?? 'veces';

  const [localProgreso, setLocalProgreso] = useState<number>(0);
  const [localCompletado, setLocalCompletado] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sincronizar datos del hábito con el estado de edición y progreso al abrir o recibir props
  useEffect(() => {
    if (!habito) return;

    setEditNombre(habito.nombre || '');
    setEditDescripcion(habito.descripcion || '');
    setEditMetaDiaria(habito.metaDiaria ?? habito.meta_diaria ?? 1);
    setEditUnidadMedida(habito.unidadMedida ?? habito.unidad_medida ?? 'veces');
    setEditEstado(habito.estado === 'Inactivo' ? 'Inactivo' : 'Activo');

    const days = extractHabitDays(habito);
    setEditSelectedDays(days);
    setEditFrequencyPreset(determineFrequencyPreset(days));
    setEditReminders(extractHabitReminders(habito));

    setIsEditing(false);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const isComp = habito.registroHoy?.completado ?? false;
    const prog = habito.registroHoy?.progresoActual ?? (isComp ? (habito.metaDiaria ?? habito.meta_diaria ?? 1) : 0);
    setLocalProgreso(prog);
    setLocalCompletado(isComp);
  }, [habito, isOpen]);

  if (!isOpen || !isMounted || !habito) return null;

  const idHabito = habito.idHabito || habito.idhabito;
  const nombre = habito.nombre;
  const descripcion = habito.descripcion;

  const porcentaje = metaDiaria > 0 ? Math.min(100, Math.round((localProgreso / metaDiaria) * 100)) : 0;

  // Categoría e icono
  const catNombre =
    habito.categoria?.nombre ||
    habito.categorias_habitos?.nombre ||
    'General';

  const catLower = catNombre.toLowerCase();
  let CatIcon = Sparkles;
  if (catLower.includes('ejercicio') || catLower.includes('deporte') || catLower.includes('gym')) {
    CatIcon = Dumbbell;
  } else if (catLower.includes('productiv') || catLower.includes('estudio') || catLower.includes('trabajo')) {
    CatIcon = Zap;
  } else if (catLower.includes('nutri') || catLower.includes('comida') || catLower.includes('aliment')) {
    CatIcon = Utensils;
  } else if (catLower.includes('sueño') || catLower.includes('dormir') || catLower.includes('descanso')) {
    CatIcon = Moon;
  } else if (catLower.includes('mental') || catLower.includes('mindful') || catLower.includes('paz')) {
    CatIcon = Smile;
  } else if (catLower.includes('agua') || catLower.includes('hidrata')) {
    CatIcon = Droplets;
  }

  // Días de la semana para el historial reciente de los últimos 7 días
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const ultimos7Dias = [];
  const dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = getLocalDateString(d);
    const dayName = dayNamesShort[d.getDay()];
    const isCurrent = iso === todayStr;

    // Verificar si completó en el registro real
    let dayCompleted = false;
    if (isCurrent) {
      dayCompleted = localCompletado;
    } else {
      dayCompleted = Array.isArray(completedDates) ? completedDates.includes(iso) : false;
    }

    ultimos7Dias.push({
      dateStr: iso,
      dayNumber: d.getDate(),
      dayName: isCurrent ? 'Hoy' : dayName,
      isToday: isCurrent,
      completed: dayCompleted,
    });
  }

  // ── Registrar +1 unidad en la meta (Optimista) ──
  const handleIncrement = () => {
    const prevProg = localProgreso;
    const prevComp = localCompletado;
    const nextProgress = prevProg + 1;
    const isNowCompleted = nextProgress >= metaDiaria;

    // 1. Actualización optimista inmediata en la UI
    setLocalProgreso(nextProgress);
    setLocalCompletado(isNowCompleted);
    setFeedbackError(null);

    // 2. Notificar inmediatamente a las tarjetas del dashboard
    if (onProgressUpdate) {
      onProgressUpdate(idHabito, nextProgress, isNowCompleted);
    }

    // 3. Llamada al servidor
    startTransition(async () => {
      const fd = new FormData();
      fd.set('idHabito', idHabito);
      fd.set('fecha', todayStr);
      fd.set('cantidadAsumar', '1');
      fd.set('metaDiaria', metaDiaria.toString());

      const res = await avanzarProgresoAction(null, fd);
      if (!res.success) {
        // Rollback en caso de fallo
        setLocalProgreso(prevProg);
        setLocalCompletado(prevComp);
        if (onProgressUpdate) {
          onProgressUpdate(idHabito, prevProg, prevComp);
        }
        setFeedbackError(res.message || 'Error al registrar progreso');
      } else {
        router.refresh();
      }
    });
  };

  // ── Restar progreso o desmarcar (Optimista) ──
  const handleDecrement = () => {
    if (localProgreso <= 0) return;

    const prevProg = localProgreso;
    const prevComp = localCompletado;
    const nextProgress = Math.max(0, prevProg - 1);
    const isNowCompleted = nextProgress >= metaDiaria;

    // 1. Actualización optimista
    setLocalProgreso(nextProgress);
    setLocalCompletado(isNowCompleted);
    setFeedbackError(null);

    // 2. Notificar inmediatamente al dashboard
    if (onProgressUpdate) {
      onProgressUpdate(idHabito, nextProgress, isNowCompleted);
    }

    // 3. Llamada al servidor
    startTransition(async () => {
      if (nextProgress === 0 && prevComp) {
        const fd = new FormData();
        fd.set('idHabito', idHabito);
        fd.set('fecha', todayStr);
        const res = await desmarcarCompletadoAction(null, fd);
        if (!res.success) {
          setLocalProgreso(prevProg);
          setLocalCompletado(prevComp);
          if (onProgressUpdate) onProgressUpdate(idHabito, prevProg, prevComp);
          setFeedbackError(res.message || 'Error al desmarcar');
        } else {
          router.refresh();
        }
      } else {
        const fd = new FormData();
        fd.set('idHabito', idHabito);
        fd.set('fecha', todayStr);
        fd.set('cantidadAsumar', '-1');
        fd.set('metaDiaria', metaDiaria.toString());

        const res = await avanzarProgresoAction(null, fd);
        if (!res.success) {
          setLocalProgreso(prevProg);
          setLocalCompletado(prevComp);
          if (onProgressUpdate) onProgressUpdate(idHabito, prevProg, prevComp);
          setFeedbackError(res.message || 'Error al restar progreso');
        } else {
          router.refresh();
        }
      }
    });
  };

  // Manejadores de selector rápido de frecuencia en edición
  const handleEditPresetChange = (preset: 'todos' | 'laborales' | 'personalizado') => {
    setEditFrequencyPreset(preset);
    if (preset === 'todos') {
      setEditSelectedDays([1, 2, 3, 4, 5, 6, 7]);
    } else if (preset === 'laborales') {
      setEditSelectedDays([1, 2, 3, 4, 5]);
    }
  };

  const handleEditToggleDay = (diaNum: number) => {
    let newDays: number[];
    if (editSelectedDays.includes(diaNum)) {
      if (editSelectedDays.length === 1) return; // Mínimo un día seleccionado
      newDays = editSelectedDays.filter((d) => d !== diaNum);
    } else {
      newDays = [...editSelectedDays, diaNum].sort((a, b) => a - b);
    }
    setEditSelectedDays(newDays);

    if (newDays.length === 7) {
      setEditFrequencyPreset('todos');
    } else if (
      newDays.length === 5 &&
      [1, 2, 3, 4, 5].every((d) => newDays.includes(d))
    ) {
      setEditFrequencyPreset('laborales');
    } else {
      setEditFrequencyPreset('personalizado');
    }
  };

  // Manejadores de recordatorios en edición
  const handleAddEditReminder = () => {
    setEditReminders((prev) => [...prev, '12:00']);
  };

  const handleUpdateEditReminder = (index: number, newTime: string) => {
    setEditReminders((prev) => prev.map((t, i) => (i === index ? newTime : t)));
  };

  const handleRemoveEditReminder = (index: number) => {
    setEditReminders((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Guardar edición ──
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (editNombre.trim().length < 3) {
      setFeedbackError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', idHabito);
      fd.set('nombre', editNombre.trim());
      if (editDescripcion.trim()) {
        fd.set('descripcion', editDescripcion.trim());
      }
      fd.set('metaDiaria', (Number(editMetaDiaria) || 1).toString());
      fd.set('unidadMedida', editUnidadMedida.trim() || 'veces');
      fd.set('estado', editEstado);
      fd.set('diasSemana', JSON.stringify(editSelectedDays));
      fd.set('recordatorios', JSON.stringify(editReminders));

      const res = await updateHabitoAction(null, fd);
      if (res.success) {
        setFeedbackSuccess('¡Hábito actualizado exitosamente!');
        setIsEditing(false);
        if (editEstado === 'Inactivo' && onArchive) {
          onArchive(idHabito);
        }
        router.refresh();
      } else {
        setFeedbackError(res.message || 'Error al actualizar hábito');
      }
    });
  };

  // ── Archivar hábito ──
  const handleArchive = () => {
    if (!confirm(`¿Deseas archivar "${nombre}"? Podrás reactivarlo en cualquier momento desde la sección de hábitos archivados.`)) {
      return;
    }

    startTransition(async () => {
      setFeedbackError(null);
      const res = await archivarHabitoAction(idHabito);
      if (res.success) {
        if (onArchive) onArchive(idHabito);
        onClose();
        router.refresh();
      } else {
        setFeedbackError(res.message || 'Error al archivar hábito');
      }
    });
  };

  // ── Eliminar hábito ──
  const handleDelete = () => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar permanentemente el hábito "${nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      setFeedbackError(null);
      const fd = new FormData();
      fd.set('id', idHabito);

      const res = await deleteHabitoAction(null, fd);
      if (res.success) {
        if (onDelete) onDelete(idHabito);
        onClose();
        router.refresh();
      } else {
        setFeedbackError(res.message || 'Error al eliminar hábito');
      }
    });
  };

  // ── Compartir progreso ──
  const handleShare = () => {
    const text = `¡Llevo una racha de ${rachaActual} días en mi hábito "${nombre}" con HabitApp! 🚀`;
    if (navigator.share) {
      navigator.share({ title: 'Mi Hábito en HabitApp', text }).catch(() => {});
    } else {
      void navigator.clipboard.writeText(text);
      alert('¡Copiado al portapapeles!');
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-[0_20px_50px_rgba(87,45,228,0.2)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Encabezado del Modal ── */}
        <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          {/* Fila superior: Título de sección + botones de acción */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Editar Hábito' : 'Detalle del Hábito'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                  habito.estado === 'Inactivo'
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950/80 dark:text-indigo-300'
                }`}
              >
                {habito.estado === 'Inactivo' ? 'Archivado' : 'Rutina Activa'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Compartir progreso"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fila de resumen del hábito (Ícono + Título + Badges) */}
          <div className="flex items-start gap-3 sm:gap-4 pt-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#572de4]/10 dark:bg-indigo-950/80 text-[#572de4] dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <CatIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-semibold">
                  <CatIcon className="w-3 h-3 text-[#572de4] dark:text-indigo-400" />
                  {catNombre}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#572de4]"></span>
                  {(() => {
                    const d = habito.diasSemana ?? habito.dias_semana;
                    if (!Array.isArray(d) || d.length === 7 || d.length === 0) return 'Todos los días';
                    if (d.length === 5 && [1, 2, 3, 4, 5].every((x: number) => d.includes(x))) return 'Laborales (L - V)';
                    const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
                    return d.map((n: number) => labels[n - 1] || n).join(', ');
                  })()}
                </span>
                <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline-block">
                  ID: HAB-{idHabito?.slice(0, 4)}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                {nombre}
              </h1>

              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#572de4] dark:text-indigo-400" />
                <span>{formatRecordatoriosLabel(habito.recordatorios)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feedback de alertas ── */}
        {feedbackError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm text-red-600 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackError}</span>
          </div>
        )}
        {feedbackSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
        )}

        {/* ── Cuerpo del Modal ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 flex flex-col gap-5">
          {isEditing ? (
            /* ═══════════ MODO EDICIÓN ═══════════ */
            <form id="edit-habit-form" onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Nombre del hábito *
                </label>
                <input
                  type="text"
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Propósito y motivación
                </label>
                <textarea
                  rows={2}
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  placeholder="¿Por qué es importante para ti este hábito?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#572de4] resize-none"
                />
              </div>

              {/* Frecuencia y Días */}
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    Frecuencia y Días
                  </label>

                  {/* Segmented Controller de Frecuencia */}
                  <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/40 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleEditPresetChange('todos')}
                      className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                        editFrequencyPreset === 'todos'
                          ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                          : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Todos los días
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditPresetChange('laborales')}
                      className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                        editFrequencyPreset === 'laborales'
                          ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                          : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Laborales
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditPresetChange('personalizado')}
                      className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-lg text-[11px] sm:text-xs text-center transition-all truncate ${
                        editFrequencyPreset === 'personalizado'
                          ? 'font-semibold bg-white dark:bg-slate-700 text-[#572de4] dark:text-indigo-300 shadow-sm'
                          : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Personalizado
                    </button>
                  </div>
                </div>

                {/* Días circulares [L, M, M, J, V, S, D] */}
                <div className="flex items-center justify-between gap-1 pt-1 w-full">
                  {DIAS_SEMANA.map((dia) => {
                    const isSelected = editSelectedDays.includes(dia.num);

                    return (
                      <button
                        key={dia.num}
                        type="button"
                        onClick={() => handleEditToggleDay(dia.num)}
                        title={dia.name}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all select-none
                          ${
                            isSelected
                              ? 'bg-[#572de4] text-white shadow-[0_2px_8px_rgba(87,45,228,0.3)] scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold'
                          }
                        `}
                      >
                        {dia.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meta diaria y Unidad de medida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit_meta_diaria" className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    Meta diaria
                  </label>
                  <input
                    id="edit_meta_diaria"
                    type="number"
                    min={1}
                    max={9999}
                    value={editMetaDiaria}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setEditMetaDiaria('');
                      } else {
                        const num = Number.parseInt(val, 10);
                        if (!Number.isNaN(num)) setEditMetaDiaria(num);
                      }
                    }}
                    onBlur={() => {
                      if (editMetaDiaria === '' || Number(editMetaDiaria) < 1) {
                        setEditMetaDiaria(1);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit_unidad_medida" className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    Unidad de medida
                  </label>
                  <input
                    id="edit_unidad_medida"
                    type="text"
                    list="unidades-sugeridas-edit"
                    value={editUnidadMedida}
                    onChange={(e) => setEditUnidadMedida(e.target.value)}
                    placeholder="Unidad (ej: minutos, km...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#572de4]"
                  />
                  <datalist id="unidades-sugeridas-edit">
                    <option value="veces" />
                    <option value="minutos" />
                    <option value="páginas" />
                    <option value="vasos" />
                    <option value="km" />
                    <option value="horas" />
                    <option value="pasos" />
                    <option value="porciones" />
                    <option value="capítulos" />
                    <option value="repeticiones" />
                    <option value="series" />
                  </datalist>
                </div>
              </div>

              {/* Recordatorios en edición */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#572de4] dark:text-indigo-400" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      Recordatorios y Notificaciones
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditReminder}
                    className="text-xs font-semibold text-[#572de4] dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>

                {editReminders.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 py-1">
                    No hay recordatorios configurados. Haz clic en "Añadir" para agregar una hora de notificación.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    {editReminders.map((time, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-sm">
                          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => handleUpdateEditReminder(idx, e.target.value)}
                            className="bg-transparent font-medium w-full focus:outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditReminder(idx)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Eliminar recordatorio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Estado del hábito */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Estado del hábito
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditEstado('Activo')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      editEstado === 'Activo'
                        ? 'bg-[#572de4]/10 border-[#572de4] text-[#572de4] dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Activo
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEstado('Inactivo')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      editEstado === 'Inactivo'
                        ? 'bg-[#572de4]/10 border-[#572de4] text-[#572de4] dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Inactivo / Archivado
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ═══════════ MODO VISTA Y DETALLE ═══════════ */
            <>
              {/* 1. Tarjeta interactiva de meta de hoy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#572de4] text-white flex items-center justify-center shadow-md">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Meta de hoy
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                          {localProgreso}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          / {metaDiaria} {unidadMedida}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contador interactivo +/- */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-[#111827] p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={isPending || localProgreso <= 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Restar 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                      Registrar
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={isPending}
                      className="px-3 h-8 rounded-full flex items-center gap-1 bg-[#572de4] text-white hover:bg-[#461ebd] active:scale-95 shadow-sm text-xs font-bold transition-all disabled:opacity-50"
                      title="Sumar 1"
                    >
                      {isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>1</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-[#572de4] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(87,45,228,0.4)]"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {localProgreso} {unidadMedida} completados
                    </span>
                    <span className="text-[#572de4] dark:text-indigo-400 font-bold">
                      Meta: {metaDiaria} ({porcentaje}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Cuadrícula de 4 estadísticas (Racha, Récord, Éxito, Total) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Racha actual */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between text-amber-500">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                      Racha
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {rachaActual} {rachaActual === 1 ? 'día' : 'días'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ¡Tu ritmo activo!
                    </span>
                  </div>
                </div>

                {/* Récord */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between text-indigo-500">
                    <Trophy className="w-4 h-4" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                      Récord
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {Math.max(rachaActual, habito.recordRacha ?? rachaActual)} {Math.max(rachaActual, habito.recordRacha ?? rachaActual) === 1 ? 'día' : 'días'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Máxima constancia
                    </span>
                  </div>
                </div>

                {/* Éxito */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      Éxito
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {completedDates.length > 0 ? `${Math.min(100, Math.round((completedDates.length / Math.max(1, 30)) * 100))}%` : (localCompletado ? '100%' : '0%')}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cumplimiento
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between gap-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Total
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {completedDates.length}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {completedDates.length === 1 ? 'Cumplimiento' : 'Cumplimientos'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Historial Reciente de los últimos 7 días */}
              <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#572de4] dark:text-indigo-400" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Historial Reciente
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Últimos 7 días completados
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950 dark:text-indigo-300">
                    {ultimos7Dias.filter((d) => d.completed).length} de 7 días
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {ultimos7Dias.map((d) => (
                    <div
                      key={d.dateStr}
                      className={`
                        flex flex-col items-center py-2 px-1 rounded-xl transition-all
                        ${
                          d.isToday
                            ? 'bg-[#572de4]/10 dark:bg-[#572de4]/20 border border-[#572de4]/40 font-bold'
                            : 'bg-white dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/40'
                        }
                      `}
                    >
                      <span
                        className={`text-[11px] ${
                          d.isToday
                            ? 'text-[#572de4] dark:text-indigo-300 font-bold'
                            : 'text-slate-500 dark:text-slate-400 font-medium'
                        }`}
                      >
                        {d.dayName}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white my-0.5">
                        {d.dayNumber}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          d.completed
                            ? 'bg-[#572de4] text-white shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {d.completed ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <X className="w-3 h-3 opacity-60" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Propósito & Motivación */}
              <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950/80 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Quote className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    PROPÓSITO &amp; MOTIVACIÓN
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    {descripcion
                      ? `“${descripcion}”`
                      : '“Mantener la constancia y disciplina diaria para alcanzar mis metas de bienestar y salud.”'}
                  </p>
                </div>
              </div>

              {/* 5. Recordatorios */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#572de4] dark:text-indigo-400" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Recordatorios
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      Array.isArray(habito.recordatorios) && habito.recordatorios.length > 0
                        ? 'bg-[#572de4]/10 text-[#572de4] dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {(() => {
                      if (!Array.isArray(habito.recordatorios) || habito.recordatorios.length === 0) {
                        return 'Sin recordatorios';
                      }
                      const sufijo = habito.recordatorios.length === 1 ? 'activo' : 'activos';
                      return `${habito.recordatorios.length} ${sufijo}`;
                    })()}
                  </span>
                </div>
                {Array.isArray(habito.recordatorios) && habito.recordatorios.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {habito.recordatorios.map((r: any, idx: number) => {
                      const timeStr = formatSingleReminderTime(r);
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
                        >
                          <Clock className="w-3 h-3 text-[#572de4] dark:text-indigo-400" />
                          {timeStr}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    No tienes recordatorios configurados para este hábito.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer del Modal (Botones de Acción) ── */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancelar edición</span>
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Guardar cambios</span>
              </button>
            </>
          ) : (
            <>
              {/* Eliminar Hábito */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all text-xs sm:text-sm font-semibold border border-red-200/60 dark:border-red-900/40 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Hábito</span>
              </button>

              <div className="w-full sm:w-auto flex items-center justify-end gap-2 flex-wrap">
                {/* Archivar Hábito */}
                <button
                  type="button"
                  onClick={handleArchive}
                  disabled={isPending}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-all text-xs sm:text-sm font-semibold border border-slate-200/80 dark:border-slate-700 shadow-sm disabled:opacity-50"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar</span>
                </button>

                {/* Editar Hábito */}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-[#572de4] hover:bg-[#461ebd] text-white active:scale-95 shadow-[0_4px_14px_rgba(87,45,228,0.3)] hover:shadow-[0_6px_20px_rgba(87,45,228,0.4)] transition-all text-xs sm:text-sm font-bold"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Hábito</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
